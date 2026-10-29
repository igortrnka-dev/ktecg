import { redirect } from "next/navigation";
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

export async function getAdmin() {
  if (isDemo()) return demoUser();
  if (!supabaseConfigured()) return null;
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !allowedEmails().includes(email)) return null;
  return data.user;
}

/** Use at the top of every admin page, server action and admin API route. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
