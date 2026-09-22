package com.communityconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> rootHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "app", "CommunityConnect Backend API Server",
            "version", "3.2.3"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP"
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> apiHealthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP"
        ));
    }
}
