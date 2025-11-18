-- Create table to track follow-up emails sent to contractors for won bids
-- This prevents duplicate follow-ups and tracks email history

CREATE TABLE IF NOT EXISTS won_bid_followup_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_assignment_id UUID NOT NULL REFERENCES lead_assignments(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    followup_type VARCHAR(20) NOT NULL CHECK (followup_type IN ('3d', '5d')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure we don't send duplicate follow-ups
    UNIQUE(lead_assignment_id, followup_type)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_won_bid_followup_emails_lead_assignment_id ON won_bid_followup_emails(lead_assignment_id);
CREATE INDEX IF NOT EXISTS idx_won_bid_followup_emails_contractor_id ON won_bid_followup_emails(contractor_id);
CREATE INDEX IF NOT EXISTS idx_won_bid_followup_emails_lead_id ON won_bid_followup_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_won_bid_followup_emails_sent_at ON won_bid_followup_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_won_bid_followup_emails_type ON won_bid_followup_emails(followup_type);

-- Add RLS policies (if needed)
ALTER TABLE won_bid_followup_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/select follow-up emails
DROP POLICY IF EXISTS "Service role can manage won bid followup emails" ON won_bid_followup_emails;
CREATE POLICY "Service role can manage won bid followup emails" ON won_bid_followup_emails
    FOR ALL
    USING (true)
    WITH CHECK (true);

