import { describe, expect, it } from "vitest";
import { audioKey, audioPath, fnv64, recordableLines } from "./voice";

describe("recorded audio keys", () => {
  it("is the standard FNV-1a 64", () => {
    expect(fnv64("")).toBe("cbf29ce484222325");
    expect(fnv64("a")).toBe("af63dc4c8601ec8c");
  });
  it("changes with the words, language or voice; ignores stray spaces", () => {
    const k = audioKey("Wear your harness.", "en", "af_heart");
    expect(audioKey("  Wear   your harness. ", "en", "af_heart")).toBe(k);
    expect(audioKey("Wear your harness!", "en", "af_heart")).not.toBe(k);
    expect(audioKey("Wear your harness.", "es", "af_heart")).not.toBe(k);
    expect(audioKey("Wear your harness.", "en", "am_adam")).not.toBe(k);
    expect(audioPath("af_heart", k)).toBe(`af_heart/${k}.mp3`);
  });
  it("records the talk's own words in reading order, nothing dynamic", () => {
    const lines = recordableLines({ title: "Ladders", hook: "Most falls start here.", sections: [{ heading: "Set up", items: ["4 to 1", ""] }], ask: "Who checked it?" }, "Ask the team");
    expect(lines).toEqual(["Ladders", "Most falls start here.", "Set up", "4 to 1", "Ask the team", "Who checked it?"]);
  });
});
