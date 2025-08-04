-- Temporarily allow public access to trades for testing
DROP POLICY IF EXISTS "Authenticated users can create trades" ON public.trades;

CREATE POLICY "Anyone can create trades" 
ON public.trades 
FOR INSERT 
WITH CHECK (true);

-- Also allow public access to user_holdings for testing
DROP POLICY IF EXISTS "Users can insert their own holdings" ON public.user_holdings;
DROP POLICY IF EXISTS "Users can update their own holdings" ON public.user_holdings;
DROP POLICY IF EXISTS "Users can view their own holdings" ON public.user_holdings;

CREATE POLICY "Anyone can insert holdings" 
ON public.user_holdings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update holdings" 
ON public.user_holdings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view holdings" 
ON public.user_holdings 
FOR SELECT 
USING (true);