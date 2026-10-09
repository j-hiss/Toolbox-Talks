import { describe, expect, it } from "vitest";
import { alertWorthy, heatForDay, heatIndexF, heatLevel } from "./heat";
import { parseCsv, planImport, templateCsv } from "./importPeople";

describe("heat", () => {
  it("matches the NWS heat index chart", () => {
    expect(Math.round(heatIndexF(90, 70))).toBe(106); // NWS chart: 90°F at 70% = 106
    expect(Math.round(heatIndexF(96, 50))).toBe(108); // chart: 108
    expect(Math.round(heatIndexF(80, 40))).toBe(80);  // chart: 80
    expect(Math.round(heatIndexF(70, 50))).toBe(69);  // below 80: simple formula
  });
  it("levels and when to alert", () => {
    expect([79, 85, 95, 110, 130].map(heatLevel)).toEqual(["none", "caution", "extreme_caution", "danger", "extreme_danger"]);
    expect(alertWorthy("caution")).toBe(false);
    expect(alertWorthy("extreme_caution")).toBe(true);
  });
  it("finds the hottest work hour of the day from an hourly forecast, in either temperature shape", () => {
    const f = { properties: { periods: [
      { startTime: "2026-10-05T05:00:00-04:00", temperature: 99, temperatureUnit: "F", relativeHumidity: { value: 90 } }, // before work
      { startTime: "2026-10-05T13:00:00-04:00", temperature: 91, temperatureUnit: "F", relativeHumidity: { unitCode: "wmoUnit:percent", value: 65 } },
      { startTime: "2026-10-05T15:00:00-04:00", temperature: { unitCode: "wmoUnit:degC", value: 32 }, relativeHumidity: { value: 60 } },
      { startTime: "2026-10-06T13:00:00-04:00", temperature: 100, temperatureUnit: "F", relativeHumidity: { value: 80 } },  // tomorrow
    ] } };
    const d = heatForDay(f, "2026-10-05")!;
    expect(d.atHour).toBe("2026-10-05T13:00:00-04:00");
    expect(d.maxHeatIndexF).toBe(Math.round(heatIndexF(91, 65)));
    expect(d.level).toBe("danger");
    expect(heatForDay(f, "2026-10-09")).toBeNull();
    expect(heatForDay({ nope: 1 }, "2026-10-05")).toBeNull();
  });
});

describe("people import", () => {
  const existing = [
    { id: "p1", full_name: "Ana Diaz", employee_id: "1001", active: true },
    { id: "p2", full_name: "Ben Hall", employee_id: null, active: true },
    { id: "p3", full_name: "Old Timer", employee_id: "1003", active: false },
  ];
  const teams = [{ id: "t1", name: "Crew 1" }];
  const roles = [{ id: "r1", name: "Foreman" }];

  it("reads CSV with quotes, commas and CRLF", () => {
    expect(parseCsv('Name,Team\r\n"Diaz, Ana",Crew 1\r\n"Say ""hi""",\r\n')).toEqual([["Name", "Team"], ["Diaz, Ana", "Crew 1"], ['Say "hi"', ""]]);
  });
  it("plans adds and updates, flags problems, and lists new crews and roles", () => {
    const plan = planImport([
      ["Full Name", "Crew", "Position", "Emp ID", "Language"],
      ["Ana Diaz", "crew 1", "foreman", "1001", "Spanish"],     // update by ID, team/role matched ignoring case
      ["Ben Hall", "Crew 2", "", "", ""],                       // update by name, new crew
      ["", "Crew 1", "", "1005", ""],                           // no name
      ["Cal New", "Crew 2", "Superintendent", "1006", "Klingon"], // add, new role, unknown language
      ["Dup Id", "", "", "1006", ""],                           // duplicate ID in file
      ["Old Timer", "", "", "1003", ""],                        // brings back a removed person
      ["", "", "", "", ""],                                     // blank row ignored
    ], existing, teams, roles);
    const by = Object.fromEntries(plan.rows.map((r) => [r.line, r]));
    expect(by[2]).toMatchObject({ action: "update", matchId: "p1", team: "Crew 1", role: "Foreman", language: "es" });
    expect(by[3]).toMatchObject({ action: "update", matchId: "p2", team: "Crew 2" });
    expect(by[3].notes).toContain("Matched by name");
    expect(by[4]).toMatchObject({ action: "skip", problems: ["No name"] });
    expect(by[5]).toMatchObject({ action: "add", role: "Superintendent", language: "en" });
    expect(by[5].notes[0]).toMatch(/Klingon/);
    expect(by[6].action).toBe("skip");
    expect(by[7]).toMatchObject({ action: "update", matchId: "p3" });
    expect(plan.newTeams).toEqual(["Crew 2"]);
    expect(plan.newRoles).toEqual(["Superintendent"]);
    expect(plan.counts).toEqual({ add: 1, update: 3, skip: 2 });
    expect(plan.rows).toHaveLength(6);
  });
  it("needs a Name column", () => {
    expect(planImport([["Crew"], ["x"]], [], [], []).missingColumns).toEqual(["Name"]);
  });
  it("the template parses back to the expected columns, with a labelled example", () => {
    const t = parseCsv(templateCsv());
    expect(t[0]).toEqual(["Name", "Job title", "Team", "Employee ID", "Phone", "Preferred language"]);
    expect(t[1][0]).toMatch(/Example/);
  });
});

import { planReminders } from "./reminders";
describe("reminders", () => {
  const base = { thisWeekTitle: "Ladders", nextWeekTitle: "Heat", crewName: "Crew 1", crewDone: false, expiringSoon: 0 };
  it("Monday morning: this week's talk, then Thursday's nudge", () => {
    const r = planReminders({ ...base, today: new Date(2026, 9, 5, 5, 0) }); // Mon 5:00 AM
    expect(r.map((x) => [x.id, x.at.toString().slice(0, 21), x.body])).toEqual([
      [101, "Mon Oct 05 2026 06:30", "Ladders"],
      [102, "Thu Oct 08 2026 12:00", "Crew 1 still needs this week's talk: Ladders"],
    ]);
  });
  it("mid-week: next Monday's talk; no nudge once the crew is done; makeups running out", () => {
    const r = planReminders({ ...base, today: new Date(2026, 9, 7, 9, 0), crewDone: true, expiringSoon: 2 }); // Wed
    expect(r.map((x) => [x.id, x.at.toString().slice(0, 21)])).toEqual([[101, "Mon Oct 12 2026 06:30"], [103, "Thu Oct 08 2026 07:00"]]);
  });
  it("after Thursday noon there's no nudge", () => {
    expect(planReminders({ ...base, today: new Date(2026, 9, 8, 13, 0) }).map((x) => x.id)).toEqual([101]);
  });
  it("every 4 weeks: the next talk when the period ends, the nudge in its last week", () => {
    const period = { start: new Date(2026, 9, 5), weeks: 4 };
    const r = planReminders({ ...base, today: new Date(2026, 9, 14, 9, 0), period }); // Wed of week 2
    expect(r.map((x) => [x.id, x.at.toString().slice(0, 21), x.title])).toEqual([
      [101, "Mon Nov 02 2026 06:30", "New toolbox talk"],
      [102, "Thu Oct 29 2026 12:00", "Toolbox talk not done yet"],
    ]);
  });
});
