-- Add Certifications Column to Contractors Table
-- This enables saving and loading of contractor certifications

-- Add certifications column to store array of certification strings
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN contractors.certifications IS 'Array of contractor certifications (BBB Accreditation, ENERGY STAR Partner, BPI Certified, Licensed Bonded & Insured)';

-- Create index for certification searches (optional, for future features)
CREATE INDEX IF NOT EXISTS idx_contractors_certifications ON contractors USING GIN (certifications);

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contractors' 
AND column_name = 'certifications';
