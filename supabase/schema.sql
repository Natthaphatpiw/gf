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
-- 5b) Check-ins — the T1 (before) / T2 (after) compass
--     Raw answers, computed dial scores and the LLM analysis are
--     stored in separate columns so any rubric change can be
--     re-processed from the originals (raw kept apart from score).
-- ------------------------------------------------------------
create table if not exists public.checkins (
  id                  text primary key,            -- e.g. 'CI-4M8TRC'
  booking_id          text not null references public.bookings (id),
  assessment_id       text references public.assessments (id),

  timepoint           text not null check (timepoint in ('T1','T2')),
  -- wording/anchor version; deltas are only comparable within one version
  instrument_version  text not null,
  locale              text not null default 'th' check (locale in ('th','en')),

  -- raw answers as submitted (option keys / slider values / open text)
  answers             jsonb not null,
  -- staff-measured vitals (blood pressure, pulse, weight, device sleep)
  objective           jsonb,

  -- scores computed in code from the fixed anchor table (never by the LLM)
  dials               jsonb not null,
  -- T2 only: before/after deltas vs the same booking's T1
  deltas              jsonb,
  deltas_comparable   boolean,

  -- validated LLM (or rule-based fallback) interpretation:
  -- red flags, preferences, goals, summaries, expert/urgent flags
  analysis            jsonb not null,
  -- T2 only: change narrative + next recommendation
  t2_extras           jsonb,

  -- PDPA: explicit health-data (sensitive) consent
  consent             boolean not null default false,
  consent_at          timestamptz,
  -- separate opt-in to reuse the open answer as a testimonial
  testimonial_consent boolean not null default false,
  anonymized_at       timestamptz,

  created_at          timestamptz not null default now()
);

comment on table public.checkins is
  'T1/T2 body-mind compass check-ins. Dial scores come from a fixed anchor table computed in code; the LLM only interprets the open answer.';

create index if not exists checkins_booking_idx
  on public.checkins (booking_id, created_at);

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
alter table public.checkins    enable row level security;

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

  -- The open answer (and what the LLM extracted from it) may carry
  -- health details — wipe both, keep the anonymous dial scores.
  update public.checkins
     set answers  = (answers - 'q8'),
         analysis = '{}'::jsonb,
         anonymized_at = now()
   where booking_id in (
     select id from public.bookings
      where anonymized_at is not null
         or lower(email) = lower(target_email)
   );
end $$;

-- ============================================================
-- 9) Customer accounts, favourites, cart & assessment history
--
--    Added for the landing "explore & build your own" experience:
--    a guest registers (name / phone / email / password), then can
--    favourite or add programs, services and menus to a cart. Each
--    record is tied to a customer row.
--
--    DB connection uses the SAME env vars the Next.js server already
--    reads (see src/lib/store.ts):
--        NEXT_PUBLIC_SUPABASE_URL        = https://<project>.supabase.co
--        SUPABASE_SERVICE_ROLE_KEY       = <service role key>   (server)
--        NEXT_PUBLIC_SUPABASE_ANON_KEY   = <anon key>           (optional)
--    Add these to your .env — no new variables are required.
-- ------------------------------------------------------------

-- 9a) Account credential on the existing customers table.
--     password_hash is nullable so legacy booking-created rows
--     (which never registered) remain valid.
alter table public.customers
  add column if not exists password_hash text;

-- 9b) Assessment history per account.
--     Each time a logged-in guest finishes the quiz we append a row,
--     so re-taking the quiz keeps the new type without losing the old.
create table if not exists public.user_assessments (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references public.customers (id) on delete cascade,
  assessment_id  text references public.assessments (id),
  archetype_code text not null,          -- e.g. 'LTFB'
  archetype_name text not null,          -- display name at capture time
  created_at     timestamptz not null default now()
);

create index if not exists user_assessments_customer_idx
  on public.user_assessments (customer_id, created_at desc);

-- Convenience view: each customer's most recent assessment type.
create or replace view public.customer_latest_type as
  select distinct on (customer_id)
         customer_id, assessment_id, archetype_code, archetype_name, created_at
    from public.user_assessments
   order by customer_id, created_at desc;

-- 9c) Favourites — programs / services / menus / packages.
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  item_type   text not null check (item_type in ('program','service','menu','package')),
  item_id     text not null,            -- program slug / service id / menu id
  created_at  timestamptz not null default now(),
  unique (customer_id, item_type, item_id)
);

