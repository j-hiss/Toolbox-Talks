// Training cards per person and what each job title needs (Admin → Training). Append-only: a renewal is a new card,
// a mistake is withdrawn with a reason. Card photos go to the private person-certs bucket (admins only), served by
// one-minute signed links. Migration 0023. Status math: src/core/certs.ts.
import { supabase } from "@/lib/supabase";
import type { CertRequirement, PersonCert } from "@/core/certs";

export const PERSON_CERTS_BUCKET = "person-certs";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** submission_id: the trainer submission this card was approved from (migration 0028), or null when entered here. */
export type StoredCert = PersonCert & { note: string; card_path: string | null; withdrawn_reason: string; submission_id: string | null };
const COLUMNS = "id, person_id, cert_type, custom_name, issued_on, expires_on, note, card_path, entered_at, withdrawn_at, withdrawn_reason, submission_id";

/** Admins and office get the company's cards; anyone else gets only their own (the database decides). */
export async function listCerts(companyId: string): Promise<StoredCert[]> {
  return check(await supabase().from("person_certs").select(COLUMNS).eq("company_id", companyId).order("entered_at", { ascending: false }));
}

export type NewCert = { personId: string; certType: string; customName: string; issuedOn: string | null; expiresOn: string | null; note: string };

export async function addCert(companyId: string, c: NewCert, card: File | null = null): Promise<void> {
  let card_path: string | null = null;
  if (card) {
    const safe = card.name.replace(/[^\w.-]+/g, "_").slice(-80) || "card";
    card_path = `${companyId}/${c.personId}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase().storage.from(PERSON_CERTS_BUCKET).upload(card_path, card, { contentType: card.type, upsert: false });
    if (error) throw new Error(error.message);
  }
  check(await supabase().from("person_certs").insert({
    company_id: companyId, person_id: c.personId, cert_type: c.certType, custom_name: c.certType === "custom" ? c.customName.trim() : "",
    issued_on: c.issuedOn || null, expires_on: c.expiresOn || null, note: c.note.trim(), card_path,
  }).select("id"));
}

export async function withdrawCert(companyId: string, id: string, reason: string): Promise<void> {
  check(await supabase().from("person_certs").update({ withdrawn_at: new Date().toISOString(), withdrawn_reason: reason.trim() }).eq("company_id", companyId).eq("id", id).select("id").single());
}

/** A one-minute link to a card photo. Never stored. */
export async function cardUrl(path: string): Promise<string> {
  const { data, error } = await supabase().storage.from(PERSON_CERTS_BUCKET).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Couldn't open the card.");
  return data.signedUrl;
}

export async function listRequirements(companyId: string): Promise<CertRequirement[]> {
  return check(await supabase().from("title_cert_requirements").select("role_id, cert_type").eq("company_id", companyId));
}

export async function setRequirement(companyId: string, roleId: string, certType: string, needed: boolean): Promise<void> {
  if (needed) check(await supabase().from("title_cert_requirements").insert({ company_id: companyId, role_id: roleId, cert_type: certType }).select("role_id"));
  else check(await supabase().from("title_cert_requirements").delete().eq("company_id", companyId).eq("role_id", roleId).eq("cert_type", certType));
}
