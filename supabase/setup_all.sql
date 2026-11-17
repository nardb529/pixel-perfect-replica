-- CampusLoop Initial PostgreSQL Schema, Search, Analytics & Security Functions
-- Migration: 202611160001_initial_schema.sql

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- 1. Domain Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.account_type_enum as enum ('Product Seller', 'Service Provider', 'Both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_status_enum as enum ('unverified', 'pending', 'verified');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role_enum as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.affiliation_type_enum as enum ('Student', 'Alumni', 'Business', 'Service Provider', 'Other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.category_type_enum as enum ('product', 'service');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.listing_type_enum as enum ('product', 'service');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.price_type_enum as enum ('Fixed', 'Starting from', 'Price range', 'Negotiable', 'Free');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.listing_status_enum as enum ('Draft', 'Active', 'Paused', 'Sold', 'Unavailable', 'Rejected', 'Archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.audience_scope_enum as enum ('single', 'multiple', 'all');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_reason_enum as enum (
    'Scam or suspicious activity',
    'Misleading listing',
    'Inappropriate content',
    'Duplicate listing',
    'Prohibited product or service',
    'Other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status_enum as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type_enum as enum (
    'listing_published',
    'listing_rejected',
    'listing_expiring_soon',
    'listing_approved',
    'account_update',
    'platform_announcement'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Shared Timestamp Trigger Helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Universities
-- ---------------------------------------------------------------------------
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  university_name text not null,
  short_name text not null,
  slug text not null unique,
  logo_url text,
  location text not null default '',
  region text not null default '',
  description text not null default '',
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_universities_active_order
  on public.universities (is_active, display_order, university_name);

-- ---------------------------------------------------------------------------
-- 4. Profiles & User-University Affiliations
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  username text not null unique check (username ~ '^[a-z0-9_.-]{3,32}$'),
  email text not null,
  phone_number text,
  whatsapp_number text,
  preferred_contact_method text not null default 'WhatsApp',
  show_public_contact boolean not null default true,
  profile_image text,
  bio text not null default '',
  account_type public.account_type_enum not null default 'Both',
  primary_university_id uuid references public.universities(id) on delete set null,
  verification_status public.verification_status_enum not null default 'unverified',
  role public.user_role_enum not null default 'user',
  is_suspended boolean not null default false,
  notification_preferences jsonb not null default '{"listing_updates": true, "announcements": true, "enquiries": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_university on public.profiles (primary_university_id);
create index if not exists idx_profiles_role on public.profiles (role) where role = 'admin';
create index if not exists idx_profiles_username_trgm on public.profiles using gin (username gin_trgm_ops);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create table if not exists public.user_universities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete cascade,
  affiliation_type public.affiliation_type_enum not null default 'Student',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, university_id)
);

create index if not exists idx_user_universities_user on public.user_universities (user_id);
create index if not exists idx_user_universities_uni on public.user_universities (university_id);

-- Public profile view: never exposes private email, role, or notification_preferences
create or replace view public.public_seller_profiles
with (security_barrier = true) as
select
  p.id,
  p.full_name,
  p.username,
  p.profile_image,
  p.bio,
  p.account_type,
  p.primary_university_id,
  p.verification_status,
  p.preferred_contact_method,
  case
    when p.show_public_contact then coalesce(nullif(p.whatsapp_number, ''), nullif(p.phone_number, ''))
    else null
  end as public_contact_handle,
  p.is_suspended,
  p.created_at
from public.profiles p
where p.is_suspended = false;

-- ---------------------------------------------------------------------------
-- 5. Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_type public.category_type_enum not null,
  icon text not null default 'tag',
  description text not null default '',
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, category_type)
);

create index if not exists idx_categories_active_type
  on public.categories (category_type, is_active, display_order);

-- ---------------------------------------------------------------------------
-- 6. Core Listings, Images, Details & University Targeting
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  listing_type public.listing_type_enum not null,
  title text not null check (char_length(trim(title)) >= 2),
  slug text not null unique,
  description text not null check (char_length(trim(description)) >= 5),
  category_id uuid not null references public.categories(id) on delete restrict,
  price numeric(12, 2) check (price is null or price >= 0),
  price_type public.price_type_enum not null default 'Fixed',
  currency text not null default 'GHS' check (currency = 'GHS'),
  status public.listing_status_enum not null default 'Active',
  condition text,
  location text not null default '',
  contact_method text not null default 'WhatsApp',
  contact_value text not null check (char_length(trim(contact_value)) >= 3),
  audience_scope public.audience_scope_enum not null default 'single',
  is_featured boolean not null default false,
  featured_until timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  like_count integer not null default 0 check (like_count >= 0),
  favorite_count integer not null default 0 check (favorite_count >= 0),
  contact_click_count integer not null default 0 check (contact_click_count >= 0),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_product_requires_price check (
    listing_type = 'service' or price_type = 'Free' or price is not null
  )
);

create index if not exists idx_listings_browse
  on public.listings (status, listing_type, published_at desc nulls last, created_at desc);
create index if not exists idx_listings_active_featured_pub
  on public.listings (is_featured desc, published_at desc nulls last, created_at desc)
  where status = 'Active';
create index if not exists idx_listings_seller on public.listings (seller_id, status);
create index if not exists idx_listings_category on public.listings (category_id, status);
create index if not exists idx_listings_audience_all on public.listings (audience_scope, status) where audience_scope = 'all';
create index if not exists idx_listings_featured on public.listings (is_featured, published_at desc) where is_featured = true;
create index if not exists idx_listings_fts on public.listings using gin (search_vector);
create index if not exists idx_listings_title_trgm on public.listings using gin (title gin_trgm_ops);

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  storage_path text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_listing_images_listing
  on public.listing_images (listing_id, display_order);

create table if not exists public.product_details (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  condition text not null default 'New',
  brand text,
  stock_status text not null default 'In stock',
  additional_attributes jsonb not null default '{}'::jsonb
);

