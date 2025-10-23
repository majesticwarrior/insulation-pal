-- Add new fields to leads table for enhanced quote form
-- Migration: 35-add-quote-form-fields.sql

-- Add additional services field (array of strings)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS additional_services TEXT[];

-- Add ceiling fan count field
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ceiling_fan_count INTEGER;

-- Add project type field (residential/commercial)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) DEFAULT 'residential';

-- Add attic insulation depth field
ALTER TABLE leads ADD COLUMN IF NOT EXISTS attic_insulation_depth VARCHAR(20);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_project_type ON leads(project_type);
CREATE INDEX IF NOT EXISTS idx_leads_attic_depth ON leads(attic_insulation_depth);

-- Add comments for documentation
COMMENT ON COLUMN leads.additional_services IS 'Array of additional services requested (energy_audit, ceiling_fan_installation, air_sealing, duct_sealing)';
COMMENT ON COLUMN leads.ceiling_fan_count IS 'Number of ceiling fans to install (only if ceiling_fan_installation is in additional_services)';
COMMENT ON COLUMN leads.project_type IS 'Type of project: residential or commercial';
COMMENT ON COLUMN leads.attic_insulation_depth IS 'Depth of attic insulation: 3_inches, 6_inches, or 12_inches';