create index if not exists favorites_customer_idx
  on public.favorites (customer_id, created_at desc);

-- 9d) Cart — same item taxonomy, with a quantity.
create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  item_type   text not null check (item_type in ('program','service','menu','package')),
  item_id     text not null,
  quantity    integer not null default 1 check (quantity between 1 and 99),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (customer_id, item_type, item_id)
);

create index if not exists cart_items_customer_idx
  on public.cart_items (customer_id, created_at desc);

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

-- 9e) RLS — service-role only, like every other table.
alter table public.user_assessments enable row level security;
alter table public.favorites        enable row level security;
alter table public.cart_items       enable row level security;

-- 9f) Erasure: extend anonymize_customer to drop account-linked data.
create or replace function public.anonymize_customer(target_email text)
returns void language plpgsql security definer as $$
declare
  target_ids uuid[];
begin
  select array_agg(id) into target_ids
    from public.customers where lower(email) = lower(target_email);

  update public.customers
     set first_name = 'REDACTED',
         last_name  = 'REDACTED',
         phone      = 'REDACTED',
         email      = concat('redacted-', id, '@removed.local'),
         password_hash = null,
         anonymized_at = now()
   where lower(email) = lower(target_email);

  update public.bookings
     set first_name = 'REDACTED',
         last_name  = 'REDACTED',
         phone      = 'REDACTED',
         email      = concat('redacted-', id, '@removed.local'),
         anonymized_at = now()
   where lower(email) = lower(target_email);

  update public.checkins
     set answers  = (answers - 'q8'),
         analysis = '{}'::jsonb,
         anonymized_at = now()
   where booking_id in (
     select id from public.bookings
      where anonymized_at is not null
         or lower(email) = lower(target_email)
   );

  -- account-linked, non-statistical data is removed outright
  if target_ids is not null then
    delete from public.favorites       where customer_id = any (target_ids);
    delete from public.cart_items       where customer_id = any (target_ids);
    delete from public.user_assessments where customer_id = any (target_ids);
  end if;
end $$;

-- ============================================================
-- 10) Expert consultations (orders), payments, expert proposals,
--     realtime chat, and the LINE Messaging / LIFF integration.
--
--     A "consultation" is the customer's order: they pick an item
--     (program / service / menu / package), choose an expert and a
--     consult type, optionally write a note, pay a (mock) deposit,
--     and then track it through a Shopee-style status machine.
--
--     Env the server reads (add to .env — NEVER commit secrets):
--        LINE_CHANNEL_ACCESS_TOKEN   (long-lived, server only)
--        LINE_CHANNEL_SECRET         (webhook signature, server only)
--        LINE_CHANNEL_ID             (= 2008409511)
--        NEXT_PUBLIC_LIFF_MANAGED_PLAN_ID (= 2008409515-L8LJCmkc)
--        NEXT_PUBLIC_LIFF_CHAT_ID         (= 2008409515-rgKMDQBb)
-- ------------------------------------------------------------

-- 10a) Consultations — one row per "consult an expert" order.
create table if not exists public.consultations (
  id            text primary key,                 -- e.g. 'CS-7F3K2A'
  customer_id   uuid not null references public.customers (id) on delete cascade,

  -- what the customer is consulting about (snapshotted for display)
  item_type     text not null check (item_type in ('program','service','menu','package')),
  item_id       text not null,
  item_name_th  text not null default '',
  item_name_en  text not null default '',
  item_image    text,

  -- who they want to consult (id from src/data/experts.ts)
  expert_id     text not null,

  -- how they want to consult; 'video' is built in a later round
  consult_type  text not null check (consult_type in ('video','chat','managed')),

  -- optional free-text brief from the customer
  note          text,

  -- the customer's assessment profile linked at order time (drives the
  -- "who is this guest" panel the expert sees in LIFF)
  assessment_id text references public.assessments (id),

  -- Shopee-style status machine
  status        text not null default 'awaiting_deposit'
                check (status in (
                  'awaiting_deposit',     -- รอชำระค่ามัดจำ
                  'awaiting_expert',      -- รอการตอบรับจากผู้เชี่ยวชาญ
                  'expert_processing',    -- รอ Process จากผู้เชี่ยวชาญ
                  'awaiting_customer',    -- รอการยืนยันจากลูกค้า
                  'coordinating_partner', -- กำลังผสานงานกับ Partner
                  'payment',              -- ชำระเงิน
                  'trip_started',         -- เริ่มเดินทาง
                  'in_progress',          -- อยู่ระหว่างการผ่อนคลาย
                  'completed',            -- จบแพคเกจ
                  'awaiting_feedback',    -- รอรับฟีดแบค
                  'cancelled'
                )),

  deposit_amount  integer not null default 0,
  -- which plan the customer kept once the expert proposed an adjusted one
  chosen_plan     text check (chosen_plan in ('original','adjusted')),
  accepted_proposal_id uuid,                       -- FK added after proposals table

  consent       boolean not null default true,
  anonymized_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists consultations_customer_idx
  on public.consultations (customer_id, created_at desc);
