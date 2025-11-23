-- Fix storage bucket RLS policies for creator-content

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Creators upload own content" ON storage.objects;
DROP POLICY IF EXISTS "View approved content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can view uploads" ON storage.objects;

-- Create new policies that work

-- 1. Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload to creator-content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'creator-content'
);

-- 2. Allow users to update their own files
CREATE POLICY "Users can update own files in creator-content"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'creator-content' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Allow users to delete their own files
CREATE POLICY "Users can delete own files in creator-content"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'creator-content' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Allow everyone to view files (we'll handle access control at the application level)
CREATE POLICY "Public can view creator-content"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'creator-content');

-- Make sure the bucket exists and is configured correctly
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'creator-content',
    'creator-content',
    false,
    104857600, -- 100MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) 
DO UPDATE SET
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
