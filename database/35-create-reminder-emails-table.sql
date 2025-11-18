-- Create table to track reminder emails sent to contractors
-- This prevents duplicate reminders and tracks reminder history

CREATE TABLE IF NOT EXISTS reminder_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_assignment_id UUID NOT NULL REFERENCES lead_assignments(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('2h', '4h', '24h')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure we don't send duplicate reminders
    UNIQUE(lead_assignment_id, reminder_type)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reminder_emails_lead_assignment_id ON reminder_emails(lead_assignment_id);
CREATE INDEX IF NOT EXISTS idx_reminder_emails_contractor_id ON reminder_emails(contractor_id);
CREATE INDEX IF NOT EXISTS idx_reminder_emails_lead_id ON reminder_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_reminder_emails_sent_at ON reminder_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_reminder_emails_type ON reminder_emails(reminder_type);

-- Add RLS policies (if needed)
ALTER TABLE reminder_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/select reminder emails
DROP POLICY IF EXISTS "Service role can manage reminder emails" ON reminder_emails;
CREATE POLICY "Service role can manage reminder emails" ON reminder_emails
    FOR ALL
    USING (true)
    WITH CHECK (true);

