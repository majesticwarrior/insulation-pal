-- Setup Supabase Storage for project images
-- This creates the storage bucket and policies for contractors to upload project completion photos

-- Create the contractor-images bucket if it doesn't exist
-- Note: This must be run in Supabase dashboard or via their API
-- The bucket should be public so images can be displayed

-- Storage policies for the contractor-images bucket
-- These need to be created in the Supabase Dashboard under Storage > Policies

/*
STORAGE BUCKET SETUP INSTRUCTIONS:
=====================================

1. Go to Supabase Dashboard > Storage
2. Create a new bucket called "contractor-images" if it doesn't exist
3. Set it as PUBLIC (so images can be displayed)
4. Create the following storage policies:

Policy 1: Allow anyone to upload to contractor-images
------------------------------------------------------
Name: Allow anyone to upload
Policy: INSERT
Target roles: public
USING expression: true
WITH CHECK expression: true

Policy 2: Allow anyone to read from contractor-images
------------------------------------------------------
Name: Allow anyone to read
Policy: SELECT
Target roles: public
USING expression: true

Policy 3: Allow anyone to update in contractor-images
------------------------------------------------------
Name: Allow anyone to update
Policy: UPDATE
Target roles: public
USING expression: true
WITH CHECK expression: true

Policy 4: Allow anyone to delete from contractor-images
--------------------------------------------------------
Name: Allow anyone to delete
Policy: DELETE
Target roles: public
USING expression: true

Alternative SQL-based approach (if supported by your Supabase version):
*/

-- Enable storage for the bucket
-- Note: The actual bucket creation and policy setup must be done via Supabase Dashboard
-- or using the Supabase Management API

-- Verify the storage setup by checking if we can insert into storage.objects
-- This is just a comment to remind about storage policies

/*
VERIFICATION:
=============

After creating the bucket and policies, test by:
1. Going to contractor dashboard
2. Finding a won lead
3. Clicking "Add Project Images"
4. Selecting and uploading an image
5. Check the browser console for any errors
6. Verify the image appears in Storage > contractor-images bucket
*/

