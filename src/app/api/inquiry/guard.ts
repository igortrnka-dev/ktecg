/*
 * Abuse limits for the public inquiry endpoint. Render runs a single instance (render.yaml),
 * so per-process memory is enough to throttle one sender.
 */

import { companyDomain } from "@/lib/inquiries";

const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 5;
const PER_SENDER = 5;
/** All inquiries together; far above real traffic. Over it inquiries are saved without the Claude step. */
const GLOBAL = 30;
const MAX_TRACKED = 10_000;

const hits = new Map<string, number[]>();
let globalHits: number[] = [];
let floodWarnedAt = 0;
let lastSweep = 0;

/**
 * The visitor's address. Render's edge is Cloudflare, which sets CF-Connecting-IP (and True-Client-IP) to it,
 * replacing whatever the client sent. Render only appends to X-Forwarded-For, so its first hop is whatever
 * the client wrote there: that header is just the fallback for local development.
 */
export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip")?.trim() ||
    h.get("true-client-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

const recent = (times: number[], now: number) => times.filter((t) => t > now - WINDOW_MS);

/** Counts a request against `key` and says whether it is over `max` requests in 10 minutes; a refused request is not counted. */
function limited(key: string, max: number): boolean {
  const now = Date.now();
  if (now - lastSweep > WINDOW_MS || hits.size >= MAX_TRACKED) {
    for (const [k, times] of hits) if (times[times.length - 1] <= now - WINDOW_MS) hits.delete(k);
    lastSweep = now;
  }
  const times = recent(hits.get(key) ?? [], now);
  const over = times.length >= max;
  if (!over) times.push(now);
  // Re-insert so the Map stays ordered from longest-idle to most recent sender.
  hits.delete(key);
  hits.set(key, times);
  if (hits.size > MAX_TRACKED) hits.delete(hits.keys().next().value!);
  return over;
}

/** The 8 groups of an IPv6 address ("::" expanded, a trailing dotted IPv4 as two groups), or null if it is not one. */
function ipv6Groups(ip: string): number[] | null {
  let text = ip.replace(/%.*$/, ""); // zone id, e.g. fe80::1%eth0
  const v4 = text.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b, c, d] = v4.slice(1).map(Number);
    text = `${text.slice(0, v4.index)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = text.split("::");
  if (halves.length > 2) return null;
  const part = (s: string) => (s ? s.split(":") : []);
  const head = part(halves[0]);
  const tail = halves.length === 2 ? part(halves[1]) : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0) return null;
  const groups = [...head, ...Array<string>(fill).fill("0"), ...tail];
  if (groups.length !== 8 || !groups.every((g) => /^[0-9a-f]{1,4}$/.test(g))) return null;
  return groups.map((g) => parseInt(g, 16));
}

/**
 * The per-IP limit key. An IPv6 client gets a whole /64, so it is keyed by that prefix; an IPv4-mapped
 * IPv6 address (::ffff:a.b.c.d) counts as its IPv4 address.
 */
export function ipKey(ip: string): string {
  const s = ip.trim().toLowerCase();
  if (!s.includes(":")) return s;
  const withPort = s.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/); // "a.b.c.d:port" in a proxy header
  if (withPort) return withPort[1];
  const g = ipv6Groups(s);
  if (!g) return s;
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) return [g[6] >> 8, g[6] & 255, g[7] >> 8, g[7] & 255].join(".");
  return `${g.slice(0, 4).map((x) => x.toString(16)).join(":")}::/64`;
}

/** Before validation: at most 5 requests in 10 minutes per client address (per /64 for IPv6). */
export function ipLimited(request: Request): boolean {
  return limited(`ip:${ipKey(clientIp(request))}`, PER_IP);
}

/** For a valid inquiry: at most 5 in 10 minutes per sender company domain (the whole address for free-mail). */
export function senderLimited(email: string): boolean {
  const address = email.trim().toLowerCase();
  return limited(`sender:${companyDomain(address) ?? address}`, PER_SENDER);
}

/**
 * Counts a saved inquiry and says whether more than 30 arrived in 10 minutes. Over that the inquiry is
 * still saved and linked (a flood must not turn real buyers away); only the Claude step is skipped.
 */
export function floodReached(): boolean {
  const now = Date.now();
  globalHits = recent(globalHits, now);
  if (globalHits.length < GLOBAL) {
    globalHits.push(now);
    return false;
  }
  if (now - floodWarnedAt > WINDOW_MS) {
    floodWarnedAt = now;
    console.warn(`inquiry flood: more than ${GLOBAL} inquiries in 10 minutes, Claude is skipped until it calms down`);
  }
  return true;
}

/** The body as text, or null once it passes `limit` bytes (Content-Length can be missing or wrong). */
export async function readBody(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => {});
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}
