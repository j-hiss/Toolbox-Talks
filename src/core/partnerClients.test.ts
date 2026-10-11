import { describe, expect, it } from "vitest";
import { canRequest, needsFreshSummary, partnerClientFlags, partnerTotals, refFromSearch, referralLink, sortPartnerClients, trainerTotals, type PartnerClient } from "./partnerClients";

const now = new Date("2026-10-11T12:00:00Z");
const c = (over: Partial<PartnerClient>): PartnerClient => ({
  link_id: "l", company_id: "c", company_name: "Example Co", org_id: null, org_name: null, mine: true, reports: 1, latest_report: "r",
  period_from: "2025-10-01", period_to: "2026-09-30", sent_at: "2026-10-01T12:00:00Z", crew: 10, sign_in: 0.9, on_time: 0.8,
  periods_ended: 52, periods_missed: 0, open_issues: 0, last_requested: null, ...over,
});

describe("partner client lists", () => {
  it("a summary over 35 days old, or none, needs refreshing", () => {
    expect(needsFreshSummary(c({}), now)).toBe(false);
    expect(needsFreshSummary(c({ sent_at: "2026-09-01T12:00:00Z" }), now)).toBe(true);
    expect(needsFreshSummary(c({ sent_at: null }), now)).toBe(true);
  });
  it("one request a week", () => {
    expect(canRequest(c({ last_requested: "2026-10-08T12:00:00Z" }), now)).toBe(false);
    expect(canRequest(c({ last_requested: "2026-10-03T12:00:00Z" }), now)).toBe(true);
  });
  it("flags say what stands out; missed weeks are never hidden", () => {
    expect(partnerClientFlags(c({}), now).map((f) => f.text)).toEqual(["Up to date"]);
    expect(partnerClientFlags(c({ periods_missed: 2, open_issues: 1 }), now).map((f) => f.text)).toEqual(["2 weeks with no talk", "1 open issue"]);
    expect(partnerClientFlags(c({ sent_at: null }), now)[0].text).toBe("No summary yet".replace("yet", "sent yet"));
  });
  it("clients needing attention come first; totals add up", () => {
    const rows = [c({ company_name: "A Co" }), c({ company_name: "B Co", periods_missed: 1 }), c({ company_name: "C Co", sent_at: null, sign_in: null })];
    expect(sortPartnerClients(rows, now).map((r) => r.company_name)).toEqual(["C Co", "B Co", "A Co"]);
    expect(partnerTotals(rows, now)).toMatchObject({ clients: 3, stale: 1, missedWeeks: 1 });
    expect(partnerTotals(rows, now).avgSignIn).toBeCloseTo(0.9);
    expect(trainerTotals([{ link_id: "t", company_id: "c", company_name: "X", org_id: null, org_name: null, mine: true, people: 4, waiting: 2, approved: 1, declined: 1, last_sent: null }])).toEqual({ clients: 1, people: 4, waiting: 2, declined: 1 });
  });
  it("referral links carry only the code, and bad codes are ignored", () => {
    expect(referralLink("https://app.example/", "abcde23456")).toBe("https://app.example/setup/?ref=abcde23456");
    expect(refFromSearch("?ref=ABCDE23456")).toBe("abcde23456");
    expect(refFromSearch("?ref=<script>")).toBeNull();
    expect(refFromSearch("")).toBeNull();
  });
});
