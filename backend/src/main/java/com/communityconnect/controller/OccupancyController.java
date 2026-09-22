package com.communityconnect.controller;

import com.communityconnect.model.Household;
import com.communityconnect.model.OccupancyConflict;
import com.communityconnect.security.CustomUserDetails;
import com.communityconnect.service.OccupancyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/households")
public class OccupancyController {

    private final OccupancyService occupancyService;

    public OccupancyController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    @PostMapping("/occupancy")
    public ResponseEntity<Household> registerOccupancy(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String flatId = request.get("flatId");
        String familyName = request.get("familyName");
        String residentType = request.getOrDefault("residentType", "OWNER");

        Household household = occupancyService.registerOccupancy(flatId, userDetails.getUser().getId(), familyName, residentType);
        return ResponseEntity.ok(household);
    }

    @GetMapping("/occupancy-conflicts")
    @PreAuthorize("hasAnyRole('COMMUNITY_ADMIN', 'SECURITY', 'PLATFORM_ADMIN')")
    public ResponseEntity<List<OccupancyConflict>> getPendingConflicts() {
        return ResponseEntity.ok(occupancyService.getPendingConflicts());
    }

    @PostMapping("/occupancy-conflicts/{id}/report")
    @PreAuthorize("hasAnyRole('SECURITY', 'COMMUNITY_ADMIN')")
    public ResponseEntity<OccupancyConflict> submitSecurityReport(
            @PathVariable String id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String report = request.get("report");
        OccupancyConflict conflict = occupancyService.submitSecurityReport(id, userDetails.getUser().getId(), report);
        return ResponseEntity.ok(conflict);
    }

    @PostMapping("/occupancy-conflicts/{id}/resolve")
    @PreAuthorize("hasAnyRole('COMMUNITY_ADMIN', 'PLATFORM_ADMIN')")
    public ResponseEntity<OccupancyConflict> resolveConflict(
            @PathVariable String id,
            @RequestBody Map<String, Object> request) {
        boolean approve = Boolean.TRUE.equals(request.get("approve"));
        String familyName = (String) request.get("familyName");
        String residentType = (String) request.get("residentType");

        OccupancyConflict conflict = occupancyService.resolveConflict(id, approve, familyName, residentType);
        return ResponseEntity.ok(conflict);
    }
}
