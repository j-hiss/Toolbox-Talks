import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "./industries";
import { filingDuty, itaCaseCsv, itaCaseProblems, itaSummaryCsv, itaSummaryProblems, sizeCode, ITA_CASE_HEADERS, ITA_SUMMARY_HEADERS } from "./oshaFiling";
import { BLANK_301, nameInNarrative, incidentGaps, type InjuryCase, type InjurySummary } from "./oshaLog";

const sum: InjurySummary = {
  year: 2026, version: 1, establishment: "Example Roofing Co - Main", address: "", industry: "Roofing", naics: "238160", avg_employees: 24, hours_worked: 49920,
  certifier_name: "", certifier_title: "", certifier_phone: "", legal_name: "Example Roofing Co LLC", ein: "123456789", street: "1 Example St", city: "Fort Myers", state: "FL", zip: "33913",
  peak_employees: 31, establishment_type: 1, establishment_id: null,
};
const c = (over: Partial<InjuryCase> = {}): InjuryCase => ({
  ...BLANK_301, case_key: "k", version: 1, year: 2026, case_no: 1, removed: false, removed_reason: "", establishment_id: null, person_id: null, employee_name: "Pat Rivera", job_title: "Roofer",
  injury_date: "2026-03-02", location: "Example Jobsite", description: "Sprained ankle", outcome: "days_away", days_away: 3, days_restricted: 0, kind: "injury",
  privacy: false, privacy_reason: null, created_at: "", birth_date: "1990-01-15", hire_date: "2024-05-01", er_visit: false, inpatient: false, time_of_event: "09:30:00",
  activity_before: "Carrying shingles down a ladder", what_happened: "Missed the last rung", injury_detail: "Sprained left ankle", object_substance: "Ladder", ...over,
});

describe("who files what", () => {
  it("every industry offers 6-digit NAICS starting points", () => {
    for (const i of INDUSTRIES) expect(i.naics.length, i.id).toBeGreaterThan(0);
    for (const i of INDUSTRIES) for (const n of i.naics) expect(n.code).toMatch(/^\d{6}$/);
  });
  it("a 31-person roofer keeps the log and files the 300A, not 300/301", () => {
    const d = filingDuty("238160", 31);
    expect(d).toMatchObject({ log: "keep", file300A: true, file300_301: false });
  });
  it("a 120-person foundation contractor (Appendix B) files the 300 and 301 too", () => {
    expect(filingDuty("238110", 120)).toMatchObject({ file300A: true, file300_301: true });
  });
  it("10 or fewer all year: no log; partially exempt industries: no log", () => {
    expect(filingDuty("238160", 9).log).toBe("small");
    expect(filingDuty("722511", 40)).toMatchObject({ log: "exempt", file300A: false }); // restaurants (2012 NAICS 7221/7222)
  });
  it("250+ files the 300A in any industry that keeps the log; an unlisted mid-size one doesn't", () => {
    expect(filingDuty("811111", 260).file300A).toBe(true);
    expect(filingDuty("811111", 60).file300A).toBe(false); // auto repair isn't in Appendix A
    expect(filingDuty("12", 60).log).toBe("unknown");
  });
  it("ITA size codes", () => {
    expect([sizeCode(5), sizeCode(20), sizeCode(100), sizeCode(250)]).toEqual([1, 21, 22, 3]);
  });
});

describe("OSHA upload files", () => {
  it("summary file: exact headers, one row, totals, no byte-order mark", () => {
    const csv = itaSummaryCsv(sum, [c()], 2026);
    const [head, line] = csv.trim().split("\r\n");
    expect(head).toBe(ITA_SUMMARY_HEADERS.join(","));
    expect(csv.charCodeAt(0)).not.toBe(0xfeff);
    expect(line).toBe("Example Roofing Co - Main,123456789,Example Roofing Co LLC,1 Example St,Fort Myers,FL,33913,238160,Roofing,21,1,2026,24,49920,1,0,1,0,0,3,0,1,0,0,0,0,0,");
    expect(itaSummaryProblems(sum, [c()])).toEqual([]);
    expect(itaSummaryProblems({ ...sum, ein: "12-345", street: "PO Box 4" }, [])).toHaveLength(2);
  });
  it("case file leaves out the name and address; privacy cases send no name either", () => {
    const csv = itaCaseCsv(sum.establishment, [c({ employee_address: "9 Home Ln", provider_name: "Dr Example", privacy: true })], 2026);
    expect(csv.split("\r\n")[0]).toBe(ITA_CASE_HEADERS.join(","));
    expect(csv).not.toMatch(/Pat Rivera|Rivera|Home Ln|Dr Example/);
    expect(csv).toContain("2026-001,Roofer,03/02/2026");
    expect(itaCaseProblems([c({ birth_date: null })])).toEqual(["2026-001: date of birth"]);
  });
  it("the 301 says what's missing and catches names in boxes 14-17", () => {
    expect(incidentGaps(c())).toEqual([]);
    expect(incidentGaps(c({ inpatient: null, time_of_event: null }))).toHaveLength(2);
    expect(nameInNarrative(c({ what_happened: "Rivera slipped" }))).toBe("rivera");
    expect(itaCaseProblems([c({ location: "Rivera's truck" })])[0]).toMatch(/job title, place or description/);
    expect(nameInNarrative(c())).toBeNull();
  });
});
