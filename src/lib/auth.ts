import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "./supabase/server";
import { supabaseConfigured } from "./supabase/config";
import { isDemo } from "./demo/mode";
import { demoUser } from "./demo/session";

export function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Only accounts with a confirmed e-mail on the ADMIN_EMAILS allowlist get into the admin. */
export function isAdminUser(user: User | null | undefined): user is User {
  const email = user?.email?.toLowerCase();
  return Boolean(email && user?.email_confirmed_at && allowedEmails().includes(email));
}

// Cached per request: the panel layout and the page both check, and getUser() is a call to Supabase Auth.
export const getAdmin = cache(async () => {
  if (isDemo()) return demoUser();
  if (!supabaseConfigured()) return null;
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  return isAdminUser(data.user) ? data.user : null;
});

/** Use at the top of every admin page, server action and admin API route. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
