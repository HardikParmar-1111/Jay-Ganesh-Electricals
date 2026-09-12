-- ==============================================================================
-- Migration: 20260912_create_catalog_images_bucket.sql
-- Create Supabase Storage Bucket for Catalog Images and Set RLS Policies
-- ==============================================================================

-- 1. Create the public bucket 'catalog-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-images',
  'catalog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public read access to catalog images
DROP POLICY IF EXISTS "Public Access catalog-images" ON storage.objects;
CREATE POLICY "Public Access catalog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog-images');

-- 3. Allow authenticated users (Admin) to upload images to catalog-images
DROP POLICY IF EXISTS "Authenticated Upload catalog-images" ON storage.objects;
CREATE POLICY "Authenticated Upload catalog-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog-images');

-- 4. Allow authenticated users to update/delete images in catalog-images
DROP POLICY IF EXISTS "Authenticated Update catalog-images" ON storage.objects;
CREATE POLICY "Authenticated Update catalog-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog-images');

DROP POLICY IF EXISTS "Authenticated Delete catalog-images" ON storage.objects;
CREATE POLICY "Authenticated Delete catalog-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog-images');
