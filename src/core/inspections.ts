// Inspections: run a checklist on the phone, mark each item pass, fail or not applicable, add notes and photos, sign,
// and save it as a record that never changes. Pure module. Content: src/content/checklists.ts. Database: migration 0034.
//
// - Every industry gets the "Every job" checklists plus its own (and those of industries it uses), the same rule the
//   talk library follows (industryTags in src/core/industries.ts).
// - Honest results: every item ends pass, fail or not applicable; nothing is left blank, and a failed item says what's
//   wrong. A failed item can raise a crew issue so it gets fixed.
// - "Due" is worked out from how often the rule asks for the check (each shift, daily, monthly) and the last saved
//   inspection of that checklist. It documents that someone looked; it never says a site passed or complies.
import { industryTags, type IndustryId } from "./industries";

export type ChecklistWhen = "each_use" | "each_shift" | "daily" | "monthly";

export const WHEN_LABEL: Record<ChecklistWhen, string> = {
  each_use: "Before each use", each_shift: "Each shift", daily: "Daily", monthly: "Monthly",
};

export type ChecklistItem = { id: string; text: string; rule?: string };

export type Checklist = {
  id: string;
  version: number;
  title: string;
  industries: (IndustryId | "all")[];
  when: ChecklistWhen;
  /** The rule that asks for this check, short (shown on the card and the PDF). */
  rule: string;
  sources: { label: string; url: string; kind: "standard" | "guidance" }[];
  items: ChecklistItem[];
  /** The talk that covers the same hazard, offered after a failed inspection. */
  talkId?: string;
};

/** The checklists a company in `industry` gets: "Every job" first, then its own and those it uses. */
export function checklistsFor<C extends Pick<Checklist, "industries">>(all: C[], industry: IndustryId): C[] {
  const tags = industryTags(industry);
  return [...all.filter((c) => c.industries.includes("all")), ...all.filter((c) => !c.industries.includes("all") && tags.some((t) => c.industries.includes(t)))];
}

/**
 * The wording an inspection was checked against, as one string: the title, the rule, then one line per item (id, text
 * and rule, separated by tabs; backslash, tab and newline inside a field are escaped as \\\\, \\t, \\n). public.verify_inspection() (migration 0039) hashes the same string with SHA-256, so
 * the check page can tell whether a saved inspection used the app's own checklist wording, word for word.
 */
export function wordingText(c: { title: string; rule: string; items: ChecklistItem[] }): string {
  // Backslash, tab and newline are escaped inside each field, so no text can pass for a field or item boundary.
  const f = (v: string) => v.replace(/\\/g, "\\\\").replace(/\t/g, "\\t").replace(/\n/g, "\\n");
  return [f(c.title), f(c.rule), ...c.items.map((i) => [f(i.id), f(i.text), f(i.rule ?? "")].join("\t"))].join("\n");
}

/** SHA-256 of wordingText, as lowercase hex. Uses the platform's Web Crypto (browsers, the phone apps, Node 20). */
export async function wordingHash(c: { title: string; rule: string; items: ChecklistItem[] }): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(wordingText(c)));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type WordingMatch = "standard" | "different" | "unknown_version";

/**
 * Does a saved inspection's wording match the app's checklist with the same id and version? "unknown_version" when this
 * copy of the app doesn't carry that checklist version (an older or newer edition), so it can't say either way.
 */
export async function wordingMatch(all: Pick<Checklist, "id" | "version" | "title" | "rule" | "items">[], saved: { checklist_id: string; checklist_version: number; wording_hash: string }): Promise<WordingMatch> {
  const c = all.find((x) => x.id === saved.checklist_id && x.version === saved.checklist_version);
  if (!c) return "unknown_version";
  return (await wordingHash(c)) === saved.wording_hash ? "standard" : "different";
}

export type ItemResult = "pass" | "fail" | "na";
export type CheckedItem = ChecklistItem & { result: ItemResult; note?: string; photo?: string | null; photo_path?: string | null };

/** What's left before an inspection can be signed, in plain words, or null. */
export function inspectionProblem(items: { result: ItemResult | null; note?: string; text: string }[], inspectorName: string, signed: boolean): string | null {
  const blank = items.filter((i) => !i.result).length;
  if (blank) return `Mark every item: ${blank} still blank.`;
  const unexplained = items.find((i) => i.result === "fail" && !i.note?.trim());
  if (unexplained) return `Say what's wrong with "${unexplained.text}".`;
  if (!inspectorName.trim()) return "Who did the inspection?";
  if (!signed) return "Sign to finish.";
  return null;
}

