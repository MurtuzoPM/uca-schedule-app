package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.GymScheduleDTO;
import com.uca.scheduleapp.model.GymSchedule;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.GymScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GymScheduleService {
    @Autowired
    private GymScheduleRepository gymScheduleRepository;

    public List<GymScheduleDTO> getAllGymSchedules(User user, String gender) {
        List<GymSchedule> schedules;
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (gender != null) {
                schedules = gymScheduleRepository.findByGender(GymSchedule.Gender.valueOf(gender));
            } else {
                schedules = gymScheduleRepository.findAll();
            }
        } else {
            if (user.getGender() != null) {
                schedules = gymScheduleRepository.findByGender(
                    GymSchedule.Gender.valueOf(user.getGender().name()));
            } else {
                schedules = List.of();
            }
        }
        return schedules.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public GymScheduleDTO getGymScheduleById(Long id, User user) {
        GymSchedule schedule = gymScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gym schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser()) && 
            (user.getGender() == null || !schedule.getGender().name().equals(user.getGender().name()))) {
            throw new RuntimeException("Access denied");
        }
        
        return toDTO(schedule);
    }

    @Transactional
    public GymScheduleDTO createGymSchedule(GymScheduleDTO request, User user) {
        GymSchedule.Gender gender;
        if (Boolean.TRUE.equals(user.getIsSuperuser())) {
            if (request.getGender() == null) {
                throw new RuntimeException("Admin must specify a gender for gym schedule");
            }
            gender = GymSchedule.Gender.valueOf(request.getGender());
        } else {
            if (user.getGender() == null) {
                throw new RuntimeException("You must have a gender assigned to add gym schedules");
            }
            gender = GymSchedule.Gender.valueOf(user.getGender().name());
        }

        if (request.getOpenTime() != null && request.getCloseTime() != null && 
            !request.getOpenTime().isBefore(request.getCloseTime())) {
            throw new RuntimeException("Open time must be before close time");
        }

        List<GymSchedule> overlaps = gymScheduleRepository.findOverlappingSchedules(
            gender,
            request.getDay(),
            request.getOpenTime(),
            request.getCloseTime()
        );
        
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("This time slot overlaps with an existing gym schedule");
        }

        GymSchedule schedule = new GymSchedule();
        schedule.setGender(gender);
        schedule.setDay(request.getDay());
        schedule.setOpenTime(request.getOpenTime());
        schedule.setCloseTime(request.getCloseTime());
        
        return toDTO(gymScheduleRepository.save(schedule));
    }

    @Transactional
    public GymScheduleDTO updateGymSchedule(Long id, GymScheduleDTO request, User user) {
        GymSchedule schedule = gymScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gym schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }

        if (request.getOpenTime() != null && request.getCloseTime() != null && 
            !request.getOpenTime().isBefore(request.getCloseTime())) {
            throw new RuntimeException("Open time must be before close time");
        }

        if (request.getGender() != null) {
            schedule.setGender(GymSchedule.Gender.valueOf(request.getGender()));
        }
        if (request.getDay() != null) {
            schedule.setDay(request.getDay());
        }
        if (request.getOpenTime() != null) {
            schedule.setOpenTime(request.getOpenTime());
        }
        if (request.getCloseTime() != null) {
            schedule.setCloseTime(request.getCloseTime());
        }
        
        return toDTO(gymScheduleRepository.save(schedule));
    }

    @Transactional
    public void deleteGymSchedule(Long id, User user) {
        GymSchedule schedule = gymScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gym schedule not found"));
        
        if (!Boolean.TRUE.equals(user.getIsSuperuser())) {
            throw new RuntimeException("Access denied");
        }
        
        gymScheduleRepository.delete(schedule);
    }

    private GymScheduleDTO toDTO(GymSchedule schedule) {
        return new GymScheduleDTO(
            schedule.getId(),
            schedule.getGender().name(),
            schedule.getDay(),
            schedule.getOpenTime(),
            schedule.getCloseTime()
        );
    }
}

