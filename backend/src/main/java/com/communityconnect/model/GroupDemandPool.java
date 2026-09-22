package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_demand_pools")
public class GroupDemandPool {

    @Id
    private String id;

    @Column(name = "community_id", nullable = false)
    private String communityId;

    @Column(name = "service_id", nullable = false)
    private String serviceId;

    @Column(nullable = false)
    private String title;

    @Column(name = "target_households", nullable = false)
    private int targetHouseholds;

    @Column(name = "current_households", nullable = false)
    private int currentHouseholds = 1;

    @Column(name = "target_units", nullable = false)
    private int targetUnits;

    @Column(name = "current_units", nullable = false)
    private int currentUnits = 1;

    @Column(name = "min_discount_pct")
    private int minDiscountPct = 15;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private String status = "COLLECTING"; // COLLECTING, QUOTING, BOOKED, EXPIRED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public GroupDemandPool() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCommunityId() { return communityId; }
    public void setCommunityId(String communityId) { this.communityId = communityId; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getTargetHouseholds() { return targetHouseholds; }
    public void setTargetHouseholds(int targetHouseholds) { this.targetHouseholds = targetHouseholds; }

    public int getCurrentHouseholds() { return currentHouseholds; }
    public void setCurrentHouseholds(int currentHouseholds) { this.currentHouseholds = currentHouseholds; }

    public int getTargetUnits() { return targetUnits; }
    public void setTargetUnits(int targetUnits) { this.targetUnits = targetUnits; }

    public int getCurrentUnits() { return currentUnits; }
    public void setCurrentUnits(int currentUnits) { this.currentUnits = currentUnits; }

    public int getMinDiscountPct() { return minDiscountPct; }
    public void setMinDiscountPct(int minDiscountPct) { this.minDiscountPct = minDiscountPct; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
