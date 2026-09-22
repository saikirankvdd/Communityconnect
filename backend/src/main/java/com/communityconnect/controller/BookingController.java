package com.communityconnect.controller;

import com.communityconnect.model.ProviderReview;
import com.communityconnect.model.ServiceBooking;
import com.communityconnect.security.CustomUserDetails;
import com.communityconnect.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<ServiceBooking>> getHouseholdBookings(@PathVariable String householdId) {
        return ResponseEntity.ok(bookingService.getBookingsByHousehold(householdId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceBooking>> getProviderBookings(@PathVariable String providerId) {
        return ResponseEntity.ok(bookingService.getBookingsByProvider(providerId));
    }

    @PostMapping
    public ResponseEntity<ServiceBooking> createBooking(@RequestBody Map<String, Object> request) {
        String communityId = (String) request.get("communityId");
        String householdId = (String) request.get("householdId");
        String serviceId = (String) request.get("serviceId");
        String providerId = (String) request.get("providerId");
        String quotationId = (String) request.get("quotationId");
        String serviceType = (String) request.getOrDefault("serviceType", "GROUP");
        LocalDateTime scheduledDate = LocalDateTime.parse(request.get("scheduledDate").toString());
        BigDecimal totalAmount = new BigDecimal(request.get("totalAmount").toString());
        String notes = (String) request.get("notes");

        ServiceBooking booking = bookingService.createBooking(communityId, householdId, serviceId, providerId, quotationId, serviceType, scheduledDate, totalAmount, notes);
        return ResponseEntity.ok(booking);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceBooking> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ProviderReview> submitReview(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        int rating = ((Number) request.get("rating")).intValue();
        String comment = (String) request.get("comment");

        ProviderReview review = bookingService.submitReview(id, userDetails.getUser().getId(), rating, comment);
        return ResponseEntity.ok(review);
    }
}
