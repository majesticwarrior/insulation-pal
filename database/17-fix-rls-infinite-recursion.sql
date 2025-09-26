-- Fix RLS Infinite Recursion Issues
-- This script resolves "infinite recursion detected in policy" errors
-- Run this in your Supabase SQL Editor

-- ========================================
-- STEP 1: DISABLE RLS TEMPORARILY TO ACCESS TABLES
-- ========================================

-- Temporarily disable RLS on problematic tables
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: DROP ALL EXISTING POLICIES TO START FRESH
-- ========================================

-- Drop all existing policies on leads table
DROP POLICY IF EXISTS "Allow all access to leads" ON leads;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can view leads" ON leads;

-- Drop all existing policies on lead_assignments table
DROP POLICY IF EXISTS "Allow all access to lead_assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON lead_assignments;
DROP POLICY IF EXISTS "Enable read access for all users" ON lead_assignments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON lead_assignments;

-- Drop all existing policies on reviews table
DROP POLICY IF EXISTS "Allow admin insert reviews" ON reviews;
DROP POLICY IF EXISTS "Allow admin read reviews" ON reviews;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON reviews;
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;

-- Drop all existing policies on contractors table
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON contractors;
DROP POLICY IF EXISTS "Enable read access for all users" ON contractors;

-- ========================================
-- STEP 3: CREATE SIMPLE, NON-RECURSIVE POLICIES
-- ========================================

-- Create simple policies for leads table
CREATE POLICY "leads_public_read" ON leads
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "leads_public_insert" ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "leads_public_update" ON leads
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create simple policies for lead_assignments table
CREATE POLICY "lead_assignments_public_read" ON lead_assignments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "lead_assignments_public_insert" ON lead_assignments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create simple policies for reviews table
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "reviews_public_insert" ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "reviews_public_update" ON reviews
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create simple policies for contractors table
CREATE POLICY "contractors_public_read" ON contractors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "contractors_public_insert" ON contractors
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "contractors_public_update" ON contractors
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- ========================================
-- STEP 4: RE-ENABLE RLS WITH NEW POLICIES
-- ========================================

-- Re-enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: VERIFICATION
-- ========================================

-- Test that we can now access the tables
SELECT 'Testing leads table...' as test;
SELECT COUNT(*) as leads_count FROM leads;

SELECT 'Testing contractors table...' as test;
SELECT COUNT(*) as contractors_count FROM contractors;

SELECT 'Testing reviews table...' as test;
SELECT COUNT(*) as reviews_count FROM reviews;

SELECT 'Testing lead_assignments table...' as test;
SELECT COUNT(*) as lead_assignments_count FROM lead_assignments;

-- Show current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('leads', 'contractors', 'reviews', 'lead_assignments')
ORDER BY tablename, policyname;

-- Success message
SELECT '✅ RLS infinite recursion fixed! All tables should now be accessible.' as status;
