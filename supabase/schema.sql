-- ============================================================
-- Goodfill Care — Samui Wellness platform
-- Supabase (PostgreSQL) schema
--
-- Run this in the Supabase SQL editor (or psql) once.
-- Designed with PDPA in mind:
--   * data minimisation — only fields the flow actually needs
--   * explicit consent columns with timestamps on every table
--     that stores personal data
--   * soft-delete / anonymisation support for "right to erasure"
--   * Row Level Security enabled on all tables; service role only
--     by default (the Next.js server uses the service role key)
-- ============================================================

-- ------------------------------------------------------------
-- 1) Assessments — the "Island Journey" quiz results
--    id is the public reference (e.g. 'SW-7F3K2A') guests share
--    for family packages.
-- ------------------------------------------------------------
create table if not exists public.assessments (
  id            text primary key,
  locale        text not null default 'th' check (locale in ('th', 'en')),

  -- raw answers as submitted (question id -> value)
  answers       jsonb not null,
  mbti          text,
  note          text,

  -- full LLM-evaluated result (WellnessProfile JSON):
  -- stress / migraine / mental scores, traits, archetype, goals
  result        jsonb not null,

  -- PDPA
  consent       boolean not null default false,
  consent_at    timestamptz,
  anonymized_at timestamptz,          -- set when guest exercises erasure

  created_at    timestamptz not null default now()
);

comment on table public.assessments is
  'Gamified wellness assessment submissions and their AI-evaluated profiles. Public id is shared by guests for family bookings.';

create index if not exists assessments_created_at_idx
  on public.assessments (created_at desc);

-- ------------------------------------------------------------
-- 2) Customers — created at registration during booking
-- ------------------------------------------------------------
create table if not exists public.customers (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  phone           text not null,
  email           text not null,

  -- PDPA
  consent         boolean not null default false,
  consent_at      timestamptz,
  anonymized_at   timestamptz,

  created_at      timestamptz not null default now()
);

create unique index if not exists customers_email_idx
  on public.customers (lower(email));

-- ------------------------------------------------------------
-- 3) Bookings — one row per package booking
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id                 text primary key,            -- e.g. 'BK-9D4QXW'
  package_id         text not null,               -- references mock catalog (src/data/packages.ts)

  -- denormalised customer snapshot (kept even if customer row is
  -- later anonymised — itself anonymised on erasure request)
  first_name         text not null,
  last_name          text not null,
  phone              text not null,
  email              text not null,
  customer_id        uuid references public.customers (id),

  -- link to the guest's assessment (optional)
  assessment_id      text references public.assessments (id),

  -- family booking
  is_family          boolean not null default false,
  family_size        integer check (family_size is null or family_size between 2 and 12),
  family_members     jsonb,                       -- [{ assessmentId, label }]

  -- consult-the-expert-first flow
  consult_requested  boolean not null default false,

  -- status machine:
  --   booked -> (expert_review when consult_requested) -> processing
  --          -> contacted -> completed
  status             text not null default 'booked'
                     check (status in
                       ('booked','expert_review','processing','contacted','completed')),
  status_history     jsonb not null default '[]'::jsonb,

  -- expert decision payload (ExpertReview JSON):
  --   expertName, comment, adjustments[{target, original, replacement, reason}],
  --   approved, reviewedAt, customerAccepted
  expert_review      jsonb,

  -- PDPA
  consent            boolean not null default false,
  anonymized_at      timestamptz,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists bookings_email_idx on public.bookings (lower(email));
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_consult_idx
  on public.bookings (consult_requested, created_at desc);

-- ------------------------------------------------------------
-- 4) Consent ledger — PDPA audit trail of every consent action
-- ------------------------------------------------------------
create table if not exists public.consents (
  id           uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('assessment','customer','booking')),
  subject_id   text not null,
  purpose      text not null,        -- e.g. 'wellness_assessment', 'booking_contact'
  granted      boolean not null,
  occurred_at  timestamptz not null default now()
);

create index if not exists consents_subject_idx
  on public.consents (subject_type, subject_id);

-- ------------------------------------------------------------
-- 5) Experts — the nutritionists / doctors using /expert
-- ------------------------------------------------------------
create table if not exists public.experts (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  role       text not null check (role in ('nutritionist','doctor')),
  email      text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6) updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7) Row Level Security
--    The Next.js server talks to the database with the service
--    role key, which bypasses RLS. Enabling RLS with no public
--    policies means the anon key can read/write nothing — the
--    safest default for personal data under PDPA.
-- ------------------------------------------------------------
alter table public.assessments enable row level security;
alter table public.customers   enable row level security;
alter table public.bookings    enable row level security;
alter table public.consents    enable row level security;
alter table public.experts     enable row level security;

-- ------------------------------------------------------------
-- 8) PDPA "right to erasure" helper
--    Anonymises personal data while keeping anonymous statistics.
-- ------------------------------------------------------------
create or replace function public.anonymize_customer(target_email text)
returns void language plpgsql security definer as $$
begin
  update public.customers
     set first_name = 'REDACTED',
         last_name  = 'REDACTED',
         phone      = 'REDACTED',
         email      = concat('redacted-', id, '@removed.local'),
         anonymized_at = now()
   where lower(email) = lower(target_email);

  update public.bookings
     set first_name = 'REDACTED',
         last_name  = 'REDACTED',
         phone      = 'REDACTED',
         email      = concat('redacted-', id, '@removed.local'),
         anonymized_at = now()
   where lower(email) = lower(target_email);
end $$;
