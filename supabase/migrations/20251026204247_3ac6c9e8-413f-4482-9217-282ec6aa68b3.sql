-- Drop existing foreign keys if they exist
ALTER TABLE token_questions
DROP CONSTRAINT IF EXISTS token_questions_user_id_fkey;

ALTER TABLE token_donations
DROP CONSTRAINT IF EXISTS token_donations_user_id_fkey;

-- Recreate foreign key relationships with proper naming
ALTER TABLE token_questions
ADD CONSTRAINT token_questions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

ALTER TABLE token_donations
ADD CONSTRAINT token_donations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;