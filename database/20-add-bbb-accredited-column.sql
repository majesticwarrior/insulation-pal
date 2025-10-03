-- Add BBB Accredited Column to Contractors Table
-- This enables tracking of BBB accreditation status for contractor profiles

-- Add bbb_accredited column to contractors table
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS bbb_accredited BOOLEAN DEFAULT FALSE;

-- Add comment to document the column
COMMENT ON COLUMN contractors.bbb_accredited IS 'Indicates if the contractor is BBB (Better Business Bureau) accredited';

-- Create index for BBB accredited searches
CREATE INDEX IF NOT EXISTS idx_contractors_bbb_accredited ON contractors(bbb_accredited);

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contractors' 
AND column_name = 'bbb_accredited';
