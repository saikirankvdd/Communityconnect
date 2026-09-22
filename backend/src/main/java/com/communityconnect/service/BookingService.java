package com.communityconnect.service;

import com.communityconnect.exception.ResourceNotFoundException;
import com.communityconnect.exception.UnauthorizedOperationException;
import com.communityconnect.model.ProviderReview;
import com.communityconnect.model.ServiceBooking;
import com.communityconnect.repository.ProviderReviewRepository;
import com.communityconnect.repository.ServiceBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final ServiceBookingRepository bookingRepository;
    private final ProviderReviewRepository reviewRepository;

    public BookingService(ServiceBookingRepository bookingRepository, ProviderReviewRepository reviewRepository) {
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ServiceBooking> getBookingsByHousehold(String householdId) {
        return bookingRepository.findByHouseholdId(householdId);
    }

    public List<ServiceBooking> getBookingsByProvider(String providerId) {
        return bookingRepository.findByProviderId(providerId);
    }

    @Transactional
    public ServiceBooking createBooking(String communityId, String householdId, String serviceId, String providerId, String quotationId, String serviceType, LocalDateTime scheduledDate, BigDecimal amount, String notes) {
        ServiceBooking booking = new ServiceBooking();
        booking.setId("book-" + UUID.randomUUID().toString().substring(0, 8));
        booking.setCommunityId(communityId);
        booking.setHouseholdId(householdId);
        booking.setServiceId(serviceId);
        booking.setProviderId(providerId);
        booking.setQuotationId(quotationId);
        booking.setServiceType(serviceType);
        booking.setStatus("CONFIRMED");
        booking.setScheduledDate(scheduledDate);
        booking.setTotalAmount(amount);
        booking.setNotes(notes);

        return bookingRepository.save(booking);
    }

    @Transactional
    public ServiceBooking updateStatus(String bookingId, String newStatus) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }

    @Transactional
    public ProviderReview submitReview(String bookingId, String residentId, int rating, String comment) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new UnauthorizedOperationException("Reviews can only be submitted for completed services");
        }

        reviewRepository.findByBookingId(bookingId).ifPresent(existing -> {
            throw new UnauthorizedOperationException("A review has already been submitted for this booking");
        });

        ProviderReview review = new ProviderReview();
        review.setId("rev-" + UUID.randomUUID().toString().substring(0, 8));
        review.setBookingId(bookingId);
        review.setProviderId(booking.getProviderId());
        review.setResidentId(residentId);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }
}
