-- Fix Phoenix service areas for contractors
-- This ensures contractors can receive Phoenix leads

-- First, let's see what contractors we have
SELECT id, business_name, business_city, business_state, status, credits 
FROM contractors 
WHERE status = 'approved';

-- Add Phoenix service areas for contractors who don't have them
-- This will ensure they can receive Phoenix leads

-- Get contractors who are approved but don't have Phoenix in their service areas
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius)
SELECT 
    c.id,
    'Phoenix',
    'AZ',
    '85001',
    50
FROM contractors c
WHERE c.status = 'approved'
  AND c.id NOT IN (
    SELECT contractor_id 
    FROM contractor_service_areas 
    WHERE LOWER(city) = 'phoenix' 
      AND state = 'AZ'
  );

-- Also add Phoenix service areas for contractors based in Phoenix metro area
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius)
SELECT 
    c.id,
    'Phoenix',
    'AZ',
    '85001',
    50
FROM contractors c
WHERE c.status = 'approved'
  AND LOWER(c.business_city) IN ('phoenix', 'mesa', 'chandler', 'scottsdale', 'tempe', 'glendale', 'gilbert')
  AND c.id NOT IN (
    SELECT contractor_id 
    FROM contractor_service_areas 
    WHERE LOWER(city) = 'phoenix' 
      AND state = 'AZ'
  );

-- Verify the results
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
