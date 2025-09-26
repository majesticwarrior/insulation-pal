-- Add missing fields to leads table to fix quote form 500 errors
-- This fixes the 500 error when submitting quote forms with address information

-- Add property_address column if it doesn't exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_address TEXT;

-- Also add quote_preference field if it doesn't exist (for form compatibility)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quote_preference VARCHAR(50) DEFAULT 'random_three';

-- Update the comment to document the new fields
COMMENT ON COLUMN leads.property_address IS 'Full property address provided by customer in quote form';
COMMENT ON COLUMN leads.quote_preference IS 'Customer preference for receiving quotes: random_three or choose_three';

-- Ensure the fields have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_zip_code ON leads(zip_code);

-- Verify the changes worked
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('property_address', 'quote_preference')
ORDER BY column_name;
