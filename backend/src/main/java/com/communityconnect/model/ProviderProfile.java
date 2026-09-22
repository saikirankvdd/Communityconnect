package com.communityconnect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "is_solo_staff", nullable = false)
    private boolean soloStaff = false;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("4.80");

    @Column(name = "total_jobs")
    private int totalJobs = 0;

    @Column(name = "police_verified")
    private boolean policeVerified = true;

    private String badge = "SUPER_SERVICE";

    public ProviderProfile() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public boolean isSoloStaff() { return soloStaff; }
    public void setSoloStaff(boolean soloStaff) { this.soloStaff = soloStaff; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public int getTotalJobs() { return totalJobs; }
    public void setTotalJobs(int totalJobs) { this.totalJobs = totalJobs; }

    public boolean isPoliceVerified() { return policeVerified; }
    public void setPoliceVerified(boolean policeVerified) { this.policeVerified = policeVerified; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}
