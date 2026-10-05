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

describe("PDF record", () => {
  it("header band is the company's brand color (default Signal blue when none is set)", () => {
    // jsPDF writes the fill as "r g b rg" (2 decimals) right before the full-width band "0. <top> <width> -8. re".
    const band = (c: Company) => buildRecordPdf(rec(), c).output().match(/([\d.]+ [\d.]+ [\d.]+) rg\n0\. [\d.]+ [\d.]+ -8\. re/)?.[1];
    expect(band(co)).toBe("0.04 0.31 0.64"); // #0B4EA2
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
    expect(withIssues).toContain("Raised by the crew (1)");
    expect(withIssues).toContain("East ladder cracked");
    expect(withIssues).toContain("fix by 2026-10-13");
  });
});
