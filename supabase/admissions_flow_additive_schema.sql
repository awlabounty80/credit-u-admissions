-- Additive only. Do not modify existing assessment tables.
create table if not exists credit_u_admissions_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  user_id uuid,
  event_name text not null,
  payload jsonb default '{}'::jsonb
);

create table if not exists credit_u_admissions_prizes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  user_id uuid,
  assessment_id uuid,
  prize_id text not null,
  prize_value text not null,
  redeemed boolean not null default false
);

create table if not exists credit_u_acceptance_packets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  user_id uuid,
  assessment_id uuid,
  financial_gpa jsonb default '{}'::jsonb,
  financial_dna text,
  campus_placement text,
  degree_plan jsonb default '{}'::jsonb,
  prize jsonb default '{}'::jsonb,
  admissions_status text default 'accepted'
);

alter table credit_u_admissions_events enable row level security;
alter table credit_u_admissions_prizes enable row level security;
alter table credit_u_acceptance_packets enable row level security;
