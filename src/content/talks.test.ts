import { describe, expect, it } from "vitest";
import { TALKS } from "./talks";
import type { TalkText } from "@/core/talks";

const allText = (t: TalkText) => [t.title, t.hook, t.ask, ...t.sections.flatMap((s) => [s.heading, ...s.items])].join("\n");

describe("talk sources and wording", () => {
  it("every talk has at least one source", () => {
    for (const t of TALKS) expect(t.sources.length, t.id).toBeGreaterThan(0);
  });
  it("every source has a label, an https url and a known kind", () => {
    for (const t of TALKS) {
      for (const s of t.sources) {
        expect(s.label.trim(), t.id).not.toBe("");
        expect(s.url.startsWith("https://"), `${t.id}: ${s.url}`).toBe(true);
        expect(["standard", "guidance"], t.id).toContain(s.kind);
      }
    }
  });
  it("standard sources point at the regulation itself", () => {
    // An OSHA section or appendix page (1904 recordkeeping, 1910, 1926, 1928), or another agency's rule on eCFR (below).
    const osha = /^https:\/\/www\.osha\.gov\/laws-regs\/regulations\/standardnumber\/(1904|1910|1926|1928)\/(\1\.\d+(App[A-Z]\d*|TABLEZ[123])?|\1Subpart[A-Z]+App[A-Z]\d*)$/;
    // Non-OSHA rules a talk names plainly: EPA pesticides (part 170), EPA refrigerants (part 82 subpart F),
    // DOT/FMCSA cargo securement and driving (parts 392-393).
    const ecfr = new RegExp(
      "^https://www\\.ecfr\\.gov/current/(" +
        "title-40/chapter-I/subchapter-E/part-170" +
        "|title-40/chapter-I/subchapter-C/part-82/subpart-F(/section-82\\.\\d+)?" +
        "|title-49/subtitle-B/chapter-III/subchapter-B/part-39[23](/subpart-[A-Z]+)?(/section-39[23]\\.\\d+)?" +
        ")$",
    );
    for (const t of TALKS) {
      for (const s of t.sources.filter((x) => x.kind === "standard")) {
        expect(osha.test(s.url) || ecfr.test(s.url), `${t.id}: ${s.url}`).toBe(true);
      }
    }
  });

  it("every talk has English and Spanish with the same shape, and unique ids", () => {
    const ids = TALKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of TALKS) {
      const en = t.content.en, es = t.content.es;
      expect(es, t.id).toBeDefined();
      expect(es!.sections.length, t.id).toBe(en.sections.length);
      en.sections.forEach((sec, i) => expect(es!.sections[i].items.length, `${t.id} section ${i}`).toBe(sec.items.length));
    }
  });
  it("no talk claims compliance", () => {
    for (const t of TALKS) expect(allText(t.content.en), t.id).not.toMatch(/complian/i);
  });
});
