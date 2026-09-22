package com.communityconnect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_bookings")
public class ServiceBooking {

    @Id
    private String id;

    @Column(name = "community_id", nullable = false)
    private String communityId;

    @Column(name = "household_id", nullable = false)
    private String householdId;

    @Column(name = "service_id", nullable = false)
    private String serviceId;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "quotation_id")
    private String quotationId;

    @Column(name = "service_type", nullable = false)
    private String serviceType = "GROUP"; // GROUP, INDIVIDUAL

    @Column(nullable = false)
    private String status = "REQUESTED"; // REQUESTED, CONFIRMED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ServiceBooking() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCommunityId() { return communityId; }
    public void setCommunityId(String communityId) { this.communityId = communityId; }

    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getQuotationId() { return quotationId; }
    public void setQuotationId(String quotationId) { this.quotationId = quotationId; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
