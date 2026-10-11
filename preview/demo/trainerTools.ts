// Demo version of src/lib/data/trainerTools.ts: partner plans, classes, certificates and finding companies kept in
// this browser with the database's rules (only the company's trainer runs a class with people shared with them; a
// closed class never changes; closing sends a card per pass; finding companies needs an active plan; a company is
// listed only while it says it's looking).
import type * as Real from "@/../src/lib/data/trainerTools";
import type { Certificate, ConnectRequest, LookingCompany, NewClass, PartnerAccount, PartnerCredit, PartnerKind, TrainerListing, TrainingClass, VerifiedCertificate } from "@/core/trainerTools";
import { partnerActive } from "@/core/trainerTools";
import { db, save, tick, uid } from "./store";

type Trainer = { id: string; company_id: string; email: string; name: string; user_id: string | null; removed_at: string | null; accepted_at?: string | null; invited_at?: string };
type Sub = { id: string; company_id: string; trainer_id: string; person_id: string; cert_type: string; custom_name: string; issued_on: string | null; expires_on: string | null;
  note: string; card_path: string | null; submitted_at: string; status: string; decided_at: string | null; decline_reason: string; data: string | null; verify_code?: string };
type Extra = {
  trainers?: Trainer[]; trainerPeople?: { company_id: string; trainer_id: string; person_id: string }[]; certSubs?: Sub[];
  certs?: { submission_id?: string; withdrawn_at: string | null }[];
  partnerAccounts?: PartnerAccount[]; partnerCredits?: PartnerCredit[]; trainingClasses?: TrainingClass[];
  trainerListings?: (TrainerListing & { company_id: string; updated_at: string })[]; connectRequests?: (ConnectRequest & { user_id: string })[];
};
const x = () => db() as unknown as Extra;
const me = () => db().session?.user.id ?? "";
const myEmail = () => db().session?.user.email?.toLowerCase() ?? "you@example.com";
const accounts = () => (x().partnerAccounts ??= []);
const classes = () => (x().trainingClasses ??= []);
const listings = () => (x().trainerListings ??= []);
const requests = () => (x().connectRequests ??= []);
const myTrainer = (co: string) => (x().trainers ?? []).find((t) => t.company_id === co && t.user_id === me() && !t.removed_at);
const shared = (trainerId: string, person: string) => (x().trainerPeople ?? []).some((l) => l.trainer_id === trainerId && l.person_id === person);
const isAdmin = (co: string) => ["owner", "admin"].includes(db().members.find((m) => m.company_id === co && m.user_id === me())?.access ?? "");
const companyName = (id: string) => (db().companies as { id: string; name: string }[]).find((c) => c.id === id)?.name ?? "";
const CODE = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => CODE[b % CODE.length]).join("");
const myAccount = (kind: PartnerKind) => accounts().find((a) => a.user_id === me() && a.kind === kind) ?? null;

export async function openPartnerAccount(kind: PartnerKind): Promise<PartnerAccount> {
  await tick();
  let a = myAccount(kind);
  if (!a) {
    const end = new Date(); end.setDate(end.getDate() + 30);
    a = { user_id: me(), kind, plan: "trial", trial_ends: end.toISOString().slice(0, 10), free_until: null };
    accounts().push(a); save();
  }
  return a;
}
export async function myCredits(): Promise<PartnerCredit[]> {
  await tick();
  return (x().partnerCredits ?? []).filter((c) => (c as PartnerCredit & { user_id?: string }).user_id === me());
}

