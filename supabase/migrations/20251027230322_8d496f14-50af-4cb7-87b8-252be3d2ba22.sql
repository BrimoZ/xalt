-- Create impact pool donations table
CREATE TABLE public.impact_pool_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  transaction_hash TEXT NOT NULL,
  transaction_url TEXT NOT NULL,
  donor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.impact_pool_donations ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing donations (public)
CREATE POLICY "Anyone can view impact pool donations"
ON public.impact_pool_donations
FOR SELECT
USING (true);

-- Create policy for inserting donations (authenticated users only)
CREATE POLICY "Authenticated users can add impact pool donations"
ON public.impact_pool_donations
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_impact_pool_donations_pool_name ON public.impact_pool_donations(pool_name);
CREATE INDEX idx_impact_pool_donations_created_at ON public.impact_pool_donations(created_at DESC);