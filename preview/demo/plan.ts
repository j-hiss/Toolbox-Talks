// Demo version of src/lib/data/plan.ts: same functions and the same lock the database enforces.
import type * as Real from "@/../src/lib/data/plan";
import type { PlanOverride } from "@/lib/data/types";
import { isoDay, mondayOf } from "@/core/weeks";
import { db, save, tick } from "./store";

function mustBeAdmin(companyId: string) {
  const user = db().session?.user.id;
  const m = db().members.find((x) => x.company_id === companyId && x.user_id === user);
  if (!m || (m.access !== "owner" && m.access !== "admin")) throw new Error("Only owners and admins can change the plan.");
}

function guard(companyId: string, weekStart: string) {
  if (weekStart < isoDay(mondayOf(new Date()))) throw new Error(`Week of ${weekStart} is over; its talk can no longer change.`);
  const given = db().records.some((r) => r.company_id === companyId && r.week_start === weekStart && !r.makeup_for_week);
  if (given) throw new Error(`Week of ${weekStart} has already been recorded; its talk is locked.`);
}

const rows = () => (db().overrides ??= []);

export async function listOverrides(companyId: string): Promise<PlanOverride[]> {
  await tick();
  return rows().filter((o) => o.company_id === companyId).map(({ week_start, talk_id }) => ({ week_start, talk_id }));
}

export async function setOverride(companyId: string, weekStart: string, talkId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId); guard(companyId, weekStart);
  const hit = rows().find((o) => o.company_id === companyId && o.week_start === weekStart);
  if (hit) hit.talk_id = talkId; else rows().push({ company_id: companyId, week_start: weekStart, talk_id: talkId });
  save();
}

export async function clearOverride(companyId: string, weekStart: string): Promise<void> {
  await tick(); mustBeAdmin(companyId); guard(companyId, weekStart);
  db().overrides = rows().filter((o) => !(o.company_id === companyId && o.week_start === weekStart));
  save();
}

const _sameShape = { listOverrides, setOverride, clearOverride } satisfies Omit<typeof Real, never>;
void _sameShape;
