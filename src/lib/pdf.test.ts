import { describe, expect, it } from "vitest";
import { buildRecordPdf, pdfFileName, PDF_FOOTER, stampParts } from "./pdf";
import type { Company, TalkRecord } from "@/lib/data/types";

const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

const co: Company = {
  id: "c1", name: "Example Roofing Co", licenses: "CCC000000 (example)", address: "1 Example St", phone: "555-0100", email: "",
  industry: "con", zip: "33913", program_start: "2026-09-07", default_jobsite: "", makeup_weeks: 4,
};

const rec = (over: Partial<TalkRecord> = {}): TalkRecord => ({
  id: "r1", client_id: "x", talk_id: "fall", language: "en", title: "Fall Protection",
  week_number: 5, week_start: "2026-10-05", makeup_for_week: null, makeup_reason: null,
  held_at: "2026-10-06T11:02:00Z", jobsite_name: "Main office", team_name: "Crew 1", presenter_name: "Pat Presenter",
  statuses: ["signed", "not_signed", "absent"], presenter_signed: true,
  content: { title: "Fall Protection", hook: "Hook line", sections: [{ heading: "Before you go up", items: ["Tie off"] }], ask: "What would you change?" },
  scheduled_talk_id: "fall", team_lead_name: "Lee Lead", presenter_role: "Foreman",
  presenter_signature: PNG, presenter_signed_at: "2026-10-06T11:20:00Z", latitude: 26.6, longitude: -81.9,
  attendees: [
    { person_id: "a", name: "Ana Worker", role: "Crew member", team_name: "Crew 1", status: "signed", signature: PNG, signed_at: "2026-10-06T11:15:00Z" },
    { person_id: "b", name: "Ben Worker", role: "Crew member", team_name: "Crew 1", status: "not_signed", signature: null, signed_at: null },
    { person_id: "c", name: "Cal Worker", role: "Crew member", team_name: "Crew 1", status: "absent", signature: null, signed_at: null },
  ],
  ...over,
});

const text = (r: TalkRecord) => buildRecordPdf(r, co).output().replace(/\\([()\\])/g, "$1"); // un-escape PDF strings

const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAADAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCOiiivmj7A/9k=";

describe("PDF record", () => {
  it("carries a check code and QR when the record has one, and says so when it doesn't yet", () => {
    const withCode = buildRecordPdf(rec({ verify_code: "7KQ2M9TX4HPAZC3N" }), co, [], "https://app.example.com").output().replace(/\\([()\\])/g, "$1");
    expect(withCode).toContain("CHECK THIS RECORD");
    expect(withCode).toContain("(7KQ2-M9TX-4HPA-ZC3N) Tj");
    expect(withCode).toContain("Check code 7KQ2-M9TX-4HPA-ZC3N"); // in every page footer
    expect(withCode).toContain("app.example.com/verify");
    const before = text(rec({ verify_code: null }));
    expect(before).toContain("hasn't uploaded yet");
    expect(before).not.toContain("Check code");
  });
  it("names a walk-in's company and includes the crew photo with when it was taken", () => {
    const r = rec({
      photo: JPEG, photo_taken_at: "2026-10-06T11:21:00Z",
      attendees: [{ person_id: null, name: "Visiting electrician", role: "Not on roster", team_name: "", company_name: "Example Electric", status: "signed", signature: PNG, signed_at: "2026-10-06T11:16:00Z" }],
    });
    const pdf = text(r);
    expect(pdf).toContain("(Not on roster · Example Electric) Tj");
    expect(pdf).toContain("TEAM PHOTO · TAKEN OCT 6, 2026 11:21 AM UTC");
    expect(pdf).toMatch(/\/Subtype \/Image[\s\S]*\/Filter \/DCTDecode/); // the JPEG is embedded
    expect(text(rec())).not.toContain("CREW PHOTO");
  });
  it("header band is the company's brand color (default forest green when none is set; light brands are darkened to print)", () => {
    // jsPDF writes the fill as "r g b rg" (2 decimals) right before the full-width band "0. <top> <width> -8. re".
    const band = (c: Company) => buildRecordPdf(rec(), c).output().match(/([\d.]+ [\d.]+ [\d.]+) rg\n0\. [\d.]+ [\d.]+ -8\. re/)?.[1];
    expect(band(co)).toBe("0.12 0.3 0.23"); // #1F4D3A forest (default Paper)
    expect(band({ ...co, theme: { brand: "#123456" } })).toBe("0.07 0.2 0.34");
  });
  it("every signature line has the full date and time", () => {
    expect(stampParts("2026-10-06T11:15:00Z")).toEqual({ date: "Oct 6, 2026", time: "11:15 AM UTC" });
    const pdf = text(rec());
    expect(pdf).toContain("(Oct 6, 2026) Tj");
    expect(pdf).toContain("(11:15 AM UTC) Tj"); // Ana
    expect(pdf).toContain("(11:20 AM UTC) Tj"); // presenter
    expect(pdf).toContain("DATE AND TIME SIGNED");
  });
  it("shows company header, the week, every status, and the no-compliance footer", () => {
    const pdf = text(rec());
    for (const s of ["Example Roofing Co", "CCC000000 (example)", "SCHEDULED TALK", "Ana Worker", "Ben Worker", "Cal Worker", "NOT SIGNED", "ABSENT", "2 FLAGGED", PDF_FOOTER])
      expect(pdf, s).toContain(s);
    expect(pdf).not.toMatch(/OSHA compliant/i);
  });
  it("a makeup shows the week it makes up, when it was really given, and why", () => {
    const pdf = text(rec({ makeup_for_week: "2026-09-21", makeup_reason: "Out sick: flu" }));
    expect(pdf).toContain("MAKEUP FOR THE WEEK OF SEP 21");
    expect(pdf).toContain("GIVEN IN WEEK 5 OF 52");
    expect(pdf).toContain("Reason: Out sick: flu");
  });
  it("an unsigned presenter is flagged", () => {
    const pdf = text(rec({ presenter_signature: null, presenter_signed_at: null }));
    expect(pdf).toContain("3 FLAGGED");
  });
  it("long rosters continue onto more pages with the header repeated", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ ...rec().attendees[1], name: `Person ${i}` }));
    const pdf = text(rec({ attendees: many }));
    expect(pdf).toContain("Sign-in sheet (continued)");
    expect(pdf).toContain("Page 3");
  });
  it("file name", () => {
    expect(pdfFileName(rec())).toBe("Week 05 - Toolbox Talk - Fall Protection - 2026-10-06.pdf");
    expect(pdfFileName(rec({ makeup_for_week: "2026-09-21" }))).toBe("Week 05 - Makeup - Toolbox Talk - Fall Protection - 2026-10-06.pdf");
  });
});

