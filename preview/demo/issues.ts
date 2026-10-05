// Demo version of src/lib/data/issues.ts, with the same rules the database trigger enforces.
import type * as Real from "@/../src/lib/data/issues";
import type { Issue } from "@/lib/data/types";
import { db, save, tick } from "./store";

const rows = () => (db().issues ??= []);
const strip = ({ company_id: _c, ...i }: Issue & { company_id: string }): Issue => { void _c; return i; };
const isMember = (companyId: string) => db().members.some((m) => m.company_id === companyId && m.user_id === db().session?.user.id);

export async function listIssues(companyId: string): Promise<Issue[]> {
  await tick();
  return rows().filter((i) => i.company_id === companyId).sort((a, b) => b.raised_at.localeCompare(a.raised_at)).map(strip);
}

export async function listIssuesForRecord(companyId: string, recordId: string): Promise<Issue[]> {
  await tick();
  return rows().filter((i) => i.company_id === companyId && i.record_id === recordId).map(strip);
}

export type IssuePatch = Real.IssuePatch;

export async function updateIssue(companyId: string, id: string, patch: IssuePatch): Promise<void> {
  await tick();
  if (!isMember(companyId)) throw new Error("Not a member of this company.");
  const i = rows().find((x) => x.company_id === companyId && x.id === id);
  if (!i) throw new Error("Issue not found.");
  const was = i.status;
  Object.assign(i, patch);
  if (i.status === "fixed" && was !== "fixed") i.fixed_at = new Date().toISOString();
  if (i.status === "open") { i.fixed_at = null; i.fixed_note = ""; }
  save();
}

const _sameShape = { listIssues, listIssuesForRecord, updateIssue } satisfies Omit<typeof Real, never>;
void _sameShape;
