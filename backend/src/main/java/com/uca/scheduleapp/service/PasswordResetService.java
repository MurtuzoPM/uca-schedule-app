package com.uca.scheduleapp.service;

import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        user.setResetToken(otp); // Store OTP in the same token column
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send the OTP Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your Password Reset Code");
        message.setText("Your verification code is: " + otp + "\nThis code expires in 10 minutes.");
        mailSender.send(message);
    }

    private void sendEmail(String to, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("Click the link below to reset your password:\n" + link);
        mailSender.send(message);
    }

    public void updatePassword(String otp, String newPassword) {
    // Look for the user who has this specific OTP
    User user = userRepository.findByResetToken(otp)
            .orElseThrow(() -> new RuntimeException("Invalid or incorrect code."));

    // Check if the code has expired
    if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("The code has expired. Please request a new one.");
    }

    // Encrypt the new password and clear the token
    user.setPassword(passwordEncoder.encode(newPassword));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);
    userRepository.save(user);
}
}
