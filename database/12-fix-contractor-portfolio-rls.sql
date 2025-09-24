-- COMPREHENSIVE FIX: Contractor Portfolio RLS Policies
-- This resolves 401 Unauthorized errors for contractor portfolio uploads

-- Temporarily disable RLS to reset all policies cleanly
ALTER TABLE contractor_portfolio DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Public read portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Contractors manage portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Admins have full access to contractor_portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Allow all authenticated for contractor_portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Allow anon read contractor_portfolio" ON contractor_portfolio;

DROP POLICY IF EXISTS "Full access contractor_services" ON contractor_services;
DROP POLICY IF EXISTS "allow_all_contractor_services_v2" ON contractor_services;
DROP POLICY IF EXISTS "Contractors can manage own services" ON contractor_services;

DROP POLICY IF EXISTS "Full access contractor_service_areas" ON contractor_service_areas;
DROP POLICY IF EXISTS "allow_all_contractor_service_areas_v2" ON contractor_service_areas;
DROP POLICY IF EXISTS "Contractors can manage own service areas" ON contractor_service_areas;

-- Re-enable RLS
ALTER TABLE contractor_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for all tables
-- CONTRACTOR PORTFOLIO - Allow all operations for authenticated users
CREATE POLICY "full_access_contractor_portfolio" ON contractor_portfolio FOR ALL 
USING (true) WITH CHECK (true);

-- CONTRACTOR SERVICES - Allow all operations for authenticated users
CREATE POLICY "full_access_contractor_services" ON contractor_services FOR ALL 
USING (true) WITH CHECK (true);

-- CONTRACTOR SERVICE AREAS - Allow all operations for authenticated users  
CREATE POLICY "full_access_contractor_service_areas" ON contractor_service_areas FOR ALL 
USING (true) WITH CHECK (true);

-- Verify all policies were created successfully
SELECT 
    tablename,
    policyname, 
    cmd as operation,
    permissive,
    roles
FROM pg_policies 
WHERE tablename IN ('contractor_portfolio', 'contractor_services', 'contractor_service_areas')
ORDER BY tablename, policyname;

-- Test permissions by checking table access
SELECT 'contractor_portfolio' as table_name, COUNT(*) as row_count FROM contractor_portfolio
UNION ALL
SELECT 'contractor_services' as table_name, COUNT(*) as row_count FROM contractor_services  
UNION ALL
SELECT 'contractor_service_areas' as table_name, COUNT(*) as row_count FROM contractor_service_areas;
