// Demo version of src/lib/data/hazards.ts: crew reports kept in this browser with the database's rules (anyone in the
// company sends; anonymous keeps no name; owners, admins and office read and review once; a review can add an issue;
// a sticker report needs an active jobsite).
import type * as Real from "@/../src/lib/data/hazards";
import type { HazardReport } from "@/core/hazards";
import { hazardProblem } from "@/core/hazards";
import type { Issue, Jobsite, Person } from "@/lib/data/types";
import { db, save, tick, uid } from "./store";

type Row = HazardReport & { company_id: string; reporter_user: string | null; photo: string | null };
const rows = () => ((db() as unknown as { hazards?: Row[] }).hazards ??= []);
const me = () => db().session?.user.id ?? null;
const access = (co: string) => db().members.find((m) => m.company_id === co && m.user_id === me())?.access;
const office = (co: string) => ["owner", "admin", "office"].includes(access(co) ?? "");
const sites = () => db().jobsites as unknown as Jobsite[];
const strip = ({ company_id: _c, reporter_user: _u, photo: _p, ...r }: Row): HazardReport => { void _c; void _u; void _p; return r; };

function add(co: string, r: Real.HazardSend, via: "app" | "sticker", reporter: string | null, name: string): string {
  const dup = rows().find((x) => x.company_id === co && x.client_id === r.clientId);
  if (dup) return dup.id;
  const p = hazardProblem(r); if (p) throw new Error(p);
  const js = r.jobsiteId ? sites().find((j) => j.id === r.jobsiteId && j.company_id === co) : null;
  if (r.jobsiteId && !js) throw new Error("That jobsite isn't this company's.");
  const id = uid();
  rows().push({ id, company_id: co, client_id: r.clientId, kind: r.kind, what: r.what.trim(), where_text: r.where.trim(), jobsite_id: js?.id ?? null, jobsite_name: js?.name ?? "",
    anonymous: r.anonymous, reporter_user: r.anonymous ? null : reporter, reporter_name: r.anonymous ? "" : name, via, has_photo: !!r.photo, photo: r.photo,
    created_at: new Date().toISOString(), reviewed_at: null, action: "" });
  save(); return id;
}

export async function reportHazard(companyId: string, r: Real.HazardSend): Promise<string> {
  await tick();
  if (!access(companyId)) throw new Error("Sign in to this company to send a report.");
  const person = (db().people as unknown as (Person & { user_id?: string | null })[]).find((p) => p.company_id === companyId && p.user_id === me());
  return add(companyId, r, "app", me(), person?.full_name ?? db().session?.user.email ?? "");
}
export async function reportHazardAtSite(site: string, r: Real.HazardSend): Promise<string> {
  await tick();
  const js = sites().find((j) => j.id === site && j.active);
  if (!js) throw new Error("This sticker isn't active. Tell your supervisor.");
  return add(js.company_id, { ...r, jobsiteId: site, anonymous: r.anonymous || !(r.name ?? "").trim() }, "sticker", null, (r.name ?? "").trim());
}
export async function hazardSiteInfo(site: string): Promise<{ company: string; jobsite: string } | null> {
  await tick();
  const js = sites().find((j) => j.id === site && j.active);
  const co = js && (db().companies as { id: string; name: string }[]).find((c) => c.id === js.company_id);
  return js && co ? { company: co.name, jobsite: js.name } : null;
}
export async function listHazards(companyId: string): Promise<HazardReport[]> {
  await tick();
  return rows().filter((r) => r.company_id === companyId && (office(companyId) || (!!r.reporter_user && r.reporter_user === me())))
    .sort((a, b) => b.created_at.localeCompare(a.created_at)).map(strip);
}
export async function hazardPhoto(companyId: string, reportId: string): Promise<string | null> {
  await tick();
  if (!office(companyId)) return null;
  return rows().find((r) => r.company_id === companyId && r.id === reportId)?.photo ?? null;
}
export async function reviewHazard(companyId: string, reportId: string, action: string, issue: { ownerPersonId: string | null; due: string | null } | null): Promise<string | null> {
  await tick();
  if (!office(companyId)) throw new Error("Only owners, admins and office review reports.");
  const h = rows().find((r) => r.company_id === companyId && r.id === reportId);
  if (!h) throw new Error("Report not found.");
  if (h.reviewed_at) throw new Error("This report was already reviewed.");
  if (!action.trim()) throw new Error("Say what was done (up to 1000 characters).");
  let id: string | null = null;
  if (issue) {
    id = uid();
    const owner = issue.ownerPersonId ? (db().people as unknown as Person[]).find((p) => p.id === issue.ownerPersonId)?.full_name ?? "" : "";
    (db().issues as (Issue & { company_id: string })[]).push({ company_id: companyId, id, client_id: uid(), record_id: null, event_id: null, jobsite_name: h.jobsite_name,
      description: `${h.kind === "near_miss" ? "Near miss: " : "Hazard: "}${h.what}`.slice(0, 1000), owner_person_id: issue.ownerPersonId, owner_name: owner, due_date: issue.due,
      status: "open", raised_by_name: h.anonymous || !h.reporter_name ? "Crew report" : h.reporter_name, raised_at: new Date().toISOString(), fixed_at: null, fixed_note: "" });
  }
  h.reviewed_at = new Date().toISOString(); h.action = action.trim(); save();
  return id;
}

const _sameShape = { reportHazard, reportHazardAtSite, hazardSiteInfo, listHazards, hazardPhoto, reviewHazard } satisfies Omit<typeof Real, never>;
void _sameShape;
