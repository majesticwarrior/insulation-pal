-- Add customer city and state columns to reviews table
-- This allows reviews to be displayed on the city page where the customer lives
-- and enables fallback to nearby cities when no reviews exist for a specific city

-- Add customer location columns
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_state VARCHAR(50);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_customer_city ON reviews(customer_city);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_state ON reviews(customer_state);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_location ON reviews(customer_city, customer_state);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);

-- Add comments for documentation
COMMENT ON COLUMN reviews.customer_city IS 'City where the customer lives (not where contractor is based)';
COMMENT ON COLUMN reviews.customer_state IS 'State where the customer lives (not where contractor is based)';

-- Update existing reviews to extract city and state from location field if possible
-- This is a best-effort update for existing data
UPDATE reviews 
SET 
  customer_city = CASE 
    WHEN location IS NOT NULL AND location LIKE '%,%' THEN 
      TRIM(SPLIT_PART(location, ',', 1))
    ELSE NULL
  END,
  customer_state = CASE 
    WHEN location IS NOT NULL AND location LIKE '%,%' THEN 
      TRIM(SPLIT_PART(location, ',', 2))
    ELSE NULL
  END
WHERE customer_city IS NULL AND location IS NOT NULL;

-- Verification query to check the updates
SELECT 
    id,
    customer_name,
    location,
    customer_city,
    customer_state,
    contractor_id,
    created_at
FROM reviews 
WHERE location IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

