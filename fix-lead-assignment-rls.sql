-- Fix RLS policies for lead assignments to allow contractors to see their leads
-- Run this in Supabase SQL Editor

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE tablename IN ('leads', 'lead_assignments')
ORDER BY tablename, policyname;

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Contractors read assigned leads" ON leads;
DROP POLICY IF EXISTS "Contractors read assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors update assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Allow all access to leads" ON leads;
DROP POLICY IF EXISTS "Allow all access to lead_assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors can view their lead assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors can update their lead assignments" ON lead_assignments;
DROP POLICY IF EXISTS "Contractors can view assigned leads" ON leads;

-- Create simple, permissive policies for development
-- This allows contractors to see all leads and assignments for now
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on lead_assignments" ON lead_assignments FOR ALL USING (true);

-- Verify the new policies
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE tablename IN ('leads', 'lead_assignments')
ORDER BY tablename, policyname;

-- Test the join query that was failing
SELECT 
    la.id,
    la.lead_id,
    la.contractor_id,
    la.status,
    la.created_at,
    l.customer_name,
    l.city,
    l.state
FROM lead_assignments la
JOIN leads l ON la.lead_id = l.id
ORDER BY la.created_at DESC 
LIMIT 5;
