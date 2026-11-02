import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { MailBadge, Status, fmtDate, fmtDay, fmtDuration, percent } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
import SubmitButton from "@/components/admin/SubmitButton";
import AutoRefresh from "@/components/admin/AutoRefresh";
import PageNotice from "@/components/admin/PageNotice";
import { COMPANY_MAILBOX, mailConfigured, missingMailEnv, ownAddress } from "@/lib/mail/config";
import { isRunning, readMailState } from "@/lib/mail/state";
import { maybeSyncMail } from "@/lib/mail/sync";
import { orNull, outreachStats, waitingLeads, type OutreachStats } from "@/lib/mail/stats";
import { MAIL_ERROR } from "@/lib/mail/errors";
import { mailRoute, sender } from "@/lib/mail/text";
import { simulateMail } from "@/lib/demo/mode";
import { plural } from "@/lib/plural";
import { rescanMail, syncMailNow } from "../../actions";

type Search = { period?: string; filter?: string; synced?: string; busy?: string };

type MailRow = {
  id: string; lead_id: string; direction: string; kind: string; from_email: string | null; from_name: string | null;
  to_emails: string[]; cc_emails: string[]; subject: string | null; snippet: string | null; sent_at: string;
  leads: { company_name: string; status: string } | null;
};

const FILTERS = { all: "Všetko", in: "Prijaté", out: "Odoslané", auto: "Automatické", bounce: "Nedoručené" } as const;
type Filter = keyof typeof FILTERS;

const COLUMNS = "id, lead_id, direction, kind, from_email, from_name, to_emails, cc_emails, subject, snippet, sent_at, leads(company_name, status)";

const NO_STATS: OutreachStats = { outreached: 0, replied: 0, medianHours: null, bounces: 0, autoReplies: 0, countries: [] };

const messages = (n: number) => `${n} ${plural(n, "správa", "správy", "správ")}`;
const emails = (n: number) => `${n} ${plural(n, "nový e-mail", "nové e-maily", "nových e-mailov")}`;

