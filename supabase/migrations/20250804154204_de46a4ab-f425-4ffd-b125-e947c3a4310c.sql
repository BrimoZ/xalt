-- Create tokens table for launched tokens
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  website_url TEXT,
  x_handle TEXT,
  telegram_url TEXT,
  discord_url TEXT,
  total_supply BIGINT NOT NULL,
  hardcap DECIMAL NOT NULL,
  contributor_type TEXT NOT NULL CHECK (contributor_type IN ('any', 'followers')),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_username TEXT NOT NULL,
  current_price DECIMAL NOT NULL DEFAULT 0.00001,
  market_cap DECIMAL NOT NULL DEFAULT 0,
  volume_24h DECIMAL NOT NULL DEFAULT 0,
  price_change_24h DECIMAL NOT NULL DEFAULT 0,
  raised DECIMAL NOT NULL DEFAULT 0,
  progress DECIMAL NOT NULL DEFAULT 0,
  holders INTEGER NOT NULL DEFAULT 1,
  bonding_curve_progress DECIMAL NOT NULL DEFAULT 0,
  total_contributions DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table for buy/sell transactions
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  token_amount DECIMAL NOT NULL,
  sol_amount DECIMAL NOT NULL,
  price_per_token DECIMAL NOT NULL,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_holdings table for tracking token balances
CREATE TABLE public.user_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  balance DECIMAL NOT NULL DEFAULT 0,
  average_price DECIMAL NOT NULL DEFAULT 0,
  total_invested DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, token_id)
);

-- Create token_claims table for airdrops and claims
CREATE TABLE public.token_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_name TEXT NOT NULL,
  token_amount DECIMAL NOT NULL,
  token_value DECIMAL NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_history table for tracking price changes
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  price DECIMAL NOT NULL,
  volume DECIMAL NOT NULL DEFAULT 0,
  market_cap DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tokens (public read, authenticated users can create)
CREATE POLICY "Tokens are viewable by everyone" 
ON public.tokens 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create tokens" 
ON public.tokens 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Token creators can update their tokens" 
ON public.tokens 
FOR UPDATE 
TO authenticated
USING (auth.uid() = creator_id);

-- RLS Policies for trades (users can see all trades, but only create their own)
CREATE POLICY "Trades are viewable by everyone" 
ON public.trades 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create trades" 
ON public.trades 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_holdings (users can only see their own holdings)
CREATE POLICY "Users can view their own holdings" 
ON public.user_holdings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings" 
ON public.user_holdings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings" 
ON public.user_holdings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for token_claims (users can only see their own claims)
CREATE POLICY "Users can view their own claims" 
ON public.token_claims 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims" 
ON public.token_claims 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for price_history (public read)
CREATE POLICY "Price history is viewable by everyone" 
ON public.price_history 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_tokens_creator_id ON public.tokens(creator_id);
CREATE INDEX idx_tokens_created_at ON public.tokens(created_at DESC);
CREATE INDEX idx_tokens_symbol ON public.tokens(symbol);

CREATE INDEX idx_trades_token_id ON public.trades(token_id);
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);

CREATE INDEX idx_user_holdings_user_id ON public.user_holdings(user_id);
CREATE INDEX idx_user_holdings_token_id ON public.user_holdings(token_id);

CREATE INDEX idx_token_claims_user_id ON public.token_claims(user_id);
CREATE INDEX idx_token_claims_expires_at ON public.token_claims(expires_at);

CREATE INDEX idx_price_history_token_id ON public.price_history(token_id);
CREATE INDEX idx_price_history_created_at ON public.price_history(created_at DESC);

-- Create triggers for updating timestamps
CREATE TRIGGER update_tokens_updated_at
BEFORE UPDATE ON public.tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_holdings_updated_at
BEFORE UPDATE ON public.user_holdings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();