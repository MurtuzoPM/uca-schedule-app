package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.CourseDTO;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping("/")
    public ResponseEntity<List<CourseDTO>> getAllCourses(@AuthenticationPrincipal User user) {
        try {
            List<CourseDTO> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        try {
            CourseDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<CourseDTO> createCourse(
            @RequestBody CourseDTO request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            CourseDTO course = courseService.createCourse(request);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            CourseDTO course = courseService.updateCourse(id, request);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

