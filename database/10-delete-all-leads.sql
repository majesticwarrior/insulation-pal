-- Delete all leads and lead assignments from the system
-- Run this in your Supabase SQL Editor

-- First, delete all lead assignments (due to foreign key constraints)
DELETE FROM lead_assignments;

-- Then delete all leads
DELETE FROM leads;

-- Optional: Reset any sequences if they exist
-- ALTER SEQUENCE leads_id_seq RESTART WITH 1;
-- ALTER SEQUENCE lead_assignments_id_seq RESTART WITH 1;

-- Verify deletion
SELECT 'Leads remaining:' as info, COUNT(*) as count FROM leads
UNION ALL
SELECT 'Lead assignments remaining:' as info, COUNT(*) as count FROM lead_assignments;
