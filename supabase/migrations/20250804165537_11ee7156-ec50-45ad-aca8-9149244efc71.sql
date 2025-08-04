-- Create profiles for existing users that don't have profiles yet
INSERT INTO public.profiles (user_id, username, display_name, x_username, x_display_name, avatar_url, x_account_id)
VALUES 
  ('11ac2b0f-1ade-445f-942e-ca052c724eed', 'alpha_hunter', 'Alpha Hunter', 'alpha_hunter', 'Alpha Hunter 🎯', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alpha_hunter', '741963852'),
  ('00000000-0000-0000-0000-000000000001', 'legacy_trader', 'Legacy Trader', 'legacy_trader', 'Legacy Trader 🚀', 'https://api.dicebear.com/7.x/avataaars/svg?seed=legacy_trader', '000000001'),
  ('054ea475-c3f5-44f9-80ab-f0a033a534ca', 'crypto_trader', 'Crypto Trader', 'crypto_trader', 'Crypto Trader 🚀', 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto_trader', '123456789')
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  x_display_name = EXCLUDED.x_display_name;