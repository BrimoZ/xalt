-- Remove username column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS username;

-- Update the handle_new_user function to not use username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  insert into public.profiles (id, wallet_address, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'wallet_address', ''),
    coalesce(new.raw_user_meta_data->>'display_name', '')
  );
  return new;
end;
$function$;