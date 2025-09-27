-- Test script to verify lead assignment is working
-- Run this in Supabase SQL Editor

-- 1. Check if we have any leads
SELECT 
    id,
    customer_name,
    city,
    state,
    status,
    created_at
FROM leads 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Check if we have any lead assignments
SELECT 
    la.id,
    la.lead_id,
    la.contractor_id,
    la.status,
    la.created_at,
    c.business_name
FROM lead_assignments la
LEFT JOIN contractors c ON la.contractor_id = c.id
ORDER BY la.created_at DESC 
LIMIT 10;

-- 3. Test the exact join query that the contractor dashboard uses
SELECT 
    la.id,
    la.lead_id,
    la.status,
    la.cost,
    la.created_at,
    la.responded_at,
    l.customer_name,
    l.customer_email,
    l.customer_phone,
    l.home_size_sqft,
    l.areas_needed,
    l.insulation_types,
    l.city,
    l.state,
    l.zip_code
FROM lead_assignments la
JOIN leads l ON la.lead_id = l.id
WHERE la.contractor_id = '33333333-3333-3333-3333-333333333331' -- Replace with actual contractor ID
ORDER BY la.created_at DESC;

-- 4. Check contractor service areas for Phoenix
SELECT 
    csa.contractor_id,
    c.business_name,
    csa.city,
    csa.state,
    c.status,
    c.credits
FROM contractor_service_areas csa
JOIN contractors c ON csa.contractor_id = c.id
WHERE LOWER(csa.city) = 'phoenix' 
  AND csa.state = 'AZ'
ORDER BY c.business_name;

-- 5. Check if contractors have credits
SELECT 
    id,
    business_name,
    credits,
    status
FROM contractors 
WHERE status = 'approved'
ORDER BY business_name;
