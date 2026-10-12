import { describe, expect, it } from "vitest";
import { apiKeyNameProblem, crmBody, crmCurl, crmEndpoint, sortKeys } from "./crm";

describe("CRM connector", () => {
  it("builds the address from the project URL, or nothing until it's set", () => {
    expect(crmEndpoint("https://abc.supabase.co")).toBe("https://abc.supabase.co/rest/v1/rpc/crm_jobsite");
    expect(crmEndpoint("http://127.0.0.1:54321/")).toBe("http://127.0.0.1:54321/rest/v1/rpc/crm_jobsite");
    expect(crmEndpoint(undefined)).toBeNull();
    expect(crmEndpoint("not a url")).toBeNull();
  });
  it("the sample body names only the fields the database function takes", () => {
    expect(Object.keys(crmBody("k")).sort()).toEqual(["active", "address", "job_id", "key", "name"]);
  });
  it("the test call carries both keys and valid JSON", () => {
    const c = crmCurl("https://x.supabase.co/rest/v1/rpc/crm_jobsite", "pub", "ttk_abc");
    expect(c).toContain("-H 'apikey: pub'");
    expect(JSON.parse(c.split("-d '")[1].slice(0, -1)).key).toBe("ttk_abc");
  });
  it("names a key and lists live keys first", () => {
    expect(apiKeyNameProblem(" ")).toMatch(/Name/);
    expect(apiKeyNameProblem("x".repeat(61))).toMatch(/60/);
    expect(apiKeyNameProblem("Our CRM")).toBeNull();
    const k = (id: string, created_at: string, revoked_at: string | null = null) => ({ id, name: id, key_prefix: "ttk_1234", created_at, last_used_at: null, uses: 0, revoked_at });
    expect(sortKeys([k("old", "2026-01-01"), k("gone", "2026-03-01", "2026-04-01"), k("new", "2026-02-01")]).map((x) => x.id)).toEqual(["new", "old", "gone"]);
  });
});
