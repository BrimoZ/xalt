-- Create table for fund pool Q&A
CREATE TABLE public.token_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id uuid NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  answered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_questions ENABLE ROW LEVEL SECURITY;

-- Policies for token_questions
CREATE POLICY "Anyone can view questions"
  ON public.token_questions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can ask questions"
  ON public.token_questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Fund creators can answer questions"
  ON public.token_questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tokens
      WHERE tokens.id = token_questions.token_id
      AND tokens.creator_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_token_questions_token_id ON public.token_questions(token_id);
CREATE INDEX idx_token_questions_user_id ON public.token_questions(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_token_questions_updated_at
  BEFORE UPDATE ON public.token_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();