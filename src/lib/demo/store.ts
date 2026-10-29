import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { seed } from "./seed";

/*
 * In-memory stand-in for the service-role Supabase client, used only by the local
 * preview (see mode.ts). It implements the small part of the PostgREST query builder
 * the app uses and mirrors the defaults and constraints of supabase/migrations.
 * Data lives until the dev server restarts.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
type Tables = Record<string, Row[]>;
type DbError = { message: string; code: string };
type Result = { data: unknown; error: DbError | null; count: number | null };

const now = () => new Date().toISOString();

const DEFAULTS: Record<string, () => Row> = {
  campaigns: () => ({
    active: true, countries: [], industries: [], roles: [], notes: "", outreach_language: "auto",
    leads_per_run: 10, last_run_at: null, created_at: now(),
  }),
  lead_runs: () => ({
    campaign_id: null, trigger: "manual", status: "running", found: 0, created: 0, log: "", error: null,
    usage: {}, started_at: now(), finished_at: null,
  }),
  leads: () => ({
    domain: null, website: null, country: null, city: null, industry: null, company_size: null, description: null,
    signals: [], contacts: [], score: null, tier: null, qualification: null, recommended_roles: [],
    outreach_language: null, outreach_subject: null, outreach_body: null, status: "new", source: "manual",
    campaign_id: null, run_id: null, next_action: null, next_action_at: null, notes: "",
    created_at: now(), updated_at: now(),
  }),
  lead_events: () => ({ body: "", created_at: now() }),
  inquiries: () => ({
    phone: null, country: null, positions: null, headcount: null, start_date: null, message: null, locale: null,
    lead_id: null, created_at: now(),
  }),
  settings: () => ({ updated_at: now() }),
};

const PRIMARY_KEY: Record<string, string> = { settings: "key" };
const UNIQUE: Record<string, string[]> = { leads: ["domain"] };
/** Embeddable relations, e.g. `select("*, campaigns(name)")`. */
const EMBEDS: Record<string, { fk: string; table: string }> = { campaigns: { fk: "campaign_id", table: "campaigns" } };
const ON_DELETE: Record<string, { table: string; fk: string; cascade: boolean }[]> = {
  campaigns: [
    { table: "lead_runs", fk: "campaign_id", cascade: false },
    { table: "leads", fk: "campaign_id", cascade: false },
  ],
  lead_runs: [{ table: "leads", fk: "run_id", cascade: false }],
  leads: [
    { table: "lead_events", fk: "lead_id", cascade: true },
    { table: "inquiries", fk: "lead_id", cascade: false },
  ],
};

// Kept on globalThis so the data survives hot reloads of this module in dev.
const g = globalThis as unknown as { __ktDemoTables?: Tables };
function tables(): Tables {
  return (g.__ktDemoTables ??= seed());
}

function project(row: Row, cols: string): Row {
  let out: Row = {};
  for (const raw of cols.split(/,(?![^(]*\))/)) {
    const part = raw.trim();
    if (!part) continue;
    if (part === "*") {
      out = { ...out, ...row };
      continue;
    }
    const embed = part.match(/^(\w+)\((.*)\)$/);
    if (embed) {
      const rel = EMBEDS[embed[1]];
      const target = rel && tables()[rel.table]?.find((r) => r.id === row[rel.fk]);
      out[embed[1]] = target ? project(target, embed[2]) : null;
      continue;
    }
    out[part] = row[part] ?? null;
  }
  return structuredClone(out);
}

type Order = { col: string; asc: boolean; nullsFirst: boolean };
function sorted(rows: Row[], orders: Order[]): Row[] {
  return [...rows].sort((a, b) => {
    for (const { col, asc, nullsFirst } of orders) {
      const x = a[col] ?? null;
      const y = b[col] ?? null;
      if (x === y) continue;
      if (x === null) return nullsFirst ? -1 : 1;
      if (y === null) return nullsFirst ? 1 : -1;
      return (x < y ? -1 : 1) * (asc ? 1 : -1);
    }
    return 0;
  });
}

class Query implements PromiseLike<Result> {
  private op: "select" | "insert" | "upsert" | "update" | "delete" = "select";
  private cols = "*";
  private returning = false;
  private payload: Row[] = [];
  private patch: Row = {};
  private filters: ((r: Row) => boolean)[] = [];
  private orders: Order[] = [];
  private max: number | null = null;
  private offset = 0;
  private one: "single" | "maybe" | null = null;
  private head = false;
  private counting = false;

  constructor(private table: string) {}

  select(cols = "*", opts?: { count?: string; head?: boolean }) {
    this.cols = cols;
    if (this.op === "select") {
      this.head = Boolean(opts?.head);
      this.counting = Boolean(opts?.count);
    } else this.returning = true;
    return this;
  }
  insert(values: Row | Row[]) {
    this.op = "insert";
    this.payload = [values].flat();
    return this;
  }
  upsert(values: Row | Row[]) {
    this.op = "upsert";
    this.payload = [values].flat();
    return this;
  }
  update(values: Row) {
    this.op = "update";
    this.patch = values;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }

