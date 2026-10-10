import { describe, expect, it } from "vitest";
import { checkTailored, numbersIn, tailorPrompt, SYSTEM_PROMPT } from "./aiTailor";

const source = { title: "Ladders", hook: "Most falls start on a ladder.", sections: [{ heading: "Set up", items: ["Use the 4 to 1 rule.", "Extend 3 feet above the landing (1926.1053(b)(1))."] }], ask: "Who checked the ladder today?" };
const ok = { title: "Ladders on tear-off days", hook: "On a reroof, most falls start on the ladder.", sections: [{ heading: "Set up at the eave", items: ["Use the 4 to 1 rule on soft ground too.", "Extend 3 feet above the gutter (1926.1053(b)(1))."] }], ask: "Who checked the ladder at the dumpster side?" };

describe("AI tailoring", () => {
  it("the prompt carries the industry, notes, source talk and only its rules", () => {
    const p = tailorPrompt({ companyId: "c", baseId: "ladder", talk: source, sources: ["OSHA 1926.1053(b)(1): side rails 3 feet above the landing"], industry: "Roofing", workSetting: "Jobsites", notes: "Tear-offs on two-story homes" });
    expect(p).toContain("Company industry: Roofing");
    expect(p).toContain("Tear-offs on two-story homes");
    expect(p).toContain("- OSHA 1926.1053(b)(1)");
    expect(SYSTEM_PROMPT).toMatch(/Never add a number/);
  });
  it("accepts a draft that keeps the rules and adds no numbers", () => {
    const r = checkTailored(`Here you go: ${JSON.stringify(ok)}`, source, ["OSHA 1926.1053(b)(1)"]);
    expect("talk" in r && r.talk.title).toBe("Ladders on tear-off days");
  });
  it("rejects invented numbers, dropped rule references, compliance talk and broken shapes", () => {
    const withNumber = { ...ok, sections: [{ heading: "Set up", items: ["Keep it 10 feet from lines.", "Extend 3 feet (1926.1053(b)(1))."] }] };
    expect(checkTailored(JSON.stringify(withNumber), source, [])).toMatchObject({ problem: expect.stringMatching(/added numbers/) });
    const dropped = { ...ok, sections: [{ heading: "Set up", items: ["Use the 4 to 1 rule.", "Extend 3 feet above the landing."] }] };
    expect(checkTailored(JSON.stringify(dropped), source, [])).toMatchObject({ problem: expect.stringMatching(/rule reference/) });
    expect(checkTailored(JSON.stringify({ ...ok, ask: "Are we compliant?" }), source, [])).toMatchObject({ problem: expect.stringMatching(/compliance/) });
    expect(checkTailored("no json", source, [])).toMatchObject({ problem: expect.stringMatching(/readable/) });
    expect(checkTailored(JSON.stringify({ ...ok, sections: [] }), source, [])).toMatchObject({ problem: expect.stringMatching(/missing/) });
  });
  it("numbers are compared loosely", () => {
    expect([...numbersIn("6 feet, 6-foot, 1,5 m")]).toEqual(["6", "1.5"]);
  });
});
