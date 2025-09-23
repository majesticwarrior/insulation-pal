-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contractors table
CREATE TABLE contractors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    established_date DATE,
    county VARCHAR(100) NOT NULL,
    license_number VARCHAR(100),
    bbb_accredited BOOLEAN DEFAULT FALSE,
    about TEXT,
    phone VARCHAR(20),
    exclusive_leads_interested BOOLEAN DEFAULT FALSE,
    lead_preference VARCHAR(10) CHECK (lead_preference IN ('email', 'text', 'both')) DEFAULT 'email',
    credits INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'suspended')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractor services (areas they service)
CREATE TABLE contractor_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    service_type VARCHAR(20) CHECK (service_type IN ('attic', 'basement', 'wall', 'crawl_space', 'garage')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractor insulation types they offer
CREATE TABLE contractor_insulation_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    insulation_type VARCHAR(20) CHECK (insulation_type IN ('blown_in', 'spray_foam', 'roll_batt', 'foam_board', 'radiant_barrier')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractor service areas (cities they serve)
CREATE TABLE contractor_service_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractor project images
CREATE TABLE contractor_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    watermarked_url VARCHAR(500),
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer leads
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_size_sqft INTEGER NOT NULL,
    areas_needed JSONB NOT NULL, -- Array of area types
    insulation_types JSONB NOT NULL, -- Array of insulation types
    quote_preference VARCHAR(20) CHECK (quote_preference IN ('random_three', 'choose_three')) NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    status VARCHAR(20) CHECK (status IN ('pending', 'assigned', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead assignments to contractors
CREATE TABLE lead_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    cost DECIMAL(10,2) DEFAULT 20.00,
    status VARCHAR(20) CHECK (status IN ('sent', 'viewed', 'responded', 'hired')) DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer reviews for contractors
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment records for lead credits
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    credits_purchased INTEGER NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('stripe', 'paypal', 'venmo', 'square')) NOT NULL,
    payment_intent_id VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_county ON contractors(county);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractor_services_contractor_id ON contractor_services(contractor_id);
CREATE INDEX idx_contractor_insulation_types_contractor_id ON contractor_insulation_types(contractor_id);
CREATE INDEX idx_contractor_service_areas_contractor_id ON contractor_service_areas(contractor_id);
CREATE INDEX idx_contractor_service_areas_city ON contractor_service_areas(city);
CREATE INDEX idx_leads_city_state ON leads(city, state);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_lead_assignments_lead_id ON lead_assignments(lead_id);
CREATE INDEX idx_lead_assignments_contractor_id ON lead_assignments(contractor_id);
CREATE INDEX idx_reviews_contractor_id ON reviews(contractor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_assignments_updated_at BEFORE UPDATE ON lead_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_insulation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (contractors can only see their own data)
CREATE POLICY "Contractors can view own profile" ON contractors FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Contractors can update own profile" ON contractors FOR UPDATE USING (auth.uid()::text = id::text);

-- Public read access for approved contractors (for profile pages)
CREATE POLICY "Public can view approved contractors" ON contractors FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can view contractor services" ON contractor_services FOR SELECT USING (TRUE);
CREATE POLICY "Public can view contractor insulation types" ON contractor_insulation_types FOR SELECT USING (TRUE);
CREATE POLICY "Public can view contractor service areas" ON contractor_service_areas FOR SELECT USING (TRUE);
CREATE POLICY "Public can view contractor images" ON contractor_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (TRUE);

-- Contractors can manage their own related data
CREATE POLICY "Contractors can manage own services" ON contractor_services FOR ALL USING (contractor_id::text = auth.uid()::text);
CREATE POLICY "Contractors can manage own insulation types" ON contractor_insulation_types FOR ALL USING (contractor_id::text = auth.uid()::text);
CREATE POLICY "Contractors can manage own service areas" ON contractor_service_areas FOR ALL USING (contractor_id::text = auth.uid()::text);
CREATE POLICY "Contractors can manage own images" ON contractor_images FOR ALL USING (contractor_id::text = auth.uid()::text);

-- Lead management policies
CREATE POLICY "Contractors can view assigned leads" ON lead_assignments FOR SELECT USING (contractor_id::text = auth.uid()::text);
CREATE POLICY "Contractors can update assigned leads" ON lead_assignments FOR UPDATE USING (contractor_id::text = auth.uid()::text);

-- Public can create leads and reviews
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (TRUE);

-- Insert sample data for Maricopa County cities (Arizona)
INSERT INTO contractor_service_areas (contractor_id, city) VALUES 
-- This will be populated when we create the test contractors
('00000000-0000-0000-0000-000000000000', 'Anthem'),
('00000000-0000-0000-0000-000000000000', 'Apache Junction'),
('00000000-0000-0000-0000-000000000000', 'Buckeye'),
('00000000-0000-0000-0000-000000000000', 'Chandler'),
('00000000-0000-0000-0000-000000000000', 'Gilbert'),
('00000000-0000-0000-0000-000000000000', 'Glendale'),
('00000000-0000-0000-0000-000000000000', 'Goodyear'),
('00000000-0000-0000-0000-000000000000', 'Litchfield Park'),
('00000000-0000-0000-0000-000000000000', 'Mesa'),
('00000000-0000-0000-0000-000000000000', 'Peoria'),
('00000000-0000-0000-0000-000000000000', 'Phoenix'),
('00000000-0000-0000-0000-000000000000', 'Queen Creek'),
('00000000-0000-0000-0000-000000000000', 'Scottsdale'),
('00000000-0000-0000-0000-000000000000', 'Sun City'),
('00000000-0000-0000-0000-000000000000', 'Surprise'),
('00000000-0000-0000-0000-000000000000', 'Tempe');

-- Remove the dummy entries (they're just for reference)
DELETE FROM contractor_service_areas WHERE contractor_id = '00000000-0000-0000-0000-000000000000';
