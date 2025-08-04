-- Create comments table for token discussions
CREATE TABLE public.token_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view comments" ON public.token_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create comments" ON public.token_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own comments" ON public.token_comments FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own comments" ON public.token_comments FOR DELETE USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_token_comments_updated_at
BEFORE UPDATE ON public.token_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();