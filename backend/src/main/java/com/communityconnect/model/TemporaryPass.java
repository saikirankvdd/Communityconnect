package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "temporary_passes")
public class TemporaryPass {

    @Id
    private String id;

    @Column(name = "household_id", nullable = false)
    private String householdId;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Column(name = "guest_phone", nullable = false)
    private String guestPhone;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "pass_code", nullable = false)
    private String passCode;

    private String reason;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, REVOKED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TemporaryPass() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getPassCode() { return passCode; }
    public void setPassCode(String passCode) { this.passCode = passCode; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