create table if not exists public.service_details (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  starting_price numeric(12, 2) check (starting_price is null or starting_price >= 0),
  duration text,
  service_area text,
  delivery_method text,
  additional_attributes jsonb not null default '{}'::jsonb
);

create table if not exists public.listing_universities (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, university_id)
);

create index if not exists idx_listing_universities_uni_listing
  on public.listing_universities (university_id, listing_id);

-- ---------------------------------------------------------------------------
-- 7. Favorites, Likes & Engagement Analytics
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create index if not exists idx_favorites_user on public.favorites (user_id, created_at desc);
create index if not exists idx_favorites_listing_created on public.favorites (listing_id, created_at desc);

create table if not exists public.listing_likes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  visitor_session_id text,
  created_at timestamptz not null default now(),
  constraint chk_like_actor check (user_id is not null or visitor_session_id is not null)
);

create unique index if not exists idx_listing_likes_user_unique
  on public.listing_likes (listing_id, user_id) where user_id is not null;
create unique index if not exists idx_listing_likes_session_unique
  on public.listing_likes (listing_id, visitor_session_id) where visitor_session_id is not null;

create table if not exists public.listing_views (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  viewed_at timestamptz not null default now(),
  visitor_session_id text not null,
  source text not null default 'marketplace'
);

create index if not exists idx_listing_views_seller_time
  on public.listing_views (seller_id, viewed_at desc);
create index if not exists idx_listing_views_dedupe
  on public.listing_views (listing_id, visitor_session_id, viewed_at desc);

create table if not exists public.contact_clicks (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  contact_method text not null,
  university_id uuid references public.universities(id) on delete set null,
  clicked_at timestamptz not null default now(),
  visitor_session_id text not null
);

create index if not exists idx_contact_clicks_seller_time
  on public.contact_clicks (seller_id, clicked_at desc);
create index if not exists idx_contact_clicks_dedupe
  on public.contact_clicks (listing_id, visitor_session_id, contact_method, clicked_at desc);

