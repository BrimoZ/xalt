-- Remove the foreign key constraint that's causing the issue
ALTER TABLE public.tokens DROP CONSTRAINT IF EXISTS tokens_creator_id_fkey;

-- The creator_id field will still store the user ID, just without the foreign key constraint
-- This allows mock authentication to work while still storing creator information