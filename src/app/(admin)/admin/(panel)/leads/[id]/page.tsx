import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { Due, PRE_CONTACT, Score, Status, STATUSES, statusLabel, sourceLabel, fmtDate, fmtDay } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/SubmitButton";
import PageNotice from "@/components/admin/PageNotice";
import Icon from "@/components/admin/Icon";
import { plural } from "@/lib/plural";
import { erasureTerms, leadInquiryIds, otherLeadsWithContacts, REDACTED } from "@/lib/erase";
import { NEXT_ACTION } from "@/lib/inquiries";
import { deleteLead, enrich, logContacted, rewriteOutreach, updateLead } from "../../../actions";

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
  market_report: "Analýza trhu",
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

export default async function LeadDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ existing?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { existing } = await searchParams;
  const [{ data: lead }, { data: events }, { data: inquiry }] = await Promise.all([
    db().from("leads").select("*, campaigns(name)").eq("id", id).single(),
    db().from("lead_events").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    db().from("inquiries").select("locale, created_at").eq("lead_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!lead) notFound();

  const signals = (lead.signals ?? []) as Signal[];
  const contacts = (lead.contacts ?? []) as Contact[];
  const mailTo = contacts.find((c) => c.email)?.email ?? "";
  const mailHref = `mailto:${mailTo}?subject=${encodeURIComponent(lead.outreach_subject ?? "")}&body=${encodeURIComponent(lead.outreach_body ?? "")}`;
  // Inbound leads only have the domain of the sender's e-mail.
  const website = lead.website || (lead.domain ? `https://${lead.domain}` : null);
  const site = website ? (website.startsWith("http") ? website : `https://${website}`) : null;
  const place = [lead.city, lead.country].filter(Boolean).join(", ");
  const eventCount = (events ?? []).length;
  const inquiries = (await leadInquiryIds(lead.id, contacts)).length;
  const terms = erasureTerms(contacts);
  const others = await otherLeadsWithContacts(lead.id, contacts);
  const otherLabel = (o: (typeof others)[number]) => `${statusLabel[o.status] ?? o.status}, pridaný ${fmtDay(o.created_at)}`;
  const othersIntro = `Rovnaký e-mail kontaktu má aj ${others.length === 1 ? "lead" : "leady"}`;
  const othersAdvice = `pri žiadosti o vymazanie údajov ${others.length === 1 ? "zmažte aj ten" : "zmažte aj tie"}.`;
  const othersText = others.length
    ? `${othersIntro} ${others.map((o) => `„${o.company_name}“ (${otherLabel(o)})`).join(", ")} – ${othersAdvice}`
    : "";
  // While the inquiry still waits for a reply that nobody has drafted (e.g. the AI step was skipped), Claude
  // replies in the language the customer used on the website, even over an older cold outreach draft.
  const inquiryAt = inquiry?.created_at ? Date.parse(inquiry.created_at) : NaN;
  const replyDrafted = (events ?? []).some(
    (e) => Date.parse(e.created_at) > inquiryAt && (e.type === "outreach" || (e.type === "ai" && /návrh odpovede/i.test(e.body ?? ""))),
  );
  const inquiryLanguage =
    lead.next_action === NEXT_ACTION && !replyDrafted && LANGS.includes(inquiry?.locale ?? "") ? inquiry!.locale : null;
  const draftLanguage = inquiryLanguage ?? lead.outreach_language ?? "en";
  const deleteConfirm = [
    `Naozaj zmazať lead „${lead.company_name}“?`,
    `Zmaže sa lead s kontaktmi a signálmi, jeho história (${eventCount} ${plural(eventCount, "záznam", "záznamy", "záznamov")})` +
      (inquiries
        ? ` a ${inquiries} ${plural(inquiries, "dopyt", "dopyty", "dopytov")} z webu ` +
          `(${plural(inquiries, "priradený k leadu alebo odoslaný", "priradené k leadu alebo odoslané", "priradených k leadu alebo odoslaných")} z e-mailov jeho kontaktov).`
        : "."),
    terms.emails.length || terms.names.length || terms.phones.length || terms.profiles.length
      ? `Mená, e-maily, telefónne čísla a LinkedIn profily kontaktov sa v logoch AI vyhľadávania nahradia textom „${REDACTED}“.`
      : "",
    othersText,
    "Ďalšie AI vyhľadávanie môže firmu z verejných zdrojov nájsť znova.",
    "Zmazanie sa nedá vrátiť.",
  ]
    .filter(Boolean)
    .join(" ");
  // A won customer or a meeting keeps its status; the button then only records the sent e-mail.
  const promotes = PRE_CONTACT.includes(lead.status);

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
            <SubmitButton
              pending="Ukladám…"
              title={promotes ? "Stav sa zmení na Oslovený a odoslaný e-mail sa zapíše do histórie." : "Zapíše odoslaný e-mail do histórie, stav sa nezmení."}
            >
              {promotes ? <><Icon name="check" />Označiť ako oslovený</> : <><Icon name="mail" />Zapísať odoslaný e-mail</>}
            </SubmitButton>
          </form>
          <form action={enrich}>
            <input type="hidden" name="id" value={lead.id} />
            <SubmitButton pending="Claude hľadá… (1–2 min)"><Icon name="refresh" />Preskúmať znova s Claude</SubmitButton>
          </form>
        </div>
      </header>

      {existing && (
        <PageNotice param="existing">
          Firma s doménou {lead.domain ?? lead.website} už v zozname je – otvorili sme existujúci lead.
        </PageNotice>
      )}

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
                {/* Keyed by the saved status: React applies defaultValue only on mount, so after a save or
                    "Označiť ako oslovený" the form reset would bring back the old status and the next save would write it. */}
                <select key={lead.status} name="status" defaultValue={lead.status}>
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
                  <select key={draftLanguage} name="language" defaultValue={draftLanguage}>
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

          <form action={deleteLead} className="card card--danger">
            <input type="hidden" name="id" value={lead.id} />
            <div className="card__head">
              <div>
                <h2>Zmazať lead</h2>
                <p>
                  Pri spame, testovacom zázname alebo žiadosti o vymazanie údajov. Zmaže lead s kontaktmi a históriou a dopyty
                  z webu priradené k nemu alebo odoslané z e-mailov jeho kontaktov (okrem dopytov iných leadov). V logoch AI
                  vyhľadávania nahradí mená, e-maily, telefónne čísla a LinkedIn profily kontaktov textom „{REDACTED}“.
                  Ďalšie AI vyhľadávanie môže firmu z verejných zdrojov nájsť znova.
                </p>
                {others.length > 0 && (
                  <p className="notice notice--demo" style={{ marginTop: 10 }}>
                    {othersIntro}{" "}
                    {others.map((o, i) => (
                      <span key={o.id}>
                        {i > 0 && ", "}
                        <Link href={`/admin/leads/${o.id}`}>„{o.company_name}“</Link> ({otherLabel(o)})
                      </span>
                    ))}{" "}
                    – {othersAdvice}
                  </p>
                )}
              </div>
            </div>
            <div className="card__foot">
              <SubmitButton className="abtn abtn--danger" pending="Mažem…" confirm={deleteConfirm}>
                <Icon name="trash" />Zmazať lead
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
