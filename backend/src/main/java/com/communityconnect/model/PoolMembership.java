package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pool_memberships")
public class PoolMembership {

    @Id
    private String id;

    @Column(name = "pool_id", nullable = false)
    private String poolId;

    @Column(name = "household_id", nullable = false)
    private String householdId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "requested_units", nullable = false)
    private int requestedUnits = 1;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public PoolMembership() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPoolId() { return poolId; }
    public void setPoolId(String poolId) { this.poolId = poolId; }

    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getRequestedUnits() { return requestedUnits; }
    public void setRequestedUnits(int requestedUnits) { this.requestedUnits = requestedUnits; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
