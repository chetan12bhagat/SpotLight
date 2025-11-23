-- UPDATE SCHEMA TO v3 (OnlyFans Complete Build)

-- 1. UPDATE CREATORS TABLE
alter table public.creators 
add column if not exists stripe_account_id text,
add column if not exists kyc_status text default 'pending'; -- pending, approved, rejected

-- 2. UPDATE POSTS TABLE
-- Ensure columns exist (some might already be there from v2)
alter table public.posts
add column if not exists price integer,
add column if not exists scheduled_at timestamp with time zone;

-- 3. NEW TABLES

-- Marketplace Items (Digital Products)
create table if not exists public.marketplace_items (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators(id) not null,
  title text not null,
  description text,
  file_path text not null,
  price integer not null, -- in cents
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Marketplace Orders
create table if not exists public.marketplace_orders (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references public.marketplace_items(id) not null,
  buyer_id uuid references public.users(id) not null,
  stripe_payment_id text,
  amount integer not null,
  status text default 'completed',
  created_at timestamp with time zone default now()
);

-- Analytics Events
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  event_type text not null, -- page_view, post_view, subscription, purchase, etc.
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Reports
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.users(id) not null,
  target_table text not null, -- posts, users, creators, messages
  target_id uuid not null,
  reason text not null,
  status text default 'pending', -- pending, resolved, dismissed
  created_at timestamp with time zone default now()
);

-- 4. ENABLE RLS FOR NEW TABLES
alter table public.marketplace_items enable row level security;
alter table public.marketplace_orders enable row level security;
alter table public.analytics_events enable row level security;
alter table public.reports enable row level security;

-- 5. RLS POLICIES FOR NEW TABLES

-- Marketplace Items
create policy "Public view active items" on public.marketplace_items
  for select using (is_active = true);

create policy "Creators manage own items" on public.marketplace_items
  for all using (
    auth.uid() in (select user_id from public.creators where id = creator_id)
  );

-- Marketplace Orders
create policy "Buyers view own orders" on public.marketplace_orders
  for select using (auth.uid() = buyer_id);

create policy "Creators view sales" on public.marketplace_orders
  for select using (
    auth.uid() in (
      select c.user_id 
      from public.creators c
      join public.marketplace_items i on i.creator_id = c.id
      where i.id = item_id
    )
  );

-- Analytics
create policy "Users insert analytics" on public.analytics_events
  for insert with check (auth.uid() = user_id);

create policy "Admins view analytics" on public.analytics_events
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Reports
create policy "Users create reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

create policy "Admins manage reports" on public.reports
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- 6. STORAGE BUCKETS (New ones)
insert into storage.buckets (id, name, public) values 
  ('marketplace-content', 'marketplace-content', false),
  ('kyc-uploads', 'kyc-uploads', false)
on conflict (id) do nothing;

-- 7. STORAGE POLICIES (New ones)

-- Marketplace Content
create policy "Creators upload marketplace files" on storage.objects
  for insert with check (
    bucket_id = 'marketplace-content' and
    (storage.foldername(name))[1] in (
      select id::text from public.creators where user_id = auth.uid()
    )
  );

create policy "Buyers download purchased items" on storage.objects
  for select using (
    bucket_id = 'marketplace-content'
    -- Logic: User must have purchased the item corresponding to this file
    -- This is complex in RLS, usually handled by signed URLs from Edge Function
    -- So we might keep this policy restrictive or rely on signed URLs.
    -- For now, restrict to creator.
    and (storage.foldername(name))[1] in (
      select id::text from public.creators where user_id = auth.uid()
    )
  );

-- KYC Uploads
create policy "Creators upload KYC" on storage.objects
  for insert with check (
    bucket_id = 'kyc-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admins view KYC" on storage.objects
  for select using (
    bucket_id = 'kyc-uploads' and
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
