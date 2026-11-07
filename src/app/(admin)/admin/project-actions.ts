"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { isDemo } from "@/lib/demo/mode";
import { locales } from "@/i18n/config";
import { divisionSlugs, sectorSlugs, type DivisionSlug, type SectorSlug } from "@/content/site";
import { partyRoles, type Party, type ProjectRecord, type ProjectText } from "@/content/projects";
import { SLUG_RE, fromRow, toRow, type ProjectRow } from "@/lib/project-rows";

const BUCKET = "project-photos";
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const PHOTO_MAX = 10 * 1024 * 1024;

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const int = (v: FormDataEntryValue | null) => {
  const n = Number.parseInt(str(v), 10);
  return Number.isFinite(n) ? n : null;
};

function check<R extends { error: { message: string } | null }>(result: R): R {
  if (result.error) throw new Error(result.error.message);
  return result;
}

/** The site pages that show projects: home, projects, project pages and the division pages, in every language. */
function refreshSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
}

/** Back to the form with a message in the URL (the form shows it), keeping what is already saved. */
function fail(id: string | null, message: string): never {
  redirect(`/admin/projects/${id ?? "new"}?error=${encodeURIComponent(message)}`);
}

/** Uploads one photo to the project-photos bucket and returns its public URL; in the local preview a data URL. */
async function upload(slug: string, file: File): Promise<string> {
  const ext = PHOTO_TYPES[file.type];
  if (!ext) throw new Error(`Fotka ${file.name} nie je JPG, PNG ani WebP.`);
  if (file.size > PHOTO_MAX) throw new Error(`Fotka ${file.name} má viac ako 10 MB.`);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (isDemo()) return `data:${file.type};base64,${bytes.toString("base64")}`;
  const path = `${slug}/${randomUUID()}.${ext}`;
  const storage = db().storage.from(BUCKET);
  const { error } = await storage.upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Fotku ${file.name} sa nepodarilo nahrať: ${error.message}`);
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Removes photos that are no longer used from the bucket; a failure only leaves an unused file behind. */
async function removePhotos(urls: string[]) {
  if (isDemo() || urls.length === 0) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const paths = urls.filter((u) => u.includes(marker)).map((u) => decodeURIComponent(u.split(marker)[1]));
  if (paths.length) await db().storage.from(BUCKET).remove(paths);
}

const files = (form: FormData, name: string) =>
  form.getAll(name).filter((f): f is File => typeof f === "object" && "size" in f && f.size > 0);

export async function saveProject(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id")) || null;
  const before = id
    ? fromRow(check(await db().from("projects").select("*").eq("id", id).single()).data as ProjectRow)
    : null;

  const slug = str(form.get("slug")).toLowerCase();
  if (!SLUG_RE.test(slug)) fail(id, "Adresa (slug) môže obsahovať len malé písmená bez diakritiky, číslice a pomlčky.");
  const periodFrom = int(form.get("period_from"));
  if (!periodFrom || periodFrom < 1990 || periodFrom > 2100) fail(id, "Vyplňte rok začiatku projektu.");
  const periodTo = int(form.get("period_to"));
  if (periodTo !== null && periodTo < periodFrom) fail(id, "Rok konca nemôže byť skôr ako rok začiatku.");
  const team = int(form.get("team"));
  const status = str(form.get("status"));
  const sector = str(form.get("sector"));
  const stock = str(form.get("stock_photo"));

  const parties: Party[] = [];
  for (let i = 0; i < 4; i++) {
    const role = str(form.get(`party_role_${i}`));
    const name = str(form.get(`party_name_${i}`));
    if (name && (partyRoles as readonly string[]).includes(role)) parties.push({ role: role as Party["role"], name });
  }

  const text: ProjectRecord["text"] = {};
  for (const l of locales) {
    const t = (k: string) => str(form.get(`${l}_${k}`));
    const entry: ProjectText = {
      title: t("title"),
      location: t("location"),
      industry: t("industry"),
      site: t("site") || undefined,
      name: t("name") || undefined,
      summary: t("summary"),
      description: t("description"),
      scope: t("scope").split("\n").map((s) => s.trim()).filter(Boolean),
    };
    if (entry.title) {
      if (!entry.location || !entry.industry || !entry.summary || !entry.description) {
        fail(id, `Jazyk ${l.toUpperCase()}: k názvu vyplňte aj krajinu, odvetvie, krátky text a popis – alebo nechajte názov prázdny, ak projekt v tomto jazyku nemá byť.`);
      }
      text[l] = entry;
    }
  }
  if (!text.sk) fail(id, "Vyplňte aspoň slovenskú verziu projektu.");

  // Photos: keep the ones still ticked, add the uploads; the main photo can be replaced or removed.
  let photo = before?.photo ?? null;
  let gallery = (before?.gallery ?? []).filter((u) => form.getAll("gallery_keep").includes(u));
  const dropped: string[] = (before?.gallery ?? []).filter((u) => !gallery.includes(u));
  try {
    const newMain = files(form, "photo_file")[0];
    if (newMain) {
      if (photo) dropped.push(photo);
      photo = await upload(slug, newMain);
    } else if (photo && form.get("photo_remove")) {
      dropped.push(photo);
      photo = null;
    }
    for (const f of files(form, "gallery_files")) gallery = [...gallery, await upload(slug, f)];
  } catch (e) {
    fail(id, e instanceof Error ? e.message : "Fotku sa nepodarilo nahrať.");
  }

  const record: ProjectRecord = {
    slug,
    position: before?.position ?? 0,
    published: form.get("published") === "on",
    sector: (sectorSlugs as readonly string[]).includes(sector) ? (sector as SectorSlug) : "manufacturing",
    divisions: form.getAll("divisions").map(String).filter((d): d is DivisionSlug => (divisionSlugs as readonly string[]).includes(d)),
    periodFrom,
    periodTo: periodTo === periodFrom ? null : periodTo,
    status: status === "ongoing" || status === "completed" ? status : null,
    team: team && team > 0 ? team : null,
    teamApprox: form.get("team_approx") === "on",
    parties,
    photo,
    gallery,
    stockPhoto: stock || null,
    approved: {
      parties: form.get("parties_approved") === "on",
      team: form.get("team_approved") === "on",
      photos: form.get("photos_approved") === "on",
    },
    text,
  };

  let savedId = id;
  if (before && id) {
    const res = await db().from("projects").update({ ...toRow(record), updated_at: new Date().toISOString() }).eq("id", id);
    if (res.error?.code === "23505") fail(id, `Adresu „${slug}“ už má iný projekt.`);
    check(res);
  } else {
    // A new project goes to the end of the list.
    const { data: last } = await db().from("projects").select("position").order("position", { ascending: false }).limit(1);
    record.position = ((last?.[0]?.position as number | undefined) ?? 0) + 1;
    const res = await db().from("projects").insert(toRow(record)).select("id").single();
    if (res.error?.code === "23505") fail(null, `Adresu „${slug}“ už má iný projekt.`);
    savedId = (check(res).data as { id: string }).id;
  }
  await removePhotos(dropped);
  refreshSite();
  redirect(`/admin/projects/${savedId}?saved=1`);
}

export async function deleteProject(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  const { data } = await db().from("projects").select("*").eq("id", id).single();
  check(await db().from("projects").delete().eq("id", id));
  if (data) {
    const p = fromRow(data as ProjectRow);
    await removePhotos([...(p.photo ? [p.photo] : []), ...p.gallery]);
  }
  refreshSite();
  redirect("/admin/projects?deleted=1");
}

/** Moves a project one place up or down; the positions are renumbered 1, 2, 3, … so they stay the card numbers. */
export async function moveProject(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  const dir = str(form.get("dir")) === "up" ? -1 : 1;
  const { data } = await db().from("projects").select("id, position").order("position", { ascending: true });
  const ids = ((data ?? []) as { id: string }[]).map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((pid, k) => db().from("projects").update({ position: k + 1 }).eq("id", pid)));
  refreshSite();
  revalidatePath("/admin/projects");
}

/** Turns one approval (customer names, headcount, photos) or publishing on or off straight from the list. */
export async function toggleProjectFlag(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  const flag = str(form.get("flag"));
  if (!["published", "parties_approved", "team_approved", "photos_approved"].includes(flag)) return;
  check(await db().from("projects").update({ [flag]: form.get("value") === "on", updated_at: new Date().toISOString() }).eq("id", id));
  refreshSite();
  revalidatePath("/admin/projects");
}
