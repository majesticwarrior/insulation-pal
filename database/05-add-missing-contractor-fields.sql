-- Add missing fields to contractors table to match application code expectations
-- This migration adds fields that the application code expects but are missing from the schema

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- Add index for email if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);

-- Add unique constraint for email if it doesn't exist (but only if the column has data)
-- Note: You may need to run this manually if there are existing duplicate emails
-- ALTER TABLE contractors ADD CONSTRAINT contractors_email_unique UNIQUE (email);

-- Update any existing contractors to populate contact fields from their user record
-- This is a one-time migration to sync existing data
UPDATE contractors 
SET 
    email = users.email,
    contact_phone = users.phone,
    contact_email = users.email
FROM users 
WHERE contractors.user_id = users.id 
AND contractors.email IS NULL;

-- Note: password_hash will need to be handled separately as it's not stored in users table
-- New registrations will populate this field directly
