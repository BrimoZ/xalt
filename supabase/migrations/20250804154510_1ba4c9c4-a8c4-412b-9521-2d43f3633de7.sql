-- Insert some initial seed data for demo purposes
-- Note: This will only work after users sign up through the app

-- Insert sample token claims for users (these will appear when they sign up)
INSERT INTO public.token_claims (user_id, token_name, token_amount, token_value, expires_at, claimed)
SELECT 
  '00000000-0000-0000-0000-000000000000', -- Placeholder, will be updated when real users sign up
  'MEMECOIN', 
  10000, 
  45.50, 
  now() + interval '7 days',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.token_claims WHERE token_name = 'MEMECOIN');

-- Function to create sample claims for new users
CREATE OR REPLACE FUNCTION public.create_sample_claims_for_user(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert sample token claims for new users
  INSERT INTO public.token_claims (user_id, token_name, token_amount, token_value, expires_at, claimed)
  VALUES 
    (user_uuid, 'MEMECOIN', 10000, 45.50, now() + interval '7 days', false),
    (user_uuid, 'ALTCOIN', 5000, 125.00, now() + interval '10 days', false),
    (user_uuid, 'BONUS', 1000, 8.90, now() + interval '3 days', false);
    
  -- Insert sample holdings (as if user bought some tokens)
  INSERT INTO public.user_holdings (user_id, token_id, balance, average_price, total_invested)
  SELECT 
    user_uuid,
    t.id,
    CASE 
      WHEN t.symbol = 'PEPE' THEN 1250000
      WHEN t.symbol = 'DOGE2' THEN 8540
      ELSE 0
    END,
    CASE 
      WHEN t.symbol = 'PEPE' THEN 0.000023
      WHEN t.symbol = 'DOGE2' THEN 0.000045
      ELSE 0
    END,
    CASE 
      WHEN t.symbol = 'PEPE' THEN 28.75
      WHEN t.symbol = 'DOGE2' THEN 38.43
      ELSE 0
    END
  FROM public.tokens t
  WHERE t.symbol IN ('PEPE', 'DOGE2') AND
  NOT EXISTS (
    SELECT 1 FROM public.user_holdings 
    WHERE user_id = user_uuid AND token_id = t.id
  );
END;
$$;