-- ---------------------------------------------------------------------------
-- 8. Reporting, Moderation Logs, Notifications & Monetization Config Prep
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  listing_id uuid references public.listings(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  reason public.report_reason_enum not null,
  description text not null default '',
  status public.report_status_enum not null default 'open',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  moderation_note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reports_status_time on public.reports (status, created_at desc);

create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_moderation_logs_time on public.moderation_logs (created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type public.notification_type_enum not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_unread
  on public.notifications (user_id, is_read, created_at desc);

-- Future promotion / featured slot configuration (ZERO payment/checkout/commissions)
create table if not exists public.promotion_configs (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  name text not null,
  description text not null default '',
  target_scope text not null default 'listing',
  duration_days integer not null check (duration_days > 0),
  suggested_fee_ghs numeric(10, 2) not null default 0 check (suggested_fee_ghs >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_promotion_configs_updated_at on public.promotion_configs;
create trigger trg_promotion_configs_updated_at
  before update on public.promotion_configs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 9. Security Helper & Privilege Protection Triggers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_suspended = false
  );
$$;

create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allow privileged postgres/service_role operations (auth.uid() is null) or verified admins
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.verification_status := old.verification_status;
    new.is_suspended := old.is_suspended;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileged on public.profiles;
create trigger trg_protect_profile_privileged
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

create or replace function public.protect_listing_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.seller_id := auth.uid();
      new.is_featured := false;
      new.featured_until := null;
      if new.status = 'Rejected' then
        new.status := 'Draft';
      end if;
    elsif tg_op = 'UPDATE' then
      new.seller_id := old.seller_id;
      new.is_featured := old.is_featured;
      new.featured_until := old.featured_until;
      new.view_count := old.view_count;
      new.like_count := old.like_count;
      new.favorite_count := old.favorite_count;
      new.contact_click_count := old.contact_click_count;
      if old.status = 'Rejected' and new.status <> 'Archived' then
        new.status := old.status;
      end if;
    end if;
  end if;

  if new.status = 'Active' and new.published_at is null then
    new.published_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_listing_privileged on public.listings;
create trigger trg_protect_listing_privileged
  before insert or update on public.listings
  for each row execute function public.protect_listing_privileged_columns();

-- Automatic profile provisioning when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  uni_id uuid;
  acct_type public.account_type_enum;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'campususer'),
    '[^a-z0-9_.-]+', '', 'g'
  ));
  if char_length(base_username) < 3 then
    base_username := 'campus_' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;

  final_username := left(base_username, 24);
  if exists (select 1 from public.profiles where username = final_username) then
    final_username := left(base_username, 20) || '_' || substr(replace(new.id::text, '-', ''), 1, 5);
  end if;

  begin
    uni_id := nullif(new.raw_user_meta_data->>'primary_university_id', '')::uuid;
  exception when others then
    uni_id := null;
  end;

  if uni_id is null and nullif(new.raw_user_meta_data->>'university_name', '') is not null then
    select id into uni_id
    from public.universities
    where university_name = new.raw_user_meta_data->>'university_name'
       or short_name = new.raw_user_meta_data->>'university_name'
    limit 1;
  end if;

  acct_type := case
    when new.raw_user_meta_data->>'account_type' = 'Product Seller' then 'Product Seller'::public.account_type_enum
    when new.raw_user_meta_data->>'account_type' = 'Service Provider' then 'Service Provider'::public.account_type_enum
    else 'Both'::public.account_type_enum
  end;

  insert into public.profiles (
    id,
    full_name,
    username,
    email,
    phone_number,
    whatsapp_number,
    account_type,
    primary_university_id,
    role
  ) values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(new.email, '@', 1)),
    final_username,
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data->>'phone_number'), ''),
    nullif(trim(new.raw_user_meta_data->>'whatsapp_number'), ''),
    acct_type,
    uni_id,
    'user'
  )
  on conflict (id) do nothing;

  if uni_id is not null then
    insert into public.user_universities (user_id, university_id, affiliation_type, is_primary)
    values (new.id, uni_id, 'Student', true)
    on conflict (user_id, university_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep favorite_count synchronized cleanly
create or replace function public.sync_favorite_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.listings set favorite_count = favorite_count + 1 where id = new.listing_id;
  elsif tg_op = 'DELETE' then
    update public.listings set favorite_count = greatest(0, favorite_count - 1) where id = old.listing_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_favorites_count on public.favorites;
create trigger trg_favorites_count
  after insert or delete on public.favorites
  for each row execute function public.sync_favorite_count();

-- ---------------------------------------------------------------------------
-- 10. Marketplace Search RPC (Indexed, Paginated, Multi-University Targeted)
-- ---------------------------------------------------------------------------
create or replace function public.search_marketplace_listings(
  p_university_filter text default null,
  p_listing_type public.listing_type_enum default null,
  p_category_filter text default null,
  p_search_query text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_featured_only boolean default false,
  p_sort text default 'recent',
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  id uuid,
  seller_id uuid,
  seller_name text,
  seller_username text,
  seller_verification public.verification_status_enum,
  primary_university_name text,
  listing_type public.listing_type_enum,
  title text,
  slug text,
  description text,
  category_id uuid,
  category_name text,
  category_slug text,
  price numeric,
  price_type public.price_type_enum,
  currency text,
  status public.listing_status_enum,
  condition text,
  location text,
  contact_method text,
  contact_value text,
  audience_scope public.audience_scope_enum,
  audience_universities text[],
  images jsonb,
  is_featured boolean,
  view_count integer,
  like_count integer,
  favorite_count integer,
  contact_click_count integer,
  published_at timestamptz,
  created_at timestamptz,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select
      l.id,
      l.seller_id,
      p.full_name as seller_name,
      p.username as seller_username,
      p.verification_status as seller_verification,
      coalesce(pu.short_name, pu.university_name, 'Ghana Campus') as primary_university_name,
      l.listing_type,
      l.title,
      l.slug,
      l.description,
      l.category_id,
      c.name as category_name,
      c.slug as category_slug,
      l.price,
      l.price_type,
      l.currency,
      l.status,
      coalesce(pd.condition, l.condition) as condition,
      l.location,
      l.contact_method,
      l.contact_value,
      l.audience_scope,
      coalesce(
        case
          when l.audience_scope = 'all' then array['All Universities']::text[]
          else (
            select array_agg(coalesce(u2.short_name, u2.university_name) order by u2.display_order, u2.university_name)
            from public.listing_universities lu2
            join public.universities u2 on u2.id = lu2.university_id
            where lu2.listing_id = l.id and u2.is_active = true
          )
        end,
        array[]::text[]
      ) as audience_universities,
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object('id', li.id, 'image_url', li.image_url, 'display_order', li.display_order)
            order by li.display_order asc, li.created_at asc
          )
          from public.listing_images li
          where li.listing_id = l.id
        ),
        '[]'::jsonb
      ) as images,
      l.is_featured,
      l.view_count,
      l.like_count,
      l.favorite_count,
      l.contact_click_count,
      l.published_at,
      l.created_at,
      case
        when nullif(trim(coalesce(p_search_query, '')), '') is not null
          then ts_rank_cd(l.search_vector, websearch_to_tsquery('english', p_search_query))
        else 0
      end as relevance_rank
    from public.listings l
    join public.profiles p on p.id = l.seller_id and p.is_suspended = false
    join public.categories c on c.id = l.category_id and c.is_active = true
    left join public.universities pu on pu.id = p.primary_university_id
    left join public.product_details pd on pd.listing_id = l.id
    where l.status = 'Active'
      and (l.expires_at is null or l.expires_at > now())
      and (p_listing_type is null or l.listing_type = p_listing_type)
      and (not p_featured_only or l.is_featured = true)
      and (p_min_price is null or coalesce(l.price, 0) >= p_min_price)
      and (p_max_price is null or coalesce(l.price, 0) <= p_max_price)
      and (
        nullif(trim(coalesce(p_category_filter, '')), '') is null
        or lower(p_category_filter) = 'all'
        or lower(c.name) = lower(p_category_filter)
        or lower(c.slug) = lower(p_category_filter)
      )
      and (
        nullif(trim(coalesce(p_university_filter, '')), '') is null
        or lower(p_university_filter) = 'all universities'
        or l.audience_scope = 'all'
        or exists (
          select 1
          from public.listing_universities lu
          join public.universities u on u.id = lu.university_id and u.is_active = true
          where lu.listing_id = l.id
            and (
              u.id::text = p_university_filter
              or lower(u.slug) = lower(p_university_filter)
              or lower(u.short_name) = lower(p_university_filter)
              or lower(u.university_name) = lower(p_university_filter)
            )
        )
      )
      and (
        nullif(trim(coalesce(p_search_query, '')), '') is null
        or l.search_vector @@ websearch_to_tsquery('english', p_search_query)
        or l.title ilike ('%' || trim(p_search_query) || '%')
        or l.description ilike ('%' || trim(p_search_query) || '%')
        or c.name ilike ('%' || trim(p_search_query) || '%')
        or p.full_name ilike ('%' || trim(p_search_query) || '%')
        or p.username ilike ('%' || trim(p_search_query) || '%')
      )
  )
  select
    f.id,
    f.seller_id,
    f.seller_name,
    f.seller_username,
    f.seller_verification,
    f.primary_university_name,
    f.listing_type,
    f.title,
    f.slug,
    f.description,
    f.category_id,
    f.category_name,
    f.category_slug,
    f.price,
    f.price_type,
    f.currency,
    f.status,
    f.condition,
    f.location,
    f.contact_method,
    f.contact_value,
    f.audience_scope,
    f.audience_universities,
    f.images,
    f.is_featured,
    f.view_count,
    f.like_count,
    f.favorite_count,
    f.contact_click_count,
    f.published_at,
    f.created_at,
    count(*) over () as total_count
  from filtered f
  order by
    case when p_sort = 'relevant' then f.relevance_rank end desc nulls last,
    case when p_sort = 'price_asc' then coalesce(f.price, 0) end asc,
    case when p_sort = 'price_desc' then coalesce(f.price, 0) end desc,
    case when p_sort = 'popular' then f.view_count end desc,
    f.is_featured desc,
    coalesce(f.published_at, f.created_at) desc
  limit greatest(1, least(coalesce(p_limit, 24), 60))
  offset greatest(0, coalesce(p_offset, 0));
