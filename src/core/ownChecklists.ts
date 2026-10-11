// "Your own checklists" (migration 0045): inspection checklists a company writes itself. Pure module. They run exactly
// like the app's (src/core/inspections.ts): every item pass, fail or n/a, failures explained, signed, saved once.
//
// - Versions, never edits: the latest version is offered; a retired checklist stops being offered. Saved inspections
//   keep the exact items that were checked.
// - Same "how often" as the app's checklists, so "due", Home's count and the phone reminders work the same way. A
//   company's own checklist counts as one it uses from the start (it made it).
import type { Checklist, ChecklistItem, ChecklistWhen } from "./inspections";

export type OwnChecklistRow = {
  checklist_key: string; version: number; retired: boolean; title: string; how_often: ChecklistWhen; rule: string; items: ChecklistItem[]; created_at: string;
};

export type OwnChecklistDraft = { title: string; how_often: ChecklistWhen; rule: string; items: ChecklistItem[] };

export const MAX_ITEMS = 60;

/** A new checklist key: "own-" and 12 random letters/digits. */
export function newChecklistKey(random: () => number = Math.random): string {
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "own-" + Array.from({ length: 12 }, () => abc[Math.floor(random() * abc.length)]).join("");
}

/** The latest version of each checklist, without retired ones, by title. */
export function latestOwnChecklists(rows: OwnChecklistRow[]): OwnChecklistRow[] {
  const best = new Map<string, OwnChecklistRow>();
  for (const r of rows) { const cur = best.get(r.checklist_key); if (!cur || r.version > cur.version) best.set(r.checklist_key, r); }
  return [...best.values()].filter((r) => !r.retired).sort((a, b) => a.title.localeCompare(b.title));
}

/** As a checklist the inspection screens run. Counts as "every job" for due and reminders, marked as the company's own. */
export function asChecklist(r: OwnChecklistRow): Checklist {
  return { id: r.checklist_key, version: r.version, title: r.title, industries: ["all"], when: r.how_often, rule: r.rule, sources: [], items: r.items, own: true };
}

/**
 * Items from the editor's lines: one item per line, an optional rule after " | " ("Guardrails in place | 1926.502(b)").
 * Keeps an existing item's id when its text is unchanged, so edits don't renumber everything; new items get the next id.
 */
export function itemsFromLines(text: string, previous: ChecklistItem[] = []): ChecklistItem[] {
  const used = new Set<string>();
  let next = Math.max(0, ...previous.map((p) => Number(/^i(\d+)$/.exec(p.id)?.[1] ?? 0))) + 1;
  return text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const [itemText, rule] = line.split(" | ").map((x) => x.trim());
    const same = previous.find((p) => p.text === itemText && !used.has(p.id));
    const id = same ? same.id : `i${next++}`;
    used.add(id);
    return rule ? { id, text: itemText, rule } : { id, text: itemText };
  });
}

/** The editor's lines for a checklist's items (the reverse of itemsFromLines). */
export const linesFromItems = (items: ChecklistItem[]) => items.map((i) => (i.rule ? `${i.text} | ${i.rule}` : i.text)).join("\n");

/** What's wrong with a checklist before it can be saved, in plain words, or null. */
export function ownChecklistProblem(d: OwnChecklistDraft): string | null {
  if (!d.title.trim()) return "Give the checklist a name.";
  if (d.title.trim().length > 120) return "Keep the name under 120 characters.";
  if (d.items.length === 0) return "Add at least one thing to check, one per line.";
  if (d.items.length > MAX_ITEMS) return `Keep it to ${MAX_ITEMS} items or fewer.`;
  const long = d.items.find((i) => i.text.length > 300);
  if (long) return `Shorten this item (300 characters at most): "${long.text.slice(0, 40)}…"`;
  const longRule = d.items.find((i) => (i.rule ?? "").length > 120);
  if (longRule) return "Keep each rule reference under 120 characters.";
  if (d.rule.length > 300) return "Keep the rule line under 300 characters.";
  return null;
}
