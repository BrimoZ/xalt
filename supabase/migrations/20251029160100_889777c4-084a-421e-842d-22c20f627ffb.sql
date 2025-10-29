-- Add status and transaction_hash columns to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS transaction_hash text,
ADD COLUMN IF NOT EXISTS transaction_url text;

-- Add a check constraint for status values
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'failed'));

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Add comment
COMMENT ON COLUMN public.transactions.status IS 'Transaction status: pending (awaiting admin processing), completed (processed with hash), failed (rejected)';
COMMENT ON COLUMN public.transactions.transaction_hash IS 'Blockchain transaction hash - filled by admin after manual processing';
COMMENT ON COLUMN public.transactions.transaction_url IS 'Link to blockchain explorer for this transaction';