import { db } from "../supabase/admin";

/** PostgREST returns at most 1000 rows per request; `.in()` lists are kept short for the URL. */
const PAGE = 1000;
const CHUNK = 100;
const DAY = 864e5;

type Query<T> = (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

async function allRows<T>(query: Query<T>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await query(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if ((data ?? []).length < PAGE) return rows;
  }
}

const chunks = <T>(list: T[]) => Array.from({ length: Math.ceil(list.length / CHUNK) }, (_, i) => list.slice(i * CHUNK, (i + 1) * CHUNK));

type StatRow = { lead_id: string; direction: "in" | "out"; kind: string; sent_at: string; message_id: string };

export type CountryStats = { country: string; outreached: number; replied: number };
export type OutreachStats = {
  /** Leads with at least one sent normal e-mail in the period. */
  outreached: number;
  /** Of those, leads that wrote back (a normal e-mail) after the first one. */
  replied: number;
  medianHours: number | null;
  bounces: number;
  autoReplies: number;
  countries: CountryStats[];
};

export const NO_COUNTRY = "Neuvedená";

/** Null instead of the error page when lead_emails cannot be read (e.g. 0004_mail.sql not run yet); the page says so. */
export async function orNull<T>(stats: Promise<T>): Promise<T | null> {
  try {
    return await stats;
  } catch (err) {
    console.error("Mail stats failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** "Priebeh oslovovania" for the last `days` days. */
export async function outreachStats(days: number): Promise<OutreachStats> {
  const since = new Date(Date.now() - days * DAY).toISOString();
  const rows = await allRows<StatRow>((from, to) =>
    db().from("lead_emails").select("lead_id, direction, kind, sent_at, message_id").gte("sent_at", since).order("id").range(from, to),
  );
  const firstOut = new Map<string, number>();
  for (const r of rows) {
    if (r.direction !== "out" || r.kind !== "normal") continue;
    const t = Date.parse(r.sent_at);
    if (!firstOut.has(r.lead_id) || t < firstOut.get(r.lead_id)!) firstOut.set(r.lead_id, t);
  }
  const firstReply = new Map<string, number>();
  for (const r of rows) {
    const out = firstOut.get(r.lead_id);
    const t = Date.parse(r.sent_at);
    if (r.direction !== "in" || r.kind !== "normal" || out === undefined || t <= out) continue;
    if (!firstReply.has(r.lead_id) || t < firstReply.get(r.lead_id)!) firstReply.set(r.lead_id, t);
  }
  const distinct = (kind: string) => new Set(rows.filter((r) => r.kind === kind).map((r) => r.message_id)).size;

  const countryOf = new Map<string, string>();
  for (const ids of chunks([...firstOut.keys()])) {
    const { data, error } = await db().from("leads").select("id, country").in("id", ids);
    if (error) throw new Error(error.message);
    for (const l of data ?? []) countryOf.set(l.id, String(l.country ?? "").trim() || NO_COUNTRY);
  }
  const byCountry = new Map<string, CountryStats>();
  for (const id of firstOut.keys()) {
    const country = countryOf.get(id) ?? NO_COUNTRY;
    const entry = byCountry.get(country) ?? { country, outreached: 0, replied: 0 };
    entry.outreached++;
    if (firstReply.has(id)) entry.replied++;
    byCountry.set(country, entry);
  }

  return {
    outreached: firstOut.size,
    replied: firstReply.size,
    medianHours: median([...firstReply].map(([id, t]) => (t - firstOut.get(id)!) / 36e5)),
    bounces: distinct("bounce"),
    autoReplies: distinct("auto_reply"),
    countries: [...byCountry.values()].sort((a, b) => b.outreached - a.outreached || a.country.localeCompare(b.country, "sk")),
  };
}

export type WaitingLead = { id: string; company_name: string; country: string | null; lastOut: string; days: number };

/** Contacted leads whose last sent e-mail is over a week old and who have not written since, longest waiting first. */
export async function waitingLeads(): Promise<WaitingLead[]> {
  const leads = await allRows<{ id: string; company_name: string; country: string | null }>((from, to) =>
    db().from("leads").select("id, company_name, country").eq("status", "contacted").order("id").range(from, to),
  );
  const lastOut = new Map<string, number>();
  const lastIn = new Map<string, number>();
  for (const ids of chunks(leads.map((l) => l.id))) {
    const rows = await allRows<{ lead_id: string; direction: string; sent_at: string }>((from, to) =>
      db().from("lead_emails").select("lead_id, direction, sent_at").in("lead_id", ids).eq("kind", "normal").order("id").range(from, to),
    );
    for (const r of rows) {
      const map = r.direction === "out" ? lastOut : lastIn;
      map.set(r.lead_id, Math.max(map.get(r.lead_id) ?? 0, Date.parse(r.sent_at)));
    }
  }
  const weekAgo = Date.now() - 7 * DAY;
  return leads
    .filter((l) => {
      const out = lastOut.get(l.id);
      return out !== undefined && out < weekAgo && (lastIn.get(l.id) ?? 0) < out;
    })
    .map((l) => {
      const out = lastOut.get(l.id)!;
      return { ...l, lastOut: new Date(out).toISOString(), days: Math.floor((Date.now() - out) / DAY) };
    })
    .sort((a, b) => a.lastOut.localeCompare(b.lastOut));
}

/** Incoming normal e-mails in the last `days` days. */
export async function newRepliesCount(days: number): Promise<number> {
  const { count, error } = await db()
    .from("lead_emails")
    .select("id", { count: "exact", head: true })
    .eq("direction", "in")
    .eq("kind", "normal")
    .gte("sent_at", new Date(Date.now() - days * DAY).toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}
