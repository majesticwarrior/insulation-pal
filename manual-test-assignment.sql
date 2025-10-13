-- Manual test: Assign the most recent lead to contractors with credits

-- 1. Get the most recent unassigned lead
SELECT 
    l.id as lead_id,
    l.customer_name,
    l.city,
    l.state,
    COUNT(la.id) as current_assignments
FROM leads l
LEFT JOIN lead_assignments la ON l.id = la.lead_id
GROUP BY l.id, l.customer_name, l.city, l.state
HAVING COUNT(la.id) = 0
ORDER BY l.created_at DESC
LIMIT 1;

-- 2. Find contractors who serve that city and have credits
SELECT 
    c.id,
    c.business_name,
    c.credits,
    csa.city,
    csa.state
FROM contractors c
JOIN contractor_service_areas csa ON c.id = csa.contractor_id
WHERE c.status = 'approved'
    AND c.credits > 0
    AND csa.city = 'Phoenix'  -- Update this with the city from step 1
    AND csa.state = 'AZ'      -- Update this with the state from step 1
LIMIT 3;

-- 3. Manually insert assignment (replace the UUIDs with values from above)
-- IMPORTANT: Update these UUIDs before running!
/*
INSERT INTO lead_assignments (lead_id, contractor_id, status, cost)
VALUES 
    ('LEAD_ID_HERE', 'CONTRACTOR_ID_1_HERE', 'sent', 20.00),
    ('LEAD_ID_HERE', 'CONTRACTOR_ID_2_HERE', 'sent', 20.00),
    ('LEAD_ID_HERE', 'CONTRACTOR_ID_3_HERE', 'sent', 20.00);
*/

-- 4. Verify the assignments were created
SELECT 
    la.id,
    la.status,
    la.cost,
    c.business_name,
    l.customer_name,
    l.city
FROM lead_assignments la
JOIN contractors c ON la.contractor_id = c.id
JOIN leads l ON la.lead_id = l.id
ORDER BY la.created_at DESC
LIMIT 10;

