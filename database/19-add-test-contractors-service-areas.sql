-- Add Test Contractors and Service Areas for Lead Assignment Testing
-- This ensures lead assignment functionality works properly
-- Run this in your Supabase SQL Editor

-- ========================================
-- ADD TEST CONTRACTORS
-- ========================================

-- Insert test contractors if they don't exist
INSERT INTO contractors (
    id,
    business_name,
    license_number,
    status,
    credits,
    business_address,
    business_city,
    business_state,
    business_zip,
    average_rating,
    total_reviews,
    total_completed_projects,
    license_verified,
    insurance_verified,
    background_check_verified,
    founded_year,
    employee_count
) VALUES 
-- Phoenix contractors
(
    '11111111-1111-1111-1111-111111111111',
    'Phoenix Elite Insulation',
    'ROC-123456',
    'approved',
    50,
    '1234 Main Street',
    'Phoenix',
    'Arizona',
    '85001',
    4.8,
    125,
    300,
    true,
    true,
    true,
    2015,
    12
),
(
    '22222222-2222-2222-2222-222222222222',
    'Arizona Insulation Pro',
    'ROC-234567',
    'approved',
    75,
    '5678 Desert Ave',
    'Phoenix',
    'Arizona',
    '85002',
    4.6,
    89,
    180,
    true,
    true,
    true,
    2018,
    8
),
(
    '33333333-3333-3333-3333-333333333333',
    'Valley Insulation Experts',
    'ROC-345678',
    'approved',
    30,
    '9012 Valley Blvd',
    'Phoenix',
    'Arizona',
    '85003',
    4.7,
    156,
    420,
    true,
    true,
    true,
    2012,
    15
)
ON CONFLICT (id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    status = EXCLUDED.status,
    business_city = EXCLUDED.business_city,
    business_state = EXCLUDED.business_state;

-- ========================================
-- ADD SERVICE AREAS FOR TEST CONTRACTORS
-- ========================================

-- Phoenix Elite Insulation service areas
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('11111111-1111-1111-1111-111111111111', 'Phoenix', 'Arizona', '85001', 25),
('11111111-1111-1111-1111-111111111111', 'Scottsdale', 'Arizona', '85251', 20),
('11111111-1111-1111-1111-111111111111', 'Tempe', 'Arizona', '85281', 15)
ON CONFLICT DO NOTHING;

-- Arizona Insulation Pro service areas  
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('22222222-2222-2222-2222-222222222222', 'Phoenix', 'Arizona', '85002', 30),
('22222222-2222-2222-2222-222222222222', 'Mesa', 'Arizona', '85201', 25),
('22222222-2222-2222-2222-222222222222', 'Chandler', 'Arizona', '85225', 20)
ON CONFLICT DO NOTHING;

-- Valley Insulation Experts service areas
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333333', 'Phoenix', 'Arizona', '85003', 35),
('33333333-3333-3333-3333-333333333333', 'Glendale', 'Arizona', '85301', 25),
('33333333-3333-3333-3333-333333333333', 'Peoria', 'Arizona', '85345', 30)
ON CONFLICT DO NOTHING;

-- ========================================
-- ADD CONTRACTOR SERVICES
-- ========================================

-- Phoenix Elite Insulation services
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('11111111-1111-1111-1111-111111111111', 'attic', ARRAY['blown_in', 'roll_batt', 'spray_foam'], 500, 5000, 1.50),
('11111111-1111-1111-1111-111111111111', 'walls', ARRAY['spray_foam', 'foam_board'], 200, 3000, 2.00),
('11111111-1111-1111-1111-111111111111', 'basement', ARRAY['roll_batt', 'foam_board'], 300, 2000, 1.75)
ON CONFLICT DO NOTHING;

-- Arizona Insulation Pro services
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('22222222-2222-2222-2222-222222222222', 'attic', ARRAY['blown_in', 'spray_foam'], 400, 4000, 1.40),
('22222222-2222-2222-2222-222222222222', 'walls', ARRAY['spray_foam', 'roll_batt'], 250, 2500, 1.90),
('22222222-2222-2222-2222-222222222222', 'crawl_space', ARRAY['spray_foam', 'foam_board'], 200, 1500, 2.25)
ON CONFLICT DO NOTHING;

-- Valley Insulation Experts services
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333333', 'attic', ARRAY['blown_in', 'roll_batt'], 600, 6000, 1.35),
('33333333-3333-3333-3333-333333333333', 'walls', ARRAY['spray_foam', 'foam_board'], 300, 3500, 1.85),
('33333333-3333-3333-3333-333333333333', 'basement', ARRAY['roll_batt', 'foam_board'], 400, 2500, 1.70),
('33333333-3333-3333-3333-333333333333', 'crawl_space', ARRAY['spray_foam'], 150, 1200, 2.40)
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICATION
-- ========================================

-- Verify contractors were added
SELECT 'Test Contractors Added:' as info;
SELECT 
    id,
    business_name,
    business_city,
    business_state,
    status,
    total_reviews
FROM contractors 
WHERE business_city = 'Phoenix'
ORDER BY business_name;

-- Verify service areas were added
SELECT 'Service Areas Added:' as info;
SELECT 
    csa.city,
    csa.state,
    c.business_name,
    csa.service_radius
FROM contractor_service_areas csa
JOIN contractors c ON csa.contractor_id = c.id
WHERE csa.city = 'Phoenix'
ORDER BY c.business_name;

-- Verify services were added
SELECT 'Contractor Services Added:' as info;
SELECT 
    c.business_name,
    cs.service_type,
    cs.insulation_types,
    cs.starting_price_per_sqft
FROM contractor_services cs
JOIN contractors c ON cs.contractor_id = c.id
WHERE c.business_city = 'Phoenix'
ORDER BY c.business_name, cs.service_type;

SELECT '✅ Test contractors and service areas successfully added!' as status,
       'You can now test lead assignment functionality' as next_step;
