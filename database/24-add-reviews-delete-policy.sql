-- Add DELETE policy for reviews table to allow admin deletion
-- Run this in your Supabase SQL Editor

-- Add DELETE policy for reviews table
CREATE POLICY "reviews_public_delete" ON reviews
  FOR DELETE
  TO public
  USING (true);

-- Grant DELETE permission to authenticated users
GRANT DELETE ON reviews TO authenticated;
GRANT DELETE ON reviews TO anon;

-- Verify the policy was created
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
WHERE tablename = 'reviews' 
AND cmd = 'DELETE'
ORDER BY policyname;
