-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) not null,
  username text unique,
  email text,
  role text default 'user',
  age_verified boolean default false,
  created_at timestamp with time zone default now(),
  constraint users_auth_id_key unique(auth_id)
);

-- 2. CREATORS TABLE
create table public.creators (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  bio text,
  profile_image text,
  cover_image text,
  categories text[],
  subscription_price integer,
  created_at timestamp with time zone default now(),
  constraint creators_user_id_key unique(user_id)
);

-- 3. POSTS TABLE
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators(id) not null,
  content_url text,
  caption text,
  content_type text,
  tags text[],
  is_paid boolean default true,
  price integer,
  status text default 'pending',
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 4. SUBSCRIPTIONS TABLE
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  subscriber_id uuid references public.users(id) not null,
  creator_id uuid references public.creators(id) not null,
  stripe_sub_id text,
  status text default 'active',
  started_at timestamp with time zone default now(),
  canceled_at timestamp with time zone
);

-- 5. MESSAGES TABLE
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.users(id) not null,
  receiver_id uuid references public.users(id) not null,
  content text,
  media_url text,
  created_at timestamp with time zone default now()
);

-- 6. STORIES TABLE
create table public.stories (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators(id) not null,
  media_url text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 7. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  type text,
  payload jsonb,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- 8. MODERATION LOGS TABLE
create table public.moderation_logs (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) not null,
  moderator_id uuid references public.users(id),
  action text,
  reason text,
  confidence numeric,
  created_at timestamp with time zone default now()
);

-- ENABLE RLS ON ALL TABLES
alter table public.users enable row level security;
alter table public.creators enable row level security;
alter table public.posts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.messages enable row level security;
alter table public.stories enable row level security;
alter table public.notifications enable row level security;
alter table public.moderation_logs enable row level security;

-- RLS POLICIES

-- Users
create policy "Users can view/update own profile" on public.users
  for all using (auth.uid() = auth_id);
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = auth_id);

-- Creators
create policy "Public view creators" on public.creators
  for select using (true);
create policy "Creators manage own profile" on public.creators
  for all using (auth.uid() = user_id);

-- Posts
create policy "Public view approved posts" on public.posts
  for select using (status = 'approved');
create policy "Creators manage own posts" on public.posts
  for all using (
    auth.uid() in (
      select user_id from public.creators where id = creator_id
    )
  );

-- Subscriptions
create policy "Users view own subscriptions" on public.subscriptions
  for all using (auth.uid() = subscriber_id);

-- Messages
create policy "Users view own messages" on public.messages
  for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );
create policy "Users send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

-- Stories
create policy "View active stories" on public.stories
  for select using (expires_at > now());
create policy "Creators manage stories" on public.stories
  for all using (
    auth.uid() in (
      select user_id from public.creators where id = creator_id
    )
  );

-- Notifications
create policy "Users view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "System insert notifications" on public.notifications
  for insert with check (true);

-- Moderation Logs
create policy "Admins view logs" on public.moderation_logs
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values 
  ('creator-content', 'creator-content', false),
  ('stories-content', 'stories-content', false),
  ('messages-media', 'messages-media', false)
on conflict (id) do nothing;

-- STORAGE POLICIES
-- Creator Content
create policy "Creators upload own content" on storage.objects
  for insert with check (
    bucket_id = 'creator-content' and
    (storage.foldername(name))[1] in (
      select id::text from public.creators where user_id = auth.uid()
    )
  );
  
create policy "View approved content" on storage.objects
  for select using (
    bucket_id = 'creator-content'
    -- Add logic to check if post is approved if needed, 
    -- or rely on signed URLs which bypass RLS for the object itself
  );

-- TRIGGER FOR NEW USERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
