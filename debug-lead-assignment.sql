-- Debug script to check lead assignment issues
-- Run this in your Supabase SQL editor

-- 1. Check if contractors exist and their status
SELECT 
    id,
    business_name,
    business_city,
    business_state,
    status,
    credits
FROM contractors 
WHERE status = 'approved'
ORDER BY business_name;

-- 2. Check contractor service areas for Phoenix
SELECT 
    csa.contractor_id,
    c.business_name,
    csa.city,
    csa.state,
    c.status,
    c.credits
FROM contractor_service_areas csa
JOIN contractors c ON csa.contractor_id = c.id
WHERE LOWER(csa.city) LIKE '%phoenix%' 
   OR LOWER(csa.city) = 'phoenix'
   OR csa.city = 'Phoenix'
ORDER BY c.business_name;

-- 3. Check recent leads
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

-- 4. Check lead assignments
SELECT 
    la.id,
    la.lead_id,
    la.contractor_id,
    la.status,
    la.created_at,
    c.business_name,
    l.customer_name,
    l.city,
    l.state
FROM lead_assignments la
JOIN contractors c ON la.contractor_id = c.id
JOIN leads l ON la.lead_id = l.id
ORDER BY la.created_at DESC 
LIMIT 10;

-- 5. Check if contractors have credits
SELECT 
    id,
    business_name,
    credits,
    status
FROM contractors 
WHERE credits > 0 AND status = 'approved'
ORDER BY credits DESC;
