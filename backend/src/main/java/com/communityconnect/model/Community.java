package com.communityconnect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "communities")
public class Community {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    private String type;

    @Column(nullable = false)
    private int towers = 1;

    @Column(name = "total_units", nullable = false)
    private int totalUnits = 0;

    @Column(name = "occupied_units", nullable = false)
    private int occupiedUnits = 0;

    @Column(name = "amenities_count", nullable = false)
    private int amenitiesCount = 0;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, FROZEN

    @Column(name = "subscription_status", nullable = false)
    private String subscriptionStatus = "ACTIVE"; // ACTIVE, SUSPENDED, FROZEN

    @Column(nullable = false)
    private String plan = "GROWTH_TIER";

    @Column(name = "monthly_inflow", precision = 15, scale = 2)
    private BigDecimal monthlyInflow = BigDecimal.ZERO;

    @Column(name = "president_name")
    private String presidentName;

    @Column(name = "president_email")
    private String presidentEmail;

    @Column(name = "president_phone")
    private String presidentPhone;

    @Column(name = "security_gate_phone")
    private String securityGatePhone;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "onboarded_date", nullable = false)
    private LocalDate onboardedDate = LocalDate.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Community() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getTowers() { return towers; }
    public void setTowers(int towers) { this.towers = towers; }

    public int getTotalUnits() { return totalUnits; }
    public void setTotalUnits(int totalUnits) { this.totalUnits = totalUnits; }

    public int getOccupiedUnits() { return occupiedUnits; }
    public void setOccupiedUnits(int occupiedUnits) { this.occupiedUnits = occupiedUnits; }

    public int getAmenitiesCount() { return amenitiesCount; }
    public void setAmenitiesCount(int amenitiesCount) { this.amenitiesCount = amenitiesCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(String subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public BigDecimal getMonthlyInflow() { return monthlyInflow; }
    public void setMonthlyInflow(BigDecimal monthlyInflow) { this.monthlyInflow = monthlyInflow; }

    public String getPresidentName() { return presidentName; }
    public void setPresidentName(String presidentName) { this.presidentName = presidentName; }

    public String getPresidentEmail() { return presidentEmail; }
    public void setPresidentEmail(String presidentEmail) { this.presidentEmail = presidentEmail; }

    public String getPresidentPhone() { return presidentPhone; }
    public void setPresidentPhone(String presidentPhone) { this.presidentPhone = presidentPhone; }

    public String getSecurityGatePhone() { return securityGatePhone; }
    public void setSecurityGatePhone(String securityGatePhone) { this.securityGatePhone = securityGatePhone; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDate getOnboardedDate() { return onboardedDate; }
    public void setOnboardedDate(LocalDate onboardedDate) { this.onboardedDate = onboardedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