  private where(test: (r: Row) => boolean) {
    this.filters.push(test);
    return this;
  }
  eq(col: string, value: unknown) {
    return this.where((r) => r[col] === value);
  }
  neq(col: string, value: unknown) {
    return this.where((r) => r[col] !== value);
  }
  in(col: string, values: unknown[]) {
    return this.where((r) => values.includes(r[col]));
  }
  is(col: string, value: null | boolean) {
    return this.where((r) => (r[col] ?? null) === value);
  }
  not(col: string, operator: string, value: unknown) {
    if (operator === "is") return this.where((r) => (r[col] ?? null) !== value);
    if (operator === "in") {
      // PostgREST takes a raw list, e.g. not("status", "in", "(won,lost)"); NULL is never "not in" a list.
      const list = String(value).replace(/^\(|\)$/g, "").split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      return this.where((r) => r[col] != null && !list.includes(String(r[col])));
    }
    throw new Error(`Demo database: not.${operator} is not supported`);
  }
  ilike(col: string, pattern: string) {
    const source = pattern.split("%").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    const re = new RegExp(`^${source}$`, "i");
    return this.where((r) => re.test(String(r[col] ?? "")));
  }
  gte(col: string, value: unknown) {
    return this.where((r) => r[col] != null && r[col] >= (value as string));
  }
  lte(col: string, value: unknown) {
    return this.where((r) => r[col] != null && r[col] <= (value as string));
  }
  lt(col: string, value: unknown) {
    return this.where((r) => r[col] != null && r[col] < (value as string));
  }
  contains(col: string, values: unknown[]) {
    return this.where((r) => Array.isArray(r[col]) && values.every((v) => r[col].includes(v)));
  }
  order(col: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    const asc = opts?.ascending ?? true;
    // Postgres default: NULLS LAST ascending, NULLS FIRST descending.
    this.orders.push({ col, asc, nullsFirst: opts?.nullsFirst ?? !asc });
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  range(from: number, to: number) {
    this.offset = from;
    this.max = to - from + 1;
    return this;
  }
  single() {
    this.one = "single";
    return this;
  }
  maybeSingle() {
    this.one = "maybe";
    return this;
  }

  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return Promise.resolve()
      .then(() => this.run())
      .then(onfulfilled, onrejected);
  }

  private create(values: Row): Row {
    return { id: randomUUID(), ...DEFAULTS[this.table]?.(), ...values };
  }

  private clash(row: Row, rows: Row[]): DbError | null {
    const col = (UNIQUE[this.table] ?? []).find((c) => row[c] != null && rows.some((r) => r !== row && r[c] === row[c]));
    return col
      ? { code: "23505", message: `duplicate key value violates unique constraint "${this.table}_${col}_key"` }
      : null;
  }

  private run(): Result {
    const all = tables();
    const rows = (all[this.table] ??= []);
    const matching = () => rows.filter((r) => this.filters.every((test) => test(r)));
    let out: Row[];

    switch (this.op) {
      case "select": {
        const found = sorted(matching(), this.orders);
        const count = this.counting ? found.length : null;
        if (this.head) return { data: null, error: null, count };
        // Like PostgREST: with a count, an offset past the last row is a 416.
        if (this.counting && this.offset > found.length) {
          return { data: null, error: { code: "PGRST103", message: "Requested range not satisfiable" }, count: null };
        }
        out = found.slice(this.offset, this.max == null ? undefined : this.offset + this.max);
        if (!this.one) return { data: out.map((r) => project(r, this.cols)), error: null, count };
        break;
      }
      case "insert": {
        out = this.payload.map((p) => this.create(p));
        for (const row of out) {
          const error = this.clash(row, [...rows, ...out]);
          if (error) return { data: null, error, count: null };
        }
        rows.push(...out);
        break;
      }
      case "upsert": {
        const key = PRIMARY_KEY[this.table] ?? "id";
        out = this.payload.map((p) => {
          const existing = rows.find((r) => r[key] === p[key]);
          if (existing) return Object.assign(existing, p);
          const row = this.create(p);
          rows.push(row);
          return row;
        });
        break;
      }
      case "update": {
        out = matching();
        for (const row of out) {
          const error = this.clash({ ...row, ...this.patch }, rows.filter((r) => r !== row));
          if (error) return { data: null, error, count: null };
        }
        const touch = this.table === "leads" ? { updated_at: now() } : {};
        for (const row of out) Object.assign(row, this.patch, touch);
        break;
      }
      case "delete": {
        out = matching();
        const gone = new Set(out.map((r) => r.id));
        all[this.table] = rows.filter((r) => !gone.has(r.id));
        for (const rule of ON_DELETE[this.table] ?? []) {
          const dependants = all[rule.table] ?? [];
          if (rule.cascade) all[rule.table] = dependants.filter((r) => !gone.has(r[rule.fk]));
          else for (const r of dependants) if (gone.has(r[rule.fk])) r[rule.fk] = null;
        }
        break;
      }
    }

    if (this.op !== "select" && !this.returning) return { data: null, error: null, count: null };
    const data = out.map((r) => project(r, this.cols));
    if (!this.one) return { data, error: null, count: null };
    if (data.length === 1) return { data: data[0], error: null, count: null };
    if (data.length === 0 && this.one === "maybe") return { data: null, error: null, count: null };
    return { data: null, error: { code: "PGRST116", message: `JSON object requested, ${data.length} rows returned` }, count: null };
  }
}

export function demoClient(): SupabaseClient {
  return { from: (table: string) => new Query(table) } as unknown as SupabaseClient;
}
