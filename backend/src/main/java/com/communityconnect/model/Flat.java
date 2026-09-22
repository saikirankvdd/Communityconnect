package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flats")
public class Flat {

    @Id
    private String id;

    @Column(name = "community_id", nullable = false)
    private String communityId;

    @Column(nullable = false)
    private String tower;

    @Column(name = "flat_number", nullable = false)
    private String flatNumber;

    @Column(nullable = false)
    private int floor;

    @Column(name = "unit_type", nullable = false)
    private String unitType;

    private int sqft = 1200;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Flat() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCommunityId() { return communityId; }
    public void setCommunityId(String communityId) { this.communityId = communityId; }

    public String getTower() { return tower; }
    public void setTower(String tower) { this.tower = tower; }

    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }

    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }

    public int getSqft() { return sqft; }
    public void setSqft(int sqft) { this.sqft = sqft; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
