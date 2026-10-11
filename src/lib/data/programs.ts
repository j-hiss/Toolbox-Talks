// Written safety programs data (migration 0047). Every save is a new version, including a yearly review with no
// changes. Everyone in the company reads; owners and admins write (the database enforces it). Rules: src/core/programs.ts.
import { supabase } from "@/lib/supabase";
import type { ProgramDraft, ProgramRow } from "@/core/programs";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "program_key, template_version, version, answers, approved_name, approved_title, review_only, note, created_at";

/** Every version of every written program for this company, oldest first. */
export async function listPrograms(companyId: string): Promise<ProgramRow[]> {
  return check(await supabase().from("company_programs").select(COLUMNS).eq("company_id", companyId).order("version")) as ProgramRow[];
}

/** Save as the next version (1 for the first). `reviewOnly` marks a yearly review with no changes. */
export async function saveProgram(companyId: string, key: string, templateVersion: number, version: number, d: ProgramDraft, reviewOnly: boolean): Promise<void> {
  check(await supabase().from("company_programs").insert({
    company_id: companyId, program_key: key, template_version: templateVersion, version, answers: d.answers,
    approved_name: d.approved_name.trim(), approved_title: d.approved_title.trim(), review_only: reviewOnly, note: d.note.trim(),
  }).select("program_key"));
}