export default async function Mail({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const sp = await searchParams;
  const days = sp.period === "90" ? 90 : 30;
  const filter: Filter = sp.filter && sp.filter in FILTERS ? (sp.filter as Filter) : "all";
  const demo = simulateMail();
  const connected = demo || mailConfigured();
  const started = await maybeSyncMail();
  const state = await readMailState();
  const running = started || isRunning(state);

  let recent = db().from("lead_emails").select(COLUMNS).order("sent_at", { ascending: false }).limit(50);
  if (filter === "in" || filter === "out") recent = recent.eq("direction", filter).eq("kind", "normal");
  if (filter === "auto") recent = recent.eq("kind", "auto_reply");
  if (filter === "bounce") recent = recent.eq("kind", "bounce");
  const [statsOrNull, waitingOrNull, { data: replyRows }, { data: recentRows }] = await Promise.all([
    orNull(outreachStats(days)),
    orNull(waitingLeads()),
    db()
      .from("lead_emails")
      .select(COLUMNS)
      .eq("direction", "in")
      .eq("kind", "normal")
      .gte("sent_at", new Date(Date.now() - days * 864e5).toISOString())
      .order("sent_at", { ascending: false })
      .limit(20),
    recent,
  ]);
  const unreadable = !statsOrNull || !waitingOrNull;
  const stats = statsOrNull ?? NO_STATS;
  const waiting = waitingOrNull ?? [];
  const replies = (replyRows ?? []) as unknown as MailRow[];
  const rows = (recentRows ?? []) as unknown as MailRow[];

  const href = (next: { period?: number; filter?: Filter }) => {
    const params = new URLSearchParams();
    const period = next.period ?? days;
    const f = next.filter ?? filter;
    if (period !== 30) params.set("period", String(period));
    if (f !== "all") params.set("filter", f);
    const qs = params.toString();
    return qs ? `/admin/mail?${qs}` : "/admin/mail";
  };
  const synced = Number(sp.synced);

  return (
    <>
      <AutoRefresh active={running} ms={4000} />
      <header className="page-head">
        <div className="page-head__text">
          <h1>Pošta</h1>
          <p className="page-sub">
            Ako ide oslovovanie trhu: komu sme napísali, kto odpovedal a komu sa treba pripomenúť. Zo schránky sa ukladajú
            len e-maily od firiem z leadov a pre ne.
          </p>
        </div>
      </header>

      {sp.busy ? (
        <PageNotice param="busy">Synchronizácia práve beží. Výsledok sa tu ukáže o chvíľu.</PageNotice>
      ) : sp.synced !== undefined && Number.isFinite(synced) ? (
        <PageNotice param="synced">
          Synchronizácia hotová: {synced ? `${emails(synced)} k leadom` : "žiadne nové e-maily k leadom"}.
        </PageNotice>
      ) : null}
      {unreadable && <p className="notice notice--error" role="alert">{MAIL_ERROR.read}</p>}

      <section className="card" aria-labelledby="mail-box">
        <div className="card__head">
          <div>
            <h2 id="mail-box">Schránka</h2>
            <p>Čítajú sa priečinky Doručená a Odoslaná pošta. V schránke sa nič neoznačí, nepresunie ani neodošle.</p>
          </div>
          {connected && (running ? <span className="chip chip--run-running">Synchronizuje sa</span> : state.last_error ? <span className="chip chip--bad">Chyba</span> : <span className="chip chip--ok">Pripojená</span>)}
        </div>
        {connected ? (
          <>
            <div className="card__body">
              {demo && (
                <p className="notice notice--demo">
                  Ukážkový režim: schránka nie je pripojená a e-maily sú vymyslené. „Synchronizovať teraz“ nájde jednu ukážkovú odpoveď.
                </p>
              )}
              {state.last_error && !running && <p className="notice notice--error" role="alert">{state.last_error}</p>}
              <dl className="facts">
                <dt>Adresa</dt><dd>{demo ? COMPANY_MAILBOX : ownAddress()}</dd>
                <dt>Naposledy synchronizované</dt><dd>{state.last_ok_at ? fmtDate(state.last_ok_at) : "zatiaľ nie"}</dd>
                {state.last_error && state.last_run_at && <><dt>Posledný pokus</dt><dd>{fmtDate(state.last_run_at)}</dd></>}
                {state.stats && (
                  <>
                    <dt>Posledná synchronizácia</dt>
                    <dd>
                      prezreté {messages(state.stats.scanned)}, uložené {emails(state.stats.saved)}
                      {state.stats.remaining > 0 && `; ďalšie ${messages(state.stats.remaining)} sa načítajú pri ďalšej synchronizácii`}
                    </dd>
                  </>
                )}
              </dl>
              <p className="muted small">
                Synchronizuje sa samo každých 15 minút a pri otvorení tejto stránky. „Prehľadať znova 90 dní“ doplní e-maily
                firiem, ktoré pribudli do leadov až po ich prijatí; nič sa neuloží dvakrát.
              </p>
            </div>
            <div className="card__foot">
              <form action={syncMailNow}>
                <SubmitButton className="abtn abtn--primary" pending="Synchronizujem…" disabled={running}><Icon name="refresh" />Synchronizovať teraz</SubmitButton>
              </form>
              <form action={rescanMail}>
                <SubmitButton pending="Prehľadávam…" disabled={running} title="Prečíta znova e-maily za posledných 90 dní a doplní tie, ktoré patria k leadom.">
                  <Icon name="search" />Prehľadať znova 90 dní
                </SubmitButton>
              </form>
            </div>
          </>
        ) : (
          <div className="card__body">
            <p>
              Schránka ešte nie je pripojená (chýba {missingMailEnv().join(", ")}). Doplňte do súboru <code>.env.local</code> (na
              Renderi do Environment webovej služby) tieto riadky, namiesto „…“ heslo k schránke, a reštartujte server:
            </p>
            <pre className="log">{`IMAP_HOST=imap.websupport.sk\nIMAP_PORT=993\nIMAP_USER=${COMPANY_MAILBOX}\nIMAP_PASSWORD=…`}</pre>
            <p className="muted small">
              To sú údaje Websupportu (IMAP so šifrovaním TLS). Priečinok odoslanej pošty sa nájde sám; ak nie, doplňte aj
              riadok <code>IMAP_SENT_FOLDER=Sent</code> s názvom priečinka z webmailu. Heslo sa v administrácii nikde nezobrazuje.
            </p>
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: 16 }} aria-labelledby="mail-progress">
        <div className="card__head">
          <h2 id="mail-progress">Priebeh oslovovania</h2>
          <nav className="seg" aria-label="Obdobie">
            {[30, 90].map((p) => (
              <Link key={p} href={href({ period: p })} scroll={false} aria-current={p === days ? "true" : undefined}>{p} dní</Link>
            ))}
          </nav>
        </div>
        <div className="card__body">
          <div className="stats">
            <div className="stat"><strong>{stats.outreached}</strong><span>oslovené firmy (aspoň jeden odoslaný e-mail)</span></div>
            <div className="stat"><strong>{stats.replied}</strong><span>odpovedali po prvom e-maile</span></div>
            <div className="stat"><strong>{percent(stats.replied, stats.outreached)}</strong><span>miera odpovedí</span></div>
            <div className="stat"><strong>{fmtDuration(stats.medianHours)}</strong><span>medián času do odpovede</span></div>
            <div className="stat"><strong>{stats.bounces}</strong><span>nedoručené</span></div>
            <div className="stat"><strong>{stats.autoReplies}</strong><span>automatické odpovede</span></div>
          </div>
          {stats.countries.length > 0 && (
            <div className="table-wrap table-wrap--framed">
              <table className="table">
                <caption className="sr-only">Oslovené firmy a odpovede podľa krajiny za {days} dní</caption>
                <thead><tr><th>Krajina</th><th>Oslovené</th><th>Odpovedali</th><th>Miera odpovedí</th></tr></thead>
                <tbody>
                  {stats.countries.map((c) => (
                    <tr key={c.country}>
                      <td>{c.country}</td>
                      <td className="nowrap">{c.outreached}</td>
                      <td className="nowrap">{c.replied}</td>
                      <td className="nowrap">{percent(c.replied, c.outreached)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <div className="grid2">
        <section className="card" aria-labelledby="mail-replies">
          <div className="card__head">
            <h2 id="mail-replies">Nové odpovede <span className="count">{replies.length}</span></h2>
            <span className="muted small">za {days} dní</span>
          </div>
          {replies.length === 0 ? (
            <p className="empty">Zatiaľ žiadne odpovede od firiem z leadov.</p>
          ) : (
            <ul className="list">
              {replies.map((r) => (
                <li key={r.id} className="mail">
                  <div className="mail__head">
                    <Link className="strong" href={`/admin/leads/${r.lead_id}`}>{r.leads?.company_name ?? "Lead"}</Link>
                    {r.leads && <Status status={r.leads.status} />}
                    <time className="mail__time" dateTime={r.sent_at}>{fmtDate(r.sent_at)}</time>
                  </div>
                  <span className="mail__meta">{sender(r.from_name, r.from_email)}</span>
                  <span className="mail__subject">{r.subject || "(bez predmetu)"}</span>
                  {r.snippet && <p className="mail__snippet">{r.snippet}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-labelledby="mail-waiting">
          <div className="card__head">
            <h2 id="mail-waiting">Čakajú na pripomenutie <span className="count">{waiting.length}</span></h2>
            <span className="muted small">oslovené pred viac ako 7 dňami, bez odpovede</span>
          </div>
          {waiting.length === 0 ? (
            <p className="empty">Nikto nečaká dlhšie ako týždeň.</p>
          ) : (
            <ul className="list">
              {waiting.map((w) => (
                <li key={w.id}>
                  <Link className="list__row" href={`/admin/leads/${w.id}`}>
                    <span className="list__main">
                      <strong>{w.company_name}</strong>
                      <span>{[w.country, `posledný e-mail ${fmtDay(w.lastOut)}`].filter(Boolean).join(" · ")}</span>
                    </span>
                    <span className="due due--late">{w.days} {plural(w.days, "deň", "dni", "dní")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }} aria-labelledby="mail-all">
        <div className="card__head">
          <h2 id="mail-all">Všetka zaznamenaná pošta</h2>
          <nav className="seg" aria-label="Filter pošty">
            {(Object.keys(FILTERS) as Filter[]).map((f) => (
              <Link key={f} href={href({ filter: f })} scroll={false} aria-current={f === filter ? "true" : undefined}>{FILTERS[f]}</Link>
            ))}
          </nav>
        </div>
        {rows.length === 0 ? (
          <p className="empty">{filter === "all" ? "Zatiaľ žiadne e-maily k leadom." : "Pre tento filter tu nič nie je."}</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Posledných 50 zaznamenaných e-mailov</caption>
              <thead><tr><th>Dátum</th><th>Firma</th><th>Typ</th><th>Od → komu</th><th>Predmet</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="nowrap">{fmtDate(r.sent_at)}</td>
                    <td className="wrap"><Link className="strong" href={`/admin/leads/${r.lead_id}`}>{r.leads?.company_name ?? "Lead"}</Link></td>
                    <td><MailBadge direction={r.direction} kind={r.kind} /></td>
                    <td className="wrap small">{mailRoute(r)}</td>
                    <td className="wrap">{r.subject || <span className="muted">(bez predmetu)</span>}{r.snippet && <span className="sub clamp">{r.snippet}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
