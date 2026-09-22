package com.communityconnect.controller;

import com.communityconnect.model.User;
import com.communityconnect.model.UserRole;
import com.communityconnect.security.CustomUserDetails;
import com.communityconnect.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final String cookieName;

    public AuthController(AuthService authService, @Value("${jwt.cookie-name:cc_jwt_token}") String cookieName) {
        this.authService = authService;
        this.cookieName = cookieName;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> authResult = authService.login(email, password);
        String token = (String) authResult.get("token");

        // Set HttpOnly Cookie
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400); // 24 hrs
        response.addCookie(cookie);

        return ResponseEntity.ok(authResult);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String fullName = request.get("fullName");
        String email = request.get("email");
        String password = request.get("password");
        String phoneNumber = request.get("phoneNumber");
        UserRole role = UserRole.valueOf(request.getOrDefault("role", "RESIDENT"));
        String communityId = request.get("communityId");
        String flatId = request.get("flatId");

        User registered = authService.register(fullName, email, password, phoneNumber, role, communityId, flatId);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", registered.getId()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getUserProfile(userDetails.getUser().getId()));
    }
}
