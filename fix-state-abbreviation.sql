-- Fix existing leads to use state abbreviation "AZ" instead of "Arizona"
-- This ensures leads will match service areas correctly

-- Update all leads with state "Arizona" to "AZ"
UPDATE leads 
SET state = 'AZ' 
WHERE state = 'Arizona';

-- Verify the update
SELECT 
  id,
  customer_name,
  city,
  state,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;

-- Check if any assignments now exist for these leads
SELECT 
  l.id as lead_id,
  l.customer_name,
  l.city,
  l.state,
  COUNT(la.id) as assignment_count
FROM leads l
LEFT JOIN lead_assignments la ON l.id = la.lead_id
GROUP BY l.id, l.customer_name, l.city, l.state
ORDER BY l.created_at DESC
LIMIT 20;

