-- Add quote submission fields to lead_assignments table
-- This allows contractors to submit quotes without seeing customer contact info

-- Add quote-related columns to lead_assignments table
ALTER TABLE lead_assignments 
ADD COLUMN IF NOT EXISTS quote_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS quote_notes TEXT,
ADD COLUMN IF NOT EXISTS quote_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS quote_status VARCHAR(50) DEFAULT 'pending'; -- 'pending', 'submitted', 'sent_to_customer'

-- Update the assignment_status enum to include 'quoted' status
-- Note: This might require recreating the enum if it doesn't exist
-- For now, we'll use VARCHAR(50) for flexibility

-- Add index for better performance on quote queries
CREATE INDEX IF NOT EXISTS idx_lead_assignments_quote_status ON lead_assignments(quote_status);
CREATE INDEX IF NOT EXISTS idx_lead_assignments_quote_submitted_at ON lead_assignments(quote_submitted_at);

-- Add RLS policy for contractors to update their own quotes
DROP POLICY IF EXISTS "Contractors can update their own quotes" ON lead_assignments;
CREATE POLICY "Contractors can update their own quotes" ON lead_assignments
  FOR UPDATE USING (
    contractor_id IN (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );

-- Add RLS policy for contractors to view their own assignments
DROP POLICY IF EXISTS "Contractors can view their own assignments" ON lead_assignments;
CREATE POLICY "Contractors can view their own assignments" ON lead_assignments
  FOR SELECT USING (
    contractor_id IN (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );
