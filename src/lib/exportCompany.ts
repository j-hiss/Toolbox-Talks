"use client";

// "Download all your data": every row the company has (each table as CSV and JSON) and, if asked, every file
// (signatures, crew photos, paper sheets, card photos, documents), in one ZIP built on the phone or computer.
// Owners and admins only (checked in the database: export_company_rows, migration 0042). Works while the account is
// paused or closing, so a company can always take its records with it. Rules for the CSV cells: src/core/account.ts.
import { strToU8, zipSync, type Zippable } from "fflate";
import { exportCsvRows } from "@/core/account";
import { toCsv } from "@/core/csv";
import { FILE_BUCKETS, downloadFile, exportRows, exportTables, listCompanyFiles } from "@/lib/data/account";

export type ExportProgress = { step: string; done: number; total: number };

const README = (company: string, when: Date, withFiles: boolean, missing: string[]) => [
  `${company}: full data download, ${when.toLocaleString()}`,
  "",
  "tables/  one CSV (opens in Excel) and one JSON file per table. Every row your company has, as saved.",
  withFiles ? "files/   every file your company stored: signatures, crew photos, paper sign-in sheets, card photos, documents." : "files/   not included in this download (choose \"include files\" to get them).",
  "",
  "Talk records are never edited after saving; corrections are separate linked records. Record PDFs can be made",
  "again from these rows in the app while the account is open (Records > open a record > Download PDF).",
  ...(missing.length ? ["", `These files could not be downloaded and are not included: ${missing.length}`, ...missing.map((m) => `  ${m}`)] : []),
  "",
].join("\r\n");

/** Build the ZIP. `onProgress` gets plain-words steps for a progress line. */
export async function buildCompanyExport(companyId: string, companyName: string, withFiles: boolean, onProgress: (p: ExportProgress) => void): Promise<Blob> {
  const zip: Zippable = {};
  const tables = await exportTables(companyId);
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    onProgress({ step: `Tables: ${t.replace(/_/g, " ")}`, done: i, total: tables.length });
    const rows: Record<string, unknown>[] = [];
    for (let page = 0; ; page++) {
      const chunk = await exportRows(companyId, t, page);
      rows.push(...chunk);
      if (chunk.length < 1000) break;
    }
    zip[`tables/${t}.csv`] = strToU8(toCsv(exportCsvRows(rows)));
    zip[`tables/${t}.json`] = strToU8(JSON.stringify(rows, null, 2));
  }
  const missing: string[] = [];
  if (withFiles) {
    const paths: { bucket: string; path: string }[] = [];
    for (const bucket of FILE_BUCKETS) {
      onProgress({ step: `Finding files: ${bucket}`, done: 0, total: 1 });
      try { for (const path of await listCompanyFiles(companyId, bucket)) paths.push({ bucket, path }); }
      catch { missing.push(`${bucket}/ (couldn't list this folder)`); }
    }
    for (let i = 0; i < paths.length; i++) {
      const { bucket, path } = paths[i];
      onProgress({ step: "Files", done: i, total: paths.length });
      try { zip[`files/${bucket}/${path.slice(companyId.length + 1)}`] = [await downloadFile(bucket, path), { level: 0 }]; }
      catch { missing.push(`${bucket}/${path}`); }
    }
  }
  zip["README.txt"] = strToU8(README(companyName, new Date(), withFiles, missing));
  onProgress({ step: "Making the ZIP", done: 1, total: 1 });
  const bytes = zipSync(zip, { level: 6 });
  return new Blob([bytes as BlobPart], { type: "application/zip" });
}

/** File name for the download: company name and date. */
export const exportFileName = (companyName: string, when: Date = new Date()) =>
  `${(companyName || "Company").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim()} - all data - ${when.toISOString().slice(0, 10)}.zip`;
