-- V1__init_schema.sql
-- Initial Schema for CommunityConnect Platform (PostgreSQL Compatible)

-- 1. Users & Authentication
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) NOT NULL, -- PLATFORM_ADMIN, COMMUNITY_ADMIN, RESIDENT, SERVICE_PROVIDER, SECURITY
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    community_id VARCHAR(64),
    flat_id VARCHAR(64),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Communities & Multi-Tenancy
CREATE TABLE communities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(100),
    towers INT NOT NULL DEFAULT 1,
    total_units INT NOT NULL DEFAULT 0,
    occupied_units INT NOT NULL DEFAULT 0,
    amenities_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, FROZEN
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, FROZEN
    plan VARCHAR(50) NOT NULL DEFAULT 'GROWTH_TIER',
    monthly_inflow DECIMAL(15,2) DEFAULT 0.00,
    president_name VARCHAR(255),
    president_email VARCHAR(255),
    president_phone VARCHAR(50),
    security_gate_phone VARCHAR(50),
    description TEXT,
    image_url TEXT,
    onboarded_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Flats / Properties
CREATE TABLE flats (
    id VARCHAR(64) PRIMARY KEY,
    community_id VARCHAR(64) NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    tower VARCHAR(100) NOT NULL,
    flat_number VARCHAR(50) NOT NULL,
    floor INT NOT NULL,
    unit_type VARCHAR(50) NOT NULL, -- 2BHK, 3BHK, 4BHK, Villa
    sqft INT DEFAULT 1200,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_flat_community_tower_number UNIQUE (community_id, tower, flat_number)
);

-- 4. Households & Occupancy History
CREATE TABLE households (
    id VARCHAR(64) PRIMARY KEY,
    flat_id VARCHAR(64) NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    primary_resident_id VARCHAR(64) REFERENCES users(id),
    family_name VARCHAR(255) NOT NULL,
    resident_type VARCHAR(50) NOT NULL DEFAULT 'OWNER', -- OWNER, TENANT
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE
    move_in_date DATE NOT NULL,
    move_out_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Household Members
CREATE TABLE household_members (
    id VARCHAR(64) PRIMARY KEY,
    household_id VARCHAR(64) NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    relation VARCHAR(100) NOT NULL, -- PRIMARY, SPOUSE, CHILD, PARENT, ROOMMATE
    phone_number VARCHAR(50),
    access_granted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Occupancy Conflicts Workflow
CREATE TABLE occupancy_conflicts (
    id VARCHAR(64) PRIMARY KEY,
    flat_id VARCHAR(64) NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    previous_household_id VARCHAR(64) REFERENCES households(id),
    requesting_user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    assigned_security_id VARCHAR(64) REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION', -- PENDING_VERIFICATION, REPORT_SUBMITTED, APPROVED, REJECTED
    security_report TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 7. Temporary Access Passes
CREATE TABLE temporary_passes (
    id VARCHAR(64) PRIMARY KEY,
    household_id VARCHAR(64) NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    pass_code VARCHAR(20) NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Service Catalog
CREATE TABLE service_catalog (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_groupable BOOLEAN NOT NULL DEFAULT TRUE,
    default_unit VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    description TEXT
);

-- 9. Provider Profiles
CREATE TABLE provider_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- AC_REPAIR, MAID, COOK, PLUMBING, PEST_CONTROL
    is_solo_staff BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 4.80,
    total_jobs INT DEFAULT 0,
    police_verified BOOLEAN DEFAULT TRUE,
    badge VARCHAR(100) DEFAULT 'SUPER_SERVICE'
);

-- 10. Provider Communities Served
CREATE TABLE provider_communities (
    provider_id VARCHAR(64) NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
    community_id VARCHAR(64) NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    PRIMARY KEY (provider_id, community_id)
);

-- 11. Group Demand Pools
CREATE TABLE group_demand_pools (
    id VARCHAR(64) PRIMARY KEY,
    community_id VARCHAR(64) NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    service_id VARCHAR(64) NOT NULL REFERENCES service_catalog(id),
    title VARCHAR(255) NOT NULL,
    target_households INT NOT NULL,
    current_households INT NOT NULL DEFAULT 1,
    target_units INT NOT NULL,
    current_units INT NOT NULL DEFAULT 1,
    min_discount_pct INT DEFAULT 15,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COLLECTING', -- COLLECTING, QUOTING, BOOKED, EXPIRED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Pool Memberships
CREATE TABLE pool_memberships (
    id VARCHAR(64) PRIMARY KEY,
    pool_id VARCHAR(64) NOT NULL REFERENCES group_demand_pools(id) ON DELETE CASCADE,
    household_id VARCHAR(64) NOT NULL REFERENCES households(id),
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    requested_units INT NOT NULL DEFAULT 1,
    notes TEXT,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_pool_household UNIQUE (pool_id, household_id)
);

-- 13. Service Quotations
CREATE TABLE service_quotations (
    id VARCHAR(64) PRIMARY KEY,
    pool_id VARCHAR(64) NOT NULL REFERENCES group_demand_pools(id) ON DELETE CASCADE,
    provider_id VARCHAR(64) NOT NULL REFERENCES provider_profiles(id),
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_estimated_amount DECIMAL(12,2) NOT NULL,
    validity_date DATE NOT NULL,
    terms TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Service Bookings
CREATE TABLE service_bookings (
    id VARCHAR(64) PRIMARY KEY,
    community_id VARCHAR(64) NOT NULL REFERENCES communities(id),
    household_id VARCHAR(64) NOT NULL REFERENCES households(id),
    service_id VARCHAR(64) NOT NULL REFERENCES service_catalog(id),
    provider_id VARCHAR(64) NOT NULL REFERENCES provider_profiles(id),
    quotation_id VARCHAR(64) REFERENCES service_quotations(id),
    service_type VARCHAR(50) NOT NULL DEFAULT 'GROUP', -- GROUP, INDIVIDUAL
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, CONFIRMED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    scheduled_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Provider Reviews
CREATE TABLE provider_reviews (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL UNIQUE REFERENCES service_bookings(id) ON DELETE CASCADE,
    provider_id VARCHAR(64) NOT NULL REFERENCES provider_profiles(id),
    resident_id VARCHAR(64) NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance and community isolation queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_community ON users(community_id);
CREATE INDEX idx_flats_community ON flats(community_id);
CREATE INDEX idx_households_flat ON households(flat_id);
CREATE INDEX idx_households_status ON households(status);
CREATE INDEX idx_pools_community ON group_demand_pools(community_id);
CREATE INDEX idx_bookings_community ON service_bookings(community_id);
CREATE INDEX idx_bookings_household ON service_bookings(household_id);
