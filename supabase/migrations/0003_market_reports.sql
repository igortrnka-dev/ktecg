-- Market analyses ("Analýzy trhu"): Claude researches a country and trades on the web and saves a sourced report.
-- Safe to run more than once, on a database that ran 0001_init.sql and 0002_inquiry_duration_shift.sql.

create table if not exists market_reports (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  roles text[] not null default '{}',
  industries text[] not null default '{}',
  question text not null default '',
  status run_status not null default 'running',
  report jsonb, -- see MarketReport in src/lib/ai/schemas.ts
  log text,
  error text,
  usage jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists market_reports_created_idx on market_reports (created_at desc);
-- One analysis at a time: a second running row fails with a unique violation.
create unique index if not exists market_reports_one_running_idx on market_reports (status) where status = 'running';

alter table market_reports enable row level security;
