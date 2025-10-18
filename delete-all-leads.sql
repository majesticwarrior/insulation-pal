-- Delete all leads and related data
-- This script will remove all leads, lead assignments, and related data

-- First, delete all lead assignments (this has foreign key constraints)
DELETE FROM lead_assignments;

-- Then delete all leads
DELETE FROM leads;

-- Reset any sequences if they exist
-- ALTER SEQUENCE leads_id_seq RESTART WITH 1;
-- ALTER SEQUENCE lead_assignments_id_seq RESTART WITH 1;

-- Show confirmation
SELECT 'All leads and lead assignments have been deleted' as status;
