package com.uca.scheduleapp.config;

import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setIsSuperuser(true);
            admin.setIsStaff(true);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("=========================================");
            System.out.println("Admin user created successfully!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("=========================================");
        }
    }
}