export async function createClass(n: NewClass): Promise<string> {
  await tick();
  const t = myTrainer(n.companyId);
  if (!t) throw new Error("This company hasn't invited you as a trainer.");
  if (!n.people.length || n.people.length > 100) throw new Error("Pick 1 to 100 people for the class.");
  if (n.people.some((p) => !shared(t.id, p))) throw new Error("You can only add people this company shared with you.");
  const id = uid();
  classes().push({ id, company_id: n.companyId, trainer_id: t.id, cert_type: n.certType, custom_name: n.certType === "custom" ? n.customName.trim() : "", held_on: n.heldOn,
    place: n.place.trim(), expires_on: n.expiresOn, note: n.note.trim(), created_at: new Date().toISOString(), closed_at: null,
    people: [...new Set(n.people)].map((p) => ({ person_id: p, signed_at: null, result: null, submission_id: null })) });
  save();
  return id;
}
export async function myClasses(): Promise<TrainingClass[]> {
  await tick();
  const mine = new Set((x().trainers ?? []).filter((t) => t.user_id === me() && !t.removed_at).map((t) => t.id));
  return classes().filter((c) => mine.has(c.trainer_id)).sort((a, b) => b.held_on.localeCompare(a.held_on));
}
const openClass = (id: string) => {
  const c = classes().find((y) => y.id === id && !y.closed_at && myTrainer(y.company_id)?.id === y.trainer_id);
  if (!c) throw new Error("This class is closed or isn't yours.");
  return c;
};
export async function signClass(classId: string, personId: string, image: string): Promise<void> {
  await tick();
  const p = openClass(classId).people.find((y) => y.person_id === personId && !y.signed_at);
  if (!p) throw new Error("That person isn't in this class, or already signed.");
  if (!/^data:image\/png;base64,iVBORw0KGgo/.test(image)) throw new Error("The signature didn't come through. Try again.");
  p.signed_at = new Date().toISOString(); save();
}
export async function setClassResult(classId: string, personId: string, passed: boolean): Promise<void> {
  await tick();
  const p = openClass(classId).people.find((y) => y.person_id === personId);
  if (!p) throw new Error("That person isn't in this class.");
  p.result = passed ? "passed" : "not_passed"; save();
}
export async function closeClass(classId: string): Promise<number> {
  await tick();
  const c = openClass(classId);
  if (c.people.some((p) => !p.result)) throw new Error("Mark everyone passed or not passed first.");
  if (c.people.some((p) => p.result === "passed" && !p.signed_at)) throw new Error("Someone marked passed hasn't signed in. Have them sign, or mark them not passed.");
  let n = 0;
  for (const p of c.people.filter((y) => y.result === "passed")) {
    const id = uid();
    (x().certSubs ??= []).push({ id, company_id: c.company_id, trainer_id: c.trainer_id, person_id: p.person_id, cert_type: c.cert_type, custom_name: c.custom_name,
      issued_on: c.held_on, expires_on: c.expires_on, note: `Class on ${c.held_on}${c.place ? ` at ${c.place}` : ""}`, card_path: null, submitted_at: new Date().toISOString(),
      status: "pending", decided_at: null, decline_reason: "", data: null, verify_code: newCode() });
    p.submission_id = id; n++;
  }
  c.closed_at = new Date().toISOString(); save();
  return n;
}

export async function myCertificates(): Promise<Certificate[]> {
  await tick();
  const mine = (x().trainers ?? []).filter((t) => t.user_id === me() && !t.removed_at);
  const people = db().people as { id: string; full_name: string }[];
  return (x().certSubs ?? []).filter((s) => s.status === "approved" && mine.some((t) => t.id === s.trainer_id)).map((s) => {
    s.verify_code ??= newCode();
    return {
      submission_id: s.id, company_id: s.company_id, company_name: companyName(s.company_id), trainer_name: mine.find((t) => t.id === s.trainer_id)?.name ?? "",
      person_name: people.find((p) => p.id === s.person_id)?.full_name ?? "", cert_type: s.cert_type, custom_name: s.custom_name, issued_on: s.issued_on, expires_on: s.expires_on,
      approved_at: s.decided_at ?? s.submitted_at, verify_code: s.verify_code, withdrawn: !!(x().certs ?? []).find((c) => c.submission_id === s.id)?.withdrawn_at,
    };
  }).sort((a, b) => b.approved_at.localeCompare(a.approved_at));
}
export async function verifyCertificate(code: string): Promise<VerifiedCertificate | null> {
  await tick();
  const c = code.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const s = (x().certSubs ?? []).find((y) => y.verify_code === c && y.status === "approved");
  if (!s) return null;
  return { company: companyName(s.company_id), trainer: (x().trainers ?? []).find((t) => t.id === s.trainer_id)?.name ?? "", cert_type: s.cert_type, custom_name: s.custom_name,
    issued_on: s.issued_on, expires_on: s.expires_on, approved_at: s.decided_at ?? s.submitted_at, withdrawn: !!(x().certs ?? []).find((y) => y.submission_id === s.id)?.withdrawn_at };
}

