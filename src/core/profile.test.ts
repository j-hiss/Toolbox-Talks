import { describe, expect, it } from "vitest";
import { buildCompliance, type ReportPerson, type ReportRecord } from "./compliance";
import { buildProfile, profileRange, type ProfileInput } from "./profile";
import { parseDay } from "./weeks";

const today = parseDay("2026-10-08");
const people: ReportPerson[] = [{ id: "a", name: "Ana", teamId: null, createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null }, { id: "b", name: "Ben", teamId: null, createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null }];
const rec = (id: string, week: string, held: string, signed: string[], makeup: string | null = null): ReportRecord => ({
  id, title: "t", heldAt: held, weekStart: week, makeupForWeek: makeup, makeupReason: makeup ? "Out sick" : null, teamName: "", presenterId: null, presenterSigned: false,
  attendees: signed.map((p) => ({ personId: p, name: p, status: "signed" as const })),
});
// Weeks of Sep 7, 14, 21 (no talk), 28, Oct 5 (this week, not scored).
const weekly = [rec("r1", "2026-09-07", "2026-09-08T12:00:00Z", ["a", "b"]), rec("r2", "2026-09-14", "2026-09-15T12:00:00Z", ["a"]), rec("r3", "2026-09-28", "2026-09-29T12:00:00Z", ["a", "b"]),
  rec("r4", "2026-10-05", "2026-10-06T12:00:00Z", ["b"], "2026-09-14")];
const compliance = buildCompliance({ people, records: weekly, weeks: ["2026-10-05", "2026-09-28", "2026-09-21", "2026-09-14", "2026-09-07"], makeupWeeks: 4, today });
const base: ProfileInput = {
  compliance,
  records: [
    { id: "r1", talk_id: "fall", language: "en", held_at: "2026-09-08T12:00:00Z", makeup_for_week: null },
    { id: "r2", talk_id: "ladders", language: "es", held_at: "2026-09-15T12:00:00Z", makeup_for_week: null },
    { id: "r3", talk_id: "first-aid-blood", language: "en", held_at: "2026-09-29T12:00:00Z", makeup_for_week: null },
    { id: "r4", talk_id: "ladders", language: "es", held_at: "2026-10-06T12:00:00Z", makeup_for_week: "2026-09-14" },
  ],
  daily: [{ held_at: "2026-09-08T11:00:00Z" }, { held_at: "2026-09-08T15:00:00Z" }, { held_at: "2026-09-09T11:00:00Z" }],
  events: [
    { kind: "inspection", occurred_on: "2026-09-10", status: "closed", case_status: null, withdrawn_at: null },
    { kind: "incident", occurred_on: "2026-09-20", status: "open", case_status: null, withdrawn_at: null },
    { kind: "near_miss", occurred_on: "2026-09-21", status: "open", case_status: null, withdrawn_at: "2026-09-22T00:00:00Z" },
    { kind: "citation", occurred_on: "2026-09-25", status: "open", case_status: "contested", withdrawn_at: null },
  ],
  issues: [
    { raised_at: "2026-09-08T12:00:00Z", status: "fixed", fixed_at: "2026-09-11T12:00:00Z", due_date: "2026-09-15" },
    { raised_at: "2026-09-20T12:00:00Z", status: "open", fixed_at: null, due_date: "2026-09-27", event_id: "e1" },
  ],
  emr: [{ rating_year: 2026, emr: 0.92, note: "", entered_at: "2026-02-01T00:00:00Z" }, { rating_year: 2026, emr: 0.88, note: "corrected", entered_at: "2026-03-01T00:00:00Z" }],
  documents: [],
  from: "2026-09-01", to: "2026-10-08", today,
};

describe("company safety profile", () => {
  it("counts ended talk periods honestly: a week with no talk at all is missed", () => {
    const p = buildProfile(base);
    expect(p.periodsEnded).toBe(4); // Sep 7, 14, 21, 28; this week isn't scored
    expect(p.periodsMissed).toBe(1); // Sep 21
    expect(p.periodsWithTalk).toBe(3);
    expect(p.missedKeys).toEqual(["2026-09-21"]);
    expect(p.talks).toBe(4);
    expect(p.makeups).toBe(1);
    expect(p.topics).toBe(3);
    expect(p.languages).toEqual([{ language: "en", talks: 2 }, { language: "es", talks: 2 }]);
  });
  it("sign-in rate over ended periods, with on-time shown next to it", () => {
    const p = buildProfile(base);
    // 8 person-weeks: Sep 7 a,b on time; Sep 14 a on time, b made up; Sep 21 both open; Sep 28 both on time
    expect(p.total.on_time).toBe(5);
    expect(p.total.made_up).toBe(1);
    expect(p.signIn).toBeCloseTo(6 / 8);
    expect(p.onTime).toBeCloseTo(5 / 8);
    expect(p.months.map((m) => [m.month, m.periods, m.missed, m.talks])).toEqual([["2026-09", 4, 1, 3], ["2026-10", 0, 0, 1]]);
  });
  it("daily plans count days, the safety log leaves out withdrawn entries, issues show days to fix", () => {
    const p = buildProfile(base);
    expect(p.dailyDays).toBe(2);
    expect(p.log).toMatchObject({ inspections: 1, incidents: 1, nearMisses: 0, citations: [{ status: "contested" }] });
    expect(p.issues).toEqual({ raised: 2, fixed: 1, open: 1, overdue: 1, medianDaysToFix: 3 });
  });
  it("program elements say what records exist, never that a requirement is met", () => {
    const p = buildProfile(base);
    expect(p.elements.map((e) => [e.id, e.status])).toEqual([
      ["policy", "outside"], ["inspections", "records"], ["maintenance", "outside"], ["training", "records"], ["first_aid", "some"], ["investigation", "records"], ["records", "records"],
    ]);
    expect(JSON.stringify(p.elements)).not.toMatch(/complian|meets|satisf|certif/i);
    const withDoc = buildProfile({ ...base, documents: [{ kind: "safety_program", title: "Safety manual 2026", uploaded_at: "2026-01-02T00:00:00Z" }] });
    expect(withDoc.elements[0]).toMatchObject({ status: "records", evidence: expect.stringMatching(/^Written program attached \(1 document, latest uploaded /) });
    expect(withDoc.elements[0].evidence).not.toContain("Safety manual");
  });
  it("self-reported EMR: the latest entry per year", () => {
    expect(buildProfile(base).emr).toEqual([{ rating_year: 2026, emr: 0.88, note: "corrected", entered_at: "2026-03-01T00:00:00Z" }]);
  });
  it("ranges: the last 12 months, and last calendar month", () => {
    expect(profileRange("year", today)).toEqual({ from: "2025-10-09", to: "2026-10-08" });
    expect(profileRange("month", today)).toEqual({ from: "2026-09-01", to: "2026-09-30" });
  });
  it("adds training cards to the training element, labelled as entered by the company", () => {
    const p = buildProfile({ ...base, training: { current: 5, expiring: 1, expired: 2, missing: 1 } });
    const e = p.elements.find((x) => x.id === "training")!;
    expect(e.evidence).toContain("Training cards entered by the company, as of today: 6 current (1 expiring within 30 days), 2 expired, 1 missing");
  });
});
