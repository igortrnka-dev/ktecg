-- KTechnology: website inquiries + AI sales pipeline.
-- All tables have RLS enabled and no policies: only the server (service role) can read/write.

create extension if not exists "pgcrypto";

create type lead_status as enum (
  'new', 'qualified', 'contacted', 'replied', 'meeting', 'won', 'lost', 'disqualified'
);
create type lead_source as enum ('ai_prospecting', 'inbound', 'manual');
create type run_status as enum ('running', 'done', 'failed');

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  countries text[] not null default '{}',
  industries text[] not null default '{}',
  roles text[] not null default '{}',
  notes text not null default '',
  outreach_language text not null default 'auto',
  leads_per_run int not null default 10 check (leads_per_run between 1 and 30),
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);

create table lead_runs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete set null,
  trigger text not null default 'manual', -- manual | cron
  status run_status not null default 'running',
  found int not null default 0,
  created int not null default 0,
  log text not null default '',
  error text,
  usage jsonb not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  domain text unique,
  website text,
  country text,
  city text,
  industry text,
  company_size text,
  description text,
  signals jsonb not null default '[]',   -- [{type, detail, url}]
  contacts jsonb not null default '[]',  -- [{name, role, email, phone, linkedin}]
  score int check (score between 0 and 100),
  tier text check (tier in ('A', 'B', 'C')),
  qualification text,
  recommended_roles text[] not null default '{}',
  outreach_language text,
  outreach_subject text,
  outreach_body text,
  status lead_status not null default 'new',
  source lead_source not null default 'manual',
  campaign_id uuid references campaigns(id) on delete set null,
  run_id uuid references lead_runs(id) on delete set null,
  next_action text,
  next_action_at date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_status_idx on leads (status);
create index leads_score_idx on leads (score desc nulls last);
create index leads_created_idx on leads (created_at desc);

create table lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null, -- created | status | note | ai | outreach | inquiry
  body text not null default '',
  created_at timestamptz not null default now()
);
create index lead_events_lead_idx on lead_events (lead_id, created_at desc);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  name text not null,
  email text not null,
  phone text,
  country text,
  positions text,
  headcount int, -- older form; positions now carries the counts
  duration text,
  shift_pattern text check (shift_pattern in ('unsure', 'single', 'double', 'triple', 'rotation')),
  start_date date,
  message text,
  locale text,
  lead_id uuid references leads(id) on delete set null,
  created_at timestamptz not null default now()
);

create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;
create trigger leads_touch before update on leads for each row execute function touch_updated_at();

alter table campaigns enable row level security;
alter table lead_runs enable row level security;
alter table leads enable row level security;
alter table lead_events enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;

insert into settings (key, value) values (
  'company_profile',
  to_jsonb($$KTechnology s.r.o. (based in Slovakia) provides industrial staff leasing for projects across Europe and worldwide. We deploy to Germany, Austria, the Nordics (Sweden, Norway, Finland, Denmark), Benelux, France, Poland, Czechia, Slovakia and the UAE.

Trades: welders (MIG/MAG, TIG, MMA; steel and stainless), pipe fitters, steel fitters, industrial electricians, automation technicians (PLC), mechanics and millwrights, CNC and machine operators, assembly operators and logistics operators. Every worker passes a practical skills test before deployment.

We handle recruiting, employment contracts, A1 forms and work permits, insurance, travel and accommodation, plus a project coordinator and fast replacement. The customer gets one contact and one invoice.

Ideal customers: manufacturers, automotive suppliers, metalworking companies, energy and power plants (outages and shutdowns), shipyards and offshore, electrical and automation contractors, EPC and installation contractors, mid-size and larger, in the countries above, who struggle to hire skilled blue-collar staff.

Strong buying signals: many open job ads for skilled trades, new plant/line/expansion announcements, large project wins or contracts, planned outages/shutdowns, labour-shortage statements, subcontracting tenders.$$::text)
);