export type InspectionSummary = { id: string; checklist_id: string; title: string; subject: string; jobsite_name: string; inspector_name: string; inspected_at: string; failed_count: number; items_count: number };

/** Whether a checklist is due, from how often the rule asks and when it was last done (for this subject, if any). */
export function dueState(when: ChecklistWhen, last: string | null, now: Date = new Date()): { due: boolean; label: string } {
  if (when === "each_use") return { due: false, label: last ? `Last done ${ago(last, now)}` : "Before each use" };
  if (!last) return { due: true, label: "Not done yet" };
  const d = new Date(last);
  const sameDay = d.toDateString() === now.toDateString();
  if (when === "daily" || when === "each_shift") return sameDay ? { due: false, label: `Done today` } : { due: true, label: `Due today · last ${ago(last, now)}` };
  const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
  return d > monthAgo ? { due: false, label: `Done ${ago(last, now)}` } : { due: true, label: `Due · last ${ago(last, now)}` };
}

/**
 * Due for this company: an "Every job" checklist by its schedule; any other one only once the company has started
 * using it (not every roofer runs a trench), so the due list stays what the crew actually has on site.
 */
export function dueFor(c: Pick<Checklist, "when" | "industries">, last: string | null, now: Date = new Date()): { due: boolean; label: string } {
  const s = dueState(c.when, last, now);
  if (!last && !c.industries.includes("all")) return { due: false, label: "Not done yet" };
  return s;
}

/** A checklist this company keeps on a schedule, with when it was last done: what Home counts and reminders use. */
export type TrackedCheck = { id: string; title: string; when: ChecklistWhen; last: string | null };

/**
 * The checklists this company keeps on a schedule: its industry's set, minus "before each use" ones (no schedule),
 * minus ones it has never used unless they're "Every job" (the same rule as dueFor). One list for the Home count and
 * the phone reminders, so they never disagree.
 */
export function trackedChecks(all: Checklist[], industry: IndustryId, history: { checklist_id: string; inspected_at: string }[]): TrackedCheck[] {
  const last = (id: string) => history.filter((x) => x.checklist_id === id).map((x) => x.inspected_at).sort().at(-1) ?? null;
  return checklistsFor(all, industry)
    .filter((c) => c.when !== "each_use" && (c.industries.includes("all") || last(c.id) !== null))
    .map((c) => ({ id: c.id, title: c.title, when: c.when, last: last(c.id) }));
}

function ago(iso: string, now: Date): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
}

/** Folder for an inspection's files in the talk-files bucket (same rule as talks: <company>/<client_id>/). */
export const inspectionFolder = (companyId: string, clientId: string) => `${companyId}/${clientId}/`;

export type InspectionPayload = {
  company_id: string; client_id: string; checklist_id: string; checklist_version: number; title: string; rule: string;
  items: CheckedItem[]; subject: string; jobsite_id: string | null; jobsite_name: string;
  inspector_person_id: string | null; inspector_name: string; signature: string | null; notes: string; inspected_at: string;
  latitude: number | null; longitude: number | null;
};

export type InspectionFile = { path: string; image: string; contentType: "image/png" | "image/jpeg" };

/**
 * Split an inspection into the files to upload and the payload that points at them. Same paths every time, so a
 * retried upload never makes a second copy.
 */
export function inspectionUpload(p: InspectionPayload): { files: InspectionFile[]; insp: Omit<InspectionPayload, "signature" | "items"> & { signature_path: string | null; items: Omit<CheckedItem, "photo">[] } } {
  const folder = inspectionFolder(p.company_id, p.client_id);
  const files: InspectionFile[] = [];
  const put = (name: string, image: string | null | undefined) => {
    if (!image) return null;
    const jpeg = /^data:image\/jpe?g/i.test(image);
    const path = folder + name + (jpeg ? ".jpg" : ".png");
    files.push({ path, image, contentType: jpeg ? "image/jpeg" : "image/png" });
    return path;
  };
  const { signature, items, ...rest } = p;
  return {
    files,
    insp: {
      ...rest,
      signature_path: put("signature", signature),
      items: items.map(({ photo, ...i }, n) => ({ ...i, note: i.note?.trim() ?? "", photo_path: put(`item-${n}`, photo) })),
    },
  };
}
