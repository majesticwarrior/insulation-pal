-- Sample Data for InsulationPal Testing
-- Run this AFTER all other database setup files

-- ========================================
-- SAMPLE USERS
-- ========================================

-- Admin user
INSERT INTO users (id, email, name, user_type, email_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@insulationpal.com', 'Admin User', 'admin', true);

-- Sample customers
INSERT INTO users (id, email, name, phone, user_type, email_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'sarah.johnson@email.com', 'Sarah Johnson', '(555) 123-4567', 'customer', true),
('11111111-1111-1111-1111-111111111112', 'mike.chen@email.com', 'Mike Chen', '(555) 234-5678', 'customer', true),
('11111111-1111-1111-1111-111111111113', 'emily.rodriguez@email.com', 'Emily Rodriguez', '(555) 345-6789', 'customer', true);

-- Sample contractor users
INSERT INTO users (id, email, name, phone, user_type, email_verified) VALUES
('22222222-2222-2222-2222-222222222221', 'info@eliteinsulation.com', 'Michael Rodriguez', '(602) 555-0123', 'contractor', true),
('22222222-2222-2222-2222-222222222222', 'contact@azinsulationpros.com', 'Jennifer Martinez', '(602) 555-0124', 'contractor', true),
('22222222-2222-2222-2222-222222222223', 'hello@desertinsulation.com', 'David Thompson', '(602) 555-0125', 'contractor', true),
('22222222-2222-2222-2222-222222222224', 'info@valleyinsulation.com', 'Lisa Park', '(602) 555-0126', 'contractor', true),
('22222222-2222-2222-2222-222222222225', 'contact@phoenixinsulation.com', 'Robert Wilson', '(602) 555-0127', 'contractor', true);

-- ========================================
-- SAMPLE CONTRACTORS
-- ========================================

INSERT INTO contractors (
    id, user_id, business_name, license_number, insurance_verified, status, credits,
    bio, business_address, business_city, business_state, business_zip,
    average_rating, total_reviews, total_completed_projects,
    background_check_verified, license_verified, references_verified,
    founded_year, employee_count
) VALUES
(
    '33333333-3333-3333-3333-333333333331',
    '22222222-2222-2222-2222-222222222221',
    'Elite Insulation Services',
    'ROC-298847',
    true,
    'approved',
    25,
    'Elite Insulation Services has been serving the Phoenix metro area for over 8 years, providing top-quality insulation solutions for residential and commercial properties.',
    '2847 Desert Ridge Pkwy',
    'Phoenix',
    'AZ',
    '85054',
    4.9,
    127,
    450,
    true,
    true,
    true,
    2016,
    12
),
(
    '33333333-3333-3333-3333-333333333332',
    '22222222-2222-2222-2222-222222222222',
    'Arizona Insulation Pros',
    'ROC-301245',
    true,
    'approved',
    18,
    'Family-owned business specializing in energy-efficient insulation solutions with over 15 years of experience.',
    '1234 Main Street',
    'Scottsdale',
    'AZ',
    '85251',
    4.8,
    89,
    320,
    true,
    true,
    true,
    2009,
    8
),
(
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222223',
    'Desert Insulation Solutions',
    'ROC-287456',
    true,
    'approved',
    12,
    'Eco-friendly insulation contractor focusing on sustainable materials and energy efficiency improvements.',
    '5678 Oak Avenue',
    'Tempe',
    'AZ',
    '85281',
    4.7,
    65,
    180,
    true,
    true,
    true,
    2018,
    5
),
(
    '33333333-3333-3333-3333-333333333334',
    '22222222-2222-2222-2222-222222222224',
    'Valley Insulation Company',
    'ROC-345678',
    true,
    'approved',
    30,
    'Premier insulation contractor serving the entire Phoenix Valley with residential and commercial services.',
    '9876 Industrial Blvd',
    'Mesa',
    'AZ',
    '85201',
    4.6,
    142,
    600,
    true,
    true,
    true,
    2012,
    20
),
(
    '33333333-3333-3333-3333-333333333335',
    '22222222-2222-2222-2222-222222222225',
    'Phoenix Insulation Experts',
    'ROC-456789',
    true,
    'approved',
    8,
    'Specialized in spray foam and blown-in insulation with cutting-edge technology and materials.',
    '2468 Technology Drive',
    'Chandler',
    'AZ',
    '85225',
    4.5,
    78,
    250,
    true,
    true,
    true,
    2020,
    6
);

-- ========================================
-- CONTRACTOR SERVICE AREAS
-- ========================================

-- Elite Insulation Services
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333331', 'Phoenix', 'AZ', '85054', 30),
('33333333-3333-3333-3333-333333333331', 'Scottsdale', 'AZ', '85251', 25),
('33333333-3333-3333-3333-333333333331', 'Tempe', 'AZ', '85281', 20),
('33333333-3333-3333-3333-333333333331', 'Mesa', 'AZ', '85201', 25),
('33333333-3333-3333-3333-333333333331', 'Chandler', 'AZ', '85225', 30);

-- Arizona Insulation Pros
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333332', 'Scottsdale', 'AZ', '85251', 25),
('33333333-3333-3333-3333-333333333332', 'Phoenix', 'AZ', '85054', 30),
('33333333-3333-3333-3333-333333333332', 'Paradise Valley', 'AZ', '85253', 15);

-- Desert Insulation Solutions
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333333', 'Tempe', 'AZ', '85281', 25),
('33333333-3333-3333-3333-333333333333', 'Mesa', 'AZ', '85201', 20),
('33333333-3333-3333-3333-333333333333', 'Gilbert', 'AZ', '85234', 25);

-- Valley Insulation Company
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333334', 'Mesa', 'AZ', '85201', 35),
('33333333-3333-3333-3333-333333333334', 'Gilbert', 'AZ', '85234', 30),
('33333333-3333-3333-3333-333333333334', 'Queen Creek', 'AZ', '85142', 25),
('33333333-3333-3333-3333-333333333334', 'Apache Junction', 'AZ', '85120', 30);

-- Phoenix Insulation Experts
INSERT INTO contractor_service_areas (contractor_id, city, state, zip_code, service_radius) VALUES
('33333333-3333-3333-3333-333333333335', 'Chandler', 'AZ', '85225', 25),
('33333333-3333-3333-3333-333333333335', 'Gilbert', 'AZ', '85234', 20),
('33333333-3333-3333-3333-333333333335', 'Ahwatukee', 'AZ', '85048', 25);

-- ========================================
-- CONTRACTOR SERVICES
-- ========================================

-- Elite Insulation Services
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333331', 'attic', ARRAY['fiberglass', 'cellulose', 'spray_foam'], 500, 5000, 1.50),
('33333333-3333-3333-3333-333333333331', 'wall', ARRAY['fiberglass', 'spray_foam'], 200, 3000, 2.00),
('33333333-3333-3333-3333-333333333331', 'basement', ARRAY['fiberglass', 'rigid_foam'], 300, 2000, 1.75),
('33333333-3333-3333-3333-333333333331', 'crawl_space', ARRAY['fiberglass', 'spray_foam'], 100, 1500, 2.25);

-- Arizona Insulation Pros
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333332', 'attic', ARRAY['fiberglass', 'cellulose'], 400, 4000, 1.40),
('33333333-3333-3333-3333-333333333332', 'wall', ARRAY['fiberglass'], 200, 2500, 1.90);

-- Desert Insulation Solutions (eco-friendly focus)
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333333', 'attic', ARRAY['cellulose', 'recycled_denim'], 300, 3000, 1.60),
('33333333-3333-3333-3333-333333333333', 'wall', ARRAY['cellulose', 'wool'], 200, 2000, 2.10);

-- Valley Insulation Company
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333334', 'attic', ARRAY['fiberglass', 'cellulose', 'spray_foam'], 500, 8000, 1.35),
('33333333-3333-3333-3333-333333333334', 'wall', ARRAY['fiberglass', 'spray_foam'], 300, 5000, 1.85),
('33333333-3333-3333-3333-333333333334', 'basement', ARRAY['fiberglass', 'rigid_foam'], 200, 3000, 1.70),
('33333333-3333-3333-3333-333333333334', 'commercial', ARRAY['fiberglass', 'mineral_wool'], 1000, 20000, 1.25);

-- Phoenix Insulation Experts (spray foam specialists)
INSERT INTO contractor_services (contractor_id, service_type, insulation_types, min_project_size, max_project_size, starting_price_per_sqft) VALUES
('33333333-3333-3333-3333-333333333335', 'attic', ARRAY['spray_foam'], 400, 4000, 2.50),
('33333333-3333-3333-3333-333333333335', 'wall', ARRAY['spray_foam'], 200, 3000, 3.00),
('33333333-3333-3333-3333-333333333335', 'crawl_space', ARRAY['spray_foam'], 100, 1500, 3.25);

-- ========================================
-- SAMPLE REVIEWS
-- ========================================

INSERT INTO reviews (
    contractor_id, customer_id, rating, title, comment, service_type, 
    project_cost, project_duration_days, location, verified,
    quality_rating, timeliness_rating, communication_rating, value_rating
) VALUES
-- Elite Insulation Services Reviews
(
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    5,
    'Outstanding Work!',
    'Michael and his team were professional, on time, and cleaned up thoroughly. Our energy bills have already dropped significantly.',
    'Attic Insulation',
    2400.00,
    1,
    'Scottsdale, AZ',
    true,
    5, 5, 5, 4
),
(
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111112',
    5,
    'Excellent Service',
    'Very knowledgeable about different insulation options and helped us choose the best solution for our home.',
    'Spray Foam Insulation',
    3200.00,
    2,
    'Tempe, AZ',
    true,
    5, 4, 5, 5
),

-- Arizona Insulation Pros Reviews
(
    '33333333-3333-3333-3333-333333333332',
    '11111111-1111-1111-1111-111111111113',
    4,
    'Great Experience',
    'Jennifer and her team did excellent work. Very professional and the price was competitive.',
    'Wall Insulation',
    1800.00,
    1,
    'Phoenix, AZ',
    true,
    4, 4, 5, 4
),

-- Desert Insulation Solutions Reviews
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    5,
    'Eco-Friendly and Effective',
    'Love that they use sustainable materials. The cellulose insulation works great and feels good about the environmental impact.',
    'Attic Insulation',
    2100.00,
    1,
    'Gilbert, AZ',
    true,
    5, 5, 4, 5
);

