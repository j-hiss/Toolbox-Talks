import { describe, expect, it } from "vitest";
import { certState, latestCerts, personTraining, trainingSummary, type PersonCert } from "./certs";
import { parseDay } from "./weeks";

const today = parseDay("2026-10-09");
let n = 0;
const cert = (person: string, type: string, expires: string | null, over: Partial<PersonCert> = {}): PersonCert => ({
  id: `c${++n}`, person_id: person, cert_type: type, custom_name: "", issued_on: null, expires_on: expires, withdrawn_at: null, entered_at: `2026-01-0${n % 9 + 1}T00:00:00Z`, ...over,
});

describe("training cards", () => {
  it("reads expiry honestly: no date is current, within 30 days is expiring, past is expired", () => {
    expect(certState({ expires_on: null }, today)).toBe("current");
    expect(certState({ expires_on: "2026-12-01" }, today)).toBe("current");
    expect(certState({ expires_on: "2026-11-08" }, today)).toBe("expiring");
    expect(certState({ expires_on: "2026-10-09" }, today)).toBe("expiring");
    expect(certState({ expires_on: "2026-10-08" }, today)).toBe("expired");
  });
  it("uses the latest card per type and ignores withdrawn ones", () => {
    const old = cert("a", "forklift", "2025-01-01");
    const renewed = cert("a", "forklift", "2028-01-01");
    const mistake = cert("a", "forklift", "2030-01-01", { withdrawn_at: "2026-02-01T00:00:00Z" });
    expect(latestCerts([old, renewed, mistake]).map((c) => c.id)).toEqual([renewed.id]);
  });
  it("lists required cards first, missing ones included, then extra cards", () => {
    const reqs = [{ role_id: "op", cert_type: "forklift" }, { role_id: "op", cert_type: "osha10" }];
    const rows = personTraining("a", "op", [cert("a", "forklift", "2026-01-01"), cert("a", "first_aid", "2027-05-01")], reqs, today);
    expect(rows.map((r) => [r.cert_type, r.state, r.required])).toEqual([["forklift", "expired", true], ["osha10", "missing", true], ["first_aid", "current", false]]);
  });
  it("counts the company and names who needs attention", () => {
    const reqs = [{ role_id: "op", cert_type: "forklift" }];
    const s = trainingSummary([{ id: "a", role_id: "op" }, { id: "b", role_id: "op" }, { id: "c", role_id: null }],
      [cert("a", "forklift", "2027-01-01"), cert("c", "first_aid", "2026-10-20")], reqs, today);
    expect(s).toMatchObject({ current: 1, expiring: 1, expired: 0, missing: 1 });
    expect(s.needAttention).toEqual(["b", "c"]);
  });
});
