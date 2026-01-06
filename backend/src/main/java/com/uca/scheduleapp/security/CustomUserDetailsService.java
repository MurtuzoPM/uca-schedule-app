package com.uca.scheduleapp.security;

import com.uca.scheduleapp.model.User;
import com.uca.scheduleapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        // 1. Try to find by Email first
        java.util.Optional<User> userByEmail = userRepository.findByEmail(input);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        // 2. Try to find by Username (legacy support, valid if unique)
        try {
            java.util.Optional<User> userByUsername = userRepository.findByUsername(input);
            if (userByUsername.isPresent()) {
                return userByUsername.get();
            }
        } catch (org.springframework.dao.IncorrectResultSizeDataAccessException
                | jakarta.persistence.NonUniqueResultException e) {
            throw new UsernameNotFoundException(
                    "Username is ambiguous (duplicates exist). Please login using your Email instead.");
        }

        throw new UsernameNotFoundException("User not found with email or username: " + input);
    }
}
