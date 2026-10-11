import { describe, expect, it } from "vitest";
import { certificateCurrent, certificateTotals, classProblem, filterLooking, newClassProblem, partnerActive, partnerPlanLine, type Certificate, type PartnerAccount } from "./trainerTools";

const now = new Date("2026-10-11T12:00:00Z");
const acct = (over: Partial<PartnerAccount>): PartnerAccount => ({ user_id: "u", kind: "trainer", plan: "trial", trial_ends: "2026-11-01", free_until: null, ...over });

describe("partner plans", () => {
  it("active while paid, comp, in trial, or inside earned months (same rule as the database)", () => {
    expect(partnerActive(acct({}), now)).toBe(true);
    expect(partnerActive(acct({ trial_ends: "2026-10-01" }), now)).toBe(false);
    expect(partnerActive(acct({ trial_ends: "2026-10-01", free_until: "2027-04-01" }), now)).toBe(true);
    expect(partnerActive(acct({ trial_ends: "2026-10-01", plan: "paid" }), now)).toBe(true);
    expect(partnerActive(null, now)).toBe(false);
  });
  it("says where the plan stands", () => {
    expect(partnerPlanLine(acct({}), now)).toMatch(/^Free trial through/);
    expect(partnerPlanLine(acct({ trial_ends: "2026-10-01", free_until: "2027-04-01" }), now)).toMatch(/months you earned/);
    expect(partnerPlanLine(acct({ trial_ends: "2026-10-01" }), now)).toBe("Trial ended");
  });
});

describe("classes and certificates", () => {
  it("a class closes only when everyone has a result and every pass signed", () => {
    expect(classProblem({ people: [{ person_id: "a", signed_at: null, result: null, submission_id: null }] })).toMatch(/Mark everyone/);
    expect(classProblem({ people: [{ person_id: "a", signed_at: null, result: "passed", submission_id: null }] })).toMatch(/hasn't signed/);
    expect(classProblem({ people: [{ person_id: "a", signed_at: "x", result: "passed", submission_id: null }, { person_id: "b", signed_at: null, result: "not_passed", submission_id: null }] })).toBeNull();
  });
  it("checks a new class", () => {
    const n = { companyId: "c", certType: "forklift", customName: "", heldOn: "2026-10-01", place: "", expiresOn: null, note: "", people: ["p"] };
    expect(newClassProblem(n, "2026-10-11")).toBeNull();
    expect(newClassProblem({ ...n, heldOn: "2026-12-01" }, "2026-10-11")).toMatch(/future/);
    expect(newClassProblem({ ...n, expiresOn: "2026-09-01" }, "2026-10-11")).toMatch(/expire before/);
    expect(newClassProblem({ ...n, people: [] }, "2026-10-11")).toMatch(/at least one/);
  });
  it("certificate totals and current status", () => {
    const c = (over: Partial<Certificate>): Certificate => ({ submission_id: "s", company_id: "c1", company_name: "A", trainer_name: "T", person_name: "P", cert_type: "forklift", custom_name: "", issued_on: "2026-10-01", expires_on: null, approved_at: "2026-10-02T12:00:00Z", verify_code: "ABCDEFGHJKMNPQRS", withdrawn: false, ...over });
    expect(certificateTotals([c({}), c({ company_id: "c2" }), c({ withdrawn: true }), c({ approved_at: "2025-01-01T00:00:00Z" })], now)).toEqual({ thisYear: 2, clients: 2, all: 3 });
    expect(certificateCurrent(c({ expires_on: "2026-01-01" }), now)).toBe(false);
    expect(certificateCurrent(c({ withdrawn: true }), now)).toBe(false);
    expect(certificateCurrent(c({}), now)).toBe(true);
  });
  it("filters companies looking for a trainer by state and training", () => {
    const rows = [{ company_id: "a", name: "A", industry: "con", zip: "33901", size: "1-10 people", trainings: ["forklift"], note: "", listed_since: "", requested: false },
      { company_id: "b", name: "B", industry: "con", zip: "98101", size: "1-10 people", trainings: ["first_aid"], note: "", listed_since: "", requested: false }];
    expect(filterLooking(rows, "FL", "").map((r) => r.company_id)).toEqual(["a"]);
    expect(filterLooking(rows, "", "first_aid").map((r) => r.company_id)).toEqual(["b"]);
  });
});
