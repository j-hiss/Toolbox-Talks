import { describe, expect, it } from "vitest";
import { PROGRAMS } from "@/content/programs";
import { INDUSTRIES } from "./industries";
import { cleanAnswers, latestPrograms, programCounts, programProblem, programState, programsFor, sameAnswers, type ProgramRow } from "./programs";

const row = (over: Partial<ProgramRow>): ProgramRow => ({ program_key: "hazcom", template_version: 1, version: 1, answers: {}, approved_name: "Example Owner", approved_title: "", review_only: false, note: "", created_at: "2026-01-10T12:00:00Z", ...over });
const t = (id: string) => PROGRAMS.find((p) => p.id === id)!;

describe("written program templates", () => {
  it("ids unique, every section cites a paragraph, sources are OSHA, industries exist", () => {
    expect(new Set(PROGRAMS.map((p) => p.id)).size).toBe(PROGRAMS.length);
    const ids = new Set(INDUSTRIES.map((i) => i.id));
    for (const p of PROGRAMS) {
      expect(p.rule && p.appliesIf && p.keep, p.id).toBeTruthy();
      expect(p.id).toMatch(/^[a-z0-9-]{2,40}$/);
      expect(new Set(p.sections.map((s) => s.id)).size, p.id).toBe(p.sections.length);
      for (const s of p.sections) { expect(s.rule, `${p.id}/${s.id}`).toBeTruthy(); expect(s.id).toMatch(/^[a-z0-9-]{1,40}$/); }
      for (const src of p.sources) expect(src.url).toMatch(/^https:\/\/www\.osha\.gov\//);
      for (const i of p.industries) expect(i === "all" || ids.has(i), `${p.id}: ${i}`).toBe(true);
      expect(p.sections.some((s) => !s.optional), p.id).toBe(true);
    }
  });
  it("never claims compliance and examples are labelled", () => {
    expect(JSON.stringify(PROGRAMS)).not.toMatch(/\bcomplian(t|ce)\b|\bmeets the (rule|standard)\b/i);
    for (const p of PROGRAMS) for (const s of p.sections) if (s.example) expect(s.example, `${p.id}/${s.id}`).toMatch(/^Example: /);
  });
  it("every company sees every program; its industry's come first", () => {
    for (const i of INDUSTRIES) {
      const { mine, more } = programsFor(PROGRAMS, i.id);
      expect(mine.length + more.length).toBe(PROGRAMS.length);
      expect(mine[0].industries).toContain("all");
    }
    expect(programsFor(PROGRAMS, "roof").mine.map((p) => p.id)).toContain("silica-con");
    expect(programsFor(PROGRAMS, "roof").more.map((p) => p.id)).toContain("loto");
  });
});

describe("program rules", () => {
  it("needs every required section and an approver", () => {
    const hc = t("hazcom");
    expect(programProblem(hc, { answers: {}, approved_name: "A", approved_title: "", note: "" })).toMatch(/Fill in 5 sections/);
    const full = Object.fromEntries(hc.sections.filter((s) => !s.optional).map((s) => [s.id, "x"]));
    expect(programProblem(hc, { answers: full, approved_name: " ", approved_title: "", note: "" })).toMatch(/name/);
    expect(programProblem(hc, { answers: full, approved_name: "A", approved_title: "", note: "" })).toBeNull();
  });
  it("cleans answers to the template's sections and spots an unchanged review", () => {
    const hc = t("hazcom");
    expect(cleanAnswers(hc, { labels: " a ", bogus: "x", sds: "  " })).toEqual({ labels: "a" });
    expect(sameAnswers(hc, { labels: "a" }, { labels: "a ", sds: "" })).toBe(true);
    expect(sameAnswers(hc, { labels: "a" }, { labels: "b" })).toBe(false);
  });
  it("yearly review is due 12 months after the latest version; a newer template edition is flagged", () => {
    const bbp = t("bbp");
    const now = new Date("2027-01-11T00:00:00Z");
    expect(programState(bbp, undefined, now).kind).toBe("not_started");
    expect(programState(bbp, row({ program_key: "bbp" }), now).kind).toBe("review_due");
    expect(programState(bbp, row({ program_key: "bbp", created_at: "2026-06-01T00:00:00Z" }), now).kind).toBe("on_file");
    expect(programState(t("hazcom"), row({}), now)).toMatchObject({ kind: "on_file", reviewDue: null });
    expect(programState({ ...bbp, version: 2 }, row({ program_key: "bbp" }), now).kind).toBe("template_changed");
  });
  it("latest version per program and counts", () => {
    const rows = [row({}), row({ version: 2, review_only: true }), row({ program_key: "bbp" })];
    expect(latestPrograms(rows).get("hazcom")!.version).toBe(2);
    expect(programCounts(PROGRAMS, rows, new Date("2027-02-01T00:00:00Z"))).toEqual({ onFile: 2, reviewDue: 1, templateChanged: 0 });
  });
});
