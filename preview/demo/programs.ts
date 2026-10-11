// Demo version of src/lib/data/programs.ts: written programs kept in this browser, versioned like the database
// (everyone in the company reads, owners and admins write, next version only).
import type * as Real from "@/../src/lib/data/programs";
import type { ProgramDraft, ProgramRow } from "@/core/programs";
import { db, save, tick } from "./store";

type Row = ProgramRow & { company_id: string };
const rows = () => ((db() as unknown as { programs?: Row[] }).programs ??= []);
const access = (co: string) => db().members.find((m) => m.company_id === co && m.user_id === db().session?.user.id)?.access;

export async function listPrograms(companyId: string): Promise<ProgramRow[]> {
  await tick();
  if (!access(companyId)) return [];
  return rows().filter((r) => r.company_id === companyId).sort((x, y) => x.version - y.version).map(({ company_id: _c, ...r }) => { void _c; return r; });
}
export async function saveProgram(companyId: string, key: string, templateVersion: number, version: number, d: ProgramDraft, reviewOnly: boolean): Promise<void> {
  await tick();
  const a = access(companyId);
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can change written programs.");
  const last = rows().filter((r) => r.company_id === companyId && r.program_key === key).reduce((m, r) => Math.max(m, r.version), 0);
  if (version !== last + 1) throw new Error("Someone else changed this program. Reload and try again.");
  rows().push({ company_id: companyId, program_key: key, template_version: templateVersion, version, answers: d.answers, approved_name: d.approved_name.trim(), approved_title: d.approved_title.trim(), review_only: reviewOnly, note: d.note.trim(), created_at: new Date().toISOString() });
  save();
}

const _sameShape = { listPrograms, saveProgram } satisfies Omit<typeof Real, never>;
void _sameShape;
