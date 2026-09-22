package com.communityconnect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_quotations")
public class ServiceQuotation {

    @Id
    private String id;

    @Column(name = "pool_id", nullable = false)
    private String poolId;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "price_per_unit", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    @Column(name = "total_estimated_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalEstimatedAmount;

    @Column(name = "validity_date", nullable = false)
    private LocalDate validityDate;

    @Column(columnDefinition = "TEXT")
    private String terms;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ServiceQuotation() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPoolId() { return poolId; }
    public void setPoolId(String poolId) { this.poolId = poolId; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public BigDecimal getTotalEstimatedAmount() { return totalEstimatedAmount; }
    public void setTotalEstimatedAmount(BigDecimal totalEstimatedAmount) { this.totalEstimatedAmount = totalEstimatedAmount; }

    public LocalDate getValidityDate() { return validityDate; }
    public void setValidityDate(LocalDate validityDate) { this.validityDate = validityDate; }

    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
