// Crew hazard and near-miss reports (migration 0055). Pure module: what a report holds, checks before sending, and
// how the office list sorts and counts them. Honest status: a report is "new" until someone writes what was done.

export type HazardKind = "hazard" | "near_miss";

export const HAZARD_KINDS: { id: HazardKind; name: string; hint: string }[] = [
  { id: "hazard", name: "Something unsafe", hint: "A hazard that's there now: a hole, a missing rail, a bad cord." },
  { id: "near_miss", name: "A near miss", hint: "Something that almost hurt someone." },
];
export const hazardKindName = (k: HazardKind) => HAZARD_KINDS.find((x) => x.id === k)?.name ?? k;

export type HazardDraft = { kind: HazardKind; what: string; where: string; jobsiteId: string | null; anonymous: boolean };

export type HazardReport = {
  id: string; client_id: string; kind: HazardKind; what: string; where_text: string; jobsite_id: string | null; jobsite_name: string;
  anonymous: boolean; reporter_name: string; via: "app" | "sticker"; has_photo: boolean; created_at: string;
  reviewed_at: string | null; action: string;
};

export const HAZARD_WHAT_MAX = 1000;
export const HAZARD_WHERE_MAX = 200;
export const HAZARD_NAME_MAX = 120;
/** Photos are shrunk on the phone to well under this before sending. */
export const HAZARD_PHOTO_MAX_BYTES = 1_572_864;

export function hazardProblem(d: Pick<HazardDraft, "what" | "where">): string | null {
  const what = d.what.trim();
  if (!what) return "Say what you saw.";
  if (what.length > HAZARD_WHAT_MAX) return `Keep it to ${HAZARD_WHAT_MAX} characters.`;
  if (d.where.trim().length > HAZARD_WHERE_MAX) return `Keep the place to ${HAZARD_WHERE_MAX} characters.`;
  return null;
}

/** Who sent it, as the office sees it. */
export function reporterLabel(r: Pick<HazardReport, "anonymous" | "reporter_name" | "via">): string {
  if (r.anonymous || !r.reporter_name) return r.via === "sticker" ? "No name (jobsite sticker)" : "No name";
  return r.via === "sticker" ? `${r.reporter_name} (jobsite sticker)` : r.reporter_name;
}

/** New ones first (oldest new on top, so nothing waits forever), then reviewed, newest first. */
export function sortHazards<R extends Pick<HazardReport, "reviewed_at" | "created_at">>(rows: R[]): R[] {
  return [...rows].sort((a, b) => {
    if (!a.reviewed_at !== !b.reviewed_at) return a.reviewed_at ? 1 : -1;
    return a.reviewed_at ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at);
  });
}

/** Counts for Home, the weekly email and the list header. `since`: ISO time the period starts. */
export function hazardCounts(rows: Pick<HazardReport, "kind" | "reviewed_at" | "created_at">[], since: string) {
  return {
    waiting: rows.filter((r) => !r.reviewed_at).length,
    newSince: rows.filter((r) => r.created_at >= since).length,
    nearMissSince: rows.filter((r) => r.created_at >= since && r.kind === "near_miss").length,
  };
}

/** The link a jobsite sticker's second code carries: anyone can report there, no account. */
export function hazardLink(origin: string, jobsiteId: string): string {
  return `${origin.replace(/\/+$/, "")}/report/?site=${jobsiteId.toLowerCase()}`;
}

/** A data URL's base64 part and type, or null when it isn't a JPEG/PNG data URL. */
export function splitDataUrl(url: string): { mime: "image/jpeg" | "image/png"; base64: string } | null {
  const m = /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(url);
  return m ? { mime: m[1] as "image/jpeg" | "image/png", base64: m[2] } : null;
}

/** Postgres returns bytea as "\x" + hex; turn it into a data URL for an <img>. */
export function byteaToDataUrl(hex: string, mime: string): string {
  const h = hex.startsWith("\\x") ? hex.slice(2) : hex;
  let bin = "";
  for (let i = 0; i < h.length; i += 2) bin += String.fromCharCode(parseInt(h.slice(i, i + 2), 16));
  return `data:${mime};base64,${btoa(bin)}`;
}
