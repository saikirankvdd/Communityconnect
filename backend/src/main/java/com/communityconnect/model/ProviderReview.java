package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "provider_reviews")
public class ProviderReview {

    @Id
    private String id;

    @Column(name = "booking_id", nullable = false, unique = true)
    private String bookingId;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "resident_id", nullable = false)
    private String residentId;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProviderReview() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getResidentId() { return residentId; }
    public void setResidentId(String residentId) { this.residentId = residentId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