create index if not exists consultations_expert_idx
  on public.consultations (expert_id, status);
create index if not exists consultations_status_idx on public.consultations (status);

drop trigger if exists consultations_set_updated_at on public.consultations;
create trigger consultations_set_updated_at
  before update on public.consultations
  for each row execute function public.set_updated_at();

-- 10b) Status history — every status transition (the order's timeline).
create table if not exists public.consultation_status_history (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text not null references public.consultations (id) on delete cascade,
  status          text not null,
  actor_role      text not null default 'system'
                  check (actor_role in ('customer','expert','system','partner')),
  actor_id        text,
  note            text,
  at              timestamptz not null default now()
);

create index if not exists consultation_status_history_idx
  on public.consultation_status_history (consultation_id, at);

-- 10c) Payments — deposit (and later final). Mock UX: a slip upload
--      flips status to 'submitted' and the flow advances; no real charge.
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text not null references public.consultations (id) on delete cascade,
  kind            text not null check (kind in ('deposit','final')),
  amount          integer not null default 0,
  currency        text not null default 'THB',
  status          text not null default 'pending'
                  check (status in ('pending','submitted','verified','rejected')),
  slip_url        text,                            -- uploaded slip (mock)
  submitted_at    timestamptz,
  verified_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists payments_consultation_idx
  on public.payments (consultation_id, kind);

-- 10d) Expert proposals — the adjusted plan an expert builds in the
--      managed-plan LIFF (drag-and-drop). One consultation can have
--      several (revisions); the chosen one wins.
create table if not exists public.expert_proposals (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text not null references public.consultations (id) on delete cascade,
  expert_id       text not null,
  note            text,
  status          text not null default 'draft'
                  check (status in ('draft','sent','accepted','rejected','superseded')),
  created_at      timestamptz not null default now(),
  sent_at         timestamptz,
  decided_at      timestamptz
);

create index if not exists expert_proposals_consultation_idx
  on public.expert_proposals (consultation_id, created_at desc);

-- the ordered slots of a proposed plan (the drag-and-drop result)
create table if not exists public.proposal_slots (
  id            uuid primary key default gen_random_uuid(),
  proposal_id   uuid not null references public.expert_proposals (id) on delete cascade,
  position      integer not null,                  -- order within the plan
  item_type     text not null check (item_type in ('service','menu','guidance','unassigned')),
  item_id       text,                              -- service/menu id, null for guidance
  label_th      text not null default '',
  label_en      text not null default '',
  -- did this slot come unchanged from the original program?
  from_original boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists proposal_slots_proposal_idx
  on public.proposal_slots (proposal_id, position);

-- now that proposals exist, point the consultation's accepted proposal at it
alter table public.consultations
  add constraint consultations_accepted_proposal_fk
  foreign key (accepted_proposal_id) references public.expert_proposals (id)
  on delete set null;

-- 10e) Chat — realtime thread between customer (in-app) and expert (LIFF).
create table if not exists public.chat_threads (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text not null references public.consultations (id) on delete cascade,
  expert_id       text not null,
  status          text not null default 'open' check (status in ('open','ended')),
  created_at      timestamptz not null default now(),
  ended_at        timestamptz,
  ended_by        text check (ended_by in ('customer','expert'))
);

create unique index if not exists chat_threads_consultation_idx
  on public.chat_threads (consultation_id);

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.chat_threads (id) on delete cascade,
  sender_role text not null check (sender_role in ('customer','expert','system')),
  sender_id   text,
  body        text not null,
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);

create index if not exists chat_messages_thread_idx
  on public.chat_messages (thread_id, created_at);

