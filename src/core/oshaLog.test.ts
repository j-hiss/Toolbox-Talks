import { describe, expect, it } from "vitest";
import { BLANK_301, caseLabel, caseProblem, countDays, latestCases, logRates, logTotals, nameOnLog, postingWindow, type CaseDraft, type InjuryCase } from "./oshaLog";

const draft = (over: Partial<CaseDraft> = {}): CaseDraft => ({
  ...BLANK_301,
  person_id: null, employee_name: "Example Worker", job_title: "Roofer", injury_date: "2026-03-02", location: "Example Jobsite, roof",
  description: "Sprained left ankle stepping off a ladder", outcome: "days_away", days_away: 3, days_restricted: 0, kind: "injury",
  privacy: false, privacy_reason: null, establishment_id: null, ...over,
});
const row = (key: string, version: number, over: Partial<InjuryCase> = {}): InjuryCase => ({
  ...draft(), case_key: key, version, year: 2026, case_no: 1, removed: false, removed_reason: "", created_at: "2026-03-03T00:00:00Z", ...over,
});
const today = new Date(2026, 9, 10);

describe("OSHA 300 log", () => {
  it("one box per case, days matching the box", () => {
    expect(caseProblem(draft(), today)).toBeNull();
    expect(caseProblem(draft({ days_away: 0 }), today)).toMatch(/at least 1 day away/);
    expect(caseProblem(draft({ outcome: "restricted", days_away: 2, days_restricted: 4 }), today)).toMatch(/Days away from work/);
    expect(caseProblem(draft({ outcome: "other", days_away: 0, days_restricted: 1 }), today)).toMatch(/matching box/);
    expect(caseProblem(draft({ days_away: 181 }), today)).toMatch(/180/);
    expect(caseProblem(draft({ days_away: 120, days_restricted: 61 }), today)).toMatch(/together/);
    expect(caseProblem(draft({ injury_date: "2026-10-11" }), today)).toMatch(/future/);
  });
  it("privacy cases: a reason, the name off the log, and only illnesses at the person's request", () => {
    expect(caseProblem(draft({ privacy: true }), today)).toMatch(/why/);
    expect(caseProblem(draft({ privacy: true, privacy_reason: "employee_request" }), today)).toMatch(/Only an illness/);
    expect(caseProblem(draft({ privacy: true, privacy_reason: "employee_request", kind: "skin" }), today)).toBeNull();
    expect(nameOnLog({ privacy: true, employee_name: "Example Worker" })).toBe("Privacy case");
    expect(nameOnLog({ privacy: false, employee_name: "Example Worker" })).toBe("Example Worker");
  });
  it("latest version counts; a removed case drops out; numbered in order", () => {
    const list = latestCases([row("a", 1, { case_no: 2 }), row("b", 1, { case_no: 1 }), row("a", 2, { case_no: 2, days_away: 5 }), row("c", 1, { case_no: 3 }), row("c", 2, { case_no: 3, removed: true, removed_reason: "Not work-related" })]);
    expect(list.map((c) => `${caseLabel(c)}@${c.version}`)).toEqual(["2026-001@1", "2026-002@2"]);
  });
  it("totals every column (zeros with no cases) and works out the rates", () => {
    const t = logTotals([draft(), draft({ outcome: "restricted", days_away: 0, days_restricted: 10, kind: "skin" }), draft({ outcome: "other", days_away: 0 })]);
    expect(t).toMatchObject({ G: 0, H: 1, I: 1, J: 1, K: 3, L: 10 });
    expect(t.M[1]).toBe(2); expect(t.M[2]).toBe(1);
    expect(logTotals([])).toMatchObject({ G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 });
    expect(logRates(t, 100_000)).toEqual({ recordable: 6, dart: 4 });
    expect(logRates(t, null)).toBeNull();
  });
  it("counts calendar days from the day after, capped at 180; posts Feb 1 to Apr 30", () => {
    expect(countDays("2026-03-02", "2026-03-05")).toBe(3);
    expect(countDays("2026-01-01", "2026-12-31")).toBe(180);
    expect(countDays("2026-03-05", "2026-03-02")).toBe(0);
    expect(postingWindow(2026)).toEqual({ from: "2027-02-01", to: "2027-04-30" });
  });
});

import { companyHeadcount, onLog, type InjurySummary } from "./oshaLog";
import { filingDuty } from "./oshaFiling";
describe("more than one log (1904.30)", () => {
  const s = (est: string | null, peak: number | null, version = 1, year = 2026): InjurySummary => ({
    year, version, establishment: est ?? "Main", address: "", industry: "", naics: "238160", avg_employees: null, hours_worked: null, certifier_name: "",
    certifier_title: "", certifier_phone: "", legal_name: "", ein: "", street: "", city: "", state: "", zip: "", peak_employees: peak, establishment_type: 1, establishment_id: est,
  });
  it("splits rows by log; rows saved before locations existed count as the main log", () => {
    const rows = [{ establishment_id: null }, { establishment_id: "a" }, {} as { establishment_id?: string | null }];
    expect(onLog(rows, null)).toHaveLength(2);
    expect(onLog(rows, "a")).toHaveLength(1);
    expect(onLog(rows, "b")).toHaveLength(0);
  });
  it("adds each log's latest headcount for the year, for the company-wide 10-or-fewer test", () => {
    const rows = [s(null, 4), s(null, 6, 2), s("a", 7, 3), s("b", null, 4), s("a", 50, 5, 2025)];
    expect(companyHeadcount(rows, 2026, [null, "a"])).toBe(13);
    expect(companyHeadcount(rows, 2026, [null, "a", "b"])).toBeNull(); // b has no headcount yet: unknown, never a guess
    expect(companyHeadcount(rows, 2024, [null, "a"])).toBeNull();
  });
  it("a small location of a bigger company still keeps its log: the exemption counts the whole company", () => {
    expect(filingDuty("238160", 6).log).toBe("small");
    expect(filingDuty("238160", 6, 13).log).toBe("keep");
  });
});
