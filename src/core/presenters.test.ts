import { describe, expect, it } from "vitest";
import { presentersFrom, titleOf } from "./presenters";

const roles = [{ id: "f", name: "Foreman", presents: true }, { id: "r", name: "Roofer", presents: false }, { id: "o", name: "Old title" }];
const people = [
  { id: "1", role_id: "f" }, { id: "2", role_id: "r" }, { id: "3", role_id: null }, { id: "4", role_id: "r" }, { id: "5", role_id: "o" },
];

describe("presenters", () => {
  it("lists presenting titles and team leads only", () => {
    expect(presentersFrom(people, roles, [{ lead_person_id: "4" }]).map((p) => p.id)).toEqual(["1", "4", "5"]);
  });
  it("shows 'Team member' when someone has no job title", () => {
    expect(titleOf(people[2], roles)).toBe("Team member");
    expect(titleOf(people[1], roles)).toBe("Roofer");
  });
});
