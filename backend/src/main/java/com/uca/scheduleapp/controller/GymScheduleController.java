package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.GymScheduleDTO;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.GymScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gym")
@CrossOrigin(origins = "*")
public class GymScheduleController {
    @Autowired
    private GymScheduleService gymScheduleService;

    @GetMapping("/")
    public ResponseEntity<List<GymScheduleDTO>> getAllGymSchedules(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String gender) {
        try {
            List<GymScheduleDTO> schedules = gymScheduleService.getAllGymSchedules(user, gender);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<GymScheduleDTO> getGymScheduleById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            GymScheduleDTO schedule = gymScheduleService.getGymScheduleById(id, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<GymScheduleDTO> createGymSchedule(
            @RequestBody GymScheduleDTO request,
            @AuthenticationPrincipal User user) {
        try {
            GymScheduleDTO schedule = gymScheduleService.createGymSchedule(request, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/")
    public ResponseEntity<GymScheduleDTO> updateGymSchedule(
            @PathVariable Long id,
            @RequestBody GymScheduleDTO request,
            @AuthenticationPrincipal User user) {
        try {
            GymScheduleDTO schedule = gymScheduleService.updateGymSchedule(id, request, user);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteGymSchedule(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            gymScheduleService.deleteGymSchedule(id, user);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

