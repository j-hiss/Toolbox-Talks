// Demo version of src/lib/data/profile.ts: kept in this browser, admins only, append-only like the database.
import type * as Real from "@/../src/lib/data/profile";
import type { DocumentKind, EmrEntry } from "@/core/profile";
import { db, save, tick, uid } from "./store";

export const COMPANY_DOCS_BUCKET = "company-docs";

const emrs = () => (db().emr ??= []);
const docs = () => (db().companyDocs ??= []);
function mustBeAdmin(companyId: string) {
  const me = db().session?.user.id;
  const a = db().members.find((m) => m.company_id === companyId && m.user_id === me)?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can change the safety profile.");
}

export async function listEmr(companyId: string): Promise<EmrEntry[]> {
  await tick(); mustBeAdmin(companyId);
  return emrs().filter((e) => e.company_id === companyId).sort((a, b) => b.entered_at.localeCompare(a.entered_at))
    .map(({ rating_year, emr, note, entered_at }) => ({ rating_year, emr, note, entered_at }));
}

export async function addEmr(companyId: string, e: { rating_year: number; emr: number; note: string }): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (!(e.emr > 0 && e.emr < 10)) throw new Error("An EMR is a number like 0.85 or 1.10.");
  emrs().push({ company_id: companyId, ...e, entered_at: new Date().toISOString() });
  save();
}

export type StoredDocument = Real.StoredDocument;

export async function listDocuments(companyId: string): Promise<StoredDocument[]> {
  await tick(); mustBeAdmin(companyId);
  return docs().filter((d) => d.company_id === companyId).sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at))
    .map(({ id, kind, title, path, uploaded_at }) => ({ id, kind, title, path, uploaded_at }));
}

export async function uploadDocument(companyId: string, kind: DocumentKind, title: string, file: File): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (file.size > 20 * 1024 * 1024) throw new Error("Documents can be up to 20 MB.");
  const data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file); });
  docs().push({ id: uid(), company_id: companyId, kind, title: title.trim(), path: `${companyId}/${uid()}-${file.name}`, uploaded_at: new Date().toISOString(), data });
  save();
}

export async function documentUrl(path: string): Promise<string> {
  await tick();
  const d = docs().find((x) => x.path === path);
  if (!d) throw new Error("Document not found.");
  return d.data;
}

const _sameShape = { COMPANY_DOCS_BUCKET, listEmr, addEmr, listDocuments, uploadDocument, documentUrl } satisfies Omit<typeof Real, never>;
void _sameShape;
