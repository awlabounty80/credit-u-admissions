-- Credit U™ Elite Admissions Additive Schema
-- Do not modify existing assessment tables unless your app already has migrations for that.

create table if not exists public.creditu_admissions_events (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  user_id uuid,
  event_name text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.creditu_admissions_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  email text,
  current_stage text default 'campus_landing',
  ceremony_completed boolean default false,
  oath_accepted boolean default false,
  prize_wheel_unlocked boolean default false,
  acceptance_packet_unlocked boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creditu_campus_interactions (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  building_id text not null,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.creditu_admissions_events enable row level security;
alter table public.creditu_admissions_sessions enable row level security;
alter table public.creditu_campus_interactions enable row level security;

-- Example policies. Adjust to match your existing auth model.
create policy if not exists "Allow anonymous insert admissions events"
on public.creditu_admissions_events for insert
to anon, authenticated
with check (true);

create policy if not exists "Allow anonymous insert admissions sessions"
on public.creditu_admissions_sessions for insert
to anon, authenticated
with check (true);

create policy if not exists "Allow anonymous insert campus interactions"
on public.creditu_campus_interactions for insert
to anon, authenticated
with check (true);
