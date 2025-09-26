-- Diagnose Lead Assignment Issues
-- This script helps identify why contractors can't see assigned leads
-- Run this in your Supabase SQL Editor

-- ========================================
-- STEP 1: CHECK CONTRACTORS IN PHOENIX
-- ========================================

SELECT 'Phoenix Contractors:' as info;
SELECT 
    id,
    business_name,
    business_city,
    business_state,
    status,
    created_at
FROM contractors 
WHERE business_city = 'Phoenix' 
   OR id IN (
       SELECT contractor_id 
       FROM contractor_service_areas 
       WHERE city = 'Phoenix'
   )
ORDER BY business_name;

-- ========================================
-- STEP 2: CHECK SERVICE AREAS
-- ========================================

SELECT 'Service Areas for Phoenix:' as info;
SELECT 
    csa.city,
    csa.state,
    c.business_name,
    c.status as contractor_status
FROM contractor_service_areas csa
JOIN contractors c ON csa.contractor_id = c.id
WHERE csa.city = 'Phoenix'
ORDER BY c.business_name;

-- ========================================
-- STEP 3: CHECK RECENT LEADS
-- ========================================

SELECT 'Recent Leads:' as info;
SELECT 
    id,
    customer_name,
    city,
    state,
    home_size_sqft,
    areas_needed,
    insulation_types,
    quote_preference,
    created_at
FROM leads 
ORDER BY created_at DESC 
LIMIT 10;

-- ========================================
-- STEP 4: CHECK LEAD ASSIGNMENTS
-- ========================================

SELECT 'Lead Assignments:' as info;
SELECT 
    la.id as assignment_id,
    la.lead_id,
    la.contractor_id,
    la.status as assignment_status,
    la.cost,
    la.created_at as assigned_at,
    l.customer_name,
    l.city as lead_city,
    c.business_name as contractor_name
FROM lead_assignments la
JOIN leads l ON la.lead_id = l.id
LEFT JOIN contractors c ON la.contractor_id = c.id
ORDER BY la.created_at DESC
LIMIT 10;

-- ========================================
-- STEP 5: CHECK FOR PHOENIX ASSIGNMENTS
-- ========================================

SELECT 'Phoenix Lead Assignments:' as info;
SELECT 
    la.id as assignment_id,
    la.lead_id,
    la.contractor_id,
    la.status as assignment_status,
    la.cost,
    la.created_at as assigned_at,
    l.customer_name,
    l.city as lead_city,
    c.business_name as contractor_name
FROM lead_assignments la
JOIN leads l ON la.lead_id = l.id
LEFT JOIN contractors c ON la.contractor_id = c.id
WHERE l.city = 'Phoenix'
ORDER BY la.created_at DESC;

-- ========================================
-- STEP 6: CHECK RLS POLICIES
-- ========================================

SELECT 'RLS Policies for lead_assignments:' as info;
SELECT 
    policyname,
    cmd as operation,
    permissive,
    roles,
    qual as condition
FROM pg_policies 
WHERE tablename = 'lead_assignments'
ORDER BY policyname;

-- ========================================
-- STEP 7: TEST DIRECT QUERY (SIMULATE CONTRACTOR VIEW)
-- ========================================

-- Get a Phoenix contractor ID for testing
WITH phoenix_contractor AS (
    SELECT id as contractor_id 
    FROM contractors 
    WHERE business_city = 'Phoenix' 
    LIMIT 1
)
SELECT 'Test Query for Phoenix Contractor:' as info;
SELECT 
    la.id as assignment_id,
    la.lead_id,
    la.contractor_id,
    la.status,
    la.cost,
    l.customer_name,
    l.city
FROM lead_assignments la
JOIN leads l ON la.lead_id = l.id
CROSS JOIN phoenix_contractor pc
WHERE la.contractor_id = pc.contractor_id
ORDER BY la.created_at DESC;

-- ========================================
-- SUMMARY
-- ========================================

SELECT 'DIAGNOSIS SUMMARY:' as info;
SELECT 
    (SELECT COUNT(*) FROM contractors WHERE business_city = 'Phoenix') as phoenix_contractors,
    (SELECT COUNT(*) FROM contractor_service_areas WHERE city = 'Phoenix') as phoenix_service_areas,
    (SELECT COUNT(*) FROM leads WHERE city = 'Phoenix') as phoenix_leads,
    (SELECT COUNT(*) FROM lead_assignments la JOIN leads l ON la.lead_id = l.id WHERE l.city = 'Phoenix') as phoenix_assignments;

SELECT '✅ Diagnosis complete! Check the results above to identify the issue.' as status;
