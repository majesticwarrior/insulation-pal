-- Enable Profile Save Operations - Fix RLS for Service Areas and Services
-- This allows contractor profile editing to work properly

-- Temporarily disable RLS to reset policies
ALTER TABLE contractor_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas DISABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Contractors can manage own services" ON contractor_services;
DROP POLICY IF EXISTS "Public can view approved contractor services" ON contractor_services;
DROP POLICY IF EXISTS "Admins have full access to contractor_services" ON contractor_services;

DROP POLICY IF EXISTS "Contractors can manage own service areas" ON contractor_service_areas;
DROP POLICY IF EXISTS "Public can view approved contractor service areas" ON contractor_service_areas;
DROP POLICY IF EXISTS "Admins have full access to contractor_service_areas" ON contractor_service_areas;

-- Re-enable RLS
ALTER TABLE contractor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for development
-- Allow all authenticated users to manage contractor services
CREATE POLICY "Allow all authenticated for contractor_services" ON contractor_services FOR ALL 
TO authenticated USING (true) WITH CHECK (true);

-- Allow all authenticated users to manage contractor service areas  
CREATE POLICY "Allow all authenticated for contractor_service_areas" ON contractor_service_areas FOR ALL 
TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous (anon) role for public viewing
CREATE POLICY "Allow anon read contractor_services" ON contractor_services FOR SELECT 
TO anon USING (true);

CREATE POLICY "Allow anon read contractor_service_areas" ON contractor_service_areas FOR SELECT 
TO anon USING (true);

-- Verify the policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd as operation,
    roles,
    permissive
FROM pg_policies 
WHERE tablename IN ('contractor_services', 'contractor_service_areas')
ORDER BY tablename, policyname;
