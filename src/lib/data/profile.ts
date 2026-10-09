// The company safety profile's self-reported pieces: EMR entries and program documents (Reports → Safety profile).
// Admins only, append-only (supabase/migrations/20261009000020_company_profile.sql). The profile's numbers
// themselves come from records (src/core/profile.ts), never from here.
import { supabase } from "@/lib/supabase";
import type { CompanyDocument, DocumentKind, EmrEntry } from "@/core/profile";

export const COMPANY_DOCS_BUCKET = "company-docs";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function listEmr(companyId: string): Promise<EmrEntry[]> {
  return check(await supabase().from("company_emr").select("rating_year, emr, note, entered_at").eq("company_id", companyId).order("entered_at", { ascending: false }));
}

export async function addEmr(companyId: string, e: { rating_year: number; emr: number; note: string }): Promise<void> {
  check(await supabase().from("company_emr").insert({ company_id: companyId, ...e }).select("id"));
}

export type StoredDocument = CompanyDocument & { id: string; path: string };

export async function listDocuments(companyId: string): Promise<StoredDocument[]> {
  return check(await supabase().from("company_documents").select("id, kind, title, path, uploaded_at").eq("company_id", companyId).order("uploaded_at", { ascending: false }));
}

/** Upload a program document into the company's private folder, then record it. Files are never replaced. */
export async function uploadDocument(companyId: string, kind: DocumentKind, title: string, file: File): Promise<void> {
  const safe = file.name.replace(/[^\w.-]+/g, "_").slice(-80) || "file";
  const path = `${companyId}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase().storage.from(COMPANY_DOCS_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  check(await supabase().from("company_documents").insert({ company_id: companyId, kind, title: title.trim(), path }).select("id"));
}

/** A one-minute link to open a document. Never stored. */
export async function documentUrl(path: string): Promise<string> {
  const { data, error } = await supabase().storage.from(COMPANY_DOCS_BUCKET).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Couldn't open the document.");
  return data.signedUrl;
}
