import { describe, expect, it } from "vitest";
import { jobsiteLink, resolveScannedSite, siteFromSearch } from "./sitelink";

const id = "11111111-2222-4333-8444-555555555555";

describe("jobsite QR links", () => {
  it("carries only the jobsite id", () => {
    expect(jobsiteLink("https://app.example.com/", id)).toBe(`https://app.example.com/?site=${id}`);
    expect(() => jobsiteLink("https://app.example.com", "../admin")).toThrow();
  });
  it("reads a scanned link back, ignoring anything that isn't an id", () => {
    expect(siteFromSearch(`?site=${id.toUpperCase()}`)).toBe(id);
    expect(siteFromSearch("?site=drop table")).toBeNull();
    expect(siteFromSearch("")).toBeNull();
  });
  it("only picks a jobsite that belongs to the signed-in company", () => {
    const ours = [{ id, name: "Example Jobsite" }];
    expect(resolveScannedSite(id, ours)).toEqual({ kind: "found", site: ours[0] });
    expect(resolveScannedSite("99999999-2222-4333-8444-555555555555", ours)).toEqual({ kind: "not_ours" });
    expect(resolveScannedSite(null, ours)).toEqual({ kind: "none" });
  });
});
