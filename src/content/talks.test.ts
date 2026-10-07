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
  it("standard sources point at the OSHA regulation page", () => {
    for (const t of TALKS) {
      for (const s of t.sources.filter((x) => x.kind === "standard")) {
        expect(s.url, t.id).toMatch(/^https:\/\/www\.osha\.gov\/laws-regs\/regulations\/standardnumber\/19(10|26|28)\/19(10|26|28)\.\d+$/);
      }
    }
  });
  it("no talk claims compliance", () => {
    for (const t of TALKS) expect(allText(t.content.en), t.id).not.toMatch(/complian/i);
  });
});
