package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.ForgotPasswordRequest;
import com.uca.scheduleapp.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin // Important for your frontend connection
public class PasswordResetController {

    @Autowired
    private PasswordResetService resetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            resetService.processForgotPassword(request.getEmail());
            return ResponseEntity.ok("Reset link sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}