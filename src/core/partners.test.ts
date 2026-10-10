import { describe, expect, it } from "vitest";
import { inboxByCompany, partnerKindName } from "./partners";

describe("partner inbox", () => {
  it("groups by company with the latest summary first", () => {
    const row = (company_id: string, company_name: string, sent_at: string) => ({ report_id: sent_at, company_id, company_name, partner_name: "P", period_from: "2025-10-01", period_to: "2026-09-30", sent_at });
    const g = inboxByCompany([row("b", "Beta", "2026-01-01"), row("a", "Alpha", "2026-01-01"), row("a", "Alpha", "2026-03-01")]);
    expect(g.map((c) => c.companyName)).toEqual(["Alpha", "Beta"]);
    expect(g[0].reports.map((r) => r.sent_at)).toEqual(["2026-03-01", "2026-01-01"]);
  });
  it("names partner kinds plainly", () => {
    expect(partnerKindName("carrier")).toBe("Insurance carrier");
    expect(partnerKindName("x")).toBe("Partner");
  });
});
