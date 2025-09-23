-- Row Level Security Policies for InsulationPal
-- Run this AFTER the main schema

-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow user registration
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- CONTRACTORS TABLE POLICIES
-- ========================================

-- Public read access for approved contractors (for directory)
CREATE POLICY "Public read approved contractors" ON contractors
    FOR SELECT USING (status = 'approved');

-- Contractors can read/update their own data
CREATE POLICY "Contractors can manage own data" ON contractors
    FOR ALL USING (user_id = auth.uid());

-- Allow contractor registration
CREATE POLICY "Allow contractor registration" ON contractors
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ========================================
-- CONTRACTOR SERVICE AREAS POLICIES
-- ========================================

-- Public read for approved contractors
CREATE POLICY "Public read service areas" ON contractor_service_areas
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE status = 'approved'
        )
    );

-- Contractors can manage their service areas
CREATE POLICY "Contractors manage service areas" ON contractor_service_areas
    FOR ALL USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- CONTRACTOR SERVICES POLICIES
-- ========================================

-- Public read for approved contractors
CREATE POLICY "Public read contractor services" ON contractor_services
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE status = 'approved'
        )
    );

-- Contractors can manage their services
CREATE POLICY "Contractors manage services" ON contractor_services
    FOR ALL USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- LEADS TABLE POLICIES
-- ========================================

-- Customers can read their own leads
CREATE POLICY "Customers read own leads" ON leads
    FOR SELECT USING (customer_id = auth.uid());

-- Customers can create leads
CREATE POLICY "Customers create leads" ON leads
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

-- Customers can update their own leads
CREATE POLICY "Customers update own leads" ON leads
    FOR UPDATE USING (customer_id = auth.uid());

-- Contractors can read leads assigned to them
CREATE POLICY "Contractors read assigned leads" ON leads
    FOR SELECT USING (
        id IN (
            SELECT lead_id FROM lead_assignments 
            WHERE contractor_id IN (
                SELECT id FROM contractors WHERE user_id = auth.uid()
            )
        )
    );

-- ========================================
-- LEAD ASSIGNMENTS POLICIES
-- ========================================

-- Contractors can read their assignments
CREATE POLICY "Contractors read assignments" ON lead_assignments
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- Contractors can update their assignments (respond to leads)
CREATE POLICY "Contractors update assignments" ON lead_assignments
    FOR UPDATE USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- Customers can read assignments for their leads
CREATE POLICY "Customers read lead assignments" ON lead_assignments
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE customer_id = auth.uid()
        )
    );

-- System can create assignments (via service role)
CREATE POLICY "System create assignments" ON lead_assignments
    FOR INSERT WITH CHECK (true);

-- ========================================
-- REVIEWS TABLE POLICIES
-- ========================================

-- Public read for verified reviews
CREATE POLICY "Public read verified reviews" ON reviews
    FOR SELECT USING (verified = true);

-- All reviews readable (including unverified for moderation)
CREATE POLICY "Read all reviews" ON reviews
    FOR SELECT USING (true);

-- Customers can create reviews for their projects
CREATE POLICY "Customers create reviews" ON reviews
    FOR INSERT WITH CHECK (
        customer_id = auth.uid() OR 
        lead_assignment_id IN (
            SELECT la.id FROM lead_assignments la
            JOIN leads l ON la.lead_id = l.id
            WHERE l.customer_id = auth.uid()
        )
    );

-- Customers can update their own reviews
CREATE POLICY "Customers update own reviews" ON reviews
    FOR UPDATE USING (customer_id = auth.uid());

-- ========================================
-- CONTRACTOR PORTFOLIO POLICIES
-- ========================================

-- Public read access
CREATE POLICY "Public read portfolio" ON contractor_portfolio
    FOR SELECT USING (true);

-- Contractors can manage their portfolio
CREATE POLICY "Contractors manage portfolio" ON contractor_portfolio
    FOR ALL USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- CREDIT TRANSACTIONS POLICIES
-- ========================================

-- Contractors can read their own transactions
CREATE POLICY "Contractors read transactions" ON credit_transactions
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors WHERE user_id = auth.uid()
        )
    );

-- System can create transactions (via service role)
CREATE POLICY "System create transactions" ON credit_transactions
    FOR INSERT WITH CHECK (true);

-- ========================================
-- NOTIFICATIONS POLICIES
-- ========================================

-- Users can read their own notifications
CREATE POLICY "Users read notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- System can create notifications (via service role)
CREATE POLICY "System create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- ========================================
-- SYSTEM SETTINGS POLICIES
-- ========================================

-- Public settings are readable by everyone
CREATE POLICY "Public read system settings" ON system_settings
    FOR SELECT USING (is_public = true);

-- Admin-only access for private settings
CREATE POLICY "Admin manage system settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to check if user is a contractor
CREATE OR REPLACE FUNCTION is_contractor(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM contractors 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_uuid AND user_type = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get contractor ID for a user
CREATE OR REPLACE FUNCTION get_contractor_id(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    contractor_uuid UUID;
BEGIN
    SELECT id INTO contractor_uuid 
    FROM contractors 
    WHERE user_id = user_uuid;
    
    RETURN contractor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
