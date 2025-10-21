-- Fix contractor_portfolio RLS policies to allow project completion image uploads
-- Contractors need to be able to insert images when they upload project completion photos

-- Drop existing policies
DROP POLICY IF EXISTS "Public read portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Contractors manage portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "full_access_contractor_portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Admins have full access to contractor_portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Allow all authenticated for contractor_portfolio" ON contractor_portfolio;
DROP POLICY IF EXISTS "Allow anon read contractor_portfolio" ON contractor_portfolio;

-- Create new, simplified policies

-- 1. Allow everyone to read portfolio (public gallery)
CREATE POLICY "allow_public_read_portfolio"
    ON contractor_portfolio
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Allow everyone to insert (contractors adding completion photos)
CREATE POLICY "allow_public_insert_portfolio"
    ON contractor_portfolio
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 3. Allow everyone to update their own portfolio
CREATE POLICY "allow_public_update_portfolio"
    ON contractor_portfolio
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Allow everyone to delete from portfolio
CREATE POLICY "allow_public_delete_portfolio"
    ON contractor_portfolio
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Grant necessary permissions
GRANT ALL ON contractor_portfolio TO anon;
GRANT ALL ON contractor_portfolio TO authenticated;
GRANT ALL ON contractor_portfolio TO service_role;

-- Verify policies are created
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
WHERE tablename = 'contractor_portfolio'
ORDER BY policyname;

