import type { Locale } from "@/i18n/config";
import { divisionSlugs, sectorSlugs, type DivisionSlug, type SectorSlug } from "@/content/site";
import { partyRoles, type Party, type ProjectRecord, type ProjectStatus, type ProjectText } from "@/content/projects";

/** Row of the `projects` table (supabase/migrations/0005_projects.sql). */
export type ProjectRow = {
  id: string;
  slug: string;
  position: number;
  published: boolean;
  sector: string;
  divisions: string[];
  period_from: number;
  period_to: number | null;
  status: string | null;
  team: number | null;
  team_approx: boolean;
  parties: Party[];
  photo: string | null;
  gallery: string[];
  stock_photo: string | null;
  parties_approved: boolean;
  team_approved: boolean;
  photos_approved: boolean;
  text: Partial<Record<Locale, ProjectText>>;
  created_at?: string;
  updated_at?: string;
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function fromRow(r: ProjectRow): ProjectRecord {
  return {
    id: r.id,
    slug: r.slug,
    position: r.position,
    published: r.published,
    sector: (sectorSlugs as readonly string[]).includes(r.sector) ? (r.sector as SectorSlug) : "manufacturing",
    divisions: (r.divisions ?? []).filter((d): d is DivisionSlug => (divisionSlugs as readonly string[]).includes(d)),
    periodFrom: r.period_from,
    periodTo: r.period_to,
    status: r.status === "ongoing" || r.status === "completed" ? (r.status as ProjectStatus) : null,
    team: r.team,
    teamApprox: r.team_approx,
    parties: (r.parties ?? []).filter((p) => p && partyRoles.includes(p.role) && p.name),
    photo: r.photo,
    gallery: r.gallery ?? [],
    stockPhoto: r.stock_photo,
    approved: { parties: r.parties_approved, team: r.team_approved, photos: r.photos_approved },
    text: r.text ?? {},
  };
}

export function toRow(p: ProjectRecord): Omit<ProjectRow, "id"> {
  return {
    slug: p.slug,
    position: p.position,
    published: p.published,
    sector: p.sector,
    divisions: p.divisions,
    period_from: p.periodFrom,
    period_to: p.periodTo,
    status: p.status,
    team: p.team,
    team_approx: p.teamApprox,
    parties: p.parties,
    photo: p.photo,
    gallery: p.gallery,
    stock_photo: p.stockPhoto,
    parties_approved: p.approved.parties,
    team_approved: p.approved.team,
    photos_approved: p.approved.photos,
    text: p.text,
  };
}
