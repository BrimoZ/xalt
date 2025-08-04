-- Remove foreign key constraints that are blocking mock user data
ALTER TABLE public.trades DROP CONSTRAINT IF EXISTS trades_user_id_fkey;
ALTER TABLE public.user_holdings DROP CONSTRAINT IF EXISTS user_holdings_user_id_fkey;

-- Also check if there are any other foreign key constraints we need to remove
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;