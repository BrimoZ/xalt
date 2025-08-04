-- Update RLS policy for tokens table to work with mock authentication
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create tokens" ON public.tokens;

-- Create a more permissive policy for token creation that works with mock auth
CREATE POLICY "Anyone can create tokens" 
ON public.tokens 
FOR INSERT 
WITH CHECK (true);

-- Also update the update policy to be more permissive for development
DROP POLICY IF EXISTS "Token creators can update their tokens" ON public.tokens;

CREATE POLICY "Anyone can update tokens" 
ON public.tokens 
FOR UPDATE 
USING (true);