// What kind of talk a record is, worked out from what the record already holds (no new data). Pure module. One rule
// for every place that shows it: the Records list and its filter, the saved record, the PDF, and the talk in progress.
//
// - Daily plan: a daily pre-task plan (record_kind "daily"), separate from the weekly talk.
// - Makeup: given later for a missed week (makeup_for_week), saved with its real date and place.
// - Weekly talk: everything else.
// Plus, when true: "Own talk" (a company's own talk, id "own-…") and "Swapped" (a different talk than the plan had
// for that week, chosen by an admin).

export type RecordTypeId = "weekly" | "makeup" | "daily";
export type RecordBadge = { id: RecordTypeId | "own" | "swapped"; label: string };
export type RecordTypeInput = { kind?: "weekly" | "daily"; record_kind?: "weekly" | "daily"; makeup_for_week: string | null; talk_id: string; scheduled_talk_id?: string | null };

export function recordTypeOf(r: RecordTypeInput): RecordTypeId {
  if ((r.kind ?? r.record_kind) === "daily") return "daily";
  return r.makeup_for_week ? "makeup" : "weekly";
}

export const RECORD_TYPE_LABEL: Record<RecordTypeId, string> = { weekly: "Weekly talk", makeup: "Makeup", daily: "Daily plan" };

export function recordBadges(r: RecordTypeInput): RecordBadge[] {
  const type = recordTypeOf(r);
  const out: RecordBadge[] = [{ id: type, label: RECORD_TYPE_LABEL[type] }];
  if (r.talk_id.startsWith("own-")) out.push({ id: "own", label: "Own talk" });
  if (type === "weekly" && r.scheduled_talk_id && r.scheduled_talk_id !== r.talk_id) out.push({ id: "swapped", label: "Swapped" });
  return out;
}

export type RecordFilter = "all" | RecordTypeId | "own";
export const RECORD_FILTERS: { id: RecordFilter; label: string }[] = [
  { id: "all", label: "All types" }, { id: "weekly", label: "Weekly talks" }, { id: "makeup", label: "Makeups" },
  { id: "daily", label: "Daily plans" }, { id: "own", label: "Own talks" },
];
export const matchesRecordFilter = (r: RecordTypeInput, f: RecordFilter) =>
  f === "all" ? true : f === "own" ? r.talk_id.startsWith("own-") : recordTypeOf(r) === f;

