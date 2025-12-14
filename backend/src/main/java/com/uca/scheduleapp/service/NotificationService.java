package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.NotificationDTO;
import com.uca.scheduleapp.model.Notification;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.NotificationRepository;
import com.uca.scheduleapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<NotificationDTO> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markRead(User user, Long notificationId) {
        if (notificationId == null) {
            throw new RuntimeException("Notification id is required");
        }
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllRead(User user) {
        List<Notification> notes = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification n : notes) {
            if (!Boolean.TRUE.equals(n.getIsRead())) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        }
    }

    @Transactional
    public void notifyStudentClass(User actor, Long studentClassId, String type, String message) {
        if (studentClassId == null) return;
        List<User> users = userRepository.findByStudentClassId(studentClassId);
        for (User u : users) {
            if (actor != null && u.getId().equals(actor.getId())) {
                continue;
            }
            Notification n = new Notification();
            n.setUser(u);
            n.setType(type);
            n.setMessage(message);
            n.setIsRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);
        }
    }

    private NotificationDTO toDTO(Notification n) {
        return new NotificationDTO(
            n.getId(),
            n.getType(),
            n.getMessage(),
            n.getIsRead(),
            n.getCreatedAt()
        );
    }
}
