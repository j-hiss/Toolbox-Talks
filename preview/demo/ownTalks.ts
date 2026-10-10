// Demo version of src/lib/data/ownTalks.ts: company talks kept in this browser, versioned like the database
// (never edited, next version only, retired stays retired; staff read, owners and admins write).
import type * as Real from "@/../src/lib/data/ownTalks";
import type { OwnTalkRow } from "@/core/ownTalks";
import { db, save, tick } from "./store";

type Row = OwnTalkRow & { company_id: string };
const rows = () => ((db() as unknown as { ownTalks?: Row[] }).ownTalks ??= []);
const access = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === db().session?.user.id)?.access;
function mustBeAdmin(companyId: string) { const a = access(companyId); if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can write talks."); }
function add(companyId: string, r: Omit<OwnTalkRow, "created_at">) {
  const last = rows().filter((x) => x.company_id === companyId && x.talk_key === r.talk_key).sort((a, b) => b.version - a.version)[0];
  if (r.version !== (last?.version ?? 0) + 1) throw new Error("Someone else changed this talk. Reload and try again.");
  if (last?.retired) throw new Error("This talk was retired. Write a new one instead.");
  if (r.es_status === "reviewed" && !r.es_reviewed_by.trim()) throw new Error("Name who reviewed the Spanish.");
  rows().push({ ...r, company_id: companyId, created_at: new Date().toISOString() });
  save();
}

export async function listOwnTalks(companyId: string): Promise<OwnTalkRow[]> {
  await tick();
  if (!access(companyId) || access(companyId) === "employee") return [];
  return rows().filter((r) => r.company_id === companyId).sort((a, b) => a.version - b.version).map(({ company_id: _c, ...r }) => { void _c; return r; });
}
export type OwnTalkSave = Real.OwnTalkSave;
export async function saveOwnTalk(companyId: string, t: OwnTalkSave): Promise<void> { await tick(); mustBeAdmin(companyId); add(companyId, { ...t, retired: false }); }
export async function retireOwnTalk(companyId: string, latest: OwnTalkRow): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const { created_at: _c, ...rest } = latest; void _c;
  add(companyId, { ...rest, version: latest.version + 1, retired: true });
}

const _sameShape = { listOwnTalks, saveOwnTalk, retireOwnTalk } satisfies Omit<typeof Real, never>;
void _sameShape;
