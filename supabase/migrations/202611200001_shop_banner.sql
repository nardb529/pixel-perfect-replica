-- Allow sellers to set a custom shop banner image or fall back to the default shop banner
alter table public.profiles add column if not exists banner_image text;

-- Append p.banner_image at the end of public_seller_profiles so existing column positions remain compatible
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
  p.created_at,
  p.banner_image
from public.profiles p
where p.is_suspended = false;

grant select on public.public_seller_profiles to anon, authenticated;

notify pgrst, 'reload schema';
