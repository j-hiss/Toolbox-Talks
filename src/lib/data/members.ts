// App access: who can sign in to the company and with which app role (Admin → App access). Joining is by invite,
// claimed by public.accept_invites() when the invited email signs in (migration 0022). No server code.
// Owners change anyone; admins change presenters, office and employees (the database enforces both).
import { supabase } from "@/lib/supabase";
import type { Access } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export type Member = { user_id: string; email: string; access: Access; created_at: string };
export type Invite = { id: string; email: string; access: Access; person_id: string | null; invited_at: string };

export async function listMembers(companyId: string): Promise<Member[]> {
  return check(await supabase().from("company_members").select("user_id, email, access, created_at").eq("company_id", companyId).order("created_at"));
}

export async function setMemberAccess(companyId: string, userId: string, access: Access): Promise<void> {
  const rows = check(await supabase().from("company_members").update({ access }).eq("company_id", companyId).eq("user_id", userId).select("user_id"));
  if (!rows.length) throw new Error("Only an owner can change an owner or admin.");
}

export async function removeMember(companyId: string, userId: string): Promise<void> {
  const rows = check(await supabase().from("company_members").delete().eq("company_id", companyId).eq("user_id", userId).select("user_id"));
  if (!rows.length) throw new Error("Only an owner can remove an owner or admin.");
}

export async function listInvites(companyId: string): Promise<Invite[]> {
  return check(await supabase().from("company_invites").select("id, email, access, person_id, invited_at").eq("company_id", companyId).is("accepted_at", null).order("invited_at"));
}

export async function inviteMember(companyId: string, email: string, access: Access, personId: string | null = null): Promise<void> {
  check(await supabase().from("company_invites").insert({ company_id: companyId, email: email.trim().toLowerCase(), access, person_id: access === "employee" ? personId : null }).select("id"));
}

export async function cancelInvite(companyId: string, id: string): Promise<void> {
  check(await supabase().from("company_invites").delete().eq("company_id", companyId).eq("id", id));
}

/** Joins every company that invited the signed-in email. Run after each sign-in; returns how many were joined. */
export async function acceptInvites(): Promise<number> {
  return check(await supabase().rpc("accept_invites")) as number;
}

export type MyTalk = { id: string; title: string; held_at: string; jobsite_name: string; kind: "weekly" | "daily"; status: "signed" | "not_signed" | "absent"; signed_at: string | null };

/** An employee's own history: the talks they were on and their own status (RLS shows nothing else). */
export async function myTalks(companyId: string): Promise<MyTalk[]> {
  type Row = { id: string; held_at: string; jobsite_name: string; record_kind: "weekly" | "daily" | null; content: { en?: { title?: string }; title?: string }; talk_id: string;
    talk_attendees: { status: MyTalk["status"]; signed_at: string | null }[] };
  const rows = check(await supabase().from("talk_records").select("id, held_at, jobsite_name, record_kind, talk_id, content, talk_attendees(status, signed_at)")
    .eq("company_id", companyId).order("held_at", { ascending: false }).limit(200)) as unknown as Row[];
  return rows.filter((r) => r.talk_attendees.length).map((r) => ({
    id: r.id, held_at: r.held_at, jobsite_name: r.jobsite_name, kind: r.record_kind ?? "weekly",
    title: r.record_kind === "daily" ? "Daily pre-task plan" : r.content?.en?.title ?? r.content?.title ?? r.talk_id,
    status: r.talk_attendees[0].status, signed_at: r.talk_attendees[0].signed_at,
  }));
}
