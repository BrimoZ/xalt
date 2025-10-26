-- Fix function search path security issue
-- Recreate the function with proper security settings
drop function if exists public.handle_new_user cascade;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, wallet_address, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'wallet_address', ''),
    coalesce(new.raw_user_meta_data->>'username', ''),
    coalesce(new.raw_user_meta_data->>'display_name', '')
  );
  return new;
end;
$$;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();