describe("PDF extras", () => {
  it("shows site notes, the heat check with the reminder that was read, and what the crew raised", () => {
    const pdf = text(rec({
      site_notes: "Working over the pool enclosure",
      heat: { max_heat_index_f: 104, level: "danger", reminder_read: true, checked_at: "2026-10-06T10:00:00Z", source: "NWS", reminder: { title: "Heat today", items: ["Drink water often"], version: 1 } },
    }));
    expect(pdf).toContain("Today on this site");
    expect(pdf).toContain("Working over the pool enclosure");
    expect(pdf).toContain("Danger");
    expect(pdf).toContain("Drink water often");
    const withIssues = buildRecordPdf(rec(), co, [{
      id: "i1", client_id: "c", record_id: "r1", jobsite_name: "", description: "East ladder cracked", owner_person_id: null, owner_name: "Lee Lead",
      due_date: "2026-10-13", status: "open", raised_by_name: "", raised_at: "2026-10-06T11:00:00Z", fixed_at: null, fixed_note: "",
    }]).output().replace(/\\([()\\])/g, "$1");
    expect(withIssues).toContain("Raised by the team (1)");
    expect(withIssues).toContain("East ladder cracked");
    expect(withIssues).toContain("fix by 2026-10-13");
  });
});

describe("safety program summary PDF", () => {
  it("lists missed weeks, labels EMR self-reported, carries no names, and never claims compliance", async () => {
    const { buildCompliance } = await import("@/core/compliance");
    const { buildProfile } = await import("@/core/profile");
    const { buildProfilePdf, profilePdfFileName } = await import("./pdf");
    const today = new Date("2026-10-08T12:00:00Z");
    const people = [{ id: "a", name: "Ana Worker", teamId: null, createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null }];
    const records = [{ id: "r1", title: "t", heldAt: "2026-09-08T12:00:00Z", weekStart: "2026-09-07", makeupForWeek: null, makeupReason: null, teamName: "", presenterId: null, presenterSigned: false,
      attendees: [{ personId: "a", name: "Ana Worker", status: "signed" as const }] }];
    const compliance = buildCompliance({ people, records, weeks: ["2026-09-14", "2026-09-07"], makeupWeeks: 4, today });
    const p = buildProfile({ compliance, records: [{ id: "r1", talk_id: "fall", language: "en", held_at: "2026-09-08T12:00:00Z", makeup_for_week: null }],
      daily: [], events: [], issues: [], emr: [{ rating_year: 2026, emr: 0.88, note: "", entered_at: "2026-03-01T00:00:00Z" }], documents: [], from: "2026-09-01", to: "2026-10-08", today });
    const out = buildProfilePdf(p, co, { kind: "renewal", florida: true, crew: 1, generatedAt: today }).output().replace(/\\([()\\])/g, "$1");
    expect(out).toContain("Weeks with no talk recorded");
    expect(out).toContain("1 of 2");
    expect(out).toContain("self-reported");
    expect(out).toContain("s. 440.1025");
    expect(out).toContain(PDF_FOOTER);
    expect(out).not.toContain("Ana Worker");
    expect(out.toLowerCase()).not.toMatch(/\b(is|are|fully) compliant\b|meets osha/);
    expect(profilePdfFileName("renewal", p, co)).toBe("Example Roofing Co - Safety Program Summary - 2026-09-01 to 2026-10-08.pdf");
  });
});

