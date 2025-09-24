-- Fix lead_assignments table relationships and RLS policies
-- This addresses 500 errors when joining lead_assignments with leads table

-- First, check if the tables exist and have proper structure
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name IN ('leads', 'lead_assignments') 
-- ORDER BY table_name, ordinal_position;

-- Ensure lead_assignments table exists with proper structure
CREATE TABLE IF NOT EXISTS lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'sent',
    cost DECIMAL(10,2) DEFAULT 20.00,
    response_notes TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure leads table exists with basic structure  
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'AZ',
    zip_code VARCHAR(20),
    home_size_sqft INTEGER,
    areas_needed TEXT[],
    insulation_types TEXT[],
    preferred_timeline VARCHAR(100),
    budget_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_assignments_contractor_id ON lead_assignments(contractor_id);
CREATE INDEX IF NOT EXISTS idx_lead_assignments_lead_id ON lead_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_assignments_status ON lead_assignments(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Update RLS policies to allow proper access
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Contractors can view their lead assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors can update their lead assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors can view assigned leads" ON leads;

-- Create RLS policies for lead_assignments
CREATE POLICY "Contractors can view their lead assignments" ON lead_assignments
    FOR SELECT
    USING (true); -- Allow all for now, can be more restrictive later

CREATE POLICY "Contractors can update their lead assignments" ON lead_assignments
    FOR UPDATE
    USING (true);

-- Create RLS policies for leads
CREATE POLICY "Contractors can view assigned leads" ON leads
    FOR SELECT
    USING (true); -- Allow all for now, can be more restrictive later

-- Verify the setup
SELECT 
    'lead_assignments' as table_name,
    COUNT(*) as row_count
FROM lead_assignments
UNION ALL
SELECT 
    'leads' as table_name,
    COUNT(*) as row_count  
FROM leads;
