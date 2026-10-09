// Demo version of src/lib/data/members.ts: app access and invites, kept in this browser, same rules as the database
// (owners change anyone; admins change presenters, office and employees; never leave a company without an owner).
import type * as Real from "@/../src/lib/data/members";
import type { Access } from "@/lib/data/types";
import { db, save, tick, uid } from "./store";

export type Member = Real.Member;
export type Invite = Real.Invite;
export type MyTalk = Real.MyTalk;

const me = () => db().session?.user.id;
const myAccess = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === me())?.access;
const invites = () => (db().invites ??= []);
const STAFF: Access[] = ["presenter", "office", "employee"];
function mayManage(companyId: string, access: string) {
  const a = myAccess(companyId);
  if (a === "owner") return;
  if (a === "admin" && STAFF.includes(access as Access)) return;
  throw new Error(a === "admin" ? "Only an owner can change an owner or admin." : "Only owners and admins can change app access.");
}

export async function listMembers(companyId: string): Promise<Member[]> {
  await tick();
  if (!myAccess(companyId) || myAccess(companyId) === "employee") return [];
  return db().members.filter((m) => m.company_id === companyId).map((m) => ({
    user_id: m.user_id, access: m.access as Access, created_at: m.created_at ?? "2026-01-01T00:00:00Z",
    email: m.email ?? (m.user_id === me() ? db().session?.user.email ?? "" : ""),
  }));
}

export async function setMemberAccess(companyId: string, userId: string, access: Access): Promise<void> {
  await tick();
  const m = db().members.find((x) => x.company_id === companyId && x.user_id === userId);
  if (!m) throw new Error("No such member.");
  mayManage(companyId, m.access); mayManage(companyId, access);
  if (m.access === "owner" && access !== "owner" && !db().members.some((x) => x.company_id === companyId && x.access === "owner" && x.user_id !== userId))
    throw new Error("A company needs at least one owner. Make someone else an owner first.");
  m.access = access; save();
}

export async function removeMember(companyId: string, userId: string): Promise<void> {
  await tick();
  const m = db().members.find((x) => x.company_id === companyId && x.user_id === userId);
  if (!m) return;
  mayManage(companyId, m.access);
  if (m.access === "owner" && !db().members.some((x) => x.company_id === companyId && x.access === "owner" && x.user_id !== userId))
    throw new Error("A company needs at least one owner. Make someone else an owner first.");
  db().members = db().members.filter((x) => x !== m); save();
}

export async function listInvites(companyId: string): Promise<Invite[]> {
  await tick();
  const a = myAccess(companyId);
  if (a !== "owner" && a !== "admin") return [];
  return invites().filter((i) => i.company_id === companyId).map(({ id, email, access, person_id, invited_at }) => ({ id, email, access, person_id, invited_at }));
}

export async function inviteMember(companyId: string, email: string, access: Access, personId: string | null = null): Promise<void> {
  await tick(); mayManage(companyId, access);
  const addr = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) throw new Error("That doesn't look like an email address.");
  if (invites().some((i) => i.company_id === companyId && i.email === addr)) throw new Error("That email already has an invite waiting.");
  invites().push({ id: uid(), company_id: companyId, email: addr, access, person_id: access === "employee" ? personId : null, invited_at: new Date().toISOString() });
  save();
}

export async function cancelInvite(companyId: string, id: string): Promise<void> {
  await tick();
  const inv = invites().find((i) => i.company_id === companyId && i.id === id);
  if (!inv) return;
  mayManage(companyId, inv.access);
  db().invites = invites().filter((i) => i !== inv); save();
}

/** The preview has one demo account, so invites to other emails wait until someone signs in for real. */
export async function acceptInvites(): Promise<number> {
  await tick();
  return 0;
}

export async function myTalks(companyId: string): Promise<MyTalk[]> {
  await tick();
  const person = (db().people as { id: string; company_id: string; user_id?: string | null }[]).find((p) => p.company_id === companyId && p.user_id === me());
  if (!person) return [];
  type Rec = { id: string; company_id: string; held_at: string; jobsite_name: string; record_kind?: "weekly" | "daily"; talk_id: string;
    content?: { title?: string; en?: { title?: string } }; attendees: { person_id: string | null; status: MyTalk["status"]; signed_at: string | null }[] };
  return (db().records as unknown as Rec[])
    .filter((r) => r.company_id === companyId)
    .flatMap((r) => r.attendees.filter((a) => a.person_id === person.id).map((a) => ({
      id: r.id, title: r.record_kind === "daily" ? "Daily pre-task plan" : r.content?.en?.title ?? r.content?.title ?? r.talk_id,
      held_at: r.held_at, jobsite_name: r.jobsite_name, kind: r.record_kind ?? "weekly", status: a.status, signed_at: a.signed_at,
    })))
    .sort((a, b) => b.held_at.localeCompare(a.held_at));
}

// Compile-time check that this demo module offers every function the real one does, with the same signatures.
const _sameShape = { listMembers, setMemberAccess, removeMember, listInvites, inviteMember, cancelInvite, acceptInvites, myTalks } satisfies Omit<typeof Real, never>;
void _sameShape;
