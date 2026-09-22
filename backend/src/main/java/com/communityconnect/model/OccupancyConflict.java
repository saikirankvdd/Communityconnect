package com.communityconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "occupancy_conflicts")
public class OccupancyConflict {

    @Id
    private String id;

    @Column(name = "flat_id", nullable = false)
    private String flatId;

    @Column(name = "previous_household_id")
    private String previousHouseholdId;

    @Column(name = "requesting_user_id", nullable = false)
    private String requestingUserId;

    @Column(name = "assigned_security_id")
    private String assignedSecurityId;

    @Column(nullable = false)
    private String status = "PENDING_VERIFICATION"; // PENDING_VERIFICATION, REPORT_SUBMITTED, APPROVED, REJECTED

    @Column(name = "security_report", columnDefinition = "TEXT")
    private String securityReport;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public OccupancyConflict() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFlatId() { return flatId; }
    public void setFlatId(String flatId) { this.flatId = flatId; }

    public String getPreviousHouseholdId() { return previousHouseholdId; }
    public void setPreviousHouseholdId(String previousHouseholdId) { this.previousHouseholdId = previousHouseholdId; }

    public String getRequestingUserId() { return requestingUserId; }
    public void setRequestingUserId(String requestingUserId) { this.requestingUserId = requestingUserId; }

    public String getAssignedSecurityId() { return assignedSecurityId; }
    public void setAssignedSecurityId(String assignedSecurityId) { this.assignedSecurityId = assignedSecurityId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSecurityReport() { return securityReport; }
    public void setSecurityReport(String securityReport) { this.securityReport = securityReport; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
