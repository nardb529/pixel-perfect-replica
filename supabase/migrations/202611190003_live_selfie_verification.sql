-- CampusLoop: live-selfie vendor verification (replaces ID-card uploads).
-- Safe to run more than once. Run in Supabase > SQL Editor.
-- Buyers are never affected. Existing verified sellers stay verified.

-- 1. Allow the new document type on profiles.
alter table public.profiles drop constraint if exists chk_profiles_id_document_type;
alter table public.profiles drop constraint if exists profiles_id_document_type_check;
alter table public.profiles
  add constraint chk_profiles_id_document_type
  check (id_document_type is null or id_document_type in ('Student ID', 'Ghana Card', 'Voters ID', 'Live Selfie'));

-- 2. Non-admins may only move to 'pending', and only with a live-selfie submission.
--    Only an admin can ever set 'verified'.
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_valid_submission boolean;
begin
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
      new.id_document_type = 'Live Selfie'
      and nullif(trim(coalesce(new.id_document_path, '')), '') is not null
      and split_part(new.id_document_path, '/', 1) = auth.uid()::text
      and new.verification_photo_confirmed = true;

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

-- 3. Publishing needs a verified, non-suspended seller (a public profile photo is no longer required).
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
        and (p.role = 'admin' or p.verification_status = 'verified')
    )
  );

-- 4. Private selfie bucket: small JPEG/WebP files only (free-plan friendly).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('seller-verifications', 'seller-verifications', false, 512000, array['image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Only the owner or an admin can read a selfie.
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

-- Admins may delete selfies (used when a resubmission is requested).
drop policy if exists "Admins delete seller verification files" on storage.objects;
create policy "Admins delete seller verification files"
  on storage.objects for delete
  using (bucket_id = 'seller-verifications' and public.is_admin());

notify pgrst, 'reload schema';
