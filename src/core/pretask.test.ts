import { describe, expect, it } from "vitest";
import { dailyTally, emptyPlan, pretaskContent, pretaskProblems, tidyPlan } from "./pretask";

describe("daily pre-task plan", () => {
  it("needs a task and a hazard with a control before signatures", () => {
    expect(pretaskProblems(emptyPlan())).toEqual(["Add at least one task the crew is doing today.", "Add at least one hazard and how you'll control it."]);
    const p = { ...emptyPlan(), tasks: ["Tear off north slope"], hazards: [{ hazard: "Falls", control: " " }] };
    expect(pretaskProblems(p)).toEqual(["Say how you'll control: Falls."]);
    expect(pretaskProblems({ ...p, hazards: [{ hazard: "Falls", control: "Tie off" }] })).toEqual([]);
  });
  it("asks who checked equipment marked as checked", () => {
    const p = { ...emptyPlan(), tasks: ["x"], hazards: [{ hazard: "a", control: "b" }], equipment: [{ id: "scaffold", answer: "done" as const, by: "" }] };
    expect(pretaskProblems(p)).toEqual(["Say who checked: Scaffold."]);
  });
  it("tidies blank lines and repeats", () => {
    const t = tidyPlan({ ...emptyPlan(), tasks: ["  Set up  ", ""], ppe: ["Gloves", "Gloves"], equipment: [{ id: "crane", answer: "na", by: "Sam" }] });
    expect(t.tasks).toEqual(["Set up"]);
    expect(t.ppe).toEqual(["Gloves"]);
    expect(t.equipment[0].by).toBe("");
  });
  it("turns the plan into record sections, equipment as the foreman's answer with its cite, never as a pass", () => {
    const c = pretaskContent({ ...emptyPlan(), tasks: ["Set trusses"], hazards: [{ hazard: "Falls", control: "Tie off" }], equipment: [{ id: "scaffold", answer: "done", by: "Lee" }], muster: "Front gate" });
    expect(c.sections.map((s) => s.heading)).toEqual(["Today's tasks", "Hazards and controls", "Equipment reminders", "Emergency"]);
    expect(c.sections[2].items[0]).toContain("checked by Lee (29 CFR 1926.451(f)(3))");
    expect(JSON.stringify(c)).not.toMatch(/complian|passed/i);
  });
  it("counts days with a plan per crew, not a rate", () => {
    const day = (iso: string) => iso.slice(0, 10);
    expect(dailyTally([
      { held_at: "2026-10-05T12:00:00Z", team_name: "Crew 1" }, { held_at: "2026-10-05T15:00:00Z", team_name: "Crew 1" },
      { held_at: "2026-10-06T12:00:00Z", team_name: "Crew 1" }, { held_at: "2026-10-06T12:00:00Z", team_name: "" },
    ], day)).toEqual([{ crew: "Crew 1", days: 2 }, { crew: "No crew", days: 1 }]);
  });
});
