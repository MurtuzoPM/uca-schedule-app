package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        String response = aiService.chat(user, message);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
