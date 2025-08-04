-- Clean up existing data and create proper relationships
-- First, create a mock profile for the existing trade data
INSERT INTO public.profiles (user_id, username, display_name, x_username, x_display_name, avatar_url, x_account_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'legacy_trader',
  'Legacy Trader',
  'legacy_trader',
  'Legacy Trader 🚀',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=legacy_trader',
  '000000001'
) ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name;

-- Now add the foreign key constraints
ALTER TABLE public.trades ADD CONSTRAINT trades_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
ALTER TABLE public.user_holdings ADD CONSTRAINT user_holdings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);