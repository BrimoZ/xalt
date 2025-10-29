-- Fix search_path for update_staking_updated_at function
CREATE OR REPLACE FUNCTION update_staking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;