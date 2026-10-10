import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { talkTopic } from "./topics";

const by = (id: string) => talkTopic(TALKS.find((t) => t.id === id)!);

describe("talk topics", () => {
  it("picks the right icon for well-known talks", () => {
    expect(by("fall")).toBe("falls");
    expect(by("power-lines")).toBe("electrical");
    expect(by("roof-deliveries")).toBe("vehicles");
    expect(by("hot-work")).toBe("fire");
    expect(by("silica")).toBe("air");
    expect(by("trenching")).toBe("spaces");
    expect(by("heat")).toBe("weather");
    expect(by("nail-gun")).toBe("tools");
    expect(by("sharps")).toBe("health");
    expect(by("near-miss")).toBe("people");
  });
  it("almost every library talk gets a real topic", () => {
    const general = TALKS.filter((t) => talkTopic(t) === "general").map((t) => t.id);
    expect(general.length / TALKS.length).toBeLessThan(0.05);
  });
});
