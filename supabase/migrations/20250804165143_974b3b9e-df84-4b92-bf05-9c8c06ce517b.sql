-- Create profiles for all existing users in trades and holdings
INSERT INTO public.profiles (user_id, username, display_name, x_username, x_display_name, avatar_url, x_account_id)
SELECT DISTINCT 
  t.user_id,
  'trader_' || substring(t.user_id::text, 1, 8),
  'Trader ' || substring(t.user_id::text, 1, 8),
  'trader_' || substring(t.user_id::text, 1, 8),
  'Trader ' || substring(t.user_id::text, 1, 8) || ' 🚀',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || t.user_id::text,
  substring(t.user_id::text, 1, 9)
FROM public.trades t
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = t.user_id
)
UNION
SELECT DISTINCT 
  h.user_id,
  'holder_' || substring(h.user_id::text, 1, 8),
  'Holder ' || substring(h.user_id::text, 1, 8),
  'holder_' || substring(h.user_id::text, 1, 8),
  'Holder ' || substring(h.user_id::text, 1, 8) || ' 💎',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || h.user_id::text,
  substring(h.user_id::text, 1, 9)
FROM public.user_holdings h
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = h.user_id
);