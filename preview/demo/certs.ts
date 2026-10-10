// Demo version of src/lib/data/certs.ts: training cards kept in this browser, same rules as the database
// (admins add and withdraw; admins and office read all; others only their own; withdraw only, never edit).
import type * as Real from "@/../src/lib/data/certs";
import type { CertRequirement } from "@/core/certs";
import { db, save, tick, uid } from "./store";

export const PERSON_CERTS_BUCKET = "person-certs";
export type StoredCert = Real.StoredCert;
export type NewCert = Real.NewCert;

const me = () => db().session?.user.id;
const access = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === me())?.access;
const certs = () => (db().certs ??= []);
const reqs = () => (db().certReqs ??= []);
function mustBeAdmin(companyId: string) {
  const a = access(companyId);
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can change training records.");
}

export async function listCerts(companyId: string): Promise<StoredCert[]> {
  await tick();
  const a = access(companyId);
  const own = (db().people as { id: string; company_id: string; user_id?: string | null }[]).filter((p) => p.company_id === companyId && p.user_id === me()).map((p) => p.id);
  return certs().filter((c) => c.company_id === companyId && (a === "owner" || a === "admin" || a === "office" || own.includes(c.person_id)))
    .sort((x, y) => y.entered_at.localeCompare(x.entered_at)).map(({ company_id: _c, data: _d, ...c }) => { void _c; void _d; return c; });
}

export async function addCert(companyId: string, c: NewCert, card: File | null = null): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (c.certType === "custom" && !c.customName.trim()) throw new Error("Name the training.");
  if (c.issuedOn && c.expiresOn && c.expiresOn < c.issuedOn) throw new Error("The expiry date is before the issue date.");
  let data: string | null = null;
  let card_path: string | null = null;
  if (card) {
    if (card.size > 10 * 1024 * 1024) throw new Error("Card photos can be up to 10 MB.");
    data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(card); });
    card_path = `${companyId}/${c.personId}/${uid()}-card`;
  }
  certs().push({
    id: uid(), company_id: companyId, person_id: c.personId, cert_type: c.certType, custom_name: c.certType === "custom" ? c.customName.trim() : "",
    issued_on: c.issuedOn || null, expires_on: c.expiresOn || null, note: c.note.trim(), card_path, entered_at: new Date().toISOString(),
    withdrawn_at: null, withdrawn_reason: "", data, submission_id: null,
  });
  save();
}

export async function withdrawCert(companyId: string, id: string, reason: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const c = certs().find((x) => x.company_id === companyId && x.id === id);
  if (!c) throw new Error("No such card.");
  if (c.withdrawn_at) throw new Error("This card was already withdrawn.");
  if (!reason.trim()) throw new Error("Say why it's withdrawn.");
  c.withdrawn_at = new Date().toISOString(); c.withdrawn_reason = reason.trim(); save();
}

export async function cardUrl(path: string): Promise<string> {
  await tick();
  // Cards a trainer sent and are still waiting live with the submissions (./trainers.ts).
  const sent = ((db() as unknown as { certSubs?: { card_path: string | null; data: string | null }[] }).certSubs ?? []).find((x) => x.card_path === path);
  const c = certs().find((x) => x.card_path === path) ?? sent;
  if (!c?.data) throw new Error("Couldn't open the card.");
  return c.data;
}

export async function listRequirements(companyId: string): Promise<CertRequirement[]> {
  await tick();
  return reqs().filter((r) => r.company_id === companyId).map(({ role_id, cert_type }) => ({ role_id, cert_type }));
}

export async function setRequirement(companyId: string, roleId: string, certType: string, needed: boolean): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  db().certReqs = reqs().filter((r) => !(r.company_id === companyId && r.role_id === roleId && r.cert_type === certType));
  if (needed) reqs().push({ company_id: companyId, role_id: roleId, cert_type: certType });
  save();
}

// Compile-time check that this demo module offers every function the real one does, with the same signatures.
const _sameShape = { PERSON_CERTS_BUCKET, listCerts, addCert, withdrawCert, cardUrl, listRequirements, setRequirement } satisfies Omit<typeof Real, never>;
void _sameShape;
