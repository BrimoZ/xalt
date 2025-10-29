-- Create staking table to track user stakes
CREATE TABLE IF NOT EXISTS public.staking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  staked_amount DECIMAL NOT NULL DEFAULT 0,
  claimable_rewards DECIMAL NOT NULL DEFAULT 0,
  donation_balance DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create transactions table to track all staking activities
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  transaction_type TEXT NOT NULL, -- 'stake', 'unstake', 'reward', 'claim'
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pool_config table to track the global pool
CREATE TABLE IF NOT EXISTS public.pool_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_pool_size DECIMAL NOT NULL DEFAULT 50000000,
  apr_rate DECIMAL NOT NULL DEFAULT 150,
  last_reward_distribution TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial pool config
INSERT INTO public.pool_config (total_pool_size, apr_rate, last_reward_distribution)
VALUES (50000000, 150, now())
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_config ENABLE ROW LEVEL SECURITY;

-- Staking policies
CREATE POLICY "Users can view their own staking data"
  ON public.staking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own staking data"
  ON public.staking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own staking data"
  ON public.staking FOR UPDATE
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pool config policies (everyone can read, only service role can update)
CREATE POLICY "Anyone can view pool config"
  ON public.pool_config FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_staking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for staking table
CREATE TRIGGER update_staking_timestamp
  BEFORE UPDATE ON public.staking
  FOR EACH ROW
  EXECUTE FUNCTION update_staking_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_staking_user_id ON public.staking(user_id);
CREATE INDEX idx_staking_wallet_address ON public.staking(wallet_address);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);