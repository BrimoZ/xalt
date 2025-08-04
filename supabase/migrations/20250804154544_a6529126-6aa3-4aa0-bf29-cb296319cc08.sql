-- Function to create sample claims and holdings for new users when they sign up
CREATE OR REPLACE FUNCTION public.create_sample_data_for_user(user_uuid UUID)
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
    (user_uuid, 'BONUS', 1000, 8.90, now() + interval '3 days', false)
  ON CONFLICT DO NOTHING;
    
  -- Insert sample holdings (simulate user bought some tokens if they exist)
  INSERT INTO public.user_holdings (user_id, token_id, balance, average_price, total_invested)
  SELECT 
    user_uuid,
    t.id,
    CASE 
      WHEN t.symbol = 'PEPE' THEN 1250000
      WHEN t.symbol = 'DOGE2' THEN 8540
      ELSE 45000
    END,
    t.current_price,
    CASE 
      WHEN t.symbol = 'PEPE' THEN 28.75
      WHEN t.symbol = 'DOGE2' THEN 38.43
      ELSE 22.50
    END
  FROM public.tokens t
  LIMIT 3
  ON CONFLICT (user_id, token_id) DO NOTHING;
END;
$$;