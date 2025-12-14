package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.*;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/token/")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/token/refresh/")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody JwtResponse request) {
        // For simplicity, returning the same token. In production, implement proper refresh token logic
        return ResponseEntity.ok(request);
    }

    @PostMapping("/register/")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me/")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getCurrentUser(user));
    }

    @PutMapping("/me/")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.updateCurrentUser(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password/")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request) {
        try {
            authService.changePassword(user, request);
            return ResponseEntity.ok().body("{\"status\": \"password set\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

