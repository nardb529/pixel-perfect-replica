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
create or replace view public.public_seller_profiles as
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
  where id = p_listing_id and status = 'Active';

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
  where id = p_listing_id and status = 'Active';

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
  if not exists (select 1 from public.listings where id = p_listing_id and status = 'Active') then
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
    select
      l.id,
      l.title,
      l.listing_type,
      l.status,
      coalesce((select count(*) from public.listing_views lv where lv.listing_id = l.id and lv.viewed_at >= v_since), 0) as views,
      coalesce((select count(*) from public.contact_clicks cc where cc.listing_id = l.id and cc.clicked_at >= v_since), 0) as clicks,
      coalesce((select count(*) from public.favorites f where f.listing_id = l.id and f.created_at >= v_since), 0) as saves
    from public.listings l
    where l.seller_id = v_uid and l.status <> 'Archived'
    order by (coalesce((select count(*) from public.listing_views lv where lv.listing_id = l.id and lv.viewed_at >= v_since), 0)
      + coalesce((select count(*) from public.contact_clicks cc where cc.listing_id = l.id and cc.clicked_at >= v_since), 0) * 3) desc,
      l.created_at desc
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