$$;

-- ---------------------------------------------------------------------------
-- 11. Deduplicated View, Contact & Like RPCs + Seller Analytics
-- ---------------------------------------------------------------------------
create or replace function public.record_listing_view(
  p_listing_id uuid,
  p_university_id uuid default null,
  p_visitor_session_id text default '',
  p_source text default 'marketplace'
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller_id uuid;
  v_session text;
  v_already boolean;
begin
  select seller_id into v_seller_id
  from public.listings
  where id = p_listing_id
    and status = 'Active'
    and (expires_at is null or expires_at > now());

  if v_seller_id is null then
    return false;
  end if;

  v_session := coalesce(nullif(trim(p_visitor_session_id), ''), coalesce(auth.uid()::text, 'anon'));

  -- Ignore views from the listing owner
  if auth.uid() is not null and auth.uid() = v_seller_id then
    return false;
  end if;

  -- Deduplicate views within a 15-minute window per visitor session
  select exists (
    select 1 from public.listing_views
    where listing_id = p_listing_id
      and visitor_session_id = v_session
      and viewed_at > now() - interval '15 minutes'
  ) into v_already;

  if v_already then
    return false;
  end if;

  insert into public.listing_views (listing_id, seller_id, university_id, visitor_session_id, source)
  values (p_listing_id, v_seller_id, p_university_id, v_session, coalesce(nullif(p_source, ''), 'marketplace'));

  update public.listings
  set view_count = view_count + 1
  where id = p_listing_id;

  return true;
end;
$$;

create or replace function public.record_contact_click(
  p_listing_id uuid,
  p_contact_method text,
  p_university_id uuid default null,
  p_visitor_session_id text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller_id uuid;
  v_session text;
  v_recent_count integer;
begin
  select seller_id into v_seller_id
  from public.listings
  where id = p_listing_id
    and status = 'Active'
    and (expires_at is null or expires_at > now());

  if v_seller_id is null then
    return false;
  end if;

  v_session := coalesce(nullif(trim(p_visitor_session_id), ''), coalesce(auth.uid()::text, 'anon'));

  -- Rate-limit / dedupe bursts within 60 seconds per visitor/listing/channel
  select count(*) into v_recent_count
  from public.contact_clicks
  where listing_id = p_listing_id
    and visitor_session_id = v_session
    and contact_method = coalesce(nullif(p_contact_method, ''), 'WhatsApp')
    and clicked_at > now() - interval '60 seconds';

  if v_recent_count > 0 then
    return false;
  end if;

  insert into public.contact_clicks (listing_id, seller_id, contact_method, university_id, visitor_session_id)
  values (p_listing_id, v_seller_id, coalesce(nullif(p_contact_method, ''), 'WhatsApp'), p_university_id, v_session);

  update public.listings
  set contact_click_count = contact_click_count + 1
  where id = p_listing_id;

  return true;
end;
$$;

create or replace function public.toggle_listing_like(
  p_listing_id uuid,
  p_visitor_session_id text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_session text := nullif(trim(p_visitor_session_id), '');
  v_deleted integer := 0;
begin
  if not exists (
    select 1 from public.listings
    where id = p_listing_id
      and status = 'Active'
      and (expires_at is null or expires_at > now())
  ) then
    return false;
  end if;

  if v_uid is not null then
    delete from public.listing_likes where listing_id = p_listing_id and user_id = v_uid;
    get diagnostics v_deleted = row_count;
    if v_deleted > 0 then
      update public.listings set like_count = greatest(0, like_count - 1) where id = p_listing_id;
      return false;
    end if;
    insert into public.listing_likes (listing_id, user_id) values (p_listing_id, v_uid);
    update public.listings set like_count = like_count + 1 where id = p_listing_id;
    return true;
  elsif v_session is not null then
    delete from public.listing_likes where listing_id = p_listing_id and visitor_session_id = v_session;
    get diagnostics v_deleted = row_count;
    if v_deleted > 0 then
      update public.listings set like_count = greatest(0, like_count - 1) where id = p_listing_id;
      return false;
    end if;
    insert into public.listing_likes (listing_id, visitor_session_id) values (p_listing_id, v_session);
    update public.listings set like_count = like_count + 1 where id = p_listing_id;
    return true;
  end if;

  return false;
end;
$$;

create or replace function public.get_seller_analytics(p_range text default 'all')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_since timestamptz;
  v_views bigint;
  v_clicks bigint;
  v_saves bigint;
  v_active bigint;
  v_top jsonb;
  v_recent jsonb;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  v_since := case p_range
    when 'today' then date_trunc('day', now())
    when '7d' then now() - interval '7 days'
    when '30d' then now() - interval '30 days'
    else '1970-01-01'::timestamptz
  end;

  select count(*) into v_views
  from public.listing_views
  where seller_id = v_uid and viewed_at >= v_since;

  select count(*) into v_clicks
  from public.contact_clicks
  where seller_id = v_uid and clicked_at >= v_since;

  select count(*) into v_saves
  from public.favorites f
  join public.listings l on l.id = f.listing_id
  where l.seller_id = v_uid and f.created_at >= v_since;

  select count(*) into v_active
  from public.listings
  where seller_id = v_uid and status = 'Active';

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) into v_top
  from (
    with seller_listings as (
      select id, title, listing_type, status, created_at
      from public.listings
      where seller_id = v_uid and status <> 'Archived'
    ),
    view_counts as (
      select listing_id, count(*) as cnt
      from public.listing_views
      where seller_id = v_uid and viewed_at >= v_since
      group by listing_id
    ),
    click_counts as (
      select listing_id, count(*) as cnt
      from public.contact_clicks
      where seller_id = v_uid and clicked_at >= v_since
      group by listing_id
    ),
    save_counts as (
      select f.listing_id, count(*) as cnt
      from public.favorites f
      join seller_listings sl on sl.id = f.listing_id
      where f.created_at >= v_since
      group by f.listing_id
    )
    select
      sl.id,
      sl.title,
      sl.listing_type,
      sl.status,
      coalesce(vc.cnt, 0) as views,
      coalesce(cc.cnt, 0) as clicks,
      coalesce(sc.cnt, 0) as saves
    from seller_listings sl
    left join view_counts vc on vc.listing_id = sl.id
    left join click_counts cc on cc.listing_id = sl.id
    left join save_counts sc on sc.listing_id = sl.id
    order by (coalesce(vc.cnt, 0) + coalesce(cc.cnt, 0) * 3) desc, sl.created_at desc
    limit 5
  ) t;

  select coalesce(jsonb_agg(row_to_json(a)), '[]'::jsonb) into v_recent
  from (
    select id, listing_id, kind, text, occurred_at
    from (
      select
        lv.id,
        lv.listing_id,
        'view'::text as kind,
        ('Someone viewed “' || l.title || '”') as text,
        lv.viewed_at as occurred_at
      from public.listing_views lv
      join public.listings l on l.id = lv.listing_id
      where lv.seller_id = v_uid and lv.viewed_at >= v_since
      union all
      select
        cc.id,
        cc.listing_id,
        'contact'::text as kind,
        ('Someone clicked ' || cc.contact_method || ' on “' || l.title || '”') as text,
        cc.clicked_at as occurred_at
      from public.contact_clicks cc
      join public.listings l on l.id = cc.listing_id
      where cc.seller_id = v_uid and cc.clicked_at >= v_since
    ) events
    order by occurred_at desc
    limit 15
  ) a;

  return jsonb_build_object(
    'range', p_range,
    'active_listings', v_active,
    'total_views', v_views,
    'contact_clicks', v_clicks,
    'saved_listings', v_saves,
    'top_listings', v_top,
    'recent_activity', v_recent
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Admin Summary & Moderation RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_admin_dashboard_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sellers bigint;
  v_active bigint;
  v_products bigint;
  v_services bigint;
  v_open_reports bigint;
  v_suspended bigint;
  v_total_clicks bigint;
  v_uni_dist jsonb;
begin
  if not public.is_admin() then
    raise exception 'Administrator privileges required';
  end if;

  select count(*) into v_sellers from public.profiles;
  select count(*) into v_active from public.listings where status = 'Active';
  select count(*) into v_products from public.listings where status = 'Active' and listing_type = 'product';
  select count(*) into v_services from public.listings where status = 'Active' and listing_type = 'service';
  select count(*) into v_open_reports from public.reports where status in ('open', 'reviewing');
  select count(*) into v_suspended from public.profiles where is_suspended = true;
  select count(*) into v_total_clicks from public.contact_clicks;

  select coalesce(jsonb_agg(row_to_json(d)), '[]'::jsonb) into v_uni_dist
  from (
    select
      u.id,
      u.short_name,
      u.university_name,
      count(distinct lu.listing_id) as targeted_listings
    from public.universities u
    left join public.listing_universities lu on lu.university_id = u.id
    where u.is_active = true
    group by u.id, u.short_name, u.university_name
    order by targeted_listings desc, u.display_order asc
  ) d;

  return jsonb_build_object(
    'total_sellers', v_sellers,
    'active_listings', v_active,
    'total_products', v_products,
    'total_services', v_services,
    'open_reports', v_open_reports,
    'suspended_accounts', v_suspended,
    'total_contact_clicks', v_total_clicks,
    'university_distribution', v_uni_dist
  );
end;
$$;

create or replace function public.admin_moderate_listing(
  p_listing_id uuid,
  p_next_status public.listing_status_enum,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing record;
begin
  if not public.is_admin() then
    raise exception 'Administrator privileges required';
  end if;

  select id, seller_id, title into v_listing
  from public.listings where id = p_listing_id;

  if v_listing.id is null then
    raise exception 'Listing not found';
  end if;

  update public.listings
  set status = p_next_status
  where id = p_listing_id;

  insert into public.moderation_logs (admin_id, action, target_type, target_id, notes)
  values (auth.uid(), 'listing_status_' || lower(p_next_status::text), 'listing', p_listing_id, p_note);

  insert into public.notifications (user_id, title, message, notification_type)
  values (
    v_listing.seller_id,
    case when p_next_status = 'Active' then 'Listing restored' else 'Listing status updated' end,
    format('“%s” is now %s.%s', v_listing.title, p_next_status::text,
      case when p_note is not null and p_note <> '' then ' Note: ' || p_note else '' end),
    case when p_next_status = 'Rejected' then 'listing_rejected'::public.notification_type_enum
         else 'listing_approved'::public.notification_type_enum end
  );
end;
$$;

create or replace function public.admin_toggle_user_suspension(
  p_user_id uuid,
  p_suspended boolean,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator privileges required';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'Admins cannot suspend their own account';
  end if;

  update public.profiles
  set is_suspended = p_suspended
  where id = p_user_id;

  if p_suspended then
    update public.listings
    set status = 'Paused'
    where seller_id = p_user_id and status = 'Active';
  end if;

  insert into public.moderation_logs (admin_id, action, target_type, target_id, notes)
  values (
    auth.uid(),
    case when p_suspended then 'suspend_user' else 'restore_user' end,
    'profile',
    p_user_id,
    p_note
  );

  insert into public.notifications (user_id, title, message, notification_type)
  values (
    p_user_id,
    case when p_suspended then 'Account suspended' else 'Account restored' end,
    case when p_suspended then 'Your seller account was paused pending review.' else 'Your seller account has been restored.' end,
    'account_update'
  );
end;
$$;
-- CampusLoop Row Level Security Policies & Storage Buckets
-- Migration: 202611160002_rls_and_storage.sql

-- ---------------------------------------------------------------------------
-- 1. Enable RLS Across Every Table
-- ---------------------------------------------------------------------------
alter table public.universities enable row level security;
alter table public.profiles enable row level security;
alter table public.user_universities enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.product_details enable row level security;
alter table public.service_details enable row level security;
alter table public.listing_universities enable row level security;
alter table public.favorites enable row level security;
alter table public.listing_likes enable row level security;
alter table public.listing_views enable row level security;
alter table public.contact_clicks enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.promotion_configs enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Universities & Categories (Public Read Active; Admin Manage All)
-- ---------------------------------------------------------------------------
drop policy if exists "Public can read active universities" on public.universities;
create policy "Public can read active universities"
  on public.universities for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage universities" on public.universities;
create policy "Admins manage universities"
  on public.universities for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
  on public.categories for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Profiles & User Universities (Private Data Never Exposed to Public)
-- ---------------------------------------------------------------------------
-- Public users must use public_seller_profiles view; direct SELECT on profiles is owner or admin only.
drop policy if exists "Owners and admins view full profile" on public.profiles;
create policy "Owners and admins view full profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id and role = 'user');

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

grant select on public.public_seller_profiles to anon, authenticated;

drop policy if exists "Public read seller university affiliations" on public.user_universities;
drop policy if exists "Owners and admins view user university affiliations" on public.user_universities;
create policy "Owners and admins view user university affiliations"
  on public.user_universities for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users manage own university affiliations" on public.user_universities;
create policy "Users manage own university affiliations"
  on public.user_universities for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own university affiliations" on public.user_universities;
create policy "Users update own university affiliations"
  on public.user_universities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own university affiliations" on public.user_universities;
create policy "Users delete own university affiliations"
  on public.user_universities for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Listings, Images, Details & University Targeting
-- ---------------------------------------------------------------------------
drop policy if exists "Public views active listings; sellers view own; admins view all" on public.listings;
create policy "Public views active listings; sellers view own; admins view all"
  on public.listings for select
  using (
    (
      status = 'Active'
      and (expires_at is null or expires_at > now())
      and exists (
        select 1 from public.profiles p
        where p.id = seller_id and p.is_suspended = false
      )
    )
    or auth.uid() = seller_id
    or public.is_admin()
  );

drop policy if exists "Authenticated non-suspended sellers insert own listings" on public.listings;
create policy "Authenticated non-suspended sellers insert own listings"
  on public.listings for insert
  with check (
    auth.uid() is not null
    and auth.uid() = seller_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_suspended = false
    )
  );

drop policy if exists "Sellers update own listings; admins moderate" on public.listings;
create policy "Sellers update own listings; admins moderate"
  on public.listings for update
  using (auth.uid() = seller_id or public.is_admin())
  with check (
    public.is_admin()
    or (
      auth.uid() = seller_id
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_suspended = false
      )
    )
  );

drop policy if exists "Sellers delete own listings; admins delete" on public.listings;
create policy "Sellers delete own listings; admins delete"
  on public.listings for delete
  using (auth.uid() = seller_id or public.is_admin());

-- Listing Images
drop policy if exists "Read images of visible listings" on public.listing_images;
create policy "Read images of visible listings"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          (
            l.status = 'Active'
            and (l.expires_at is null or l.expires_at > now())
            and exists (select 1 from public.profiles p where p.id = l.seller_id and p.is_suspended = false)
          )
          or l.seller_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "Sellers manage images on own listings" on public.listing_images;
create policy "Sellers manage images on own listings"
  on public.listing_images for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  );

-- Product Details
drop policy if exists "Read product_details of visible listings" on public.product_details;
create policy "Read product_details of visible listings"
  on public.product_details for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          (
            l.status = 'Active'
            and (l.expires_at is null or l.expires_at > now())
            and exists (select 1 from public.profiles p where p.id = l.seller_id and p.is_suspended = false)
          )
          or l.seller_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "Sellers manage product_details on own listings" on public.product_details;
create policy "Sellers manage product_details on own listings"
  on public.product_details for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  );

-- Service Details
drop policy if exists "Read service_details of visible listings" on public.service_details;
create policy "Read service_details of visible listings"
  on public.service_details for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          (
            l.status = 'Active'
            and (l.expires_at is null or l.expires_at > now())
            and exists (select 1 from public.profiles p where p.id = l.seller_id and p.is_suspended = false)
          )
          or l.seller_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "Sellers manage service_details on own listings" on public.service_details;
create policy "Sellers manage service_details on own listings"
  on public.service_details for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  );

