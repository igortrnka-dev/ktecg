-- Mailbox tracking ("Pošta"): e-mails between the company mailbox and the companies in the leads.
-- Only messages that match a lead are stored, as plain text without attachments or HTML.
-- The sync cursor lives in settings under the key 'mail_sync'.
-- Safe to run more than once, on a database that ran 0001_init.sql to 0003_market_reports.sql.

create table if not exists lead_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  message_id text not null, -- the Message-ID header, or "<folder>:<uidvalidity>:<uid>" when it is missing
  folder text,
  direction text not null check (direction in ('in', 'out')),
  kind text not null default 'normal' check (kind in ('normal', 'auto_reply', 'bounce')),
  from_email text,
  from_name text,
  to_emails text[] not null default '{}', -- for a bounce: the recipients that failed
  cc_emails text[] not null default '{}',
  subject text,
  snippet text, -- the start of the new text, without the quoted reply
  body text,    -- plain text without the quoted history where it is detectable, at most ~20 000 characters
  sent_at timestamptz,
  in_reply_to text,
  created_at timestamptz not null default now(),
  unique (lead_id, message_id)
);
create index if not exists lead_emails_lead_idx on lead_emails (lead_id, sent_at desc);
create index if not exists lead_emails_sent_idx on lead_emails (sent_at desc);

alter table lead_emails enable row level security;
