-- Create Escrow Jobs Table for Per Job Completed Payment System
CREATE TABLE IF NOT EXISTS escrow_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Job details
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    service_type VARCHAR(100),
    
    -- Financial details
    total_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- 10% commission
    commission_amount DECIMAL(10,2) NOT NULL,
    contractor_payment DECIMAL(10,2) NOT NULL,
    
    -- Payment details
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'disputed')),
    
    -- Timeline
    start_date DATE,
    completion_date DATE,
    payment_released_date DATE,
    
    -- Escrow details
    escrow_held BOOLEAN DEFAULT FALSE,
    escrow_release_conditions TEXT,
    
    -- Notes and communication
    customer_notes TEXT,
    contractor_notes TEXT,
    admin_notes TEXT,
    
    -- Files and documents
    contract_url TEXT,
    completion_photos TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_escrow_jobs_contractor_id ON escrow_jobs(contractor_id);
CREATE INDEX IF NOT EXISTS idx_escrow_jobs_customer_id ON escrow_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_jobs_status ON escrow_jobs(status);
CREATE INDEX IF NOT EXISTS idx_escrow_jobs_created_at ON escrow_jobs(created_at);

-- Add comments
COMMENT ON TABLE escrow_jobs IS 'Jobs with escrow payment system for per job completed contractors';
COMMENT ON COLUMN escrow_jobs.commission_rate IS 'Platform commission rate as percentage (default 10%)';
COMMENT ON COLUMN escrow_jobs.contractor_payment IS 'Amount contractor will receive after commission';
COMMENT ON COLUMN escrow_jobs.escrow_held IS 'Whether payment is held in escrow';
