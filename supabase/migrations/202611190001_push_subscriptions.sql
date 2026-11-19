-- CampusLoop Migration: Web Push Subscriptions for offline/closed-app device notifications
-- Creates public.push_subscriptions and restricts access strictly to each user's own rows.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- Upgrade existing installations cleanly if push_subscriptions came from an older schema
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'push_subscriptions'
  ) then
    alter table public.push_subscriptions
      drop constraint if exists push_subscriptions_user_id_fkey;
    alter table public.push_subscriptions
      add constraint push_subscriptions_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;

    alter table public.push_subscriptions
      drop constraint if exists push_subscriptions_user_id_endpoint_key;
  end if;
exception
  when duplicate_object then null;
end $$;

create unique index if not exists idx_push_subscriptions_endpoint
  on public.push_subscriptions (endpoint);

create index if not exists idx_push_subscriptions_user
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users select own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users insert own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users delete own push subscriptions" on public.push_subscriptions;

create policy "Users select own push subscriptions"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users insert own push subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users delete own push subscriptions"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);
