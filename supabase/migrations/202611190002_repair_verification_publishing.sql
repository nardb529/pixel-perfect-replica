-- CampusLoop repair: seller verification + publishing + image uploads.
-- Safe to run more than once. Run in Supabase > SQL Editor.

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
declare
  v_valid_submission boolean;
begin
  -- Allow privileged postgres/service_role operations (auth.uid() is null) or verified admins
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.is_suspended := old.is_suspended;
    new.verification_note := old.verification_note;
    new.subscription_tier := old.subscription_tier;
    new.subscription_status := old.subscription_status;
    new.subscription_expires_at := old.subscription_expires_at;
    new.paystack_customer_code := old.paystack_customer_code;
    new.paystack_reference := old.paystack_reference;

    v_valid_submission :=
      nullif(trim(coalesce(new.profile_image, '')), '') is not null
      and nullif(trim(coalesce(new.id_document_path, '')), '') is not null
      and new.verification_photo_confirmed = true
      and (
        (new.is_student = true and new.id_document_type = 'Student ID')
        or (new.is_student = false and new.id_document_type in ('Ghana Card', 'Voters ID'))
      );

    -- Non-admins may only transition to 'pending' with a valid Student ID or Ghana Card / Voter's ID + profile photo
    if new.verification_status = 'pending' and v_valid_submission then
      new.verification_status := 'pending';
      new.verification_submitted_at := coalesce(new.verification_submitted_at, now());
      new.verification_note := null;
    else
      new.verification_status := old.verification_status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileged on public.profiles;
create trigger trg_protect_profile_privileged
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

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


drop policy if exists "Authenticated non-suspended sellers insert own listings" on public.listings;
drop policy if exists "Verified non-suspended sellers insert own listings" on public.listings;
create policy "Verified non-suspended sellers insert own listings"
  on public.listings for insert
  with check (
    auth.uid() is not null
    and auth.uid() = seller_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_suspended = false
        and (
          p.role = 'admin'
          or (
            p.verification_status = 'verified'
            and nullif(trim(coalesce(p.profile_image, '')), '') is not null
          )
        )
    )
  );


insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-images', 'profile-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('university-logos', 'university-logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('seller-verifications', 'seller-verifications', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access for marketplace/profile/university images (NEVER seller-verifications)
drop policy if exists "Public read CampusLoop media buckets" on storage.objects;
create policy "Public read CampusLoop media buckets"
  on storage.objects for select
  using (bucket_id in ('profile-images', 'listing-images', 'university-logos'));

-- Strictly private ID verification documents: readable ONLY by the document owner or platform admins
drop policy if exists "Owners and admins view seller verification documents" on storage.objects;
create policy "Owners and admins view seller verification documents"
  on storage.objects for select
  using (
    bucket_id = 'seller-verifications'
    and (
      public.is_admin()
      or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

-- Sellers upload/update/delete only inside their own {auth.uid()}/ folder
drop policy if exists "Users upload own profile or listing images" on storage.objects;
create policy "Users upload own profile or listing images"
  on storage.objects for insert
  with check (
    auth.uid() is not null
    and bucket_id in ('profile-images', 'listing-images', 'seller-verifications')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own profile or listing images" on storage.objects;
create policy "Users update own profile or listing images"
  on storage.objects for update
  using (
    auth.uid() is not null
    and bucket_id in ('profile-images', 'listing-images', 'seller-verifications')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own profile or listing images" on storage.objects;
create policy "Users delete own profile or listing images"
  on storage.objects for delete
  using (
    (auth.uid() is not null
      and bucket_id in ('profile-images', 'listing-images', 'seller-verifications')
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
