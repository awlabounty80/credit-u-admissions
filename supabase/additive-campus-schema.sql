-- Credit U™ Living Campus Additive Schema
-- Safe rule: this adds new tables only. Do not modify existing assessment tables.

create table if not exists credit_u_campus_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  payload jsonb default '{}'::jsonb,
  session_id text,
  lead_id uuid,
  created_at timestamptz default now()
);

create table if not exists credit_u_campus_building_visits (
  id uuid primary key default gen_random_uuid(),
  building_id text not null,
  route text not null,
  lead_id uuid,
  session_id text,
  created_at timestamptz default now()
);

create table if not exists credit_u_student_traditions (
  id uuid primary key default gen_random_uuid(),
  tradition_key text not null,
  tradition_name text not null,
  lead_id uuid,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_credit_u_campus_events_event_name on credit_u_campus_events(event_name);
create index if not exists idx_credit_u_campus_events_created_at on credit_u_campus_events(created_at);
