-- Add Payment Preference Column to Contractors Table
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS payment_preference VARCHAR(20) DEFAULT 'per_lead';

-- Add comment
COMMENT ON COLUMN contractors.payment_preference IS 'Payment preference: per_lead or per_job_completed';

-- Create index
CREATE INDEX IF NOT EXISTS idx_contractors_payment_preference ON contractors(payment_preference);

-- Add check constraint to ensure valid values
ALTER TABLE contractors ADD CONSTRAINT check_payment_preference 
  CHECK (payment_preference IN ('per_lead', 'per_job_completed'));
