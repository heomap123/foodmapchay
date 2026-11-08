create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  bio text default 'Xin chào, mình là thành viên LocaFood.',
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create table if not exists public.user_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id text not null,
  place_name text,
  place_image text,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_follows enable row level security;
alter table public.user_favorites enable row level security;

create policy "Users can view all profiles"
on public.profiles
for select
using (true);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can view follows"
on public.user_follows
for select
using (true);

create policy "Users can insert own follows"
on public.user_follows
for insert
with check (auth.uid() = follower_id);

create policy "Users can delete own follows"
on public.user_follows
for delete
using (auth.uid() = follower_id);

create policy "Users can view favorites"
on public.user_favorites
for select
using (true);

create policy "Users can insert own favorite"
on public.user_favorites
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own favorite"
on public.user_favorites
for delete
using (auth.uid() = user_id);
