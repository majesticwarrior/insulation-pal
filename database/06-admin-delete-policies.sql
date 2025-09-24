-- Admin Delete Policies for RLS
-- This file adds delete permissions for admin operations

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin can delete users" ON users;
DROP POLICY IF EXISTS "Admin can delete contractors" ON contractors;

-- Enable RLS on both tables (in case it was disabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Admin delete policy for users table
CREATE POLICY "Admin can delete users" ON users
  FOR DELETE
  USING (true); -- Admin can delete any user

-- Admin delete policy for contractors table  
CREATE POLICY "Admin can delete contractors" ON contractors
  FOR DELETE
  USING (true); -- Admin can delete any contractor

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename IN ('users', 'contractors') 
AND cmd = 'DELETE';
