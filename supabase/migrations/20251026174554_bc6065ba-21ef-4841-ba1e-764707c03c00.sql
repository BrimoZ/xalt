-- Create table for token hearts/likes
CREATE TABLE public.token_hearts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id uuid NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(token_id, user_id)
);

-- Enable RLS
ALTER TABLE public.token_hearts ENABLE ROW LEVEL SECURITY;

-- Policies for token_hearts
CREATE POLICY "Anyone can view hearts"
  ON public.token_hearts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add hearts"
  ON public.token_hearts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own hearts"
  ON public.token_hearts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for token backers/donations
CREATE TABLE public.token_donations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id uuid NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_donations ENABLE ROW LEVEL SECURITY;

-- Policies for token_donations
CREATE POLICY "Anyone can view donations"
  ON public.token_donations
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add donations"
  ON public.token_donations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_token_hearts_token_id ON public.token_hearts(token_id);
CREATE INDEX idx_token_hearts_user_id ON public.token_hearts(user_id);
CREATE INDEX idx_token_donations_token_id ON public.token_donations(token_id);
CREATE INDEX idx_token_donations_user_id ON public.token_donations(user_id);