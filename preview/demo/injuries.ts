// Demo version of src/lib/data/injuries.ts: the OSHA log kept in this browser, versioned like the database (owners and
// admins only; next version only; case numbers per year, kept by later versions).
import type * as Real from "@/../src/lib/data/injuries";
import { caseProblem, type CaseDraft, type InjuryCase, type InjurySummary } from "@/core/oshaLog";
import { db, save, tick } from "./store";

type Case = InjuryCase & { company_id: string };
type Sum = InjurySummary & { company_id: string };
const store = () => db() as unknown as { injuryCases?: Case[]; injurySummaries?: Sum[] };
const cases = () => (store().injuryCases ??= []);
const sums = () => (store().injurySummaries ??= []);
function mustBeAdmin(companyId: string) {
  const a = db().members.find((m) => m.company_id === companyId && m.user_id === db().session?.user.id)?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can see the injury log.");
}
const strip = <T extends { company_id: string }>({ company_id: _c, ...r }: T) => { void _c; return r; };

export async function listInjuryCases(companyId: string, year: number): Promise<InjuryCase[]> {
  await tick(); mustBeAdmin(companyId);
  return cases().filter((c) => c.company_id === companyId && c.year === year).sort((a, b) => a.version - b.version).map(strip);
}
function add(companyId: string, row: Omit<InjuryCase, "created_at" | "case_no">) {
  const prev = cases().filter((c) => c.company_id === companyId && c.case_key === row.case_key).sort((a, b) => b.version - a.version)[0];
  if (row.version !== (prev?.version ?? 0) + 1) throw new Error("Someone else changed this case. Reload and try again.");
  if (prev && prev.year !== row.year) throw new Error(`A case stays in the year it was logged. Remove it here and add it to ${row.year}.`);
  const case_no = prev?.case_no ?? Math.max(0, ...cases().filter((c) => c.company_id === companyId && c.year === row.year).map((c) => c.case_no)) + 1;
  cases().push({ ...row, case_no, company_id: companyId, created_at: new Date().toISOString() });
  save();
}
export async function saveInjuryCase(companyId: string, c: CaseDraft, prev: InjuryCase | null): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const p = caseProblem(c); if (p) throw new Error(p);
  add(companyId, { ...c, case_key: prev?.case_key ?? crypto.randomUUID(), version: (prev?.version ?? 0) + 1, year: Number(c.injury_date.slice(0, 4)), removed: false, removed_reason: "" });
}
export async function removeInjuryCase(companyId: string, prev: InjuryCase, reason: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (!reason.trim()) throw new Error("Say why it comes off the log.");
  const { created_at: _c, case_no: _n, ...rest } = prev; void _c; void _n;
  add(companyId, { ...rest, version: prev.version + 1, removed: true, removed_reason: reason.trim() });
}
export async function listInjurySummaries(companyId: string): Promise<InjurySummary[]> {
  await tick(); mustBeAdmin(companyId);
  return sums().filter((s) => s.company_id === companyId).sort((a, b) => a.version - b.version).map(strip);
}
export async function saveInjurySummary(companyId: string, s: InjurySummary): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const last = Math.max(0, ...sums().filter((x) => x.company_id === companyId && x.year === s.year).map((x) => x.version));
  if (s.version !== last + 1) throw new Error("Someone else changed this summary. Reload and try again.");
  sums().push({ ...s, company_id: companyId }); save();
}

const _sameShape = { listInjuryCases, saveInjuryCase, removeInjuryCase, listInjurySummaries, saveInjurySummary } satisfies Omit<typeof Real, never>;
void _sameShape;