-- Listing Universities
drop policy if exists "Read listing_universities of visible listings" on public.listing_universities;
create policy "Read listing_universities of visible listings"
  on public.listing_universities for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          (
            l.status = 'Active'
            and (l.expires_at is null or l.expires_at > now())
            and exists (select 1 from public.profiles p where p.id = l.seller_id and p.is_suspended = false)
          )
          or l.seller_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "Sellers manage university targets on own listings" on public.listing_universities;
create policy "Sellers manage university targets on own listings"
  on public.listing_universities for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          public.is_admin()
          or (l.seller_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended = false))
        )
    )
  );

-- ---------------------------------------------------------------------------
-- 5. Favorites, Analytics, Reports, Moderation, Notifications, Promotions
-- ---------------------------------------------------------------------------
drop policy if exists "Users manage own favorites" on public.favorites;
create policy "Users manage own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Likes: inserts/deletes flow via toggle_listing_like RPC; allow user read of own likes
drop policy if exists "Users view own likes" on public.listing_likes;
create policy "Users view own likes"
  on public.listing_likes for select
  using (auth.uid() = user_id);

-- Views & Contact Clicks: sellers read aggregate/own counts, admins read all; inserts via deduplicated RPC only
drop policy if exists "Sellers read own listing views; admins read all" on public.listing_views;
create policy "Sellers read own listing views; admins read all"
  on public.listing_views for select
  using (auth.uid() = seller_id or public.is_admin());

