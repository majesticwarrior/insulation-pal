-- Comprehensive RLS Policy Fix for All Contractor Tables
-- This fixes 401 Unauthorized errors by allowing proper access

-- Disable RLS temporarily to ensure we can create policies
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_insulation_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on contractor-related tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies 
              WHERE tablename IN ('contractors', 'contractor_services', 'contractor_service_areas', 
                                'contractor_insulation_types', 'leads', 'lead_assignments', 'users'))
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_insulation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for development
-- Users table
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Contractors table
CREATE POLICY "Allow all operations on contractors" ON contractors FOR ALL USING (true);

-- Contractor services table
CREATE POLICY "Allow all operations on contractor_services" ON contractor_services FOR ALL USING (true);

-- Contractor service areas table
CREATE POLICY "Allow all operations on contractor_service_areas" ON contractor_service_areas FOR ALL USING (true);

-- Contractor insulation types table
CREATE POLICY "Allow all operations on contractor_insulation_types" ON contractor_insulation_types FOR ALL USING (true);

-- Leads table
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);

-- Lead assignments table
CREATE POLICY "Allow all operations on lead_assignments" ON lead_assignments FOR ALL USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE tablename IN ('contractors', 'contractor_services', 'contractor_service_areas', 
                   'contractor_insulation_types', 'leads', 'lead_assignments', 'users')
ORDER BY tablename, policyname;
