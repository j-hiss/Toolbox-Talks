// Demo version of src/lib/data/plan.ts: same functions and the same lock the database enforces.
import type * as Real from "@/../src/lib/data/plan";
import type { Cadence, CadenceSetting, TalkList } from "@/core/plan";
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

// Talk lists, with the same rule the database enforces: only a list that starts after this week can change.
const lists = () => (db().talkLists ??= []);
function listGuard(fromWeek: string) {
  if (fromWeek <= isoDay(new Date())) throw new Error(`A talk list has to start next week or later (${fromWeek}), so weeks already planned keep their talks.`);
}

export async function listTalkLists(companyId: string): Promise<TalkList[]> {
  await tick();
  return lists().filter((l) => l.company_id === companyId).sort((a, b) => a.from_week.localeCompare(b.from_week))
    .map(({ from_week, talk_ids }) => ({ from_week, talk_ids: [...talk_ids] }));
}

export async function saveTalkList(companyId: string, fromWeek: string, talkIds: string[]): Promise<void> {
  await tick(); mustBeAdmin(companyId); listGuard(fromWeek);
  if (talkIds.length === 0) throw new Error("Pick at least one talk.");
  const hit = lists().find((l) => l.company_id === companyId && l.from_week === fromWeek);
  if (hit) hit.talk_ids = [...talkIds]; else lists().push({ company_id: companyId, from_week: fromWeek, talk_ids: [...talkIds] });
  save();
}

export async function removeTalkList(companyId: string, fromWeek: string): Promise<void> {
  await tick(); mustBeAdmin(companyId); listGuard(fromWeek);
  db().talkLists = lists().filter((l) => !(l.company_id === companyId && l.from_week === fromWeek));
  save();
}

// Cadences, with the database's rule: only a change that starts after today can be added, changed or removed.
const cads = () => (db().cadences ??= []);
function cadenceGuard(fromWeek: string) {
  if (fromWeek <= isoDay(new Date())) throw new Error(`A new cadence has to start after today (${fromWeek}), so talk periods already planned keep their shape.`);
}

export async function listCadences(companyId: string): Promise<CadenceSetting[]> {
  await tick();
  return cads().filter((c) => c.company_id === companyId).sort((a, b) => a.from_week.localeCompare(b.from_week))
    .map(({ from_week, weeks }) => ({ from_week, weeks }));
}

export async function saveCadence(companyId: string, fromWeek: string, weeks: Cadence): Promise<void> {
  await tick(); mustBeAdmin(companyId); cadenceGuard(fromWeek);
  const hit = cads().find((c) => c.company_id === companyId && c.from_week === fromWeek);
  if (hit) hit.weeks = weeks; else cads().push({ company_id: companyId, from_week: fromWeek, weeks });
  save();
}

export async function removeCadence(companyId: string, fromWeek: string): Promise<void> {
  await tick(); mustBeAdmin(companyId); cadenceGuard(fromWeek);
  db().cadences = cads().filter((c) => !(c.company_id === companyId && c.from_week === fromWeek));
  save();
}

const _sameShape = { listOverrides, setOverride, clearOverride, listTalkLists, saveTalkList, removeTalkList, listCadences, saveCadence, removeCadence } satisfies Omit<typeof Real, never>;
void _sameShape;