drop policy if exists "Sellers read own contact clicks; admins read all" on public.contact_clicks;
create policy "Sellers read own contact clicks; admins read all"
  on public.contact_clicks for select
  using (auth.uid() = seller_id or public.is_admin());

-- Reports: anyone (including anonymous buyer) can submit against active listings; only admins can view/update
drop policy if exists "Anyone can submit a listing report" on public.reports;
create policy "Anyone can submit a listing report"
  on public.reports for insert
  with check (
    (reporter_id is null or reporter_id = auth.uid())
    and listing_id is not null
    and char_length(coalesce(description, '')) <= 1500
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'Active'
    )
  );

drop policy if exists "Admins view and manage reports" on public.reports;
create policy "Admins view and manage reports"
  on public.reports for select
  using (public.is_admin());

drop policy if exists "Admins update reports" on public.reports;
create policy "Admins update reports"
  on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());

-- Moderation Logs
drop policy if exists "Admins manage moderation logs" on public.moderation_logs;
create policy "Admins manage moderation logs"
  on public.moderation_logs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Notifications
drop policy if exists "Users view and mark own notifications" on public.notifications;
create policy "Users view and mark own notifications"
  on public.notifications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users update own notification read status" on public.notifications;
create policy "Users update own notification read status"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins send notifications" on public.notifications;
create policy "Admins send notifications"
  on public.notifications for insert
  with check (public.is_admin());

