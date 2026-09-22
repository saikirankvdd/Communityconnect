package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_members")
public class HouseholdMember {

    @Id
    private String id;

    @Column(name = "household_id", nullable = false)
    private String householdId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String relation;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "access_granted", nullable = false)
    private boolean accessGranted = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public HouseholdMember() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public boolean isAccessGranted() { return accessGranted; }
    public void setAccessGranted(boolean accessGranted) { this.accessGranted = accessGranted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
