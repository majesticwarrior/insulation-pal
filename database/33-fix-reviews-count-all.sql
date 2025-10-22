-- Fix review counting to include all reviews (verified and unverified)
-- This migration updates the contractor rating function and sample data to count all reviews

-- ========================================
-- UPDATE CONTRACTOR RATING FUNCTION
-- ========================================

-- Function to update contractor average rating (now includes all reviews)
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
DECLARE
    contractor_uuid UUID;
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Get contractor ID from the review
    contractor_uuid := COALESCE(NEW.contractor_id, OLD.contractor_id);
    
    -- Calculate new average rating and count (now includes all reviews, not just verified)
    SELECT 
        ROUND(AVG(rating)::numeric, 2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE contractor_id = contractor_uuid;
    
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

-- ========================================
-- UPDATE ALL CONTRACTOR REVIEW TOTALS
-- ========================================

-- Update all contractors to count all reviews (verified and unverified)
UPDATE contractors SET 
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE contractor_id = contractors.id
    ),
    average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM reviews 
        WHERE contractor_id = contractors.id
    )
WHERE id IN (
    SELECT DISTINCT contractor_id 
    FROM reviews
);

-- For contractors with no reviews, set defaults
UPDATE contractors SET 
    total_reviews = 0,
    average_rating = 0
WHERE id NOT IN (
    SELECT DISTINCT contractor_id 
    FROM reviews
    WHERE contractor_id IS NOT NULL
);

-- ========================================
-- VERIFICATION QUERY
-- ========================================

-- Verify the changes by showing review counts
SELECT 
    c.business_name,
    c.total_reviews as contractor_total,
    COUNT(r.id) as actual_total,
    c.average_rating as contractor_avg,
    ROUND(AVG(r.rating)::numeric, 2) as actual_avg,
    COUNT(CASE WHEN r.verified = true THEN 1 END) as verified_count,
    COUNT(CASE WHEN r.verified = false THEN 1 END) as unverified_count
FROM contractors c
LEFT JOIN reviews r ON c.id = r.contractor_id
GROUP BY c.id, c.business_name, c.total_reviews, c.average_rating
ORDER BY c.business_name;
