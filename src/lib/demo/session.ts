import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Login for the local admin preview (see mode.ts): an e-mail from ADMIN_EMAILS plus
 * DEMO_ADMIN_PASSWORD from .env.local. The session cookie is an HMAC keyed by that password,
 * so changing the password signs everyone out.
 */

const COOKIE = "kt_demo_session";

const sign = (email: string) =>
  createHmac("sha256", process.env.DEMO_ADMIN_PASSWORD ?? "").update(email).digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function demoUser() {
  if (!process.env.DEMO_ADMIN_PASSWORD) return null;
  const [email, mac] = ((await cookies()).get(COOKIE)?.value ?? "").split("|");
  if (!email || !mac || !same(mac, sign(email))) return null;
  return { id: "demo", email };
}

export async function demoSignIn(email: string, password: string): Promise<boolean> {
  const expected = process.env.DEMO_ADMIN_PASSWORD;
  if (!expected || !same(password, expected)) return false;
  (await cookies()).set(COOKIE, `${email}|${sign(email)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function demoSignOut() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