-- 10f) LINE — identity link (expert's LINE user <-> our expert id),
--      and full inbound/outbound audit logs.
create table if not exists public.line_links (
  id            uuid primary key default gen_random_uuid(),
  line_user_id  text not null unique,
  role          text not null default 'expert' check (role in ('expert','customer')),
  expert_id     text,                              -- when role = 'expert'
  customer_id   uuid references public.customers (id) on delete cascade,
  display_name  text,
  linked_at     timestamptz not null default now()
);

-- every Flex/text push we send to LINE (outbound audit)
create table if not exists public.line_push_log (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text references public.consultations (id) on delete set null,
  target          text not null,                   -- line user id, or 'broadcast'
  message_type    text,                            -- 'flex' | 'text' | ...
  payload         jsonb,
  status          text not null check (status in ('sent','failed')),
  response        jsonb,                           -- LINE API response / error
  created_at      timestamptz not null default now()
);

-- every webhook event LINE delivers to us (inbound audit)
create table if not exists public.line_webhook_events (
  id            uuid primary key default gen_random_uuid(),
  event_type    text,                              -- message | postback | follow | ...
  line_user_id  text,
  consultation_id text references public.consultations (id) on delete set null,
  raw           jsonb not null,
  processed     boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists line_webhook_events_idx
  on public.line_webhook_events (created_at desc);

-- 10g) Activity log — a catch-all audit trail for the whole flow
--      (deposit submitted, proposal sent, plan accepted, chat ended, …).
create table if not exists public.activity_log (
  id              uuid primary key default gen_random_uuid(),
  consultation_id text references public.consultations (id) on delete cascade,
  actor_role      text not null default 'system'
                  check (actor_role in ('customer','expert','system','partner')),
  actor_id        text,
  action          text not null,                   -- machine code, e.g. 'deposit.submitted'
  detail          jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists activity_log_consultation_idx
  on public.activity_log (consultation_id, created_at);

-- 10h) RLS — service-role only, like every other table.
alter table public.consultations               enable row level security;
alter table public.consultation_status_history enable row level security;
alter table public.payments                    enable row level security;
alter table public.expert_proposals            enable row level security;
alter table public.proposal_slots              enable row level security;
alter table public.chat_threads                enable row level security;
alter table public.chat_messages               enable row level security;
alter table public.line_links                  enable row level security;
alter table public.line_push_log               enable row level security;
alter table public.line_webhook_events         enable row level security;
alter table public.activity_log                enable row level security;

-- 10i) Erasure: extend anonymize_customer to scrub consultation PII
--      (notes, chat bodies, uploaded slips) while keeping anonymous
--      status statistics.
create or replace function public.anonymize_customer(target_email text)
returns void language plpgsql security definer as $$
declare
  target_ids uuid[];
  target_consults text[];
begin
  select array_agg(id) into target_ids
    from public.customers where lower(email) = lower(target_email);

  update public.customers
     set first_name = 'REDACTED', last_name = 'REDACTED', phone = 'REDACTED',
         email = concat('redacted-', id, '@removed.local'),
         password_hash = null, anonymized_at = now()
   where lower(email) = lower(target_email);

  update public.bookings
     set first_name = 'REDACTED', last_name = 'REDACTED', phone = 'REDACTED',
         email = concat('redacted-', id, '@removed.local'), anonymized_at = now()
   where lower(email) = lower(target_email);

  update public.checkins
     set answers = (answers - 'q8'), analysis = '{}'::jsonb, anonymized_at = now()
   where booking_id in (
     select id from public.bookings
      where anonymized_at is not null or lower(email) = lower(target_email)
   );

  if target_ids is not null then
    delete from public.favorites       where customer_id = any (target_ids);
    delete from public.cart_items       where customer_id = any (target_ids);
    delete from public.user_assessments where customer_id = any (target_ids);

    select array_agg(id) into target_consults
      from public.consultations where customer_id = any (target_ids);

    update public.consultations
       set note = null, item_name_th = 'REDACTED', item_name_en = 'REDACTED',
           anonymized_at = now()
     where customer_id = any (target_ids);

    if target_consults is not null then
      update public.payments set slip_url = null
       where consultation_id = any (target_consults);
      update public.chat_messages set body = 'REDACTED'
       where thread_id in (
         select id from public.chat_threads where consultation_id = any (target_consults)
       );
    end if;
  end if;
end $$;
