-- Migration V3: Legal Privacy & DPDP Act Compliance Audit Trail
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_consent_given BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_version VARCHAR(20) DEFAULT 'v1.0';

ALTER TABLE temporary_passes ADD COLUMN IF NOT EXISTS data_purge_date TIMESTAMP;

ALTER TABLE occupancy_conflicts ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE occupancy_conflicts ADD COLUMN IF NOT EXISTS resolved_by_admin_id VARCHAR(255);
