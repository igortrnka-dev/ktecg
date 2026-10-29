/*
 * Abuse limits for the public inquiry endpoint. Render runs a single instance (render.yaml),
 * so per-process memory is enough to throttle one sender.
 */

import { companyDomain } from "@/lib/inquiries";

const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 5;
const PER_SENDER = 5;
/** All inquiries together; far above real traffic, it only stops a flood from rotating addresses. */
const GLOBAL = 30;
const MAX_TRACKED = 10_000;

const hits = new Map<string, number[]>();
let globalHits: number[] = [];
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

/** Before validation: at most 5 requests in 10 minutes per client address. */
export function ipLimited(request: Request): boolean {
  return limited(`ip:${clientIp(request)}`, PER_IP);
}

/**
 * For a valid inquiry: at most 5 in 10 minutes per sender company domain (the whole address for
 * free-mail) and 30 in 10 minutes in total, so one sender rotating addresses cannot flood the pipeline.
 */
export function inquiryLimited(email: string): boolean {
  const now = Date.now();
  globalHits = recent(globalHits, now);
  if (globalHits.length >= GLOBAL) return true;
  const address = email.trim().toLowerCase();
  if (limited(`sender:${companyDomain(address) ?? address}`, PER_SENDER)) return true;
  globalHits.push(now);
  return false;
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
