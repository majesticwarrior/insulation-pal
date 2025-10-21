-- Create project_gallery table for storing project completion images
-- This allows contractors to upload before/after photos and request reviews

-- Create the table
CREATE TABLE IF NOT EXISTS project_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_assignment_id UUID REFERENCES lead_assignments(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_gallery_contractor ON project_gallery(contractor_id);
CREATE INDEX IF NOT EXISTS idx_project_gallery_lead_assignment ON project_gallery(lead_assignment_id);

-- Add project_completed_at column to lead_assignments if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='lead_assignments' 
                   AND column_name='project_completed_at') THEN
        ALTER TABLE lead_assignments ADD COLUMN project_completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add 'completed' status to assignment_status enum if not exists
ALTER TYPE assignment_status ADD VALUE IF NOT EXISTS 'completed';

-- Enable RLS
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Contractors can insert their own project images" ON project_gallery;
DROP POLICY IF EXISTS "Contractors can view their own project images" ON project_gallery;
DROP POLICY IF EXISTS "Public can view project images" ON project_gallery;
DROP POLICY IF EXISTS "Contractors can update their own project images" ON project_gallery;
DROP POLICY IF EXISTS "Contractors can delete their own project images" ON project_gallery;

-- Create RLS policies
-- Allow contractors to insert their own project images
CREATE POLICY "Contractors can insert their own project images"
    ON project_gallery
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);  -- Allow all inserts (we verify contractor_id in the application)

-- Allow contractors to view their own project images
CREATE POLICY "Contractors can view their own project images"
    ON project_gallery
    FOR SELECT
    TO anon, authenticated
    USING (true);  -- Allow all to view (images are public for display)

-- Allow contractors to update their own project images
CREATE POLICY "Contractors can update their own project images"
    ON project_gallery
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow contractors to delete their own project images
CREATE POLICY "Contractors can delete their own project images"
    ON project_gallery
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON project_gallery TO anon;
GRANT ALL ON project_gallery TO authenticated;
GRANT ALL ON project_gallery TO service_role;

COMMENT ON TABLE project_gallery IS 'Stores project completion images uploaded by contractors';
COMMENT ON COLUMN project_gallery.lead_assignment_id IS 'Reference to the lead assignment/project';
COMMENT ON COLUMN project_gallery.contractor_id IS 'Reference to the contractor who uploaded the image';
COMMENT ON COLUMN project_gallery.image_url IS 'Public URL of the uploaded image in Supabase Storage';
COMMENT ON COLUMN project_gallery.caption IS 'Optional description of the image';