-- ========================================
-- SAMPLE LEADS (for testing)
-- ========================================

INSERT INTO leads (
    id, customer_id, customer_name, customer_email, customer_phone,
    home_size_sqft, areas_needed, insulation_types, project_timeline, budget_range,
    city, state, zip_code, property_address, quote_preference, status
) VALUES
(
    '44444444-4444-4444-4444-444444444441',
    '11111111-1111-1111-1111-111111111111',
    'Sarah Johnson',
    'sarah.johnson@email.com',
    '(555) 123-4567',
    2500,
    ARRAY['attic', 'walls'],
    ARRAY['fiberglass', 'cellulose'],
    '1-3months',
    '3000-5000',
    'Phoenix',
    'AZ',
    '85054',
    '123 Main Street, Phoenix, AZ 85054',
    'random_three',
    'active'
),
(
    '44444444-4444-4444-4444-444444444442',
    NULL,
    'John Smith',
    'john.smith@email.com',
    '(555) 987-6543',
    1800,
    ARRAY['attic'],
    ARRAY['spray_foam'],
    'asap',
    '2000-4000',
    'Scottsdale',
    'AZ',
    '85251',
    NULL,
    'choose_three',
    'active'
);

-- ========================================
-- SYSTEM SETTINGS (additional)
-- ========================================

INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public) VALUES
('site_name', 'InsulationPal', 'Site name for branding', 'string', true),
('contact_email', 'support@insulationpal.com', 'Main contact email', 'string', true),
('contact_phone', '(888) 357-9555', 'Main contact phone', 'string', true),
('business_hours', '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-18:00", "saturday": "9:00-17:00", "sunday": "closed"}', 'Business hours by day', 'json', true),
('service_areas', '["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", "Gilbert", "Glendale", "Peoria", "Surprise", "Avondale"]', 'Main service areas', 'json', true);

-- Update totals based on sample data
UPDATE contractors SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE contractor_id = contractors.id AND verified = true),
    average_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE contractor_id = contractors.id AND verified = true)
WHERE id IN (
    '33333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333332', 
    '33333333-3333-3333-3333-333333333333'
);
