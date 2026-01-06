package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.RegisterRequest;
import com.uca.scheduleapp.dto.UserResponse;
import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.StudentClassRepository;
import com.uca.scheduleapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        // Username is no longer unique, so we don't check for existence by username.
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        if (request.getGender() != null) {
            user.setGender(User.Gender.valueOf(request.getGender()));
        }
        if (request.getStudentClass() != null) {
            Optional<StudentClass> studentClass = studentClassRepository.findById(request.getStudentClass());
            studentClass.ifPresent(user::setStudentClass);
        }
        user.setIsSuperuser(false);
        user.setIsStaff(false);
        user.setIsActive(true);

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getGender() != null) {
            user.setGender(User.Gender.valueOf(request.getGender()));
        }
        if (request.getStudentClass() != null) {
            Optional<StudentClass> studentClass = studentClassRepository.findById(request.getStudentClass());
            studentClass.ifPresent(user::setStudentClass);
        }

        boolean roleChanged = false;
        String newRole = "";

        // Handle admin privileges
        if (request.getIsSuperuser() != null) {
            if (!request.getIsSuperuser().equals(user.getIsSuperuser())) {
                user.setIsSuperuser(request.getIsSuperuser());
                roleChanged = true;
                if (Boolean.TRUE.equals(request.getIsSuperuser())) {
                    user.setIsStaff(true);
                    newRole = "Admin";
                } else {
                    newRole = user.getIsStaff() ? "Staff" : "Student";
                }
            }
        }
        // Allow explicit isStaff setting (but superuser always has staff privileges)
        if (request.getIsStaff() != null) {
            // Only set isStaff if user is not a superuser, or if explicitly setting it
            if (!Boolean.TRUE.equals(user.getIsSuperuser()) || request.getIsStaff()) {
                if (!request.getIsStaff().equals(user.getIsStaff())) {
                    user.setIsStaff(request.getIsStaff());
                    roleChanged = true;
                    newRole = request.getIsStaff() ? "Staff" : "Student";
                }
            }
        }

        User savedUser = userRepository.save(user);

        if (roleChanged) {
            notificationService.notifyUser(savedUser, "ROLE_UPDATED", "Your role has been updated to: " + newRole);
        }

        return toUserResponse(savedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Delete related notifications first to satisfy FK constraint
        notificationService.deleteUserNotifications(user);
        userRepository.delete(user);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getStudentClass() != null ? user.getStudentClass().getId() : null,
                user.getStudentClass() != null ? user.getStudentClass().getName() : null,
                user.getStudentClass() != null ? user.getStudentClass().getYearLevel().name() : null,
                user.getIsSuperuser());
    }
}
