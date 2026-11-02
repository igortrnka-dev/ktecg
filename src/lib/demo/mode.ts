import { supabaseConfigured } from "../supabase/config";
import { mailConfigured } from "../mail/config";

/**
 * Local preview: `next dev` without Supabase keys serves the admin from in-memory
 * sample data, without login. Production builds inline NODE_ENV, so this is always off there.
 */
export function isDemo(): boolean {
  return process.env.NODE_ENV === "development" && !supabaseConfigured();
}

/** In the preview, AI steps are simulated unless an Anthropic key is present. */
export function simulateAi(): boolean {
  return isDemo() && !process.env.ANTHROPIC_API_KEY;
}

/** In the preview, the mailbox is simulated unless the IMAP settings are present. */
export function simulateMail(): boolean {
  return isDemo() && !mailConfigured();
}