-- Promotion Configs
drop policy if exists "Public views active promotion configs" on public.promotion_configs;
create policy "Public views active promotion configs"
  on public.promotion_configs for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage promotion configs" on public.promotion_configs;
create policy "Admins manage promotion configs"
  on public.promotion_configs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Function execution permissions
grant execute on function public.search_marketplace_listings(text, public.listing_type_enum, text, text, numeric, numeric, boolean, text, integer, integer) to anon, authenticated;
grant execute on function public.record_listing_view(uuid, uuid, text, text) to anon, authenticated;
grant execute on function public.record_contact_click(uuid, text, uuid, text) to anon, authenticated;
grant execute on function public.toggle_listing_like(uuid, text) to anon, authenticated;
grant execute on function public.get_seller_analytics(text) to authenticated;
grant execute on function public.get_admin_dashboard_summary() to authenticated;
grant execute on function public.admin_moderate_listing(uuid, public.listing_status_enum, text) to authenticated;
grant execute on function public.admin_toggle_user_suspension(uuid, boolean, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Storage Buckets & Object Security Policies
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-images', 'profile-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('university-logos', 'university-logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access for marketplace/profile/university images
drop policy if exists "Public read CampusLoop media buckets" on storage.objects;
create policy "Public read CampusLoop media buckets"
  on storage.objects for select
  using (bucket_id in ('profile-images', 'listing-images', 'university-logos'));

-- Sellers upload/update/delete only inside their own {auth.uid()}/ folder
drop policy if exists "Users upload own profile or listing images" on storage.objects;
create policy "Users upload own profile or listing images"
  on storage.objects for insert
  with check (
    auth.uid() is not null
    and bucket_id in ('profile-images', 'listing-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own profile or listing images" on storage.objects;
create policy "Users update own profile or listing images"
  on storage.objects for update
  using (
    auth.uid() is not null
    and bucket_id in ('profile-images', 'listing-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own profile or listing images" on storage.objects;
create policy "Users delete own profile or listing images"
  on storage.objects for delete
  using (
    (auth.uid() is not null
      and bucket_id in ('profile-images', 'listing-images')
      and (storage.foldername(name))[1] = auth.uid()::text)
    or public.is_admin()
  );

-- University logos: Admin only write/update/delete
drop policy if exists "Admins manage university logos" on storage.objects;
create policy "Admins manage university logos"
  on storage.objects for all
  using (bucket_id = 'university-logos' and public.is_admin())
  with check (bucket_id = 'university-logos' and public.is_admin());

notify pgrst, 'reload schema';
-- CampusLoop Seed Data: Ghanaian Universities, Categories & Initial Promotion Configs
-- Migration: 202611160003_seed_universities_categories.sql

insert into public.universities (university_name, short_name, slug, location, region, description, display_order, is_active)
values
  ('Kwame Nkrumah University of Science and Technology', 'KNUST', 'knust', 'Kumasi', 'Ashanti', 'Premier science and technology university community in Kumasi.', 1, true),
  ('University of Ghana', 'University of Ghana', 'ug-legon', 'Legon, Accra', 'Greater Accra', 'Ghana’s oldest public university campus at Legon and Korle-Bu.', 2, true),
  ('University of Cape Coast', 'University of Cape Coast', 'ucc', 'Cape Coast', 'Central', 'Coastal university hub serving student communities in Cape Coast.', 3, true),
  ('University of Professional Studies, Accra', 'UPSA', 'upsa', 'Madina, Accra', 'Greater Accra', 'Business and professional studies campus in Madina, Accra.', 4, true),
  ('University of Education, Winneba', 'UEW', 'uew', 'Winneba', 'Central', 'Teacher education and multi-campus community in Winneba.', 5, true),
  ('University for Development Studies', 'UDS', 'uds', 'Tamale / Nyankpala', 'Northern', 'Development-oriented multi-campus network across Northern Ghana.', 6, true),
  ('University of Mines and Technology', 'UMaT', 'umat', 'Tarkwa', 'Western', 'Engineering and mining campus community in Tarkwa.', 7, true),
  ('University of Energy and Natural Resources', 'UENR', 'uenr', 'Sunyani', 'Bono', 'Energy, science and natural resources university in Sunyani.', 8, true),
  ('Ghana Communication Technology University', 'GCTU', 'gctu', 'Tesano, Accra', 'Greater Accra', 'ICT and telecommunications campus in Tesano, Accra.', 9, true),
  ('University of Health and Allied Sciences', 'UHAS', 'uhas', 'Ho', 'Volta', 'Health sciences university community in Ho and Hohoe.', 10, true),
  ('University of Environment and Sustainable Development', 'UESD', 'uesd', 'Somanya', 'Eastern', 'Sustainability and environmental studies campus in Somanya.', 11, true),
  ('Ghana Institute of Management and Public Administration', 'GIMPA', 'gimpa', 'Greenhill, Accra', 'Greater Accra', 'Management, governance and law university at Greenhill.', 12, true),
  ('Accra Technical University', 'ATU', 'atu', 'Tudu, Accra', 'Greater Accra', 'Applied science, engineering and business campus in central Accra.', 13, true),
  ('Kumasi Technical University', 'KsTU', 'kstu', 'Kumasi', 'Ashanti', 'Technical and vocational innovation hub in Kumasi.', 14, true),
  ('Takoradi Technical University', 'TTU', 'ttu', 'Takoradi', 'Western', 'Applied engineering, art and design university in Sekondi-Takoradi.', 15, true),
  ('Other Accredited Institutions', 'Other institutions', 'other-institutions', 'Nationwide', 'Ghana', 'Accredited colleges, polytechnics and private university campuses across Ghana.', 99, true)
on conflict (slug) do update set
  university_name = excluded.university_name,
  short_name = excluded.short_name,
  location = excluded.location,
  region = excluded.region,
  display_order = excluded.display_order;

-- Product Categories
insert into public.categories (name, slug, category_type, icon, description, display_order, is_active)
values
  ('Electronics', 'electronics', 'product', 'smartphone', 'Laptops, phones, headphones, chargers and campus tech.', 1, true),
  ('Fashion', 'fashion', 'product', 'shopping-bag', 'Sneakers, apparel, campus merch and footwear.', 2, true),
  ('Books & Academics', 'books-and-academics', 'product', 'graduation-cap', 'Textbooks, lab manuals, past questions and calculators.', 3, true),
  ('Food & Groceries', 'food-and-groceries', 'product', 'coffee', 'Prepared meals, snacks, provisions and hostel groceries.', 4, true),
  ('Beauty', 'beauty', 'product', 'sparkles', 'Skincare, hair products, fragrances and personal care.', 5, true),
  ('Hostel Essentials', 'hostel-essentials', 'product', 'sofa', 'Kettles, lamps, fans, bedding and room organizers.', 6, true),
  ('Sports', 'sports', 'product', 'dumbbell', 'Jerseys, boots, fitness accessories and campus sports gear.', 7, true),
  ('Accessories', 'accessories', 'product', 'watch', 'Bags, watches, laptop sleeves, glasses and everyday carry.', 8, true),
  ('Home and Living', 'home-and-living', 'product', 'home', 'Decor, cookware, storage boxes and apartment essentials.', 9, true),
  ('Others', 'product-others', 'product', 'layout-grid', 'Additional campus products and student finds.', 99, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order;

-- Service Categories
insert into public.categories (name, slug, category_type, icon, description, display_order, is_active)
values
  ('Graphic Design', 'graphic-design', 'service', 'palette', 'Flyers, branding, slide decks and social media creatives.', 1, true),
  ('Photography', 'photography', 'service', 'camera', 'Portraits, graduation shoots, events and media coverage.', 2, true),
  ('Hair & Beauty', 'hair-and-beauty', 'service', 'scissors', 'Braiding, barbering, makeup and nail care around hostels.', 3, true),
  ('Technology & Repairs', 'technology-and-repairs', 'service', 'cpu', 'Laptop diagnostics, phone screen repairs and OS setup.', 4, true),
  ('Tutoring', 'tutoring', 'service', 'book-open', 'One-on-one coaching, course revision and coding help.', 5, true),
  ('Laundry', 'laundry', 'service', 'shirt', 'Hostel pickup, wash, press and folded laundry service.', 6, true),
  ('Printing', 'printing', 'service', 'printer', 'Assignment printing, binding and project hardcover binding.', 7, true),
  ('Food Services', 'food-services', 'service', 'utensils', 'Catering, meal prep and event refreshment boxes.', 8, true),
  ('Transport', 'transport', 'service', 'car', 'Campus errands, luggage moving and shuttle rides.', 9, true),
  ('Cleaning', 'cleaning', 'service', 'spray-can', 'Hostel room deep cleaning and move-in prep.', 10, true),
  ('Events', 'events', 'service', 'calendar', 'MCing, DJing, decor setup and hall week planning.', 11, true),
  ('Others', 'service-others', 'service', 'briefcase', 'Other student-led and campus community services.', 99, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order;

-- Future Monetization Slots Prep (Disabled by default, zero payment gateways)
insert into public.promotion_configs (plan_key, name, description, target_scope, duration_days, suggested_fee_ghs, is_active)
values
  ('featured-listing-7d', 'Featured Campus Listing (7 days)', 'Highlight an approved product or service at the top of campus feeds.', 'listing', 7, 25.00, false),
  ('promoted-service-14d', 'Promoted Campus Service (14 days)', 'Boost visibility for student service providers across targeted universities.', 'service', 14, 40.00, false),
  ('campus-spotlight-30d', 'University Spotlight Slot (30 days)', 'Future sponsored campus announcement slot managed by administrators.', 'banner', 30, 150.00, false)
on conflict (plan_key) do nothing;

notify pgrst, 'reload schema';
