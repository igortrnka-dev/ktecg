import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { seedProjects, type ProjectRecord, type PublicProject } from "@/content/projects";
import { fromRow, type ProjectRow } from "./project-rows";
import { isDemo } from "./demo/mode";
import { supabaseConfigured } from "./supabase/config";
import { db } from "./supabase/admin";

/** PostgREST / Postgres codes for "the table is not there": migration 0005 has not run yet. */
const MISSING_TABLE = new Set(["42P01", "PGRST205", "PGRST202"]);

/**
 * Every project, published or not, in site order. The site falls back to the projects in content/projects.ts only
 * while the database is not set up or the table does not exist yet; any other database error shows no projects
 * rather than ones the owner may have taken down.
 */
export const allProjects = cache(async (): Promise<ProjectRecord[]> => {
  if (!isDemo() && !supabaseConfigured()) return seedProjects;
  const { data, error } = await db().from("projects").select("*").order("position", { ascending: true });
  if (error) {
    if (MISSING_TABLE.has(error.code ?? "")) return seedProjects;
    console.error("projects: could not load", error.message);
    return [];
  }
  return (data as ProjectRow[]).map(fromRow);
});

/**
 * The public view of a project in one language, or null when it is not published in that language. Customer names,
 * headcount and the project's own photos are left out until the owner approves each of them.
 */
export function publicProject(p: ProjectRecord, locale: Locale, number: number): PublicProject | null {
  const text = p.text[locale];
  if (!p.published || !text?.title?.trim()) return null;
  return {
    slug: p.slug,
    position: p.position,
    published: true,
    sector: p.sector,
    divisions: p.divisions,
    periodFrom: p.periodFrom,
    periodTo: p.periodTo,
    status: p.status,
    team: p.approved.team ? p.team : null,
    teamApprox: p.teamApprox,
    parties: p.approved.parties ? p.parties : [],
    photo: p.approved.photos ? p.photo : null,
    gallery: p.approved.photos ? p.gallery : [],
    stockPhoto: p.stockPhoto,
    number,
    text: { ...text, scope: (text.scope ?? []).filter((s) => s.trim()) },
  };
}

/** Published projects in a language, numbered 01, 02, … in site order. */
export async function siteProjects(locale: Locale): Promise<PublicProject[]> {
  const out: PublicProject[] = [];
  for (const p of await allProjects()) {
    const pub = publicProject(p, locale, out.length + 1);
    if (pub) out.push(pub);
  }
  return out;
}
