-- Fix Schema Issues

-- 1. Add full_name to users
alter table public.users 
add column if not exists full_name text;

-- 2. Rename caption to content in posts
alter table public.posts 
rename column caption to content;

-- 3. Update handle_new_user trigger to populate full_name
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, email, username, full_name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;
