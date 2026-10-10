// Trainer portal data (migration 0026). Company side: owners and admins invite trainers, give them people, and approve
// or decline the cards they send. Trainer side: the trainer's roster (names and job titles only), their own sent cards,
// and sending a card. Card photos: private person-certs bucket, <company>/trainer/<trainer>/. Opening a photo: cardUrl
// in src/lib/data/certs.ts. Pure logic: src/core/trainers.ts. No server code.
import { supabase } from "@/lib/supabase";
import { PERSON_CERTS_BUCKET, type NewCert } from "@/lib/data/certs";
import type { RosterRow, Submission } from "@/core/trainers";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export type Trainer = { id: string; email: string; name: string; invited_at: string; accepted_at: string | null; people: string[] };
export type CompanySubmission = Submission & { trainer_name: string };
const SUB_COLUMNS = "id, company_id, trainer_id, person_id, cert_type, custom_name, issued_on, expires_on, note, card_path, submitted_at, status, decided_at, decline_reason";

// Company side ---------------------------------------------------------------------------------------------------------

export async function listTrainers(companyId: string): Promise<Trainer[]> {
  const [t, p] = await Promise.all([
    supabase().from("company_trainers").select("id, email, name, invited_at, accepted_at").eq("company_id", companyId).is("removed_at", null).order("name"),
    supabase().from("company_trainer_people").select("trainer_id, person_id").eq("company_id", companyId),
  ]);
  const links = check(p) as { trainer_id: string; person_id: string }[];
  return (check(t) as Omit<Trainer, "people">[]).map((x) => ({ ...x, people: links.filter((l) => l.trainer_id === x.id).map((l) => l.person_id) }));
}

export async function inviteTrainer(companyId: string, email: string, name: string): Promise<void> {
  check(await supabase().rpc("invite_trainer", { co: companyId, email: email.trim().toLowerCase(), name: name.trim() }));
}

/** Ends the trainer's access at once. Their sent cards stay on file. */
export async function removeTrainer(companyId: string, trainerId: string): Promise<void> {
  void companyId; // the database checks the trainer belongs to a company this person runs
  check(await supabase().rpc("remove_trainer", { trainer: trainerId }));
}

export async function setTrainerPerson(companyId: string, trainerId: string, personId: string, given: boolean): Promise<void> {
  if (given) check(await supabase().from("company_trainer_people").insert({ company_id: companyId, trainer_id: trainerId, person_id: personId }).select("person_id"));
  else check(await supabase().from("company_trainer_people").delete().eq("company_id", companyId).eq("trainer_id", trainerId).eq("person_id", personId));
}

/** Every waiting card (never cut off: nothing waits unseen), plus the 100 most recently reviewed. */
export async function listSubmissions(companyId: string): Promise<CompanySubmission[]> {
  type Row = Submission & { company_trainers: { name: string } | null };
  const cols = `${SUB_COLUMNS}, company_trainers(name)`;
  const [waiting, reviewed] = await Promise.all([
    supabase().from("cert_submissions").select(cols).eq("company_id", companyId).eq("status", "pending").order("submitted_at"),
    supabase().from("cert_submissions").select(cols).eq("company_id", companyId).neq("status", "pending").order("decided_at", { ascending: false }).limit(100),
  ]);
  return [...(check(waiting) as unknown as Row[]), ...(check(reviewed) as unknown as Row[])].map(({ company_trainers, ...s }) => ({ ...s, trainer_name: company_trainers?.name ?? "" }));
}

/** Approve (adds the training card) or decline with a reason. Once. */
export async function decideSubmission(companyId: string, id: string, approve: boolean, reason = ""): Promise<void> {
  void companyId;
  check(await supabase().rpc("decide_cert_submission", { submission: id, approve, reason: reason.trim() }));
}

// Trainer side ---------------------------------------------------------------------------------------------------------

/** Whether the signed-in account is a trainer for any company (decides where a non-member lands). */
export async function amTrainer(userId: string): Promise<boolean> {
  const rows = check(await supabase().from("company_trainers").select("id").eq("user_id", userId).is("removed_at", null).limit(1)) as { id: string }[];
  return rows.length > 0;
}

export async function myTrainerRoster(): Promise<RosterRow[]> {
  return check(await supabase().rpc("trainer_roster")) as RosterRow[];
}

/** The cards this trainer sent (the database shows a trainer only their own). */
export async function mySubmissions(): Promise<Submission[]> {
  return check(await supabase().from("cert_submissions").select(SUB_COLUMNS).order("submitted_at", { ascending: false }).limit(500)) as Submission[];
}

/** Send a card for a person the company gave this trainer. `clientId` makes a retry safe (sent once). */
export async function submitCert(companyId: string, trainerId: string, c: NewCert, card: File | null, clientId: string = crypto.randomUUID()): Promise<void> {
  let card_path: string | null = null;
  if (card) {
    const safe = card.name.replace(/[^\w.-]+/g, "_").slice(-80) || "card";
    card_path = `${companyId}/trainer/${trainerId}/${clientId}-${safe}`;
    const { error } = await supabase().storage.from(PERSON_CERTS_BUCKET).upload(card_path, card, { contentType: card.type, upsert: false });
    if (error && !/exists/i.test(error.message)) throw new Error(error.message);
  }
  check(await supabase().rpc("submit_cert", { c: {
    company_id: companyId, person_id: c.personId, client_id: clientId, cert_type: c.certType, custom_name: c.certType === "custom" ? c.customName.trim() : "",
    issued_on: c.issuedOn || null, expires_on: c.expiresOn || null, note: c.note.trim(), card_path,
  } }));
}
