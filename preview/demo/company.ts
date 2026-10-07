// Demo version of src/lib/data/company.ts for the preview: same functions, same rules, stored in the browser.
// Keep the export list identical to the real module (typecheck enforces it via the satisfies line at the bottom).
import type * as Real from "@/../src/lib/data/company";
import type { Company, Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { db, save, tick, uid } from "./store";

const DEFAULT_ROLES = ["Owner", "Safety Manager", "Superintendent", "Supervisor", "Foreman", "Team Lead"];
const byName = <T,>(k: keyof T) => (a: T, b: T) => String(a[k]).localeCompare(String(b[k]));
const rows = <T,>(table: keyof Omit<ReturnType<typeof db>, "session" | "members" | "records" | "overrides" | "issues">) => db()[table] as unknown as T[];

function mustBeAdmin(companyId: string) {
  const user = db().session?.user.id;
  const m = db().members.find((x) => x.company_id === companyId && x.user_id === user);
  if (!m || (m.access !== "owner" && m.access !== "admin")) throw new Error("Only owners and admins can change company setup.");
}

export async function myMemberships(userId: string): Promise<Membership[]> {
  await tick();
  return db().members
    .filter((m) => m.user_id === userId)
    .map((m) => ({ access: m.access as Membership["access"], company: rows<Company>("companies").find((c) => c.id === m.company_id)! }))
    .filter((m) => m.company)
    .sort((a, b) => a.company.name.localeCompare(b.company.name));
}

export type NewCompany = Real.NewCompany;

export async function createCompany(input: NewCompany): Promise<string> {
  await tick();
  const user = db().session?.user.id;
  if (!user) throw new Error("Sign in to create a company");
  const id = uid();
  const monday = new Date(); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const iso = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  rows<Company>("companies").push({
    id, name: input.name, industry: input.industry, zip: input.zip ?? null, licenses: input.licenses ?? "", address: input.address ?? "",
    phone: input.phone ?? "", email: input.email ?? "", program_start: input.program_start ?? iso, default_jobsite: input.default_jobsite ?? "", makeup_weeks: input.makeup_weeks ?? 4, work_setting: input.work_setting ?? null,
  });
  db().members.push({ company_id: id, user_id: user, access: "owner" });
  DEFAULT_ROLES.forEach((name) => rows<Role>("roles").push({ id: uid(), company_id: id, name }));
  save();
  return id;
}

export async function updateCompany(id: string, patch: Partial<Omit<Company, "id">>): Promise<void> {
  await tick(); mustBeAdmin(id);
  Object.assign(rows<Company>("companies").find((c) => c.id === id)!, patch); save();
}

export async function listRoles(companyId: string): Promise<Role[]> {
  await tick(); return rows<Role>("roles").filter((r) => r.company_id === companyId).sort(byName<Role>("name"));
}
export async function addRole(companyId: string, name: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (rows<Role>("roles").some((r) => r.company_id === companyId && r.name === name)) throw new Error("That role already exists.");
  rows<Role>("roles").push({ id: uid(), company_id: companyId, name }); save();
}
export async function deleteRole(companyId: string, roleId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  db().roles = db().roles.filter((r) => !(r.company_id === companyId && r.id === roleId)); save();
}

export async function listTeams(companyId: string): Promise<Team[]> {
  await tick(); return rows<Team>("teams").filter((t) => t.company_id === companyId).sort(byName<Team>("name"));
}
export async function addTeam(companyId: string, name: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  rows<Team>("teams").push({ id: uid(), company_id: companyId, name, lead_person_id: null }); save();
}
export async function updateTeam(companyId: string, teamId: string, patch: Partial<Pick<Team, "name" | "lead_person_id">>): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  Object.assign(rows<Team>("teams").find((t) => t.company_id === companyId && t.id === teamId)!, patch); save();
}
export async function deleteTeam(companyId: string, teamId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  db().teams = db().teams.filter((t) => !(t.company_id === companyId && t.id === teamId));
  rows<Person>("people").forEach((p) => { if (p.company_id === companyId && p.team_id === teamId) p.team_id = null; });
  save();
}

export async function listPeople(companyId: string): Promise<Person[]> {
  await tick(); return rows<Person>("people").filter((p) => p.company_id === companyId && p.active).sort(byName<Person>("full_name"));
}
export async function listAllPeople(companyId: string): Promise<Person[]> {
  await tick(); return rows<Person>("people").filter((p) => p.company_id === companyId).sort(byName<Person>("full_name"));
}
export async function addPerson(companyId: string, p: Pick<Person, "full_name" | "role_id" | "team_id"> & Partial<Pick<Person, "employee_id" | "phone" | "preferred_language">>): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  rows<Person>("people").push({ id: uid(), company_id: companyId, employee_id: null, phone: null, preferred_language: "en", active: true, ...p, created_at: new Date().toISOString() } as Person); save();
}
export async function updatePerson(companyId: string, personId: string, patch: Partial<Omit<Person, "id" | "company_id">>): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  // Same as the database trigger: reactivating clears the deactivation date.
  const extra = patch.active === true ? { deactivated_at: null } : {};
  Object.assign(rows<Person>("people").find((p) => p.company_id === companyId && p.id === personId)!, patch, extra); save();
}
export async function deactivatePerson(companyId: string, personId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  rows<Team>("teams").forEach((t) => { if (t.company_id === companyId && t.lead_person_id === personId) t.lead_person_id = null; });
  Object.assign(rows<Person>("people").find((p) => p.company_id === companyId && p.id === personId)!, { active: false, team_id: null, deactivated_at: new Date().toISOString() });
  save();
}

export async function listJobsites(companyId: string): Promise<Jobsite[]> {
  await tick(); return rows<Jobsite>("jobsites").filter((j) => j.company_id === companyId && j.active).sort(byName<Jobsite>("name"));
}
export async function addJobsite(companyId: string, j: Pick<Jobsite, "name" | "address" | "latitude" | "longitude" | "kind">): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  rows<Jobsite>("jobsites").push({ id: uid(), company_id: companyId, active: true, ...j }); save();
}
export async function updateJobsite(companyId: string, id: string, patch: Partial<Pick<Jobsite, "name" | "address" | "latitude" | "longitude" | "kind" | "work_setting" | "active">>): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  Object.assign(rows<Jobsite>("jobsites").find((j) => j.company_id === companyId && j.id === id)!, patch); save();
}
export async function deactivateJobsite(companyId: string, id: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  Object.assign(rows<Jobsite>("jobsites").find((j) => j.company_id === companyId && j.id === id)!, { active: false }); save();
}

// Compile-time check that this demo module offers every function the real one does, with the same signatures.
const _sameShape = {
  myMemberships, createCompany, updateCompany, listRoles, addRole, deleteRole, listTeams, addTeam, updateTeam, deleteTeam,
  listPeople, listAllPeople, addPerson, updatePerson, deactivatePerson, listJobsites, addJobsite, updateJobsite, deactivateJobsite,
} satisfies Omit<typeof Real, never>;
void _sameShape;
