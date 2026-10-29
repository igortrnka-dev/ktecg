import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { Due, Score, Status, STATUSES, statusLabel, sourceLabel, fmtDate, fmtDay } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/SubmitButton";
import Icon from "@/components/admin/Icon";
import { enrich, logContacted, rewriteOutreach, updateLead } from "../../../actions";

type Signal = { type: string; detail: string; url: string };
type Contact = { name: string; role: string; email: string; phone: string; linkedin: string };

const LANGS = ["en", "de", "fr", "sv", "sk", "cs", "pl", "nl", "da", "no", "fi", "it", "es", "hu"];

const signalLabel: Record<string, string> = {
  job_ads: "Pracovné inzeráty",
  expansion: "Expanzia",
  project_win: "Nový projekt",
  outage: "Odstávka",
  labour_shortage: "Nedostatok ľudí",
  tender: "Tender",
  inbound_request: "Dopyt z webu",
};

const eventLabel: Record<string, string> = {
  created: "Pridaný",
  status: "Zmena stavu",
  ai: "Claude",
  outreach: "Oslovenie",
  inquiry: "Dopyt z webu",
};

/** Status changes are stored as "qualified → contacted"; show them with the Slovak names. */
function eventBody(type: string, body: string) {
  if (type !== "status") return body;
  return body.split(" → ").map((s) => statusLabel[s] ?? s).join(" → ");
}

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [{ data: lead }, { data: events }] = await Promise.all([
    db().from("leads").select("*, campaigns(name)").eq("id", id).single(),
    db().from("lead_events").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);
  if (!lead) notFound();

  const signals = (lead.signals ?? []) as Signal[];
  const contacts = (lead.contacts ?? []) as Contact[];
  const mailTo = contacts.find((c) => c.email)?.email ?? "";
  const mailHref = `mailto:${mailTo}?subject=${encodeURIComponent(lead.outreach_subject ?? "")}&body=${encodeURIComponent(lead.outreach_body ?? "")}`;
  const site = lead.website ? (lead.website.startsWith("http") ? lead.website : `https://${lead.website}`) : null;
  const place = [lead.city, lead.country].filter(Boolean).join(", ");

  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <Link href="/admin/leads" className="crumb"><Icon name="back" size={14} />Leady</Link>
          <h1>{lead.company_name}</h1>
          <div className="page-meta">
            <Score score={lead.score} tier={lead.tier} />
            <Status status={lead.status} />
            {lead.industry && <span>{lead.industry}</span>}
            {place && <span>{place}</span>}
            {lead.company_size && <span>{lead.company_size} zamestnancov</span>}
            {site && <a className="link" href={site} target="_blank" rel="noreferrer">{lead.domain ?? lead.website}<Icon name="external" size={13} /></a>}
          </div>
        </div>
        <div className="head-actions">
          <form action={logContacted}>
            <input type="hidden" name="id" value={lead.id} />
            <SubmitButton pending="Ukladám…"><Icon name="check" />Označiť ako oslovený</SubmitButton>
          </form>
          <form action={enrich}>
            <input type="hidden" name="id" value={lead.id} />
            <SubmitButton pending="Claude hľadá… (1–2 min)"><Icon name="refresh" />Preskúmať znova s Claude</SubmitButton>
          </form>
        </div>
      </header>

      <div className="grid-detail">
        <div className="stack">
          <section className="card">
            <div className="card__head"><h2>Prečo táto firma</h2></div>
            <div className="card__body">
              <p className="prose">{lead.qualification || <span className="muted">Zatiaľ bez hodnotenia. Kliknite na „Preskúmať znova s Claude“.</span>}</p>
              {lead.description && <p className="muted">{lead.description}</p>}
              {lead.recommended_roles?.length > 0 && (
                <div className="stack" style={{ gap: 8 }}>
                  <h3>Pozície, ktoré im môžeme ponúknuť</h3>
                  <div className="tags">{lead.recommended_roles.map((r: string) => <span key={r} className="tag">{r}</span>)}</div>
                </div>
              )}
              <dl className="facts">
                <dt>Zdroj</dt><dd>{sourceLabel(lead.source)}{lead.campaigns?.name ? `, kampaň ${lead.campaigns.name}` : ""}</dd>
                <dt>Pridané</dt><dd>{fmtDate(lead.created_at)}</dd>
              </dl>
            </div>
          </section>

          <section className="card">
            <div className="card__head"><h2>Signály <span className="count">{signals.length}</span></h2></div>
            {signals.length === 0 ? (
              <p className="empty">Žiadne signály.</p>
            ) : (
              <ul className="list">
                {signals.map((s, i) => (
                  <li key={i} className="list__row signal">
                    <span className="tag">{signalLabel[s.type] ?? s.type.replaceAll("_", " ")}</span>
                    <span>{s.detail}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="link">Zdroj<Icon name="external" size={12} /></a>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card__head"><h2>Kontakty <span className="count">{contacts.length}</span></h2></div>
            {contacts.length === 0 ? (
              <p className="empty">Žiadne verejné kontakty.</p>
            ) : (
              <ul className="list">
                {contacts.map((c, i) => (
                  <li key={i} className="contact">
                    <span className="list__main"><strong>{c.name || "Bez mena"}</strong><span>{c.role}</span></span>
                    <span className="contact__links">
                      {c.email && <a href={`mailto:${c.email}`}><Icon name="mail" size={14} />{c.email}</a>}
                      {c.phone && <a href={`tel:${c.phone}`}><Icon name="phone" size={14} />{c.phone}</a>}
                      {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer"><Icon name="link" size={14} />LinkedIn</a>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card__head"><h2>História</h2></div>
            {(events ?? []).length === 0 ? (
              <p className="empty">Zatiaľ bez záznamov.</p>
            ) : (
              <ol className="timeline">
                {(events ?? []).map((e) => (
                  <li key={e.id}>
                    <div>
                      <time dateTime={e.created_at}>{fmtDate(e.created_at)} · {eventLabel[e.type] ?? e.type}</time>
                      {eventBody(e.type, e.body)}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className="stack">
          <form action={updateLead} className="card">
            <input type="hidden" name="id" value={lead.id} />
            <div className="card__head">
              <h2>Stav a ďalší krok</h2>
              {lead.next_action_at && <Due date={lead.next_action_at} />}
            </div>
            <div className="card__body">
              <label className="afield">
                <span>Stav</span>
                <select name="status" defaultValue={lead.status}>
                  {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
              </label>
              <div className="row2">
                <label className="afield"><span>Ďalší krok</span><input name="next_action" defaultValue={lead.next_action ?? ""} placeholder="napr. zavolať Thomasovi" /></label>
                <label className="afield"><span>Termín</span><input type="date" name="next_action_at" defaultValue={lead.next_action_at ?? ""} /></label>
              </div>
              <label className="afield"><span>Poznámky</span><textarea name="notes" rows={4} defaultValue={lead.notes} /></label>
            </div>
            <div className="card__foot">
              <SubmitButton className="abtn abtn--primary" pending="Ukladám…">Uložiť</SubmitButton>
              {lead.next_action_at && <span className="muted small">Termín: {fmtDay(lead.next_action_at)}</span>}
            </div>
          </form>

          <form action={updateLead} className="card">
            <input type="hidden" name="id" value={lead.id} />
            <div className="card__head">
              <h2>E-mail na oslovenie</h2>
              {lead.outreach_language && <span className="tag">{lead.outreach_language.toUpperCase()}</span>}
            </div>
            <div className="card__body">
              <label className="afield"><span>Predmet</span><input name="outreach_subject" defaultValue={lead.outreach_subject ?? ""} /></label>
              <label className="afield"><span>Text</span><textarea name="outreach_body" rows={12} defaultValue={lead.outreach_body ?? ""} /></label>
            </div>
            <div className="card__foot">
              <SubmitButton className="abtn abtn--primary" pending="Ukladám…">Uložiť e-mail</SubmitButton>
              <a className="abtn" href={mailHref}><Icon name="mail" />Otvoriť v pošte</a>
            </div>
          </form>

          <form action={rewriteOutreach} className="card">
            <input type="hidden" name="id" value={lead.id} />
            <div className="card__head">
              <div>
                <h2>Napísať e-mail znova s Claude</h2>
                <p>Claude prepíše e-mail vyššie podľa jazyka a pokynov.</p>
              </div>
            </div>
            <div className="card__body">
              <div className="row2">
                <label className="afield">
                  <span>Jazyk</span>
                  <select name="language" defaultValue={lead.outreach_language ?? "en"}>
                    {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                  </select>
                </label>
                <label className="afield"><span>Pokyny (nepovinné)</span><input name="instructions" placeholder="napr. kratšie, spomeň odstávku v marci" /></label>
              </div>
            </div>
            <div className="card__foot">
              <SubmitButton pending="Claude píše…"><Icon name="pen" />Napísať znova</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
