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
  - *Analýzy trhu*: Claude researches a country for chosen trades on the web (demand and job-ad indicators, companies
    hiring, competitors, wages and rates for leased staff, rules for leasing and posting workers, seasonality) and saves a
    sourced report in Slovak. From it, companies go into the pipeline with "Pridať ako lead" (an existing lead with the
    same domain is linked instead), and "Vytvoriť kampaň z analýzy" creates an inactive prospecting campaign.
  - *Pošta*: reads the company mailbox (`office@ktechnology.sk`) over IMAP and records the e-mails exchanged with
    leads, so the admin shows how the outreach is going: leads written to, reply rate and median time to reply, bounces
    and auto-replies (30 or 90 days, also per country), new replies, contacted leads waiting more than 7 days for an
    answer, and every recorded e-mail. A lead's detail lists its e-mails. An incoming reply moves a new, qualified or
    contacted lead to *Odpovedal*; a sent e-mail moves a new or qualified lead to *Oslovený*. The next step comes from
    the lead's newest e-mail: a reply sets "Odpovedať na e-mail" for today (later and closed leads keep their status
    and only get the step; a won customer's mail sets none), a sent e-mail sets the follow-up unless a next step was
    set by hand, a bounce sets "Overiť e-mail kontaktu". E-mails older than 14 days (the first sync and *Prehľadať
    znova 90 dní* read 90 days back) change neither status nor next step. Each recorded e-mail is written to the
    lead's history. Read-only: nothing is sent, moved or marked as read.
  - *Nastavenia*: the company profile / ideal-customer text Claude works from. Claude is told to use only
    the facts in it. 0001_init.sql seeds it once, so a project that ran an older 0001 still has the old
    default text (it mentioned Switzerland, the UK, "certified" welders and engagement sizes, and lacked the
    quote within one business day and the crew on site in about 14 days): edit it in *Nastavenia* to match
    what the website says.

Stack: Next.js 15 (App Router), Supabase (Postgres + Auth), Anthropic API (`claude-opus-5-5` with web search), Render.

## Setup

1. **Supabase** – create a project, then run `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_inquiry_duration_shift.sql`, `supabase/migrations/0003_market_reports.sql` and then
   `supabase/migrations/0004_mail.sql` in the SQL editor. 0002–0004 are safe to run again; a project set up with an
   older 0001 needs 0002, or every website inquiry fails, an existing project needs 0003 for *Analýzy trhu* and 0004
   for *Pošta*. Run 0004 before deploying the version with *Pošta*; until then *Pošta* and the mail card of *Prehľad*
   say the e-mails could not be loaded. `supabase/migrations/0005_projects.sql` adds the *Projekty* table with the
   owner's projects and the public `project-photos` storage bucket; until it has run, the site shows the projects from
   `src/content/projects.ts` and *Projekty* in the admin asks for the migration.
   In *Authentication → Users* add the admin user(s) with a password and tick *Auto Confirm User*
   (the admin only accepts confirmed e-mails listed in `ADMIN_EMAILS`).
   Then in *Authentication → Sign In / Providers* turn off *Allow new users to sign up* (it is on by default)
   and leave *Confirm email* on, so nobody can create an account with the public anon key.
2. **Env vars** – copy `.env.example` to `.env.local` and fill in the values.
   For *Pošta* set `IMAP_HOST=imap.websupport.sk`, `IMAP_PORT=993`, `IMAP_USER=office@ktechnology.sk` and
   `IMAP_PASSWORD` (the mailbox's password, as set in the Websupport admin). The sent folder is found on its own
   (`\Sent`, then *Sent*, *INBOX.Sent*, *Sent Items*, *Odoslané*); set `IMAP_SENT_FOLDER` to its exact name only if
   *Pošta* says it was not found.
   Without these three values the rest of the admin works and *Pošta* explains what is missing.
3. `npm install && npm run dev` → http://localhost:3000 and http://localhost:3000/admin

## Deploy on Render

Use *New → Blueprint* and point it at this repo; `render.yaml` creates the web service, the daily
prospecting cron job and the mail cron job (every 15 minutes). Fill in the env vars marked `sync: false` in the
Render dashboard (`NEXT_PUBLIC_SITE_URL` is the public URL of the web service, set it on both services).

## Notes

- All tables have Row Level Security on with no policies; only the server (service-role key) touches data.
- Card and portrait visuals are CSS compositions; replace them with real photography
  (`src/components/site/Art.tsx`, `.portrait` in `site.css`) when available.
- AI runs cost API credits: each prospecting run uses up to ~25 web searches plus two Claude calls.
  A campaign runs at most once at a time. Runs live in the web server process, so a run cut off by a
  restart or deploy is marked failed ("Beh sa prerušil") after an hour; its research notes stay in the run log.
- A market analysis uses up to ~20 web searches plus two Claude calls and takes a few minutes; only one runs at a
  time, and like a prospecting run it is marked failed after an hour if a restart cut it off. Its figures, wages and
  rules are only as good as the sources it lists: the page marks wages as indicative and rules as informative.
- The inquiry endpoint takes at most 5 requests per 10 minutes per visitor address (CF-Connecting-IP, which
  Render's Cloudflare edge sets; IPv6 counted per /64) and 5 inquiries per 10 minutes per sender company
  domain (the whole address for free-mail); over either limit it answers 429. Above 30 inquiries in 10 minutes
  in total, inquiries are still saved and put into the pipeline, but Claude does not assess them (the lead's
  history says so and the server log warns once per 10 minutes), so a flood cannot lock real buyers out.
  On a validation error it answers 400 `{"error":"invalid","fields":[…]}` with the failing field names.
- *Pošta* stores only e-mails that belong to a lead: an incoming one whose sender (or Reply-To) is a contact's
  address or on the lead's domain or a subdomain of it, an outgoing one by its To/Cc, and a bounce by the address that
  failed for good (a delay warning is not a bounce). Free-mail addresses match only a contact's exact address, and
  KTechnology's own domain never matches. Newsletters and other list mail (List-Id, List-Unsubscribe) are not stored.
  For each it keeps the addresses, subject, date and the plain text without the quoted earlier messages (at most
  20 000 characters; no attachments or HTML). Other mail is looked at only by its headers and is not stored. The
  mailbox is opened read-only (IMAP EXAMINE over TLS, certificates checked); `settings.mail_sync` keeps a cursor per
  folder, so each run reads only new messages (at most 300 per folder; the rest follow in the next runs). The first
  run, or *Prehľadať znova 90 dní*, goes back 90 days; e-mails already recorded are not stored or acted on twice.
  The sync runs every 15 minutes through the Render cron job (a separate paid service), in the background when
  *Pošta* or *Prehľad* is opened and the last run is older than 5 minutes, and with *Synchronizovať teraz*. Until
  the IMAP variables are set, the cron job's call answers 503 and its runs fail.
- *Zmazať lead* deletes the lead with its history, its recorded e-mails, every website inquiry linked to it or sent
  from one of its contacts' e-mail addresses (unless another lead owns it), and replaces the contacts' e-mails, full
  names, phone numbers and LinkedIn profiles with "[vymazané]" in all AI prospecting run logs and in other leads'
  recorded e-mails and their e-mail history lines (a message sent to both companies, a bounce for both). A later
  prospecting run can find the company again from public sources, and if it becomes a lead again, *Prehľadať znova
  90 dní* records its e-mails from the last 90 days again (the mailbox itself is not changed).
