// Demo version of src/lib/data/trainers.ts: trainers, the people they're given and the cards they send, kept in this
// browser with the database's rules (admins invite, give people and review; a trainer sees only people given to them;
// a card is reviewed once; declining needs a reason). The preview can't sign in as a second person, so "View as →
// Trainer" makes the demo account the trainer of its own company (see viewAs in ./example.ts).
import type * as Real from "@/../src/lib/data/trainers";
import type { NewCert } from "@/lib/data/certs";
import type { RosterRow, Submission } from "@/core/trainers";
import { db, save, tick, uid } from "./store";

export type Trainer = Real.Trainer;
export type CompanySubmission = Real.CompanySubmission;
type DemoTrainer = { id: string; company_id: string; email: string; name: string; invited_at: string; accepted_at: string | null; removed_at: string | null; user_id: string | null };
type DemoSub = Submission & { data: string | null };
type Extra = { trainers?: DemoTrainer[]; trainerPeople?: { company_id: string; trainer_id: string; person_id: string }[]; certSubs?: DemoSub[] };
const x = () => db() as unknown as Extra;
const trainers = () => (x().trainers ??= []);
const links = () => (x().trainerPeople ??= []);
const subs = () => (x().certSubs ??= []);
const me = () => db().session?.user.id ?? null;
function mustBeAdmin(companyId: string) {
  const a = db().members.find((m) => m.company_id === companyId && m.user_id === me())?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can manage trainers.");
}
const people = () => db().people as { id: string; company_id: string; full_name: string; role_id: string | null; active?: boolean }[];
const myTrainer = (companyId: string) => trainers().find((t) => t.company_id === companyId && t.user_id === me() && !t.removed_at);
const sees = (companyId: string, personId: string) => {
  const t = myTrainer(companyId);
  return !!t && links().some((l) => l.trainer_id === t.id && l.person_id === personId) && people().some((p) => p.id === personId && p.active !== false);
};

export async function listTrainers(companyId: string): Promise<Trainer[]> {
  await tick(); mustBeAdmin(companyId);
  return trainers().filter((t) => t.company_id === companyId && !t.removed_at).sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, email, name, invited_at, accepted_at }) => ({ id, email, name, invited_at, accepted_at, people: links().filter((l) => l.trainer_id === id).map((l) => l.person_id) }));
}

export async function inviteTrainer(companyId: string, email: string, name: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Type the trainer's email address.");
  if (!name.trim()) throw new Error("Type the trainer's or training company's name.");
  if (trainers().some((t) => t.company_id === companyId && t.email === e && !t.removed_at)) throw new Error("That trainer is already invited.");
  trainers().push({ id: uid(), company_id: companyId, email: e, name: name.trim(), invited_at: new Date().toISOString(), accepted_at: null, removed_at: null, user_id: null });
  save();
}

export async function removeTrainer(companyId: string, trainerId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const t = trainers().find((y) => y.id === trainerId && y.company_id === companyId);
  if (!t) throw new Error("Trainer not found.");
  t.removed_at ??= new Date().toISOString();
  x().trainerPeople = links().filter((l) => l.trainer_id !== trainerId);
  save();
}

export async function setTrainerPerson(companyId: string, trainerId: string, personId: string, given: boolean): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  x().trainerPeople = links().filter((l) => !(l.trainer_id === trainerId && l.person_id === personId));
  if (given) links().push({ company_id: companyId, trainer_id: trainerId, person_id: personId });
  save();
}

export async function listSubmissions(companyId: string): Promise<CompanySubmission[]> {
  await tick(); mustBeAdmin(companyId);
  return subs().filter((s) => s.company_id === companyId).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))
    .map(({ data: _d, ...s }) => { void _d; return { ...s, trainer_name: trainers().find((t) => t.id === s.trainer_id)?.name ?? "" }; });
}