describe("OSHA 300 log PDFs", () => {
  const base = { version: 1, year: 2026, removed: false, removed_reason: "", person_id: null, created_at: "", job_title: "Roofer", location: "Example Jobsite", privacy: false, privacy_reason: null } as const;
  const cases = [
    { ...base, case_key: "a", case_no: 1, employee_name: "Example Worker One", injury_date: "2026-03-02", description: "Sprained ankle", outcome: "days_away", days_away: 3, days_restricted: 2, kind: "injury" },
    { ...base, case_key: "b", case_no: 2, employee_name: "Example Private Person", injury_date: "2026-05-14", description: "Skin rash on hands", outcome: "restricted", days_away: 0, days_restricted: 6, kind: "skin", privacy: true, privacy_reason: "employee_request" },
  ] as import("@/core/oshaLog").InjuryCase[];
  const plain = (d: { output: () => string }) => d.output().replace(/\\([()\\])/g, "$1");
  it("the log prints \"Privacy case\" instead of the name, and page totals", async () => {
    const { buildOsha300Pdf } = await import("./pdf");
    const pdf = plain(buildOsha300Pdf(cases, co, 2026, null));
    expect(pdf).toContain("(Example Worker One) Tj");
    expect(pdf).toContain("(Privacy case) Tj");
    expect(pdf).not.toContain("Example Private Person");
    expect(pdf).toContain("2026-002");
    expect(pdf).not.toMatch(/\bcompliant\b/i);
  });
  it("the 300A totals the columns and carries the access, falsifying and posting lines", async () => {
    const { buildOsha300APdf } = await import("./pdf");
    const pdf = plain(buildOsha300APdf(cases, co, 2026, null));
    expect(pdf).toContain("(J) Other recordable cases");
    expect(pdf).toContain("Knowingly falsifying this document may result in a fine.");
    expect(pdf).toContain("Post this summary from Feb 1, 2027 to Apr 30, 2027.");
    expect(pdf).toContain("Employees, former employees, and their representatives have the right to review");
    expect(pdf).not.toContain("Example Private Person");
  });
  it("the confidential list has the privacy names only", async () => {
    const { buildPrivacyListPdf } = await import("./pdf");
    const pdf = plain(buildPrivacyListPdf(cases, co, 2026));
    expect(pdf).toContain("CONFIDENTIAL");
    expect(pdf).toContain("(Example Private Person) Tj");
    expect(pdf).not.toContain("Example Worker One");
  });
});

describe("OSHA 301 PDF", () => {
  it("prints fields 1-18 in order and says what's still missing", async () => {
    const { buildOsha301Pdf } = await import("./pdf");
    const { BLANK_301 } = await import("@/core/oshaLog");
    const c = { ...BLANK_301, case_key: "a", version: 1, year: 2026, case_no: 4, removed: false, removed_reason: "", person_id: null, created_at: "", employee_name: "Example Worker",
      job_title: "Roofer", injury_date: "2026-03-02", location: "Example Jobsite", description: "Sprained ankle", outcome: "days_away", days_away: 3, days_restricted: 0, kind: "injury",
      privacy: false, privacy_reason: null, inpatient: true, er_visit: true, time_of_event: "14:05:00", what_happened: "Missed the last rung" } as import("@/core/oshaLog").InjuryCase;
    const pdf = buildOsha301Pdf(c, co).output().replace(/\\([()\\])/g, "$1");
    expect(pdf).toContain("Injury and Illness Incident Report");
    expect(pdf).toContain("(2026-004) Tj");
    expect(pdf).toContain("(2:05 PM) Tj");
    expect(pdf).toContain("(Missed the last rung) Tj");
    expect(pdf).toContain("Still to fill in: date of birth (3)");
    expect(pdf).not.toMatch(/\bcompliant\b/i);
  });
});
