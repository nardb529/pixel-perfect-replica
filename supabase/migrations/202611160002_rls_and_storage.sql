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
create policy "Public read seller university affiliations"
  on public.user_universities for select
  using (true);

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
    (status = 'Active' and (expires_at is null or expires_at > now()))
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
  with check (auth.uid() = seller_id or public.is_admin());

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
        and (l.status = 'Active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Sellers manage images on own listings" on public.listing_images;
create policy "Sellers manage images on own listings"
  on public.listing_images for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
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
        and (l.status = 'Active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Sellers manage product_details on own listings" on public.product_details;
create policy "Sellers manage product_details on own listings"
  on public.product_details for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
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
        and (l.status = 'Active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Sellers manage service_details on own listings" on public.service_details;
create policy "Sellers manage service_details on own listings"
  on public.service_details for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
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
        and (l.status = 'Active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Sellers manage university targets on own listings" on public.listing_universities;
create policy "Sellers manage university targets on own listings"
  on public.listing_universities for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.seller_id = auth.uid() or public.is_admin())
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

-- Reports: anyone (including anonymous buyer) can submit; only admins can view/update
drop policy if exists "Anyone can submit a listing report" on public.reports;
create policy "Anyone can submit a listing report"
  on public.reports for insert
  with check (
    (reporter_id is null or reporter_id = auth.uid())
    and listing_id is not null
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