export async function decideSubmission(companyId: string, id: string, approve: boolean, reason = ""): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const s = subs().find((y) => y.id === id && y.company_id === companyId);
  if (!s) throw new Error("Card not found.");
  if (s.status !== "pending") throw new Error("This card was already reviewed.");
  if (!approve && !reason.trim()) throw new Error("Say why the card is declined.");
  s.decided_at = new Date().toISOString();
  if (approve) {
    (db().certs ??= []).push({ id: uid(), company_id: companyId, person_id: s.person_id, cert_type: s.cert_type, custom_name: s.custom_name, issued_on: s.issued_on,
      expires_on: s.expires_on, note: s.note, card_path: s.card_path, entered_at: s.decided_at,
      withdrawn_at: null, withdrawn_reason: "", data: s.data, submission_id: s.id });
    s.status = "approved";
  } else { s.status = "declined"; s.decline_reason = reason.trim(); }
  save();
}

export async function amTrainer(userId: string): Promise<boolean> {
  await tick();
  return trainers().some((t) => t.user_id === userId && !t.removed_at);
}

export async function myTrainerRoster(): Promise<RosterRow[]> {
  await tick();
  const companies = db().companies as { id: string; name: string }[];
  const roles = db().roles as { id: string; name: string }[];
  return trainers().filter((t) => t.user_id === me() && !t.removed_at).flatMap((t): RosterRow[] => {
    const name = companies.find((c) => c.id === t.company_id)?.name ?? "";
    const given = people().filter((p) => p.company_id === t.company_id && p.active !== false && links().some((l) => l.trainer_id === t.id && l.person_id === p.id));
    if (!given.length) return [{ company_id: t.company_id, company_name: name, trainer_id: t.id, person_id: null, full_name: null, job_title: null }];
    return given.map((p) => ({ company_id: t.company_id, company_name: name, trainer_id: t.id, person_id: p.id, full_name: p.full_name, job_title: roles.find((r) => r.id === p.role_id)?.name ?? "" }));
  });
}

export async function mySubmissions(): Promise<Submission[]> {
  await tick();
  const mine = new Set(trainers().filter((t) => t.user_id === me() && !t.removed_at).map((t) => t.id));
  return subs().filter((s) => mine.has(s.trainer_id)).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)).map(({ data: _d, ...s }) => { void _d; return s; });
}

export async function submitCert(companyId: string, trainerId: string, c: NewCert, card: File | null, clientId: string = uid()): Promise<void> {
  await tick();
  if (!sees(companyId, c.personId) || myTrainer(companyId)?.id !== trainerId) throw new Error("You can only send cards for people this company gave you.");
  if (subs().some((s) => s.trainer_id === trainerId && (s as DemoSub & { client_id?: string }).client_id === clientId)) return;
  if (c.certType === "custom" && !c.customName.trim()) throw new Error("Name the training.");
  if (c.issuedOn && c.expiresOn && c.expiresOn < c.issuedOn) throw new Error("The expiry date is before the issue date.");
  let data: string | null = null, card_path: string | null = null;
  if (card) {
    if (card.size > 10 * 1024 * 1024) throw new Error("Card photos can be up to 10 MB.");
    data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(card); });
    card_path = `${companyId}/trainer/${trainerId}/${clientId}-card`;
  }
  subs().push({ id: uid(), company_id: companyId, trainer_id: trainerId, person_id: c.personId, cert_type: c.certType, custom_name: c.certType === "custom" ? c.customName.trim() : "",
    issued_on: c.issuedOn || null, expires_on: c.expiresOn || null, note: c.note.trim(), card_path, submitted_at: new Date().toISOString(), status: "pending",
    decided_at: null, decline_reason: "", data, ...{ client_id: clientId } });
  save();
}

const _sameShape = { listTrainers, inviteTrainer, removeTrainer, setTrainerPerson, listSubmissions, decideSubmission, amTrainer, myTrainerRoster, mySubmissions, submitCert } satisfies Omit<typeof Real, never>;
void _sameShape;
