-- Delete all leads and related data
-- WARNING: This will permanently delete all lead data!

-- First, delete all lead assignments (foreign key constraint)
DELETE FROM lead_assignments;

-- Delete project gallery entries (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'project_gallery') THEN
        DELETE FROM project_gallery;
        RAISE NOTICE 'Deleted project_gallery entries';
    ELSE
        RAISE NOTICE 'project_gallery table does not exist, skipping';
    END IF;
END $$;

-- Delete reviews (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
        DELETE FROM reviews;
        RAISE NOTICE 'Deleted reviews';
    ELSE
        RAISE NOTICE 'reviews table does not exist, skipping';
    END IF;
END $$;

-- Delete all leads
DELETE FROM leads;

-- Verify deletion
SELECT 
    (SELECT COUNT(*) FROM leads) as leads_count,
    (SELECT COUNT(*) FROM lead_assignments) as assignments_count;

-- Check if other tables exist and show their counts
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'project_gallery') THEN
        RAISE NOTICE 'project_gallery count: %', (SELECT COUNT(*) FROM project_gallery);
    ELSE
        RAISE NOTICE 'project_gallery: N/A (table does not exist)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
        RAISE NOTICE 'reviews count: %', (SELECT COUNT(*) FROM reviews);
    ELSE
        RAISE NOTICE 'reviews: N/A (table does not exist)';
    END IF;
END $$;
