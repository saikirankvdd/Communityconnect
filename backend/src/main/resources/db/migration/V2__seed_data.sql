-- V2__seed_data.sql
-- Seed Data for CommunityConnect Backend

-- 1. Communities
INSERT INTO communities (id, name, area, city, state, pincode, address, type, towers, total_units, occupied_units, amenities_count, status, subscription_status, plan, monthly_inflow, president_name, president_email, president_phone, security_gate_phone, description, image_url, onboarded_date) VALUES
('comm-bhooja', 'My Home Bhooja', 'Gachibowli', 'Hyderabad', 'Telangana', '500032', 'C9R5+6V, Silpa Gram Craft Village, Gachibowli, Hyderabad', 'Gated Luxury High-Rise', 8, 1200, 1140, 52, 'ACTIVE', 'ACTIVE', 'ENTERPRISE_PREMIUM', 4850000.00, 'S. Venkat Reddy', 'president.bhooja@communityconnect.com', '+91 98490 12345', '+91 98490 55001', 'A vibrant, secure, and ultra-green luxury community.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', '2025-01-15'),
('comm-saket', 'Saket Towers', 'Damayura', 'Hyderabad', 'Telangana', '500062', 'Saket Road, Kapra, Damayura, Hyderabad', 'Residential Society', 4, 480, 452, 28, 'ACTIVE', 'ACTIVE', 'GROWTH_TIER', 1820000.00, 'Elena Rostova', 'admin.saket@communityconnect.com', '+91 98480 99881', '+91 98480 66002', 'Tight-knit residential society with lush gardens.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80', '2025-02-01');

-- 2. Flats
INSERT INTO flats (id, community_id, tower, flat_number, floor, unit_type, sqft) VALUES
('flat-bhooja-a101', 'comm-bhooja', 'Block A', '101', 1, '3BHK', 2450),
('flat-bhooja-a102', 'comm-bhooja', 'Block A', '102', 1, '3BHK', 2450),
('flat-saket-b304', 'comm-saket', 'Tower B', '304', 3, '2BHK', 1400);

