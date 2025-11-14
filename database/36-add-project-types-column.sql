-- Add project_types column to contractors table
-- This allows contractors to specify whether they work on residential, commercial, or both types of projects

ALTER TABLE contractors ADD COLUMN IF NOT EXISTS project_types TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_contractors_project_types ON contractors USING GIN(project_types);

-- Add comment
COMMENT ON COLUMN contractors.project_types IS 'Array of project types the contractor works on: residential, commercial, or both';

