-- Add credits to contractors so they can receive leads
-- This ensures contractors have credits to purchase leads

-- Add 10 credits to all approved contractors
UPDATE contractors 
SET credits = credits + 10
WHERE status = 'approved';

-- Verify the results
SELECT 
    id,
    business_name,
    credits,
    status
FROM contractors 
WHERE status = 'approved'
ORDER BY business_name;
