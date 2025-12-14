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
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

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
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Should be encoded, but for admin creation we might handle differently
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
        // Note: isSuperuser and isStaff would need separate DTO fields

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
            user.getIsSuperuser()
        );
    }
}

