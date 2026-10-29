import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Login for the local admin preview (see mode.ts): an e-mail from ADMIN_EMAILS plus
 * DEMO_ADMIN_PASSWORD from .env.local. The session cookie is `email|issuedAt|HMAC`, keyed by that
 * password and a per-process nonce: it expires after 12 hours on the server too, and signing out
 * (or changing the password, or restarting the server) ends every session.
 */

const COOKIE = "kt_demo_session";
const MAX_AGE_S = 60 * 60 * 12;

// On globalThis, so hot reloads and the separately bundled server actions see the same nonce.
const g = globalThis as unknown as { __ktDemoNonce?: string };
const nonce = () => (g.__ktDemoNonce ??= randomBytes(16).toString("hex"));

const sign = (email: string, issuedAt: string) =>
  createHmac("sha256", process.env.DEMO_ADMIN_PASSWORD ?? "").update(`${nonce()}|${email}|${issuedAt}`).digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function demoUser() {
  if (!process.env.DEMO_ADMIN_PASSWORD) return null;
  const [email, issuedAt, mac] = ((await cookies()).get(COOKIE)?.value ?? "").split("|");
  if (!email || !issuedAt || !mac || !same(mac, sign(email, issuedAt))) return null;
  const age = Date.now() / 1000 - Number(issuedAt);
  if (!(age >= -60 && age <= MAX_AGE_S)) return null;
  return { id: "demo", email };
}

export async function demoSignIn(email: string, password: string): Promise<boolean> {
  const expected = process.env.DEMO_ADMIN_PASSWORD;
  if (!expected || !same(password, expected)) return false;
  const issuedAt = String(Math.floor(Date.now() / 1000));
  (await cookies()).set(COOKIE, `${email}|${issuedAt}|${sign(email, issuedAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE_S,
  });
  return true;
}

export async function demoSignOut() {
  // A new nonce makes every cookie issued so far invalid, including copies of this one.
  g.__ktDemoNonce = randomBytes(16).toString("hex");
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
