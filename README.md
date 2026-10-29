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
  - *Nastavenia*: the company profile / ideal-customer text Claude works from. Claude is told to use only
    the facts in it. 0001_init.sql seeds it once, so a project that ran an older 0001 still has the old
    default text (it mentioned Switzerland, the UK, "certified" welders and engagement sizes): edit it in
    *Nastavenia* to match what the website says.

Stack: Next.js 15 (App Router), Supabase (Postgres + Auth), Anthropic API (`claude-opus-5-5` with web search), Render.

## Setup

1. **Supabase** – create a project, then run `supabase/migrations/0001_init.sql` and then
   `supabase/migrations/0002_inquiry_duration_shift.sql` in the SQL editor. 0002 is safe to run again; a
   project set up with an older 0001 needs it, or every website inquiry fails.
   In *Authentication → Users* add the admin user(s) with a password and tick *Auto Confirm User*
   (the admin only accepts confirmed e-mails listed in `ADMIN_EMAILS`).
   Then in *Authentication → Sign In / Providers* turn off *Allow new users to sign up* (it is on by default)
   and leave *Confirm email* on, so nobody can create an account with the public anon key.
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
  A campaign runs at most once at a time. Runs live in the web server process, so a run cut off by a
  restart or deploy is marked failed ("Beh sa prerušil") after an hour; its research notes stay in the run log.
- The inquiry endpoint takes at most 5 requests per 10 minutes per visitor address (CF-Connecting-IP, which
  Render's Cloudflare edge sets), 5 inquiries per 10 minutes per sender company domain (the whole address
  for free-mail) and 30 inquiries per 10 minutes in total; over a limit it answers 429.
