import { describe, expect, it, vi } from "vitest";
import { strFromU8, unzipSync } from "fflate";

const rows = Array.from({ length: 1500 }, (_, i) => ({ id: `p${i}`, company_id: "co1", full_name: i === 0 ? "=cmd()" : `Example ${i}`, meta: { a: 1 } }));
vi.mock("@/lib/data/account", () => ({
  FILE_BUCKETS: ["talk-files", "company-docs"],
  exportTables: async () => ["companies", "people"],
  exportRows: async (_co: string, t: string, page: number) => (t === "companies" ? (page === 0 ? [{ id: "co1", name: "Example Co" }] : []) : rows.slice(page * 1000, page * 1000 + 1000)),
  listCompanyFiles: async (_co: string, bucket: string) => (bucket === "talk-files" ? ["co1/rec1/signature-0.png", "co1/rec1/broken.png"] : []),
  downloadFile: async (_b: string, path: string) => { if (path.endsWith("broken.png")) throw new Error("gone"); return new Uint8Array([1, 2, 3]); },
}));

describe("download all data", () => {
  it("has every row of every table (past 1000), the files, and says which files are missing", async () => {
    const { buildCompanyExport } = await import("./exportCompany");
    const steps: string[] = [];
    const blob = await buildCompanyExport("co1", "Example Co", true, (p) => steps.push(p.step));
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    expect(Object.keys(files).sort()).toEqual(["README.txt", "files/talk-files/rec1/signature-0.png", "tables/companies.csv", "tables/companies.json", "tables/people.csv", "tables/people.json"]);
    expect(JSON.parse(strFromU8(files["tables/people.json"]))).toHaveLength(1500);
    const csv = strFromU8(files["tables/people.csv"]);
    expect(csv.split("\r\n").filter(Boolean)).toHaveLength(1501);
    expect(csv).toContain("'=cmd()"); // a name can't run as a spreadsheet formula
    expect(csv).toContain('"{""a"":1}"');
    expect(strFromU8(files["README.txt"])).toContain("talk-files/co1/rec1/broken.png");
    expect(steps.at(-1)).toBe("Making the ZIP");
  });
  it("leaves files out when not asked", async () => {
    const { buildCompanyExport } = await import("./exportCompany");
    const files = unzipSync(new Uint8Array(await (await buildCompanyExport("co1", "Example Co", false, () => {})).arrayBuffer()));
    expect(Object.keys(files).some((k) => k.startsWith("files/"))).toBe(false);
  });
});
