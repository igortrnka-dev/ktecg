import { db } from "../supabase/admin";

/** Where each folder was read up to; a new UIDVALIDITY means the server renumbered it and it is read again. */
export type FolderCursor = { uidvalidity: string; last_uid: number };
export type MailRunStats = { scanned: number; matched: number; saved: number; remaining: number };

/** Stored in settings under the key 'mail_sync'. */
export type MailSyncState = {
  folders: Record<string, FolderCursor>;
  last_run_at: string | null;
  last_ok_at: string | null;
  last_error: string | null;
  running_since: string | null;
  stats: MailRunStats | null;
};

const KEY = "mail_sync";
/** A run that started longer ago was cut off (restart, deploy) and no longer blocks the next one. */
export const LOCK_MS = 10 * 60 * 1000;
/** Opening the admin starts a sync in the background when the last one is older than this. */
export const AUTO_SYNC_MS = 5 * 60 * 1000;

const EMPTY: MailSyncState = { folders: {}, last_run_at: null, last_ok_at: null, last_error: null, running_since: null, stats: null };

export async function readMailState(): Promise<MailSyncState> {
  const { data, error } = await db().from("settings").select("value").eq("key", KEY).maybeSingle();
  if (error) throw new Error(error.message);
  const value = data?.value && typeof data.value === "object" ? (data.value as Partial<MailSyncState>) : {};
  return { ...EMPTY, ...value, folders: { ...value.folders } };
}

export async function writeMailState(state: MailSyncState) {
  const { error } = await db().from("settings").upsert({ key: KEY, value: state, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

export function isRunning(state: MailSyncState): boolean {
  return Boolean(state.running_since && Date.now() - Date.parse(state.running_since) < LOCK_MS);
}
