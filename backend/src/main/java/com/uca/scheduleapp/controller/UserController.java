package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.RegisterRequest;
import com.uca.scheduleapp.dto.UserResponse;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<UserResponse>> getAllUsers(@AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            UserResponse userResponse = userService.getUserById(id);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody RegisterRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            UserResponse userResponse = userService.createUser(request);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody RegisterRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            UserResponse userResponse = userService.updateUser(id, request);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null || !Boolean.TRUE.equals(user.getIsSuperuser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

