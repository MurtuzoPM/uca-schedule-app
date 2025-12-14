package com.uca.scheduleapp.service;

import com.uca.scheduleapp.dto.*;
import com.uca.scheduleapp.model.StudentClass;
import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.StudentClassRepository;
import com.uca.scheduleapp.repository.UserRepository;
import com.uca.scheduleapp.security.CustomUserDetailsService;
import com.uca.scheduleapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        return new JwtResponse(token, token); // In a real app, you'd generate a separate refresh token
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
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

        User savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    public UserResponse getCurrentUser(User user) {
        return toUserResponse(user);
    }

    public UserResponse updateCurrentUser(User user, RegisterRequest request) {
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
        User savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
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

