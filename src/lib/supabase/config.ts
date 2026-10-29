const SUPABASE_ENV = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const;

/** Names (never values) of the Supabase env vars that are empty. */
export function missingSupabaseEnv(): string[] {
  return SUPABASE_ENV.filter((name) => !process.env[name]);
}

export function supabaseConfigured(): boolean {
  return missingSupabaseEnv().length === 0;
}
