package com.communityconnect.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "service_catalog")
public class ServiceCatalog {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "is_groupable", nullable = false)
    private boolean groupable = true;

    @Column(name = "default_unit", nullable = false)
    private String defaultUnit;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    public ServiceCatalog() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isGroupable() { return groupable; }
    public void setGroupable(boolean groupable) { this.groupable = groupable; }

    public String getDefaultUnit() { return defaultUnit; }
    public void setDefaultUnit(String defaultUnit) { this.defaultUnit = defaultUnit; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
