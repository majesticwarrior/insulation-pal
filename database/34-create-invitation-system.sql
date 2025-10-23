-- Create lead_invitations table
CREATE TABLE IF NOT EXISTS lead_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
  invite_token VARCHAR(32) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contractor_quotes table for invited contractors
CREATE TABLE IF NOT EXISTS contractor_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  contractor_name VARCHAR(255) NOT NULL,
  contractor_email VARCHAR(255) NOT NULL,
  contractor_phone VARCHAR(20),
  business_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(50),
  quote_amount DECIMAL(10,2) NOT NULL,
  quote_notes TEXT,
  estimated_timeline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_invitations_token ON lead_invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_lead_invitations_lead_id ON lead_invitations(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_invitations_contractor_id ON lead_invitations(contractor_id);
CREATE INDEX IF NOT EXISTS idx_contractor_quotes_lead_id ON contractor_quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_contractor_quotes_email ON contractor_quotes(contractor_email);

-- Enable RLS
ALTER TABLE lead_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_invitations (public read for valid tokens)
CREATE POLICY "Anyone can read valid invitations" ON lead_invitations
  FOR SELECT USING (expires_at > NOW());

-- RLS Policies for contractor_quotes (public insert, restricted read)
CREATE POLICY "Anyone can submit quotes" ON contractor_quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read all quotes" ON contractor_quotes
  FOR SELECT USING (auth.role() = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lead_invitations_updated_at 
  BEFORE UPDATE ON lead_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractor_quotes_updated_at 
  BEFORE UPDATE ON contractor_quotes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
