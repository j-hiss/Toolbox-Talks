import { describe, expect, it } from "vitest";
import { groupRoster, sortSubmissions } from "./trainers";

describe("trainer roster", () => {
  it("groups by company, sorts people, and keeps a company with no one given yet", () => {
    const g = groupRoster([
      { company_id: "b", company_name: "Beta Co", trainer_id: "tb", person_id: null, full_name: null, job_title: null },
      { company_id: "a", company_name: "Alpha Co", trainer_id: "ta", person_id: "2", full_name: "Zed", job_title: "Roofer" },
      { company_id: "a", company_name: "Alpha Co", trainer_id: "ta", person_id: "1", full_name: "Ann", job_title: null },
    ]);
    expect(g.map((c) => c.companyName)).toEqual(["Alpha Co", "Beta Co"]);
    expect(g[0].people).toEqual([{ id: "1", name: "Ann", title: "" }, { id: "2", name: "Zed", title: "Roofer" }]);
    expect(g[1].people).toEqual([]);
  });
});

describe("submissions", () => {
  it("lists waiting cards first, oldest first, then reviewed ones newest first", () => {
    const s = sortSubmissions([
      { status: "approved", submitted_at: "2026-01-01" }, { status: "pending", submitted_at: "2026-03-01" },
      { status: "declined", submitted_at: "2026-02-01" }, { status: "pending", submitted_at: "2026-01-15" },
    ]);
    expect(s.map((x) => `${x.status}:${x.submitted_at}`)).toEqual(["pending:2026-01-15", "pending:2026-03-01", "declined:2026-02-01", "approved:2026-01-01"]);
  });
});
