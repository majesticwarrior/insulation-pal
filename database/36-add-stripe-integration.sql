-- Create credit transactions table and functions
-- Migration: 36-add-stripe-integration.sql

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  package_id VARCHAR(50) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL, -- Amount in cents
  stripe_session_id VARCHAR(255) UNIQUE,
  transaction_type VARCHAR(50) DEFAULT 'purchase',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_contractor_id ON credit_transactions(contractor_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_stripe_session_id ON credit_transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_status ON credit_transactions(status);

-- Enable RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_transactions
CREATE POLICY "Contractors can view their own transactions" ON credit_transactions
  FOR SELECT USING (contractor_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage all transactions" ON credit_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to add credits to contractor
CREATE OR REPLACE FUNCTION add_contractor_credits(
  contractor_id UUID,
  credits_to_add INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- Update contractor credits
  UPDATE contractors 
  SET credits = credits + credits_to_add,
      updated_at = NOW()
  WHERE id = contractor_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contractor with ID % not found', contractor_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_credit_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_credit_transactions_updated_at
  BEFORE UPDATE ON credit_transactions
  FOR EACH ROW EXECUTE FUNCTION update_credit_transactions_updated_at();

-- Add comments for documentation
COMMENT ON TABLE credit_transactions IS 'Tracks all credit purchase transactions';
COMMENT ON COLUMN credit_transactions.package_id IS 'ID of the lead package purchased';
COMMENT ON COLUMN credit_transactions.credits_purchased IS 'Number of credits purchased';
COMMENT ON COLUMN credit_transactions.amount_paid IS 'Amount paid in cents';
COMMENT ON COLUMN credit_transactions.stripe_session_id IS 'Stripe checkout session ID';
COMMENT ON COLUMN credit_transactions.transaction_type IS 'Type of transaction (purchase, refund, etc.)';
COMMENT ON COLUMN credit_transactions.status IS 'Transaction status (pending, completed, failed, refunded)';
