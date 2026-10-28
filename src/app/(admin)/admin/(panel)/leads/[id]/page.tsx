import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/supabase/admin";
import { Score, Status, STATUSES, statusLabel, sourceLabel, fmtDate } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/SubmitButton";
import { enrich, logContacted, rewriteOutreach, updateLead } from "../../../actions";

type Signal = { type: string; detail: string; url: string };
type Contact = { name: string; role: string; email: string; phone: string; linkedin: string };

const LANGS = ["en", "de", "fr", "sv", "sk", "cs", "pl", "nl", "da", "no", "fi", "it", "es", "hu"];

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <>
      <header className="page-head">
        <div>
          <Link href="/admin/leads" className="muted back">← Leady</Link>
          <h1>{lead.company_name}</h1>
          <p className="muted">
            {[lead.industry, [lead.city, lead.country].filter(Boolean).join(", "), lead.company_size].filter(Boolean).join(" · ")}
            {lead.website && <> · <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer">{lead.domain ?? lead.website} ↗</a></>}
          </p>
        </div>
        <div className="head-right">
          <Score score={lead.score} tier={lead.tier} />
          <Status status={lead.status} />
          <form action={enrich}>
            <input type="hidden" name="id" value={lead.id} />
            <SubmitButton pending="Claude hľadá… (1–2 min)">↻ Preskúmať znova s Claude</SubmitButton>
          </form>
        </div>
      </header>

      <div className="grid2 grid2--wide">
        <div className="stack">
          <section className="card">
            <h2>Kvalifikácia</h2>
            <p>{lead.qualification || <span className="muted">Zatiaľ bez kvalifikácie. Kliknite na „Preskúmať znova“.</span>}</p>
            {lead.description && <p className="muted">{lead.description}</p>}
            {lead.recommended_roles?.length > 0 && (
              <div className="tags">{lead.recommended_roles.map((r: string) => <span key={r} className="tag">{r}</span>)}</div>
            )}
          </section>

          <section className="card">
            <h2>Signály</h2>
            {signals.length === 0 && <p className="muted">Žiadne.</p>}
            <ul className="signals">
              {signals.map((s, i) => (
                <li key={i}>
                  <span className="tag">{s.type}</span>
                  <span>{s.detail}</span>
                  {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="muted">zdroj ↗</a>}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Kontakty</h2>
            {contacts.length === 0 && <p className="muted">Žiadne verejné kontakty.</p>}
            <ul className="rows">
              {contacts.map((c, i) => (
                <li key={i} className="contact-row">
                  <span className="grow">{c.name}<small>{c.role}</small></span>
                  {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                  {c.phone && <a href={`tel:${c.phone}`}>{c.phone}</a>}
                  {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Aktivita</h2>
            <ul className="timeline-a">
              {(events ?? []).map((e) => (
                <li key={e.id}><span className="mono muted">{fmtDate(e.created_at)}</span> <span className="tag">{e.type}</span> {e.body}</li>
              ))}
            </ul>
            <p className="muted small">
              Zdroj: {sourceLabel(lead.source)}
              {lead.campaigns?.name ? ` · kampaň ${lead.campaigns.name}` : ""} · vytvorené {fmtDate(lead.created_at)}
            </p>
          </section>
        </div>

        <div className="stack">
          <form action={updateLead} className="card stack">
            <input type="hidden" name="id" value={lead.id} />
            <h2>Pipeline</h2>
            <label className="afield">
              <span>Stav</span>
              <select name="status" defaultValue={lead.status}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
            </label>
            <div className="row2">
              <label className="afield"><span>Ďalší krok</span><input name="next_action" defaultValue={lead.next_action ?? ""} /></label>
              <label className="afield"><span>Termín</span><input type="date" name="next_action_at" defaultValue={lead.next_action_at ?? ""} /></label>
            </div>
            <label className="afield"><span>Poznámky</span><textarea name="notes" rows={4} defaultValue={lead.notes} /></label>

            <h2>Oslovenie {lead.outreach_language && <span className="tag">{lead.outreach_language}</span>}</h2>
            <label className="afield"><span>Predmet</span><input name="outreach_subject" defaultValue={lead.outreach_subject ?? ""} /></label>
            <label className="afield"><span>Text e-mailu</span><textarea name="outreach_body" rows={12} defaultValue={lead.outreach_body ?? ""} /></label>
            <div className="actions">
              <SubmitButton className="abtn abtn--primary" pending="Ukladám…">Uložiť</SubmitButton>
              <a className="abtn" href={mailHref}>Otvoriť v e-maile</a>
            </div>
          </form>

          <div className="card stack">
            <form action={logContacted}>
              <input type="hidden" name="id" value={lead.id} />
              <SubmitButton pending="…">✓ Označiť ako oslovený</SubmitButton>
            </form>
            <form action={rewriteOutreach} className="stack">
              <input type="hidden" name="id" value={lead.id} />
              <h2>Prepísať oslovenie s Claude</h2>
              <div className="row2">
                <label className="afield">
                  <span>Jazyk</span>
                  <select name="language" defaultValue={lead.outreach_language ?? "en"}>
                    {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                  </select>
                </label>
                <label className="afield"><span>Pokyny</span><input name="instructions" placeholder="napr. kratšie, spomeň odstávku v marci" /></label>
              </div>
              <SubmitButton pending="Claude píše…">✎ Napísať znova</SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
