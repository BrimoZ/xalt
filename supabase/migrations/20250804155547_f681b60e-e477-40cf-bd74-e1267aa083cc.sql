-- Update storage policies to allow uploads with mock authentication
-- Remove the existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload token images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own token images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own token images" ON storage.objects;

-- Create more permissive policies for token images bucket
CREATE POLICY "Anyone can upload token images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'token-images');

CREATE POLICY "Anyone can update token images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'token-images');

CREATE POLICY "Anyone can delete token images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'token-images');