import { describe, expect, it } from "vitest";
import { secretFromHash, shareKind, shareLink, shareSnapshot, shareStatus } from "./share";
import type { SafetyProfile } from "./profile";

const tally = { expected: 10, on_time: 8, made_up: 1, open: 0, missed: 1, due: 0 };
const profile = {
  from: "2025-10-01", to: "2026-09-30", talks: 50, makeups: 2, topics: 40,
  languages: [{ language: "es", talks: 10 }],
  periodsEnded: 52, periodsWithTalk: 50, periodsMissed: 2, missedKeys: ["2026-01-05", "2026-02-02"],
  total: tally, signIn: 0.9, onTime: 0.8,
  months: [{ month: "2026-01", periods: 4, missed: 1, talks: 3, tally, signIn: 0.9, onTime: 0.8 }],
  dailyDays: 12,
  log: { inspections: 3, walkarounds: 2, incidents: 1, nearMisses: 1, citations: [{ status: "closed", note: "x" }], open: 0 },
  issues: { raised: 4, fixed: 3, open: 1, overdue: 0, medianDaysToFix: 2 },
  elements: [{ id: "policy", name: "Written safety policy and safety rules", status: "records", evidence: "1 document" }],
  emr: [{ rating_year: 2026, emr: 0.85, note: "Per agent J. Smith", entered_at: "2026-01-01T00:00:00Z" }],
  // Extra fields as the screen holds them (a stored document has its private path): must not be shared.
  documents: [{ kind: "safety_program", title: "Safety manual", uploaded_at: "2026-01-01T00:00:00Z", id: "d1", path: "co/secret-file.pdf" }],
  workerNames: ["Should Not Appear"],
} as unknown as SafetyProfile;
const company = { id: "co-1", name: "Example Co", licenses: "", address: "1 Main St", phone: "", email: "", industry: "con", zip: "33101", theme: null, program_start: "2025-01-06" };

describe("shareSnapshot", () => {
  const snap = shareSnapshot(profile, company, { kind: "renewal", florida: true, crew: 12 });
  const text = JSON.stringify(snap);

  it("keeps the counts and rates the PDF needs", () => {
    expect(snap.profile.periodsMissed).toBe(2);
    expect(snap.profile.missedKeys).toEqual(["2026-01-05", "2026-02-02"]);
    expect(snap.profile.documents).toEqual([{ kind: "safety_program", title: "", uploaded_at: "2026-01-01T00:00:00Z" }]);
    expect(snap.profile.emr[0].note).toBe("");
    expect(snap).toMatchObject({ v: 1, kind: "renewal", florida: true, crew: 12 });
  });

  it("never carries private paths, ids, settings or fields it doesn't name", () => {
    expect(text).not.toContain("secret-file");
    expect(text).not.toContain("Should Not Appear");
    expect(text).not.toContain("Safety manual");
    expect(text).not.toContain("J. Smith");
    expect(text).not.toContain("co-1");
    expect(text).not.toContain("33101");
    expect(Object.keys(snap.company).sort()).toEqual(["address", "email", "industry", "licenses", "name", "phone", "theme"]);
    expect(snap.profile.log.citations).toEqual([{ status: "closed" }]);
  });
});

describe("share status and links", () => {
  const now = new Date("2026-10-10T12:00:00Z");
  it("reads live, expired and switched off honestly", () => {
    expect(shareStatus({ expires_at: "2026-10-11T00:00:00Z", revoked_at: null }, now)).toBe("live");
    expect(shareStatus({ expires_at: "2026-10-10T11:59:59Z", revoked_at: null }, now)).toBe("expired");
    expect(shareStatus({ expires_at: "2026-11-01T00:00:00Z", revoked_at: "2026-10-09T00:00:00Z" }, now)).toBe("off");
  });

  it("puts the secret after # and reads it back", () => {
    const secret = "a".repeat(64);
    expect(shareLink("https://app.example.com/", secret)).toBe(`https://app.example.com/share/#${secret}`);
    expect(secretFromHash(`#${secret}`)).toBe(secret);
    expect(secretFromHash("#abc")).toBeNull();
    expect(secretFromHash("")).toBeNull();
    expect(() => shareLink("https://app.example.com", "nope")).toThrow();
  });

  it("a month or less shares as the monthly summary", () => {
    expect(shareKind({ from: "2026-09-01", to: "2026-09-30" })).toBe("monthly");
    expect(shareKind({ from: "2025-10-01", to: "2026-09-30" })).toBe("renewal");
  });
});
