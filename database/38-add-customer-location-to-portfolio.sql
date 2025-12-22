-- Add customer location and additional project details to contractor_portfolio
-- This allows projects to be displayed on city pages where the customer lives
-- and provides more detailed information about the project

-- Add lead_assignment_id to track the originating customer/lead
ALTER TABLE contractor_portfolio 
ADD COLUMN IF NOT EXISTS lead_assignment_id UUID REFERENCES lead_assignments(id) ON DELETE SET NULL;

-- Add customer location fields (separate from project location for clarity)
ALTER TABLE contractor_portfolio 
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);

ALTER TABLE contractor_portfolio 
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(50);

-- Add arrays to track multiple areas and insulation types
ALTER TABLE contractor_portfolio 
ADD COLUMN IF NOT EXISTS areas_insulated TEXT[]; -- ['attic', 'walls', 'basement']

ALTER TABLE contractor_portfolio 
ADD COLUMN IF NOT EXISTS insulation_types TEXT[]; -- ['spray_foam', 'fiberglass', 'cellulose']

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_customer_city ON contractor_portfolio(customer_city);
CREATE INDEX IF NOT EXISTS idx_portfolio_customer_state ON contractor_portfolio(customer_state);
CREATE INDEX IF NOT EXISTS idx_portfolio_customer_location ON contractor_portfolio(customer_city, customer_state);
CREATE INDEX IF NOT EXISTS idx_portfolio_lead_assignment ON contractor_portfolio(lead_assignment_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_contractor_completion ON contractor_portfolio(contractor_id, completion_date DESC);

-- Add comments for documentation
COMMENT ON COLUMN contractor_portfolio.lead_assignment_id IS 'Reference to the lead assignment that generated this project';
COMMENT ON COLUMN contractor_portfolio.customer_city IS 'City where the customer lives (from the original lead)';
COMMENT ON COLUMN contractor_portfolio.customer_state IS 'State where the customer lives (from the original lead)';
COMMENT ON COLUMN contractor_portfolio.areas_insulated IS 'Array of areas where insulation was added (attic, walls, basement, etc.)';
COMMENT ON COLUMN contractor_portfolio.insulation_types IS 'Array of insulation types used in the project';
COMMENT ON COLUMN contractor_portfolio.project_city IS 'City where the project was completed (may differ from customer city)';
COMMENT ON COLUMN contractor_portfolio.project_state IS 'State where the project was completed (may differ from customer state)';

-- For existing projects without customer location, try to populate from leads via lead_assignment_id
-- This is a best-effort update for existing data
-- Note: This will only work for projects that were properly linked to lead_assignments

-- Verification query to check the updates
SELECT 
    id,
    title,
    contractor_id,
    lead_assignment_id,
    customer_city,
    customer_state,
    project_city,
    project_state,
    areas_insulated,
    insulation_types,
    service_type,
    created_at
FROM contractor_portfolio 
ORDER BY created_at DESC
LIMIT 10;

