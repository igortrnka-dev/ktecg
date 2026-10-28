# KTechnology web + sales admin

Company website for **KTechnology s.r.o.** (industrial staff leasing) in six languages, plus an
admin that uses Claude to find, qualify and draft outreach to sales leads.

- **Public site** – `/{en,de,fr,sv,sk,pl}`. Visitors are redirected to their browser language.
  Texts live in `src/i18n/dictionaries/*.ts`.
- **Contact form** – saved to Supabase; Claude scores the inquiry and drafts a reply in the visitor's language.
- **Admin** – `/admin` (Supabase Auth, only e-mails in `ADMIN_EMAILS`):
  - *Prehľad*: KPIs, funnel, hottest leads, follow-ups due today.
  - *Leady*: pipeline with score/tier, filters, detail with signals, contacts, activity,
    editable outreach e-mail, "Preskúmať znova s Claude" (web research) and "Napísať znova" (rewrite in any language).
  - *AI prospecting*: campaigns (countries, industries, roles). Claude searches the web for buying signals
    (job ads, expansions, project wins, outages), returns structured, scored leads with a personalised first e-mail.
    Active campaigns also run daily via the Render cron job.
  - *Nastavenia*: the company profile / ideal-customer text Claude works from.

Stack: Next.js 15 (App Router), Supabase (Postgres + Auth), Anthropic API (`claude-opus-5-5` with web search), Render.

## Setup

1. **Supabase** – create a project, then run `supabase/migrations/0001_init.sql` in the SQL editor.
   In *Authentication → Users* add the admin user(s) with a password.
2. **Env vars** – copy `.env.example` to `.env.local` and fill in the values.
3. `npm install && npm run dev` → http://localhost:3000 and http://localhost:3000/admin

## Deploy on Render

Use *New → Blueprint* and point it at this repo; `render.yaml` creates the web service and the daily
prospecting cron job. Fill in the env vars marked `sync: false` in the Render dashboard
(`NEXT_PUBLIC_SITE_URL` is the public URL of the web service, set it on both services).

## Notes

- All tables have Row Level Security on with no policies; only the server (service-role key) touches data.
- Card and portrait visuals are CSS compositions; replace them with real photography
  (`src/components/site/Art.tsx`, `.portrait` in `site.css`) when available.
- AI runs cost API credits: each prospecting run uses up to ~25 web searches plus two Claude calls.
