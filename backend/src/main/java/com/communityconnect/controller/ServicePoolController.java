package com.communityconnect.controller;

import com.communityconnect.model.GroupDemandPool;
import com.communityconnect.model.PoolMembership;
import com.communityconnect.model.ServiceCatalog;
import com.communityconnect.model.ServiceQuotation;
import com.communityconnect.repository.ServiceCatalogRepository;
import com.communityconnect.security.CustomUserDetails;
import com.communityconnect.service.ServicePoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServicePoolController {

    private final ServiceCatalogRepository catalogRepository;
    private final ServicePoolService poolService;

    public ServicePoolController(ServiceCatalogRepository catalogRepository, ServicePoolService poolService) {
        this.catalogRepository = catalogRepository;
        this.poolService = poolService;
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<ServiceCatalog>> getCatalog() {
        return ResponseEntity.ok(catalogRepository.findAll());
    }

    @GetMapping("/pools")
    public ResponseEntity<List<GroupDemandPool>> getPools(@RequestParam String communityId) {
        return ResponseEntity.ok(poolService.getPoolsByCommunity(communityId));
    }

    @PostMapping("/pools/{id}/join")
    public ResponseEntity<PoolMembership> joinPool(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String householdId = (String) request.get("householdId");
        int units = ((Number) request.getOrDefault("units", 1)).intValue();
        String notes = (String) request.get("notes");

        PoolMembership membership = poolService.joinPool(id, householdId, userDetails.getUser().getId(), units, notes);
        return ResponseEntity.ok(membership);
    }

    @PostMapping("/quotations")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<ServiceQuotation> submitQuotation(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String poolId = (String) request.get("poolId");
        String providerId = (String) request.get("providerId");
        BigDecimal pricePerUnit = new BigDecimal(request.get("pricePerUnit").toString());
        BigDecimal totalEstimate = new BigDecimal(request.get("totalEstimate").toString());
        LocalDate validity = LocalDate.parse(request.get("validityDate").toString());
        String terms = (String) request.get("terms");

        ServiceQuotation quotation = poolService.submitQuotation(poolId, providerId, pricePerUnit, totalEstimate, validity, terms);
        return ResponseEntity.ok(quotation);
    }
}
