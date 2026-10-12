import { describe, expect, it } from "vitest";
import { setupDone, setupProgress, setupSteps } from "./onboarding";

const none = { people: 0, teams: 0, jobsites: 0, talks: 0, helpers: 0, certs: 0 };

describe("first-week setup", () => {
  it("ticks steps from what the company has, never from a box", () => {
    const s = setupSteps({ ...none, people: 5, jobsites: 1 });
    expect(s.filter((x) => x.done).map((x) => x.id)).toEqual(["people", "jobsites"]);
    expect(setupProgress(s)).toEqual({ done: 2, total: 6 });
    expect(setupSteps({ ...none, people: 1 }).find((x) => x.id === "people")!.done).toBe(false);
  });
  it("is done when every required step is, training cards optional", () => {
    expect(setupDone(setupSteps({ people: 3, teams: 1, jobsites: 1, talks: 1, helpers: 1, certs: 0 }))).toBe(true);
    expect(setupDone(setupSteps({ people: 3, teams: 1, jobsites: 1, talks: 0, helpers: 1, certs: 9 }))).toBe(false);
  });
  it("every step links somewhere in the app", () => {
    for (const s of setupSteps(none)) expect(s.href.startsWith("/")).toBe(true);
  });
});