export async function findCompanies(): Promise<LookingCompany[]> {
  await tick();
  if (!partnerActive(myAccount("trainer"))) throw new Error("Finding companies is part of the trainer plan. Your trial or free months have ended.");
  const companies = db().companies as { id: string; name: string; industry: string; zip?: string }[];
  return listings().filter((l) => l.looking && !myTrainer(l.company_id)).map((l) => {
    const c = companies.find((y) => y.id === l.company_id);
    const n = (db().people as { company_id: string; active?: boolean }[]).filter((p) => p.company_id === l.company_id && p.active !== false).length;
    return { company_id: l.company_id, name: c?.name ?? "", industry: c?.industry ?? "", zip: c?.zip ?? "", size: n <= 10 ? "1-10 people" : n <= 25 ? "11-25 people" : n <= 100 ? "26-100 people" : "over 100 people",
      trainings: l.trainings, note: l.note, listed_since: l.updated_at, requested: requests().some((r) => r.company_id === l.company_id && r.user_id === me() && !r.answered_at) };
  });
}
export async function requestConnect(companyId: string, name: string, message: string): Promise<void> {
  await tick();
  if (!partnerActive(myAccount("trainer"))) throw new Error("Asking to connect is part of the trainer plan.");
  if (!listings().some((l) => l.company_id === companyId && l.looking)) throw new Error("That company isn't looking for a trainer right now.");
  if (requests().some((r) => r.company_id === companyId && r.user_id === me() && !r.answered_at)) throw new Error("You already asked this company. They'll see your request.");
  requests().push({ id: uid(), company_id: companyId, user_id: me(), email: myEmail(), name: name.trim(), message: message.trim().slice(0, 500), requested_at: new Date().toISOString(), answered_at: null, accepted: null });
  save();
}

export async function getListing(companyId: string): Promise<TrainerListing> {
  await tick();
  const l = listings().find((y) => y.company_id === companyId);
  return l ? { looking: l.looking, trainings: l.trainings, note: l.note } : { looking: false, trainings: [], note: "" };
}
export async function setListing(companyId: string, l: TrainerListing): Promise<void> {
  await tick();
  if (!isAdmin(companyId)) throw new Error("Only owners and admins can do this.");
  const row = listings().find((y) => y.company_id === companyId);
  const v = { looking: l.looking, trainings: l.trainings, note: l.note.trim().slice(0, 300), updated_at: new Date().toISOString() };
  if (row) Object.assign(row, v); else listings().push({ company_id: companyId, ...v });
  save();
}
export async function connectRequests(companyId: string): Promise<ConnectRequest[]> {
  await tick();
  if (!isAdmin(companyId)) return [];
  return requests().filter((r) => r.company_id === companyId).sort((a, b) => b.requested_at.localeCompare(a.requested_at)).map(({ user_id: _u, ...r }) => { void _u; return r; });
}
export async function answerConnect(requestId: string, accept: boolean): Promise<void> {
  await tick();
  const r = requests().find((y) => y.id === requestId && !y.answered_at);
  if (!r || !isAdmin(r.company_id)) throw new Error("Request not found.");
  r.answered_at = new Date().toISOString(); r.accepted = accept;
  if (accept && !(x().trainers ?? []).some((t) => t.company_id === r.company_id && t.email === r.email && !t.removed_at)) {
    (x().trainers ??= []).push({ id: uid(), company_id: r.company_id, email: r.email, name: r.name, user_id: r.user_id, removed_at: null, accepted_at: r.answered_at, invited_at: r.answered_at });
  }
  save();
}

const _sameShape = {
  openPartnerAccount, myCredits, createClass, myClasses, signClass, setClassResult, closeClass, myCertificates, verifyCertificate,
  findCompanies, requestConnect, getListing, setListing, connectRequests, answerConnect,
} satisfies Omit<typeof Real, never>;
void _sameShape;
