-- Add foreign key constraints to link trades and user_holdings to profiles
ALTER TABLE public.trades ADD CONSTRAINT trades_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
ALTER TABLE public.user_holdings ADD CONSTRAINT user_holdings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);