-- 3. Users (Passwords are BCrypt encoded for "password123": $2a$10$7R9rR5.YwQG2i7iQ5fPj7.m6R6e6T4l2e7r6T4l2e7r6T4l2e7r6)
-- We will use standard BCrypt hash for 'password123': $2a$10$3zR14Z5hR6t5G9E5N.4e5e7R.y7R7m7R7e7R7m7R7e7R7m7R7e7
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, is_active, community_id, flat_id) VALUES
('user-platform-admin', 'platform.admin@communityconnect.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Super Platform Admin', '+91 99999 00000', 'PLATFORM_ADMIN', TRUE, NULL, NULL),
('user-admin-bhooja', 'admin.bhooja@communityconnect.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Ramesh Varma', '+91 98490 11111', 'COMMUNITY_ADMIN', TRUE, 'comm-bhooja', NULL),
('user-resident-rahul', 'rahul.sharma@gmail.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Rahul Sharma', '+91 98765 43210', 'RESIDENT', TRUE, 'comm-bhooja', 'flat-bhooja-a101'),
('user-resident-ananya', 'ananya.deshmukh@gmail.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Ananya Deshmukh', '+91 98111 22233', 'RESIDENT', TRUE, 'comm-bhooja', 'flat-bhooja-a102'),
('user-security-bhooja', 'security.bhooja@communityconnect.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Vikram Singh (Head Security)', '+91 98490 55001', 'SECURITY', TRUE, 'comm-bhooja', NULL),
('user-provider-coolcare', 'contact@coolcareac.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'CoolCare AC Services', '+91 98888 77777', 'SERVICE_PROVIDER', TRUE, NULL, NULL),
('user-provider-sunita', 'sunita.cook@communityconnect.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Sunita Devi (Home Cook)', '+91 98765 99001', 'SERVICE_PROVIDER', TRUE, NULL, NULL),
('user-provider-lakshmi', 'lakshmi.maid@communityconnect.com', '$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO', 'Lakshmi Bai (Housekeeper Maid)', '+91 98765 99002', 'SERVICE_PROVIDER', TRUE, NULL, NULL);

-- 4. Households
INSERT INTO households (id, flat_id, primary_resident_id, family_name, resident_type, status, move_in_date) VALUES
('house-bhooja-a101', 'flat-bhooja-a101', 'user-resident-rahul', 'Rahul Family', 'OWNER', 'ACTIVE', '2025-01-01'),
('house-bhooja-a102', 'flat-bhooja-a102', 'user-resident-ananya', 'Deshmukh Household', 'OWNER', 'ACTIVE', '2025-01-10');

-- 5. Household Members
INSERT INTO household_members (id, household_id, user_id, full_name, relation, phone_number, access_granted) VALUES
('hm-1', 'house-bhooja-a101', 'user-resident-rahul', 'Rahul Sharma', 'PRIMARY', '+91 98765 43210', TRUE),
('hm-2', 'house-bhooja-a101', NULL, 'Priya Sharma', 'SPOUSE', '+91 98765 43211', TRUE),
('hm-3', 'house-bhooja-a102', 'user-resident-ananya', 'Ananya Deshmukh', 'PRIMARY', '+91 98111 22233', TRUE);

-- 6. Service Catalog
INSERT INTO service_catalog (id, name, category, is_groupable, default_unit, base_price, description) VALUES
('srv-ac-service', 'AC Servicing & Deep Jet Wash', 'Appliance Maintenance', TRUE, 'AC Unit', 899.00, 'Comprehensive high-pressure foam jet wash and gas check for split/window ACs.'),
('srv-pest-control', 'Herbal Pest Control Treatment', 'Cleaning & Sanitation', TRUE, 'Flat', 1299.00, 'Odourless 2-coat herbal gel treatment for cockroaches and ants.'),
('srv-cook', 'Dedicated Home Cook', 'Individual Household Staff', FALSE, 'Month', 8000.00, 'Experienced home cook for North/South Indian meals 2 times a day.'),
('srv-maid', 'Housekeeping & Maid Service', 'Individual Household Staff', FALSE, 'Month', 5000.00, 'Daily sweeping, mopping, utensil cleaning, and dust management.');

-- 7. Provider Profiles
INSERT INTO provider_profiles (id, user_id, company_name, service_type, is_solo_staff, rating, total_jobs, police_verified, badge) VALUES
('prov-coolcare', 'user-provider-coolcare', 'CoolCare Services Pvt Ltd', 'AC_REPAIR', FALSE, 4.90, 142, TRUE, 'COMMUNITY_PREFERRED'),
('prov-sunita', 'user-provider-sunita', 'Sunita Devi Cooking Services', 'COOK', TRUE, 4.95, 28, TRUE, 'POLICE_VERIFIED_STAFF'),
('prov-lakshmi', 'user-provider-lakshmi', 'Lakshmi Housekeeping', 'MAID', TRUE, 4.88, 35, TRUE, 'POLICE_VERIFIED_STAFF');

-- Provider Communities
INSERT INTO provider_communities (provider_id, community_id) VALUES
('prov-coolcare', 'comm-bhooja'),
('prov-coolcare', 'comm-saket'),
('prov-sunita', 'comm-bhooja'),
('prov-lakshmi', 'comm-bhooja');

-- 8. Group Demand Pools
INSERT INTO group_demand_pools (id, community_id, service_id, title, target_households, current_households, target_units, current_units, min_discount_pct, expires_at, status) VALUES
('pool-bhooja-ac-1', 'comm-bhooja', 'srv-ac-service', 'My Home Bhooja Summer AC Servicing Group Buying', 10, 2, 18, 5, 20, '2026-10-15 23:59:59', 'COLLECTING');

-- Pool Memberships
INSERT INTO pool_memberships (id, pool_id, household_id, user_id, requested_units, notes) VALUES
('pm-1', 'pool-bhooja-ac-1', 'house-bhooja-a101', 'user-resident-rahul', 3, '2 Split ACs in Bedrooms + 1 Cassette AC in Living Room'),
('pm-2', 'pool-bhooja-ac-1', 'house-bhooja-a102', 'user-resident-ananya', 2, '2 Split ACs');
