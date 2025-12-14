package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.UniversityScheduleDTO;
import com.uca.scheduleapp.dto.UniversityScheduleRequest;
import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.model.UniversitySchedule;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.StudentClassRepository;
import com.uca.scheduleapp.repository.UniversityScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UniversityScheduleService {
    @Autowired
    private UniversityScheduleRepository universityScheduleRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private NotificationService notificationService;

    public List<UniversityScheduleDTO> getAllSchedules(User user, Long studentClassId) {
        List<UniversitySchedule> schedules;
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (studentClassId != null) {
                schedules = universityScheduleRepository.findByStudentClassId(studentClassId);
            } else {
                schedules = universityScheduleRepository.findAll();
            }
        } else {
            if (user.getStudentClass() != null) {
                schedules = universityScheduleRepository.findByStudentClass(user.getStudentClass());
            } else {
                schedules = List.of();
            }
        }
        return schedules.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UniversityScheduleDTO getScheduleById(Long id, User user) {
        UniversitySchedule schedule = universityScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser()) && 
            (user.getStudentClass() == null || !schedule.getStudentClass().getId().equals(user.getStudentClass().getId()))) {
            throw new RuntimeException("Access denied");
        }
        
        return toDTO(schedule);
    }

    @Transactional
    public UniversityScheduleDTO createSchedule(UniversityScheduleRequest request, User user) {
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (request.getStudentClassIds() == null || request.getStudentClassIds().isEmpty()) {
                throw new RuntimeException("Admin must specify at least one Student Class ID");
            }

            if (request.getStartTime() != null && request.getEndTime() != null && 
                !request.getStartTime().isBefore(request.getEndTime())) {
                throw new RuntimeException("Start time must be before end time");
            }

            UniversitySchedule firstSchedule = null;
            for (Long classId : request.getStudentClassIds()) {
                StudentClass studentClass = studentClassRepository.findById(classId)
                        .orElseThrow(() -> new RuntimeException("Student class with ID " + classId + " does not exist"));

                List<UniversitySchedule> overlaps = universityScheduleRepository.findOverlappingSchedules(
                    studentClass,
                    request.getDay(),
                    request.getStartTime(),
                    request.getEndTime()
                );

                if (!overlaps.isEmpty()) {
                    throw new RuntimeException("This class overlaps with another class in " + studentClass.getName() + "'s schedule");
                }

                UniversitySchedule schedule = new UniversitySchedule();
                schedule.setStudentClass(studentClass);
                schedule.setCourseName(request.getCourseName());
                schedule.setDay(request.getDay());
                schedule.setStartTime(request.getStartTime());
                schedule.setEndTime(request.getEndTime());
                schedule.setLocation(request.getLocation());

                if (firstSchedule == null) {
                    firstSchedule = universityScheduleRepository.save(schedule);
                } else {
                    universityScheduleRepository.save(schedule);
                }
            }
            return toDTO(firstSchedule);
        } else {
            if (user.getStudentClass() == null) {
                throw new RuntimeException("You must have a class assigned to add lessons");
            }
            UniversitySchedule schedule = new UniversitySchedule();
            schedule.setStudentClass(user.getStudentClass());
            schedule.setCourseName(request.getCourseName());
            schedule.setDay(request.getDay());
            schedule.setStartTime(request.getStartTime());
            schedule.setEndTime(request.getEndTime());
            schedule.setLocation(request.getLocation());
            return toDTO(universityScheduleRepository.save(schedule));
        }
    }

    @Transactional
    public UniversityScheduleDTO updateSchedule(Long id, UniversityScheduleRequest request, User user) {
        UniversitySchedule schedule = universityScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }

        if (request.getStartTime() != null && request.getEndTime() != null && 
            !request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        if (request.getCourseName() != null) {
            schedule.setCourseName(request.getCourseName());
        }
        if (request.getDay() != null) {
            schedule.setDay(request.getDay());
        }
        if (request.getStartTime() != null) {
            schedule.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            schedule.setEndTime(request.getEndTime());
        }
        if (request.getLocation() != null) {
            schedule.setLocation(request.getLocation());
        }

        UniversitySchedule saved = universityScheduleRepository.save(schedule);

        try {
            String message = "Class updated: " + saved.getCourseName() + " (" + saved.getDay() + " " + saved.getStartTime() + "-" + saved.getEndTime() + ") @ " + saved.getLocation();
            notificationService.notifyStudentClass(user, saved.getStudentClass().getId(), "CLASS_UPDATED", message);
        } catch (Exception ignored) {
            // best-effort notifications
        }

        return toDTO(saved);
    }

    @Transactional
    public void deleteSchedule(Long id, User user) {
        UniversitySchedule schedule = universityScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }
        
        Long studentClassId = schedule.getStudentClass() != null ? schedule.getStudentClass().getId() : null;
        String courseName = schedule.getCourseName();
        String day = schedule.getDay();
        String start = schedule.getStartTime() != null ? schedule.getStartTime().toString() : "";
        String end = schedule.getEndTime() != null ? schedule.getEndTime().toString() : "";
        String location = schedule.getLocation();

        universityScheduleRepository.delete(schedule);

        try {
            String message = "Class deleted: " + courseName + " (" + day + " " + start + "-" + end + ") @ " + location;
            notificationService.notifyStudentClass(user, studentClassId, "CLASS_DELETED", message);
        } catch (Exception ignored) {
            // best-effort notifications
        }
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
}

