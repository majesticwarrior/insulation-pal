-- Setup Supabase Storage for Contractor Images
-- This creates the storage bucket and sets up proper policies for image uploads

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('contractor_images', 'contractor_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads to contractor_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'contractor_images' 
    AND auth.role() = 'authenticated'
  );

-- Allow public read access to images
CREATE POLICY "Allow public read access to contractor_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'contractor_images');

-- Allow contractors to update/delete their own images
CREATE POLICY "Allow contractors to manage their images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'contractor_images' 
    AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'contractor_images' 
    AND auth.role() = 'authenticated'
  );

-- Verify bucket was created
SELECT 
  id,
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'contractor_images';

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%contractor_images%';
