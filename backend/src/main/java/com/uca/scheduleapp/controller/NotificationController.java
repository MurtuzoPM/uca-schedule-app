package com.uca.scheduleapp.controller;

import com.uca.scheduleapp.dto.NotificationDTO;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/")
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(notificationService.getMyNotifications(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/unread-count/")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(notificationService.getUnreadCount(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{id}/read/")
    public ResponseEntity<?> markRead(@AuthenticationPrincipal User user, @PathVariable Long id) {
        try {
            notificationService.markRead(user, id);
            return ResponseEntity.ok().body("{\"status\": \"ok\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/read-all/")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal User user) {
        try {
            notificationService.markAllRead(user);
            return ResponseEntity.ok().body("{\"status\": \"ok\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
