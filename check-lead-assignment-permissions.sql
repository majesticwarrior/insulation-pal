-- Check RLS policies on lead_assignments table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'lead_assignments';

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'lead_assignments';

-- Try to see what happens when we insert (this will show the exact error)
-- This is a test that will be rolled back
BEGIN;
INSERT INTO lead_assignments (lead_id, contractor_id, status, cost)
VALUES (
    (SELECT id FROM leads LIMIT 1),
    (SELECT id FROM contractors WHERE status = 'approved' LIMIT 1),
    'sent',
    20.00
);
ROLLBACK;

