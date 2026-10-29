/*
 * Abuse limits for the public inquiry endpoint. Render runs a single instance (render.yaml),
 * so per-process memory is enough to throttle one sender.
 */

const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 5;
const MAX_TRACKED = 10_000;

const hits = new Map<string, number[]>();
let lastSweep = 0;

/** First X-Forwarded-For hop: Render's proxy puts the client address first. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Counts a request from `key` and says whether it is over 5 requests in 10 minutes. */
export function rateLimited(key: string): boolean {
  const now = Date.now();
  if (now - lastSweep > WINDOW_MS || hits.size >= MAX_TRACKED) {
    for (const [k, times] of hits) if (times[times.length - 1] <= now - WINDOW_MS) hits.delete(k);
    lastSweep = now;
  }
  const recent = (hits.get(key) ?? []).filter((t) => t > now - WINDOW_MS);
  const limited = recent.length >= PER_WINDOW;
  if (!limited) recent.push(now);
  // Re-insert so the Map stays ordered from longest-idle to most recent sender.
  hits.delete(key);
  hits.set(key, recent);
  if (hits.size > MAX_TRACKED) hits.delete(hits.keys().next().value!);
  return limited;
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
