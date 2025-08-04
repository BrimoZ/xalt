-- Create storage bucket for token images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('token-images', 'token-images', true);

-- Create storage policies for token images
CREATE POLICY "Token images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'token-images');

CREATE POLICY "Authenticated users can upload token images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'token-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own token images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'token-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own token images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'token-images' AND auth.uid() IS NOT NULL);