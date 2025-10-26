-- Create profiles table for wallet users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  wallet_address text unique not null,
  username text,
  display_name text,
  avatar_url text,
  bio text,
  total_raised numeric default 0,
  total_donated numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Profiles are viewable by everyone
create policy "Profiles are viewable by everyone"
on public.profiles for select
using (true);

-- Users can update their own profile
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Create tokens/fund pools table
create table public.tokens (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) not null,
  name text not null,
  symbol text not null,
  description text,
  image_url text,
  goal_amount numeric not null,
  current_amount numeric default 0,
  current_price numeric default 0,
  price_change_24h numeric default 0,
  website_url text,
  x_url text,
  telegram_url text,
  discord_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.tokens enable row level security;

-- Tokens are viewable by everyone
create policy "Tokens are viewable by everyone"
on public.tokens for select
using (true);

-- Authenticated users can create tokens
create policy "Authenticated users can create tokens"
on public.tokens for insert
to authenticated
with check (auth.uid() = creator_id);

-- Users can update their own tokens
create policy "Users can update own tokens"
on public.tokens for update
using (auth.uid() = creator_id);

-- Create trigger for updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.handle_updated_at();

create trigger set_updated_at_tokens
before update on public.tokens
for each row execute function public.handle_updated_at();

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, wallet_address, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'wallet_address',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();