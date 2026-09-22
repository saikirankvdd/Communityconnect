package com.communityconnect.service;

import com.communityconnect.exception.ResourceNotFoundException;
import com.communityconnect.exception.UnauthorizedOperationException;
import com.communityconnect.model.User;
import com.communityconnect.model.UserRole;
import com.communityconnect.repository.UserRepository;
import com.communityconnect.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedOperationException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedOperationException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new UnauthorizedOperationException("Account is inactive or suspended");
        }

        String token = tokenProvider.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", sanitizeUser(user));
        return response;
    }

    @Transactional
    public User register(String fullName, String email, String password, String phoneNumber, UserRole role, String communityId, String flatId) {
        if (userRepository.existsByEmail(email)) {
            throw new UnauthorizedOperationException("User already exists with email: " + email);
        }

        String userId = "user-" + UUID.randomUUID().toString().substring(0, 8);
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User(userId, email, encodedPassword, fullName, phoneNumber, role, communityId, flatId);
        return userRepository.save(user);
    }

    public Map<String, Object> getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return sanitizeUser(user);
    }

    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> sanitized = new HashMap<>();
        sanitized.put("id", user.getId());
        sanitized.put("email", user.getEmail());
        sanitized.put("fullName", user.getFullName());
        sanitized.put("phoneNumber", user.getPhoneNumber());
        sanitized.put("role", user.getRole().name());
        sanitized.put("communityId", user.getCommunityId());
        sanitized.put("flatId", user.getFlatId());
        sanitized.put("isActive", user.isActive());
        return sanitized;
    }
}
