package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.UniversityScheduleDTO;
import com.uca.scheduleapp.dto.UniversityScheduleRequest;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.UniversityScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class UniversityScheduleController {
    @Autowired
    private UniversityScheduleService universityScheduleService;

    @GetMapping("/")
    public ResponseEntity<List<UniversityScheduleDTO>> getAllSchedules(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long student_class_id) {
        try {
            List<UniversityScheduleDTO> schedules = universityScheduleService.getAllSchedules(user, student_class_id);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<UniversityScheduleDTO> getScheduleById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            UniversityScheduleDTO schedule = universityScheduleService.getScheduleById(id, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<UniversityScheduleDTO> createSchedule(
            @RequestBody UniversityScheduleRequest request,
            @AuthenticationPrincipal User user) {
        try {
            UniversityScheduleDTO schedule = universityScheduleService.createSchedule(request, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/")
    public ResponseEntity<UniversityScheduleDTO> updateSchedule(
            @PathVariable Long id,
            @RequestBody UniversityScheduleRequest request,
            @AuthenticationPrincipal User user) {
        try {
            UniversityScheduleDTO schedule = universityScheduleService.updateSchedule(id, request, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            universityScheduleService.deleteSchedule(id, user);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

