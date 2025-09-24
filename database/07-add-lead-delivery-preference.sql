-- Add lead delivery preference field to contractors table
-- This field is used in the profile edit form but was missing from the schema

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS lead_delivery_preference VARCHAR(20) DEFAULT 'email' CHECK (lead_delivery_preference IN ('email', 'text', 'both'));

-- Update existing contractors to have default value
UPDATE contractors 
SET lead_delivery_preference = 'email' 
WHERE lead_delivery_preference IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contractors' 
AND column_name = 'lead_delivery_preference';
