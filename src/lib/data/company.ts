// Company, roles, teams and people. Every call goes through RLS: a user only ever reaches their own companies.
// Each function scopes by company_id explicitly as well, so a query never depends on RLS alone to be correct.
import { supabase } from "@/lib/supabase";
import type { Company, Jobsite, Membership, Person, Role, Team } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COMPANY_COLUMNS = "id, name, licenses, address, phone, email, industry, zip, program_start, default_jobsite, makeup_weeks, theme, work_setting";

export async function myMemberships(userId: string): Promise<Membership[]> {
  const rows = check(
    await supabase()
      .from("company_members")
      .select(`access, company:companies(${COMPANY_COLUMNS})`)
      .eq("user_id", userId),
  ) as unknown as { access: Membership["access"]; company: Company }[];
  return rows.filter((r) => r.company).sort((a, b) => a.company.name.localeCompare(b.company.name));
}

export type NewCompany = Pick<Company, "name" | "industry"> & Partial<Omit<Company, "id" | "name" | "industry">>;

export async function createCompany(input: NewCompany): Promise<string> {
  const id = check(
    await supabase().rpc("create_company", {
      company_name: input.name,
      company_industry: input.industry,
      company_zip: input.zip || null,
    }),
  ) as string;
  const details: Partial<Omit<Company, "id">> = {};
  for (const k of ["licenses", "address", "phone", "email", "program_start", "default_jobsite", "makeup_weeks", "work_setting"] as const) {
    if (input[k] !== undefined) (details as Record<string, unknown>)[k] = input[k];
  }
  if (Object.keys(details).length) await updateCompany(id, details);
  return id;
}

export async function updateCompany(id: string, patch: Partial<Omit<Company, "id">>): Promise<void> {
  check(await supabase().from("companies").update(patch).eq("id", id).select("id").single());
}

// Roles ----------------------------------------------------------------------------------------------------------
export async function listRoles(companyId: string): Promise<Role[]> {
  return check(await supabase().from("roles").select("id, company_id, name").eq("company_id", companyId).order("name"));
}
export async function addRole(companyId: string, name: string): Promise<void> {
  check(await supabase().from("roles").insert({ company_id: companyId, name }));
}
export async function deleteRole(companyId: string, roleId: string): Promise<void> {
  check(await supabase().from("roles").delete().eq("company_id", companyId).eq("id", roleId));
}

// Teams ----------------------------------------------------------------------------------------------------------
export async function listTeams(companyId: string): Promise<Team[]> {
  return check(
    await supabase().from("teams").select("id, company_id, name, lead_person_id").eq("company_id", companyId).order("name"),
  );
}
export async function addTeam(companyId: string, name: string): Promise<void> {
  check(await supabase().from("teams").insert({ company_id: companyId, name }));
}
export async function updateTeam(companyId: string, teamId: string, patch: Partial<Pick<Team, "name" | "lead_person_id">>): Promise<void> {
  check(await supabase().from("teams").update(patch).eq("company_id", companyId).eq("id", teamId));
}
export async function deleteTeam(companyId: string, teamId: string): Promise<void> {
  check(await supabase().from("teams").delete().eq("company_id", companyId).eq("id", teamId));
}

// People ---------------------------------------------------------------------------------------------------------
const PERSON_COLUMNS = "id, company_id, full_name, role_id, team_id, employee_id, phone, preferred_language, active";

export async function listPeople(companyId: string): Promise<Person[]> {
  return check(
    await supabase().from("people").select(PERSON_COLUMNS).eq("company_id", companyId).eq("active", true).order("full_name"),
  );
}
/** Everyone, including removed people (for matching a spreadsheet re-import). */
export async function listAllPeople(companyId: string): Promise<Person[]> {
  return check(await supabase().from("people").select(PERSON_COLUMNS).eq("company_id", companyId).order("full_name"));
}
export async function addPerson(companyId: string, p: Pick<Person, "full_name" | "role_id" | "team_id"> & Partial<Pick<Person, "employee_id" | "phone" | "preferred_language">>): Promise<void> {
  check(await supabase().from("people").insert({ company_id: companyId, ...p }));
}
export async function updatePerson(companyId: string, personId: string, patch: Partial<Omit<Person, "id" | "company_id">>): Promise<void> {
  check(await supabase().from("people").update(patch).eq("company_id", companyId).eq("id", personId));
}
/**
 * People are deactivated, never deleted: saved attendance records will point at them and must keep their history.
 * A deactivated person drops off rosters and team leads.
 */
export async function deactivatePerson(companyId: string, personId: string): Promise<void> {
  check(await supabase().from("teams").update({ lead_person_id: null }).eq("company_id", companyId).eq("lead_person_id", personId));
  await updatePerson(companyId, personId, { active: false, team_id: null });
}

// Jobsites -------------------------------------------------------------------------------------------------------
const JOBSITE_COLUMNS = "id, company_id, name, address, latitude, longitude, kind, active";

export async function listJobsites(companyId: string): Promise<Jobsite[]> {
  return check(
    await supabase().from("jobsites").select(JOBSITE_COLUMNS).eq("company_id", companyId).eq("active", true).order("name"),
  );
}
export async function addJobsite(companyId: string, j: Pick<Jobsite, "name" | "address" | "latitude" | "longitude" | "kind">): Promise<void> {
  check(await supabase().from("jobsites").insert({ company_id: companyId, ...j }));
}
export async function updateJobsite(companyId: string, id: string, patch: Partial<Pick<Jobsite, "name" | "address" | "latitude" | "longitude" | "kind" | "active">>): Promise<void> {
  check(await supabase().from("jobsites").update(patch).eq("company_id", companyId).eq("id", id));
}
/** Jobsites are deactivated, never deleted: saved talk records will point at them. */
export async function deactivateJobsite(companyId: string, id: string): Promise<void> {
  check(await supabase().from("jobsites").update({ active: false }).eq("company_id", companyId).eq("id", id));
}
