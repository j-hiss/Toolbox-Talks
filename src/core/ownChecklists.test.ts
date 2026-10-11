import { describe, expect, it } from "vitest";
import { asChecklist, itemsFromLines, latestOwnChecklists, linesFromItems, newChecklistKey, ownChecklistProblem, type OwnChecklistRow } from "./ownChecklists";
import { trackedChecks, wordingMatch } from "./inspections";

const row = (key: string, version: number, over: Partial<OwnChecklistRow> = {}): OwnChecklistRow => ({
  checklist_key: key, version, retired: false, title: "Example crane setup", how_often: "daily", rule: "", items: [{ id: "i1", text: "Outriggers down" }], created_at: "2026-10-11T12:00:00Z", ...over,
});

describe("your own checklists", () => {
  it("makes keys the database accepts", () => {
    expect(newChecklistKey()).toMatch(/^own-[a-z0-9]{12}$/);
  });
  it("offers the latest version of each, never retired ones", () => {
    const rows = [row("own-aaaaaaaaaaaa", 1), row("own-aaaaaaaaaaaa", 2, { title: "Crane v2" }), row("own-bbbbbbbbbbbb", 1), row("own-bbbbbbbbbbbb", 2, { retired: true })];
    expect(latestOwnChecklists(rows).map((r) => [r.checklist_key, r.version, r.title])).toEqual([["own-aaaaaaaaaaaa", 2, "Crane v2"]]);
  });
  it("reads one item per line with an optional rule after |, keeping ids of unchanged items", () => {
    const first = itemsFromLines("Outriggers down\nLoad chart in cab | 1926.1417(c)\n\n");
    expect(first).toEqual([{ id: "i1", text: "Outriggers down" }, { id: "i2", text: "Load chart in cab", rule: "1926.1417(c)" }]);
    const second = itemsFromLines("Swing radius barricaded\nOutriggers down", first);
    expect(second).toEqual([{ id: "i3", text: "Swing radius barricaded" }, { id: "i1", text: "Outriggers down" }]);
    expect(itemsFromLines(linesFromItems(first), first)).toEqual(first);
  });
  it("says plainly what's missing", () => {
    expect(ownChecklistProblem({ title: "", how_often: "daily", rule: "", items: [{ id: "i1", text: "x" }] })).toMatch(/name/);
    expect(ownChecklistProblem({ title: "X", how_often: "daily", rule: "", items: [] })).toMatch(/at least one/);
    expect(ownChecklistProblem({ title: "X", how_often: "daily", rule: "", items: [{ id: "i1", text: "x" }] })).toBeNull();
  });
  it("counts toward due and reminders for every industry, and the check page calls it the company's own", async () => {
    const c = asChecklist(row("own-aaaaaaaaaaaa", 2));
    expect(c).toMatchObject({ id: "own-aaaaaaaaaaaa", version: 2, own: true, industries: ["all"] });
    expect(trackedChecks([c], "roof", []).map((t) => t.id)).toEqual(["own-aaaaaaaaaaaa"]);
    expect(await wordingMatch([], { checklist_id: "own-aaaaaaaaaaaa", checklist_version: 2, wording_hash: "x" })).toBe("company_own");
  });
});
