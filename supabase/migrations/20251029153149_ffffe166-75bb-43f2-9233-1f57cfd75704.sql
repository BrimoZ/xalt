-- Enable realtime for staking table
ALTER PUBLICATION supabase_realtime ADD TABLE public.staking;

-- Enable realtime for pool_config table
ALTER PUBLICATION supabase_realtime ADD TABLE public.pool_config;

-- Enable realtime for transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;