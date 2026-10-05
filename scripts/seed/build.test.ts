import { describe, expect, it } from "vitest";
import { buildCompliance, weekKeys, type ReportRecord } from "@/core/compliance";
import { isoDay, mondayOf, parseDay } from "@/core/weeks";
import { buildSeed, SEED_COMPANY, SEED_MAKEUP_LIMIT, staffDates } from "./build";
import { encodePng, examplePhoto, exampleSignature } from "./png";
import { rng } from "./build";

const today = new Date("2026-10-07T15:00:00"); // a Wednesday afternoon
const plan = buildSeed(today);

describe("local test data plan", () => {
  it("is the same every run for the same day and seed", () => {
    expect(JSON.stringify(buildSeed(today))).toEqual(JSON.stringify(plan));
  });

  it("is clearly labelled as example data (no real names)", () => {
    expect(plan.company.name).toBe(SEED_COMPANY);
    for (const p of plan.people) expect(p.name.startsWith("Example ")).toBe(true);
    for (const j of plan.jobsites) expect(j.name.startsWith("Example ")).toBe(true);
    for (const t of plan.talks) for (const a of t.attendees) if ("walkin" in a) expect(a.walkin.company.startsWith("Example ")).toBe(true);
  });

  it("never dates a talk in the future, and makeups keep their real date after the week they cover, inside the limit", () => {
    for (const t of plan.talks) expect(t.heldAt.getTime()).toBeLessThanOrEqual(today.getTime());
    const makeups = plan.talks.filter((t) => t.makeup);
    expect(makeups.length).toBeGreaterThan(0);
    for (const t of makeups) {
      const held = isoDay(mondayOf(t.heldAt));
      expect(t.makeup!.weekStart < held).toBe(true);
      expect((parseDay(held).getTime() - parseDay(t.makeup!.weekStart).getTime()) / (7 * 864e5)).toBeLessThanOrEqual(SEED_MAKEUP_LIMIT);
      expect(t.makeup!.reason.length).toBeGreaterThan(0);
    }
  });

  it("only signs people who were there", () => {
    for (const t of plan.talks) for (const a of t.attendees) if (a.signed) expect(a.here).toBe(true);
  });

  it("gives the reports every honest state: on time, made up, open, missed, and due this week", () => {
    const people = plan.people.filter((p) => !p.role).map((p) => {
      const d = staffDates(p, today);
      return { id: p.key, name: p.name, teamId: p.team, createdAt: d.createdAt.toISOString(), deactivatedAt: d.deactivatedAt?.toISOString() ?? null };
    });
    const records: ReportRecord[] = plan.talks.map((t) => ({
      id: t.key, title: t.talkId, heldAt: t.heldAt.toISOString(), weekStart: isoDay(mondayOf(t.heldAt)),
      makeupForWeek: t.makeup?.weekStart ?? null, makeupReason: t.makeup?.reason ?? null, teamName: t.teamName,
      presenterId: t.presenterKey, presenterSigned: t.presenterSigned,
      attendees: t.attendees.map((a) => ({
        personId: "personKey" in a ? a.personKey : null, name: "personKey" in a ? a.personKey : a.walkin.name,
        status: a.signed ? "signed" : a.here ? "not_signed" : "absent",
      })),
    }));
    const report = buildCompliance({ people, records, weeks: weekKeys(plan.company.program_start, today), makeupWeeks: SEED_MAKEUP_LIMIT, today });
    const states = new Set(report.weeks.flatMap((w) => w.people.map((p) => p.state)));
    for (const s of ["on_time", "made_up", "open", "missed", "due"]) expect(states.has(s as never)).toBe(true);
    // Someone who left isn't expected after they left; the new hire isn't expected before they joined.
    const leftWeeks = report.people.find((p) => p.person.id === "left")!.weeks.map((w) => w.week);
    expect(leftWeeks.every((w) => w <= isoDay(mondayOf(new Date(today.getTime() - 5 * 7 * 864e5))))).toBe(true);
    const hireWeeks = report.people.find((p) => p.person.id === "new-hire")!.weeks.length;
    expect(hireWeeks).toBeLessThanOrEqual(3);
  });

  it("has walk-ins with a company, crew photos, site notes, heat and issues (some fixed)", () => {
    expect(plan.talks.some((t) => t.attendees.some((a) => "walkin" in a))).toBe(true);
    expect(plan.talks.some((t) => t.photo)).toBe(true);
    expect(plan.talks.some((t) => t.siteNotes)).toBe(true);
    expect(plan.talks.some((t) => t.heat?.reminderRead)).toBe(true);
    const issues = plan.talks.flatMap((t) => t.issues);
    expect(issues.some((i) => i.fixed)).toBe(true);
    expect(issues.some((i) => !i.fixed)).toBe(true);
  });
});

describe("example images", () => {
  const isPng = (d: string) => Buffer.from(d.split(",")[1], "base64").subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  it("makes valid PNG signatures and stand-in photos, different each time", () => {
    const r = rng(1);
    const a = exampleSignature(r), b = exampleSignature(r), p = examplePhoto(r);
    expect(isPng(a) && isPng(b) && isPng(p)).toBe(true);
    expect(a).not.toEqual(b);
    expect(encodePng(1, 1, new Uint8Array([0, 0, 0, 255])).length).toBeGreaterThan(40);
  });
});
