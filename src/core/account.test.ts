import { describe, expect, it } from "vitest";
import { accountNotice, exportCsvRows, noticeText, removableFrom, type CompanyAccount } from "./account";

const base: CompanyAccount = { plan: "trial", trial_ends_at: null, paused_at: null, pause_reason: "", closure_requested_at: null };
const TODAY = new Date(2026, 9, 11, 9, 0);

describe("account notices", () => {
  it("says nothing for an open-ended trial or a paid plan", () => {
    expect(accountNotice(base, TODAY)).toBeNull();
    expect(accountNotice({ ...base, plan: "paid" }, TODAY)).toBeNull();
    expect(accountNotice(null, TODAY)).toBeNull();
  });
  it("warns admins in the last week of a trial, and once it's over", () => {
    expect(accountNotice({ ...base, trial_ends_at: "2026-10-25" }, TODAY)).toBeNull();
    expect(accountNotice({ ...base, trial_ends_at: "2026-10-14" }, TODAY)).toMatchObject({ kind: "trial_ending", daysLeft: 3 });
    expect(accountNotice({ ...base, trial_ends_at: "2026-10-11" }, TODAY)).toMatchObject({ kind: "trial_ending", daysLeft: 0 });
    expect(accountNotice({ ...base, trial_ends_at: "2026-10-10" }, TODAY)?.kind).toBe("trial_over");
    expect(noticeText(accountNotice({ ...base, trial_ends_at: "2026-10-10" }, TODAY)!, false)).toBe(""); // crews aren't told about billing
  });
  it("a pause comes first and tells crews what it means for them", () => {
    const n = accountNotice({ ...base, trial_ends_at: "2026-10-10", paused_at: "2026-10-11T12:00:00Z", pause_reason: "Example reason", closure_requested_at: "2026-10-01T00:00:00Z" }, TODAY)!;
    expect(n.kind).toBe("paused");
    expect(noticeText(n, true)).toContain("Example reason");
    expect(noticeText(n, false)).toContain("can't be saved");
  });
  it("closing counts down 30 days from the request", () => {
    const asked = "2026-10-01T15:00:00Z";
    expect(removableFrom(asked).toISOString()).toBe("2026-10-31T15:00:00.000Z");
    expect(accountNotice({ ...base, closure_requested_at: asked }, TODAY)).toMatchObject({ kind: "closing", daysLeft: 20 });
  });
  it("never claims anything about compliance", () => {
    const all = [accountNotice({ ...base, paused_at: "x" }, TODAY)!, accountNotice({ ...base, closure_requested_at: "2026-10-01T00:00:00Z" }, TODAY)!];
    for (const n of all) for (const admin of [true, false]) expect(noticeText(n, admin)).not.toMatch(/complian/i);
  });
});

describe("export rows to CSV", () => {
  it("uses every column seen, keeps nested values as JSON and blanks for missing", () => {
    expect(exportCsvRows([{ a: 1, b: { x: 2 } }, { a: null, c: "z" }])).toEqual([["a", "b", "c"], [1, '{"x":2}', ""], ["", "", "z"]]);
  });
  it("counts 30 calendar days to removal even across the clock change", () => {
    const n = accountNotice({ ...base, closure_requested_at: new Date(2026, 9, 11, 8, 52).toISOString() }, new Date(2026, 9, 11, 9, 0));
    expect(n).toMatchObject({ kind: "closing", daysLeft: 30 });
  });
});
