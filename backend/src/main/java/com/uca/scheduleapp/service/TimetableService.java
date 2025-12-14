package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.*;
import com.uca.scheduleapp.model.TimetableSelection;
import com.uca.scheduleapp.model.UniversitySchedule;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.TimetableSelectionRepository;
import com.uca.scheduleapp.repository.UniversityScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableService {
    @Autowired
    private TimetableSelectionRepository timetableSelectionRepository;

    @Autowired
    private UniversityScheduleRepository universityScheduleRepository;

    public TimetableResponse getMyTimetable(User user) {
        List<UniversitySchedule> schedules = timetableSelectionRepository.findByUser(user)
            .stream()
            .map(TimetableSelection::getSchedule)
            .collect(Collectors.toList());

        List<TimetableConflictDTO> conflicts = detectOverlaps(schedules);
        List<UniversityScheduleDTO> entries = schedules.stream().map(this::toDTO).collect(Collectors.toList());
        return new TimetableResponse(entries, conflicts);
    }

    @Transactional
    public TimetableResponse updateMyTimetable(User user, TimetableUpdateRequest request) {
        timetableSelectionRepository.deleteByUser(user);

        List<Long> ids = request.getScheduleIds() != null ? request.getScheduleIds() : List.of();
        if (ids.isEmpty()) {
            return new TimetableResponse(List.of(), List.of());
        }

        List<UniversitySchedule> schedules = universityScheduleRepository.findAllById(ids);

        // Validate access: students can only select within their studentClass
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            Long studentClassId = user.getStudentClass() != null ? user.getStudentClass().getId() : null;
            if (studentClassId == null) {
                throw new RuntimeException("You must have a class assigned to build a timetable");
            }
            boolean invalid = schedules.stream().anyMatch(s -> !s.getStudentClass().getId().equals(studentClassId));
            if (invalid) {
                throw new RuntimeException("Invalid schedule selection");
            }
        }

        for (UniversitySchedule schedule : schedules) {
            TimetableSelection selection = new TimetableSelection();
            selection.setUser(user);
            selection.setSchedule(schedule);
            timetableSelectionRepository.save(selection);
        }

        List<TimetableConflictDTO> conflicts = detectOverlaps(schedules);
        List<UniversityScheduleDTO> entries = schedules.stream().map(this::toDTO).collect(Collectors.toList());
        return new TimetableResponse(entries, conflicts);
    }

    public String exportMyTimetableAsIcs(User user) {
        List<UniversitySchedule> schedules = timetableSelectionRepository.findByUser(user)
            .stream()
            .map(TimetableSelection::getSchedule)
            .collect(Collectors.toList());

        StringBuilder sb = new StringBuilder();
        sb.append("BEGIN:VCALENDAR\r\n");
        sb.append("VERSION:2.0\r\n");
        sb.append("PRODID:-//UCA Schedule App//EN\r\n");

        LocalDate today = LocalDate.now();
        DateTimeFormatter dtFmt = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");

        for (UniversitySchedule s : schedules) {
            DayOfWeek dow = parseDayOfWeek(s.getDay());
            LocalDate date = nextOrSame(today, dow);
            LocalDateTime start = LocalDateTime.of(date, s.getStartTime());
            LocalDateTime end = LocalDateTime.of(date, s.getEndTime());

            String uid = "uca-" + s.getId() + "-" + user.getId() + "@uca-schedule";

            sb.append("BEGIN:VEVENT\r\n");
            sb.append("UID:").append(uid).append("\r\n");
            sb.append("SUMMARY:").append(escapeIcs(s.getCourseName())).append("\r\n");
            sb.append("LOCATION:").append(escapeIcs(s.getLocation())).append("\r\n");
            sb.append("DTSTART:").append(dtFmt.format(start)).append("\r\n");
            sb.append("DTEND:").append(dtFmt.format(end)).append("\r\n");
            sb.append("RRULE:FREQ=WEEKLY\r\n");
            sb.append("END:VEVENT\r\n");
        }

        sb.append("END:VCALENDAR\r\n");
        return sb.toString();
    }

    private List<TimetableConflictDTO> detectOverlaps(List<UniversitySchedule> schedules) {
        Map<String, List<UniversitySchedule>> byDay = schedules.stream()
            .collect(Collectors.groupingBy(UniversitySchedule::getDay));

        List<TimetableConflictDTO> conflicts = new ArrayList<>();

        for (Map.Entry<String, List<UniversitySchedule>> entry : byDay.entrySet()) {
            List<UniversitySchedule> daySchedules = new ArrayList<>(entry.getValue());
            daySchedules.sort(Comparator.comparing(UniversitySchedule::getStartTime));

            for (int i = 0; i < daySchedules.size(); i++) {
                UniversitySchedule a = daySchedules.get(i);
                for (int j = i + 1; j < daySchedules.size(); j++) {
                    UniversitySchedule b = daySchedules.get(j);

                    // since sorted by startTime, can break early
                    if (!b.getStartTime().isBefore(a.getEndTime())) {
                        break;
                    }

                    if (a.getStartTime().isBefore(b.getEndTime()) && a.getEndTime().isAfter(b.getStartTime())) {
                        conflicts.add(new TimetableConflictDTO(
                            entry.getKey(),
                            a.getId(),
                            b.getId(),
                            "Overlapping classes: " + a.getCourseName() + " and " + b.getCourseName()
                        ));
                    }
                }
            }
        }

        return conflicts;
    }

    private UniversityScheduleDTO toDTO(UniversitySchedule schedule) {
        return new UniversityScheduleDTO(
            schedule.getId(),
            schedule.getCourseName(),
            schedule.getDay(),
            schedule.getStartTime(),
            schedule.getEndTime(),
            schedule.getLocation(),
            schedule.getStudentClass().getId(),
            schedule.getStudentClass().getName()
        );
    }

    private DayOfWeek parseDayOfWeek(String day) {
        if (day == null) return DayOfWeek.MONDAY;
        return switch (day.trim().toLowerCase()) {
            case "monday" -> DayOfWeek.MONDAY;
            case "tuesday" -> DayOfWeek.TUESDAY;
            case "wednesday" -> DayOfWeek.WEDNESDAY;
            case "thursday" -> DayOfWeek.THURSDAY;
            case "friday" -> DayOfWeek.FRIDAY;
            case "saturday" -> DayOfWeek.SATURDAY;
            case "sunday" -> DayOfWeek.SUNDAY;
            default -> DayOfWeek.MONDAY;
        };
    }

    private LocalDate nextOrSame(LocalDate date, DayOfWeek target) {
        int diff = target.getValue() - date.getDayOfWeek().getValue();
        if (diff < 0) diff += 7;
        return date.plusDays(diff);
    }

    private String escapeIcs(String value) {
        if (value == null) return "";
        return value
            .replace("\\", "\\\\")
            .replace(";", "\\;")
            .replace(",", "\\,")
            .replace("\n", "\\n");
    }
}
