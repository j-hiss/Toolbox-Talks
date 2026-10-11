// Demo version of src/lib/data/ownChecklists.ts: the company's own checklists kept in this browser, versioned like
// the database (admins write; next version only; a retired checklist stays retired).
import type * as Real from "@/../src/lib/data/ownChecklists";
import { ownChecklistProblem, type OwnChecklistDraft, type OwnChecklistRow } from "@/core/ownChecklists";
import { db, save, tick } from "./store";

type Row = OwnChecklistRow & { company_id: string };
const rows = () => ((db() as unknown as { ownChecklists?: Row[] }).ownChecklists ??= []);
const access = (co: string) => db().members.find((m) => m.company_id === co && m.user_id === db().session?.user.id)?.access;
function add(co: string, r: Omit<Row, "created_at" | "company_id">) {
  const a = access(co);
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can change checklists.");
  const prev = rows().filter((x) => x.company_id === co && x.checklist_key === r.checklist_key).sort((x, y) => y.version - x.version)[0];
  if (r.version !== (prev?.version ?? 0) + 1) throw new Error("Someone else changed this checklist. Reload and try again.");
  if (prev?.retired) throw new Error("This checklist was retired. Make a new one instead.");
  rows().push({ ...r, company_id: co, created_at: new Date().toISOString() }); save();
}

export async function listOwnChecklists(companyId: string): Promise<OwnChecklistRow[]> {
  await tick();
  const a = access(companyId);
  if (!a || a === "employee") return [];
  return rows().filter((r) => r.company_id === companyId).sort((x, y) => x.version - y.version).map(({ company_id: _c, ...r }) => { void _c; return r; });
}
export async function saveOwnChecklist(companyId: string, key: string, version: number, d: OwnChecklistDraft): Promise<void> {
  await tick();
  const p = ownChecklistProblem(d); if (p) throw new Error(p);
  add(companyId, { checklist_key: key, version, retired: false, title: d.title.trim(), how_often: d.how_often, rule: d.rule.trim(), items: d.items });
}
export async function retireOwnChecklist(companyId: string, latest: OwnChecklistRow): Promise<void> {
  await tick();
  const { created_at: _c, ...r } = latest; void _c;
  add(companyId, { ...r, version: latest.version + 1, retired: true });
}

const _sameShape = { listOwnChecklists, saveOwnChecklist, retireOwnChecklist } satisfies Omit<typeof Real, never>;
void _sameShape;
