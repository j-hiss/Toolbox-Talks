import { describe, expect, it } from "vitest";
import { activeCourses, courseOwnerKind, courseProblem, expiryAfter, isCourseCode, myOwnCourses, renewText, type TrainingCourse } from "./courses";
import { certTypeName } from "@/content/certTypes";

const course = (over: Partial<TrainingCourse>): TrainingCourse => ({
  code: "c_abcdefghjkmn", owner_company: null, owner_user: null, owner_org: null, name: "Example", description: "", renew_months: null, retired: false, ...over,
});

describe("own trainings", () => {
  it("knows a training code from a built-in type", () => {
    expect(isCourseCode("c_abcdefghjkmn")).toBe(true);
    expect(isCourseCode("forklift")).toBe(false);
    expect(isCourseCode("c_short")).toBe(false);
  });

  it("checks a training the same way the database does", () => {
    expect(courseProblem({ name: " ", description: "", renewMonths: null })).toMatch(/Name/);
    expect(courseProblem({ name: "x".repeat(101), description: "", renewMonths: null })).toMatch(/100/);
    expect(courseProblem({ name: "Checkout", description: "x".repeat(1001), renewMonths: null })).toMatch(/1000/);
    expect(courseProblem({ name: "Checkout", description: "", renewMonths: 0 })).toMatch(/1 to 120/);
    expect(courseProblem({ name: "Checkout", description: "", renewMonths: 121 })).toMatch(/1 to 120/);
    expect(courseProblem({ name: "Checkout", description: "", renewMonths: 1.5 })).toMatch(/1 to 120/);
    expect(courseProblem({ name: "Checkout", description: "", renewMonths: 24 })).toBeNull();
    expect(courseProblem({ name: "Checkout", description: "", renewMonths: null })).toBeNull();
  });

  it("says the renewal in plain words", () => {
    expect(renewText(null)).toBe("No expiry");
    expect(renewText(12)).toBe("Every year");
    expect(renewText(36)).toBe("Every 3 years");
    expect(renewText(18)).toBe("Every 18 months");
    expect(renewText(1)).toBe("Every month");
  });

  it("suggests an expiry by calendar months, never past the end of a short month", () => {
    expect(expiryAfter("2026-10-01", 12)).toBe("2027-10-01");
    expect(expiryAfter("2026-01-31", 1)).toBe("2026-02-28");
    expect(expiryAfter("2028-01-31", 1)).toBe("2028-02-29");
    expect(expiryAfter("2026-11-15", 3)).toBe("2027-02-15");
    expect(expiryAfter("2026-03-10", 60)).toBe("2031-03-10");
  });

  it("offers only trainings that aren't retired, by name", () => {
    const list = activeCourses([course({ code: "c_bbbbbbbbbbbb", name: "B" }), course({ name: "Old", retired: true }), course({ code: "c_aaaaaaaaaaaa", name: "A" })]);
    expect(list.map((c) => c.name)).toEqual(["A", "B"]);
  });

  it("a trainer's own trainings are theirs or their organization's, never a company's or another trainer's", () => {
    const list = [
      course({ code: "c_mine00000000", owner_user: "me" }),
      course({ code: "c_org000000000", owner_org: "o1" }),
      course({ code: "c_other0000000", owner_user: "someone" }),
      course({ code: "c_otherorg0000", owner_org: "o2" }),
      course({ code: "c_company00000", owner_company: "co" }),
    ];
    expect(myOwnCourses(list, "me", ["o1"]).map((c) => c.code)).toEqual(["c_mine00000000", "c_org000000000"]);
    expect(list.map(courseOwnerKind)).toEqual(["me", "org", "me", "org", "company"]);
  });

  it("a card for an own training shows the name it was given with, even after a rename", () => {
    const courses = [{ code: "c_abcdefghjkmn", name: "Renamed later" }];
    expect(certTypeName("c_abcdefghjkmn", "Skid steer checkout", courses)).toBe("Skid steer checkout");
    expect(certTypeName("c_abcdefghjkmn", "", courses)).toBe("Renamed later");
    expect(certTypeName("c_zzzzzzzzzzzz")).toBe("Own training");
    expect(certTypeName("forklift")).toBe("Forklift operator evaluation");
    expect(certTypeName("custom", "Typed")).toBe("Typed");
  });
});
