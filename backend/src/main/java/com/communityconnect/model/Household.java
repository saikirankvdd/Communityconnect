package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "households")
public class Household {

    @Id
    private String id;

    @Column(name = "flat_id", nullable = false)
    private String flatId;

    @Column(name = "primary_resident_id")
    private String primaryResidentId;

    @Column(name = "family_name", nullable = false)
    private String familyName;

    @Column(name = "resident_type", nullable = false)
    private String residentType = "OWNER"; // OWNER, TENANT

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    @Column(name = "move_in_date", nullable = false)
    private LocalDate moveInDate = LocalDate.now();

    @Column(name = "move_out_date")
    private LocalDate moveOutDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Household() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFlatId() { return flatId; }
    public void setFlatId(String flatId) { this.flatId = flatId; }

    public String getPrimaryResidentId() { return primaryResidentId; }
    public void setPrimaryResidentId(String primaryResidentId) { this.primaryResidentId = primaryResidentId; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getResidentType() { return residentType; }
    public void setResidentType(String residentType) { this.residentType = residentType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public LocalDate getMoveOutDate() { return moveOutDate; }
    public void setMoveOutDate(LocalDate moveOutDate) { this.moveOutDate = moveOutDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
