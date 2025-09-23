-- Database Functions and Triggers for InsulationPal
-- Run this AFTER the main schema and RLS policies

-- ========================================
-- UTILITY FUNCTIONS
-- ========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_assignments_updated_at BEFORE UPDATE ON lead_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractor_portfolio_updated_at BEFORE UPDATE ON contractor_portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- CONTRACTOR RATING CALCULATION
-- ========================================

-- Function to update contractor average rating
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
DECLARE
    contractor_uuid UUID;
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Get contractor ID from the review
    contractor_uuid := COALESCE(NEW.contractor_id, OLD.contractor_id);
    
    -- Calculate new average rating and count
    SELECT 
        ROUND(AVG(rating)::numeric, 2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE contractor_id = contractor_uuid AND verified = true;
    
    -- Update contractor record
    UPDATE contractors 
    SET 
        average_rating = COALESCE(avg_rating, 0),
        total_reviews = COALESCE(review_count, 0),
        updated_at = NOW()
    WHERE id = contractor_uuid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update contractor rating when reviews change
CREATE TRIGGER update_contractor_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_contractor_rating();

-- ========================================
-- LEAD ASSIGNMENT FUNCTIONS
-- ========================================

-- Function to assign lead to contractors
CREATE OR REPLACE FUNCTION assign_lead_to_contractors(
    lead_uuid UUID,
    max_contractors INTEGER DEFAULT 3
)
RETURNS TABLE(contractor_id UUID, business_name VARCHAR, email VARCHAR, phone VARCHAR) AS $$
DECLARE
    lead_record RECORD;
    contractor_record RECORD;
    assignment_cost DECIMAL(10,2) := 20.00;
BEGIN
    -- Get lead details
    SELECT * INTO lead_record FROM leads WHERE id = lead_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead not found';
    END IF;
    
    -- Find eligible contractors in the area
    FOR contractor_record IN
        SELECT DISTINCT c.id, c.business_name, c.credits, u.email, u.phone
        FROM contractors c
        JOIN users u ON c.user_id = u.id
        JOIN contractor_service_areas csa ON c.id = csa.contractor_id
        WHERE c.status = 'approved'
          AND c.credits >= 1
          AND LOWER(csa.city) = LOWER(lead_record.city)
          AND LOWER(csa.state) = LOWER(lead_record.state)
          AND c.id NOT IN (
              SELECT la.contractor_id 
              FROM lead_assignments la 
              WHERE la.lead_id = lead_uuid
          )
        ORDER BY RANDOM()
        LIMIT max_contractors
    LOOP
        -- Create lead assignment
        INSERT INTO lead_assignments (lead_id, contractor_id, cost)
        VALUES (lead_uuid, contractor_record.id, assignment_cost);
        
        -- Deduct credit from contractor
        UPDATE contractors 
        SET credits = credits - 1 
        WHERE id = contractor_record.id;
        
        -- Return contractor info for notifications
        RETURN QUERY SELECT 
            contractor_record.id,
            contractor_record.business_name,
            contractor_record.email,
            contractor_record.phone;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- CREDIT MANAGEMENT FUNCTIONS
-- ========================================

-- Function to add credits to contractor
CREATE OR REPLACE FUNCTION add_contractor_credits(
    contractor_uuid UUID,
    credits_amount INTEGER,
    transaction_type VARCHAR DEFAULT 'purchase',
    reference_info JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    transaction_uuid UUID;
BEGIN
    -- Update contractor credits
    UPDATE contractors 
    SET credits = credits + credits_amount
    WHERE id = contractor_uuid;
    
    -- Record transaction
    INSERT INTO credit_transactions (
        contractor_id,
        transaction_type,
        credits_amount,
        status,
        description,
        metadata
    ) VALUES (
        contractor_uuid,
        transaction_type,
        credits_amount,
        'completed',
        format('Added %s credits via %s', credits_amount, transaction_type),
        reference_info
    ) RETURNING id INTO transaction_uuid;
    
    RETURN transaction_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct credits from contractor
CREATE OR REPLACE FUNCTION deduct_contractor_credits(
    contractor_uuid UUID,
    credits_amount INTEGER,
    reference_uuid UUID DEFAULT NULL,
    reference_type VARCHAR DEFAULT 'lead_assignment'
)
RETURNS UUID AS $$
DECLARE
    transaction_uuid UUID;
    current_credits INTEGER;
BEGIN
    -- Check current credits
    SELECT credits INTO current_credits 
    FROM contractors 
    WHERE id = contractor_uuid;
    
    IF current_credits < credits_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Current: %, Required: %', current_credits, credits_amount;
    END IF;
    
    -- Update contractor credits
    UPDATE contractors 
    SET credits = credits - credits_amount
    WHERE id = contractor_uuid;
    
    -- Record transaction
    INSERT INTO credit_transactions (
        contractor_id,
        transaction_type,
        credits_amount,
        status,
        reference_id,
        reference_type,
        description
    ) VALUES (
        contractor_uuid,
        'deduction',
        -credits_amount,
        'completed',
        reference_uuid,
        reference_type,
        format('Deducted %s credits for %s', credits_amount, reference_type)
    ) RETURNING id INTO transaction_uuid;
    
    RETURN transaction_uuid;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- NOTIFICATION FUNCTIONS
-- ========================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    user_uuid UUID,
    notification_title VARCHAR,
    notification_message TEXT,
    notification_type VARCHAR,
    reference_uuid UUID DEFAULT NULL,
    reference_type VARCHAR DEFAULT NULL,
    metadata_json JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    notification_uuid UUID;
BEGIN
    INSERT INTO notifications (
        user_id,
        title,
        message,
        notification_type,
        reference_id,
        reference_type,
        metadata
    ) VALUES (
        user_uuid,
        notification_title,
        notification_message,
        notification_type,
        reference_uuid,
        reference_type,
        metadata_json
    ) RETURNING id INTO notification_uuid;
    
    RETURN notification_uuid;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SEARCH FUNCTIONS
-- ========================================

-- Function to search contractors by location and services
CREATE OR REPLACE FUNCTION search_contractors(
    search_city VARCHAR DEFAULT NULL,
    search_state VARCHAR DEFAULT NULL,
    search_zip VARCHAR DEFAULT NULL,
    service_types VARCHAR[] DEFAULT NULL,
    min_rating DECIMAL DEFAULT 0,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
    contractor_id UUID,
    business_name VARCHAR,
    average_rating DECIMAL,
    total_reviews INTEGER,
    profile_image TEXT,
    bio TEXT,
    services TEXT[],
    service_areas TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.business_name,
        c.average_rating,
        c.total_reviews,
        c.profile_image,
        c.bio,
        ARRAY_AGG(DISTINCT cs.service_type) as services,
        ARRAY_AGG(DISTINCT csa.city || ', ' || csa.state) as service_areas
    FROM contractors c
    LEFT JOIN contractor_services cs ON c.id = cs.contractor_id
    LEFT JOIN contractor_service_areas csa ON c.id = csa.contractor_id
    WHERE c.status = 'approved'
      AND (search_city IS NULL OR LOWER(csa.city) LIKE LOWER('%' || search_city || '%'))
      AND (search_state IS NULL OR LOWER(csa.state) LIKE LOWER('%' || search_state || '%'))
      AND (search_zip IS NULL OR csa.zip_code = search_zip)
      AND (service_types IS NULL OR cs.service_type = ANY(service_types))
      AND c.average_rating >= min_rating
    GROUP BY c.id, c.business_name, c.average_rating, c.total_reviews, c.profile_image, c.bio
    ORDER BY c.average_rating DESC, c.total_reviews DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ANALYTICS FUNCTIONS
-- ========================================

-- Function to get contractor dashboard stats
CREATE OR REPLACE FUNCTION get_contractor_dashboard_stats(contractor_uuid UUID)
RETURNS TABLE(
    total_leads INTEGER,
    pending_leads INTEGER,
    accepted_leads INTEGER,
    completed_projects INTEGER,
    current_credits INTEGER,
    average_rating DECIMAL,
    total_reviews INTEGER,
    monthly_leads INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(la.id)::INTEGER as total_leads,
        COUNT(CASE WHEN la.status = 'pending' THEN 1 END)::INTEGER as pending_leads,
        COUNT(CASE WHEN la.status = 'accepted' THEN 1 END)::INTEGER as accepted_leads,
        COUNT(CASE WHEN la.project_completed_at IS NOT NULL THEN 1 END)::INTEGER as completed_projects,
        c.credits as current_credits,
        c.average_rating,
        c.total_reviews,
        COUNT(CASE WHEN la.created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::INTEGER as monthly_leads
    FROM contractors c
    LEFT JOIN lead_assignments la ON c.id = la.contractor_id
    WHERE c.id = contractor_uuid
    GROUP BY c.id, c.credits, c.average_rating, c.total_reviews;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- CLEANUP FUNCTIONS
-- ========================================

-- Function to cleanup expired leads
CREATE OR REPLACE FUNCTION cleanup_expired_leads()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Update expired leads
    UPDATE leads 
    SET status = 'cancelled'
    WHERE status = 'active' 
      AND expires_at < NOW();
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Update expired lead assignments
    UPDATE lead_assignments
    SET status = 'expired'
    WHERE status = 'pending'
      AND response_deadline < NOW();
    
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SCHEDULED JOBS (if supported by your hosting)
-- ========================================

-- Note: This would typically be run via cron job or scheduled function
-- SELECT cleanup_expired_leads();
