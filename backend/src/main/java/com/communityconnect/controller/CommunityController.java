package com.communityconnect.controller;

import com.communityconnect.exception.CommunityAccessDeniedException;
import com.communityconnect.model.Community;
import com.communityconnect.security.CustomUserDetails;
import com.communityconnect.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<Community>> getPublicCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunityById(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Community Isolation enforcement
        if (userDetails != null && userDetails.getUser().getCommunityId() != null) {
            if (!userDetails.getUser().getCommunityId().equals(id) && !"PLATFORM_ADMIN".equalsIgnoreCase(userDetails.getUser().getRole().name())) {
                throw new CommunityAccessDeniedException("Access denied: You cannot view data from another community.");
            }
        }
        Community community = communityService.getCommunityById(id);
        communityService.validateCommunityAccess(community);
        return ResponseEntity.ok(community);
    }

    @PatchMapping("/{id}/subscription")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<Community> updateSubscriptionStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        String status = request.get("status"); // ACTIVE, SUSPENDED, FROZEN
        return ResponseEntity.ok(communityService.updateSubscriptionStatus(id, status));
    }
}
