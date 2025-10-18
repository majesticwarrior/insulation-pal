-- Project Gallery and Reviews System
-- Run this in your Supabase SQL Editor

-- ========================================
-- PROJECT GALLERY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS project_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_assignment_id UUID REFERENCES lead_assignments(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- REVIEWS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    lead_assignment_id UUID REFERENCES lead_assignments(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    insulation_added TEXT NOT NULL,
    comments TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT TRUE, -- Only verified customers can leave reviews
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one review per lead assignment
    UNIQUE(lead_assignment_id)
);

-- ========================================
-- RLS POLICIES FOR PROJECT GALLERY
-- ========================================

-- Enable RLS
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Contractors can view their own project gallery
CREATE POLICY "Contractors can view own project gallery" ON project_gallery
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors 
            WHERE user_id = auth.uid()
        )
    );

-- Contractors can insert their own project gallery
CREATE POLICY "Contractors can insert own project gallery" ON project_gallery
    FOR INSERT WITH CHECK (
        contractor_id IN (
            SELECT id FROM contractors 
            WHERE user_id = auth.uid()
        )
    );

-- Contractors can update their own project gallery
CREATE POLICY "Contractors can update own project gallery" ON project_gallery
    FOR UPDATE USING (
        contractor_id IN (
            SELECT id FROM contractors 
            WHERE user_id = auth.uid()
        )
    );

-- Public can view project gallery (for public contractor profiles)
CREATE POLICY "Public can view project gallery" ON project_gallery
    FOR SELECT USING (true);

-- ========================================
-- RLS POLICIES FOR REVIEWS
-- ========================================

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can view reviews
CREATE POLICY "Public can view reviews" ON reviews
    FOR SELECT USING (true);

-- Only verified customers can insert reviews
CREATE POLICY "Verified customers can insert reviews" ON reviews
    FOR INSERT WITH CHECK (
        -- Check if the customer email matches the lead assignment
        customer_email IN (
            SELECT customer_email FROM leads 
            WHERE id IN (
                SELECT lead_id FROM lead_assignments 
                WHERE id = lead_assignment_id
            )
        )
    );

-- Contractors can view their own reviews
CREATE POLICY "Contractors can view own reviews" ON reviews
    FOR SELECT USING (
        contractor_id IN (
            SELECT id FROM contractors 
            WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Project gallery indexes
CREATE INDEX IF NOT EXISTS idx_project_gallery_contractor_id ON project_gallery(contractor_id);
CREATE INDEX IF NOT EXISTS idx_project_gallery_lead_assignment_id ON project_gallery(lead_assignment_id);
CREATE INDEX IF NOT EXISTS idx_project_gallery_uploaded_at ON project_gallery(uploaded_at);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_contractor_id ON reviews(contractor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_date ON reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON reviews(is_verified);

-- ========================================
-- FUNCTIONS FOR REVIEW STATISTICS
-- ========================================

-- Function to get contractor review statistics
CREATE OR REPLACE FUNCTION get_contractor_review_stats(contractor_uuid UUID)
RETURNS TABLE (
    total_reviews BIGINT,
    average_rating NUMERIC,
    five_star_count BIGINT,
    four_star_count BIGINT,
    three_star_count BIGINT,
    two_star_count BIGINT,
    one_star_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
        COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
        COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
        COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
        COUNT(*) FILTER (WHERE rating = 1) as one_star_count
    FROM reviews 
    WHERE contractor_id = contractor_uuid AND is_verified = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Uncomment the following lines to add sample data for testing

/*
-- Sample project gallery entry
INSERT INTO project_gallery (lead_assignment_id, contractor_id, image_url, caption)
VALUES (
    (SELECT id FROM lead_assignments LIMIT 1),
    (SELECT id FROM contractors LIMIT 1),
    'https://example.com/sample-image.jpg',
    'Before and after attic insulation installation'
);

-- Sample review
INSERT INTO reviews (contractor_id, lead_assignment_id, customer_name, customer_email, rating, insulation_added, comments)
VALUES (
    (SELECT id FROM contractors LIMIT 1),
    (SELECT id FROM lead_assignments LIMIT 1),
    'John Smith',
    'john@example.com',
    5,
    'R-38 fiberglass in attic, R-13 cellulose in walls',
    'Excellent work! The contractor was professional, on time, and the quality was outstanding. Highly recommend!'
);
*/
