// Trainer and partner tools (migrations 0050-0052): partner plans and earned months, classes, certificates, finding
// companies, and the company side of "looking for a trainer". Every write goes through a checked database function.
// Rules: src/core/trainerTools.ts.
import { supabase } from "@/lib/supabase";
import type { Certificate, ConnectRequest, LookingCompany, NewClass, PartnerAccount, PartnerCredit, PartnerKind, TrainerListing, TrainingClass, VerifiedCertificate } from "@/core/trainerTools";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// Plans -----------------------------------------------------------------------------------------------------------------

/** Opens this account's plan the first time (a 30-day trial) and returns it. */
export async function openPartnerAccount(kind: PartnerKind): Promise<PartnerAccount> {
  return check(await supabase().rpc("open_partner_account", { kind })) as PartnerAccount;
}
export async function myCredits(): Promise<PartnerCredit[]> {
  return check(await supabase().from("partner_credits").select("id, kind, company_id, months, granted_at").order("granted_at", { ascending: false })) as PartnerCredit[];
}

// Classes ---------------------------------------------------------------------------------------------------------------

export async function createClass(n: NewClass): Promise<string> {
  return check(await supabase().rpc("create_training_class", {
    co: n.companyId, cert_type: n.certType, custom_name: n.customName, held_on: n.heldOn, place: n.place, expires_on: n.expiresOn, note: n.note, people: n.people,
  })) as string;
}
/** This trainer's classes, newest first, with who's in each. */
export async function myClasses(): Promise<TrainingClass[]> {
  const classes = check(await supabase().from("training_classes").select("id, company_id, trainer_id, cert_type, custom_name, held_on, place, expires_on, note, created_at, closed_at").order("held_on", { ascending: false }).limit(200)) as Omit<TrainingClass, "people">[];
  if (!classes.length) return [];
  const people = check(await supabase().from("training_class_people").select("class_id, person_id, signed_at, result, submission_id").in("class_id", classes.map((c) => c.id))) as (TrainingClass["people"][number] & { class_id: string })[];
  return classes.map((c) => ({ ...c, people: people.filter((p) => p.class_id === c.id).map(({ class_id: _c, ...p }) => { void _c; return p; }) }));
}
export async function signClass(classId: string, personId: string, image: string): Promise<void> {
  check(await supabase().rpc("sign_training_class", { cls: classId, person: personId, image }));
}
export async function setClassResult(classId: string, personId: string, passed: boolean): Promise<void> {
  check(await supabase().rpc("set_training_result", { cls: classId, person: personId, passed }));
}
/** Closes the class and sends a card for each person who passed. Returns how many. */
export async function closeClass(classId: string): Promise<number> {
  return check(await supabase().rpc("close_training_class", { cls: classId })) as number;
}

// Certificates ----------------------------------------------------------------------------------------------------------

export async function myCertificates(): Promise<Certificate[]> {
  return check(await supabase().rpc("my_certificates")) as Certificate[];
}
/** Anyone with a certificate's code (works signed out). */
export async function verifyCertificate(code: string): Promise<VerifiedCertificate | null> {
  return (check(await supabase().rpc("verify_certificate", { code })) as VerifiedCertificate | null) ?? null;
}

// Finding companies -----------------------------------------------------------------------------------------------------

export async function findCompanies(): Promise<LookingCompany[]> {
  return check(await supabase().rpc("find_companies_for_training")) as LookingCompany[];
}
export async function requestConnect(companyId: string, name: string, message: string): Promise<void> {
  check(await supabase().rpc("request_trainer_connect", { co: companyId, name: name.trim(), message }));
}

// Company side ----------------------------------------------------------------------------------------------------------

export async function getListing(companyId: string): Promise<TrainerListing> {
  const rows = check(await supabase().from("company_trainer_listings").select("looking, trainings, note").eq("company_id", companyId).limit(1)) as TrainerListing[];
  return rows[0] ?? { looking: false, trainings: [], note: "" };
}
export async function setListing(companyId: string, l: TrainerListing): Promise<void> {
  check(await supabase().rpc("set_trainer_listing", { co: companyId, looking: l.looking, trainings: l.trainings, note: l.note }));
}
export async function connectRequests(companyId: string): Promise<ConnectRequest[]> {
  return check(await supabase().from("trainer_connect_requests").select("id, company_id, name, email, message, requested_at, answered_at, accepted").eq("company_id", companyId).order("requested_at", { ascending: false }).limit(50)) as ConnectRequest[];
}
export async function answerConnect(requestId: string, accept: boolean): Promise<void> {
  check(await supabase().rpc("answer_trainer_connect", { request: requestId, accept }));
}
