-- Delete all leads and related data
-- WARNING: This will permanently delete all lead data!

-- First, delete all lead assignments (foreign key constraint)
DELETE FROM lead_assignments;

-- Delete all project gallery entries (if they reference leads)
DELETE FROM project_gallery;

-- Delete all reviews (if they reference lead assignments)
DELETE FROM reviews;

-- Delete all leads
DELETE FROM leads;

-- Verify deletion
SELECT 
    (SELECT COUNT(*) FROM leads) as leads_count,
    (SELECT COUNT(*) FROM lead_assignments) as assignments_count,
    (SELECT COUNT(*) FROM project_gallery) as gallery_count,
    (SELECT COUNT(*) FROM reviews) as reviews_count;

-- Optional: Reset any sequences if they exist
-- ALTER SEQUENCE IF EXISTS leads_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS lead_assignments_id_seq RESTART WITH 1;
