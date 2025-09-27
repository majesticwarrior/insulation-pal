-- Add customer_name and customer_email columns to reviews table
-- This allows manual admin reviews to store customer info directly

-- Add missing columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_customer_name ON reviews(customer_name);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_email ON reviews(customer_email);

-- Update comments to document the new fields
COMMENT ON COLUMN reviews.customer_name IS 'Customer name for manual admin reviews (when customer_id is not available)';
COMMENT ON COLUMN reviews.customer_email IS 'Customer email for manual admin reviews (when customer_id is not available)';

-- Verification query
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reviews' 
AND column_name IN ('customer_name', 'customer_email')
ORDER BY column_name;
