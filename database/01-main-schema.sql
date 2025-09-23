-- InsulationPal Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('customer', 'contractor', 'admin');
CREATE TYPE contractor_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE lead_status AS ENUM ('active', 'assigned', 'completed', 'cancelled');
CREATE TYPE assignment_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ========================================
-- USERS TABLE (Base for all users)
-- ========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type user_type NOT NULL DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTRACTORS TABLE
-- ========================================
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    insurance_verified BOOLEAN DEFAULT FALSE,
    insurance_expiry DATE,
    status contractor_status DEFAULT 'pending',
    credits INTEGER DEFAULT 0,
    profile_image TEXT,
    bio TEXT,
    website_url TEXT,
    founded_year INTEGER,
    employee_count INTEGER,
    
    -- Business details
    business_address TEXT,
    business_city VARCHAR(100),
    business_state VARCHAR(100),
    business_zip VARCHAR(20),
    
    -- Ratings
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_completed_projects INTEGER DEFAULT 0,
    
    -- Verification
    background_check_verified BOOLEAN DEFAULT FALSE,
    license_verified BOOLEAN DEFAULT FALSE,
    references_verified BOOLEAN DEFAULT FALSE,
    
    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTRACTOR SERVICE AREAS
-- ========================================
CREATE TABLE contractor_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    service_radius INTEGER DEFAULT 50, -- miles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTRACTOR SERVICES
-- ========================================
CREATE TABLE contractor_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL, -- 'attic', 'wall', 'basement', etc.
    insulation_types TEXT[], -- ['fiberglass', 'cellulose', 'spray_foam']
    min_project_size INTEGER,
    max_project_size INTEGER,
    starting_price_per_sqft DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEADS TABLE
-- ========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Customer info (for non-registered users)
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Project details
    home_size_sqft INTEGER NOT NULL,
    areas_needed TEXT[] NOT NULL, -- ['attic', 'walls', 'basement']
    insulation_types TEXT[] NOT NULL, -- ['fiberglass', 'cellulose']
    project_timeline VARCHAR(50), -- 'asap', '1-3months', '3-6months'
    budget_range VARCHAR(50), -- '1000-3000', '3000-5000', etc.
    
    -- Location
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    property_address TEXT,
    
    -- Preferences
    quote_preference VARCHAR(50) DEFAULT 'random_three', -- 'random_three', 'choose_three'
    preferred_contact_method VARCHAR(20) DEFAULT 'email', -- 'email', 'phone', 'both'
    
    -- Status
    status lead_status DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    
    -- Additional info
    additional_notes TEXT,
    current_insulation_type VARCHAR(100),
    energy_bills_amount DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEAD ASSIGNMENTS
-- ========================================
CREATE TABLE lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    
    -- Assignment details
    status assignment_status DEFAULT 'pending',
    cost DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_deadline TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Quote details (if contractor responds)
    quote_amount DECIMAL(10,2),
    quote_notes TEXT,
    estimated_completion_time VARCHAR(100),
    
    -- Project completion
    project_started_at TIMESTAMP WITH TIME ZONE,
    project_completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one assignment per contractor per lead
    UNIQUE(lead_id, contractor_id)
);

-- ========================================
-- REVIEWS
-- ========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_assignment_id UUID REFERENCES lead_assignments(id) ON DELETE SET NULL,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Review details
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Project details
    service_type VARCHAR(100),
    project_cost DECIMAL(10,2),
    project_duration_days INTEGER,
    location VARCHAR(255),
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    
    -- Additional ratings
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTRACTOR PORTFOLIO
-- ========================================
CREATE TABLE contractor_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    
    -- Project details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(100),
    project_size_sqft INTEGER,
    completion_date DATE,
    
    -- Images
    before_image_url TEXT,
    after_image_url TEXT,
    additional_images TEXT[], -- Array of image URLs
    
    -- Location (city/state only for privacy)
    project_city VARCHAR(100),
    project_state VARCHAR(100),
    
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CREDIT TRANSACTIONS
-- ========================================
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'deduction', 'refund', 'bonus'
    credits_amount INTEGER NOT NULL, -- positive for additions, negative for deductions
    cost_amount DECIMAL(10,2), -- actual money amount (for purchases)
    
    -- Package info (for purchases)
    package_id VARCHAR(50),
    package_name VARCHAR(255),
    
    -- Payment details
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    
    -- Status
    status transaction_status DEFAULT 'pending',
    
    -- Reference
    reference_id UUID, -- Could reference lead_assignment or other entities
    reference_type VARCHAR(50), -- 'lead_assignment', 'purchase', etc.
    
    -- Notes
    description TEXT,
    admin_notes TEXT,
    
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- NOTIFICATIONS
-- ========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'new_lead', 'lead_response', 'review', etc.
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    
    -- Reference
    reference_id UUID,
    reference_type VARCHAR(50),
    
    -- Metadata
    metadata JSONB,
    
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SYSTEM SETTINGS
-- ========================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public) VALUES
('lead_cost_default', '20.00', 'Default cost per lead assignment', 'number', FALSE),
('lead_expiry_days', '30', 'Days before a lead expires', 'number', FALSE),
('response_deadline_hours', '48', 'Hours contractors have to respond to leads', 'number', FALSE),
('max_contractors_per_lead', '3', 'Maximum contractors assigned per lead', 'number', FALSE),
('min_credits_required', '5', 'Minimum credits required to receive leads', 'number', FALSE),
('review_reminder_days', '7', 'Days after project completion to send review reminder', 'number', FALSE),
('site_maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', TRUE);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);

-- Contractors
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_credits ON contractors(credits);
CREATE INDEX idx_contractors_rating ON contractors(average_rating);
CREATE INDEX idx_contractors_location ON contractors(business_city, business_state);

-- Service Areas
CREATE INDEX idx_service_areas_location ON contractor_service_areas(city, state);
CREATE INDEX idx_service_areas_contractor ON contractor_service_areas(contractor_id);

-- Leads
CREATE INDEX idx_leads_location ON leads(city, state);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_leads_customer ON leads(customer_id);

-- Lead Assignments
CREATE INDEX idx_assignments_contractor ON lead_assignments(contractor_id);
CREATE INDEX idx_assignments_lead ON lead_assignments(lead_id);
CREATE INDEX idx_assignments_status ON lead_assignments(status);
CREATE INDEX idx_assignments_created ON lead_assignments(created_at);

-- Reviews
CREATE INDEX idx_reviews_contractor ON reviews(contractor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(verified);
CREATE INDEX idx_reviews_created ON reviews(created_at);

-- Credit Transactions
CREATE INDEX idx_transactions_contractor ON credit_transactions(contractor_id);
CREATE INDEX idx_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX idx_transactions_status ON credit_transactions(status);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
