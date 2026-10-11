// Crew self check-in data (migration 0043). The presenter opens a check-in for the talk in progress and takes the
// waiting signatures; a crew member's phone (no account) views the check-in and signs once. Rules: src/core/checkin.ts.
import { supabase } from "@/lib/supabase";
import type { CheckinEntry, WaitingSignature } from "@/core/checkin";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** Start (or restart) a check-in for this talk. Returns the secret for the QR code. */
export async function openCheckin(companyId: string, clientId: string, roster: CheckinEntry[], statement: string, title: string): Promise<string> {
  return check(await supabase().rpc("open_checkin", { co: companyId, talk_client: clientId, roster, statement, title })) as string;
}

/** Signatures waiting for this talk (presenters of the company only). */
export async function waitingSignatures(companyId: string, clientId: string): Promise<WaitingSignature[]> {
  // Every check-in for this talk, open or restarted: a signature given with an earlier code is never lost.
  const rows = check(await supabase().from("checkin_signatures").select("roster_key, name, image, signed_at, confirmed_at, checkin_sessions!inner(client_id)")
    .eq("company_id", companyId).eq("checkin_sessions.client_id", clientId)) as unknown as (WaitingSignature & { checkin_sessions: unknown })[];
  return rows.map(({ checkin_sessions: _s, ...w }) => { void _s; return w; });
}

/** The talk is saved or discarded: delete its check-ins and anything still waiting. */
export async function closeCheckin(companyId: string, clientId: string): Promise<void> {
  check(await supabase().rpc("close_checkin", { co: companyId, talk_client: clientId }));
}

/** The phone has these signatures in the talk now: delete them from the waiting area. */
export async function takeCheckinSignatures(companyId: string, clientId: string, keys: string[]): Promise<void> {
  check(await supabase().rpc("take_checkin_signatures", { co: companyId, talk_client: clientId, keys }));
}

export type CheckinView = { company: string; title: string; statement: string; expires_at: string; roster: (CheckinEntry & { signed: boolean })[] };

/** What a crew member's phone shows for a code, or null (wrong, closed or expired). Works signed out. */
export async function checkinView(token: string): Promise<CheckinView | null> {
  return (check(await supabase().rpc("checkin_view", { token })) as CheckinView | null) ?? null;
}

/** Sign once for one name. False when the code is closed, the name isn't open, or it's already signed. */
export async function checkinSign(token: string, key: string, image: string, confirmedAt: string): Promise<boolean> {
  return check(await supabase().rpc("checkin_sign", { token, key, image, confirmed_at: confirmedAt })) as boolean;
}
