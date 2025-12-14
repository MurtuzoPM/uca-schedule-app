package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.StudentClassDTO;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.StudentClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-classes")
@CrossOrigin(origins = "*")
public class StudentClassController {
    @Autowired
    private StudentClassService studentClassService;

    @GetMapping("/")
    public ResponseEntity<List<StudentClassDTO>> getAllStudentClasses() {
        try {
            List<StudentClassDTO> classes = studentClassService.getAllStudentClasses();
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<StudentClassDTO> getStudentClassById(@PathVariable Long id) {
        try {
            StudentClassDTO studentClass = studentClassService.getStudentClassById(id);
            return ResponseEntity.ok(studentClass);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<StudentClassDTO> createStudentClass(
            @RequestBody StudentClassDTO request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            StudentClassDTO studentClass = studentClassService.createStudentClass(request);
            return ResponseEntity.ok(studentClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/")
    public ResponseEntity<StudentClassDTO> updateStudentClass(
            @PathVariable Long id,
            @RequestBody StudentClassDTO request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            StudentClassDTO studentClass = studentClassService.updateStudentClass(id, request);
            return ResponseEntity.ok(studentClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteStudentClass(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            studentClassService.deleteStudentClass(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

