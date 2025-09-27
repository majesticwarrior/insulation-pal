-- Debug script for new lead assignment issues
-- Run this in Supabase SQL Editor

-- 1. Check recent leads (last 24 hours)
SELECT 
    id,
    customer_name,
    city,
    state,
    status,
    created_at
FROM leads 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 2. Check recent lead assignments (last 24 hours)
SELECT 
    la.id as assignment_id,
    la.lead_id,
    la.contractor_id,
    la.status as assignment_status,
    la.cost,
    la.created_at as assignment_created_at,
    c.business_name as contractor_name,
    l.customer_name as lead_customer_name,
    l.city as lead_city,
    l.state as lead_state
FROM lead_assignments la
LEFT JOIN contractors c ON la.contractor_id = c.id
LEFT JOIN leads l ON la.lead_id = l.id
WHERE la.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY la.created_at DESC;

-- 3. Check contractors in Phoenix with credits
SELECT 
    c.id, 
    c.business_name, 
    c.status, 
    c.credits, 
    c.business_city,
    c.business_state,
    csa.city as service_area_city,
    csa.state as service_area_state
FROM contractors c
LEFT JOIN contractor_service_areas csa ON c.id = csa.contractor_id
WHERE c.status = 'approved'
  AND (LOWER(c.business_city) = 'phoenix' OR LOWER(csa.city) = 'phoenix')
ORDER BY c.business_name;

-- 4. Check if there are any leads without assignments
SELECT 
    l.id,
    l.customer_name,
    l.city,
    l.state,
    l.created_at,
    COUNT(la.id) as assignment_count
FROM leads l
LEFT JOIN lead_assignments la ON l.id = la.lead_id
WHERE l.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY l.id, l.customer_name, l.city, l.state, l.created_at
HAVING COUNT(la.id) = 0
ORDER BY l.created_at DESC;

-- 5. Check RLS policies on leads and lead_assignments
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies
WHERE tablename IN ('leads', 'lead_assignments')
ORDER BY tablename, policyname;
