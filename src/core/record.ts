// Turns a finished talk (who was on the roster, who was there, who signed) into the record that gets saved.
// Pure module: the one place statuses are decided for a saved talk. Origin: prototype saveSession.
import { resolveStatus, type AttendanceStatus } from "./attendance";
import type { TalkText } from "./talks";
import type { LanguageId } from "./languages";

export type Signature = { image: string; signedAt: string };

export type RosterEntry = {
  key: string;            // person id, or "walkin:<n>" for someone added on the spot
  personId: string | null;
  name: string;
  role: string;
  teamName: string;
};

export type AttendeeRow = {
  person_id: string | null;
  name: string;
  role: string;
  team_name: string;
  status: AttendanceStatus;
  signature: string | null;
  signed_at: string | null;
};

/**
 * Every roster entry ends as signed / not_signed / absent. A signature from someone marked absent is dropped,
 * never upgraded to "signed". The presenter is not an attendee (they sign separately).
 */
export function buildAttendees(roster: RosterEntry[], present: Record<string, boolean>, signatures: Record<string, Signature>): AttendeeRow[] {
  return roster.map((r) => {
    const here = present[r.key] ?? false;
    const sig = here ? signatures[r.key] : undefined;
    const status = resolveStatus(here, !!sig);
    return {
      person_id: r.personId,
      name: r.name,
      role: r.role,
      team_name: r.teamName,
      status,
      signature: status === "signed" ? sig!.image : null,
      signed_at: status === "signed" ? sig!.signedAt : null,
    };
  });
}

export type RecordInput = {
  companyId: string;
  clientId: string;
  talkId: string;
  language: LanguageId;
  content: TalkText & { en?: TalkText };
  week: { number: number; start: string; scheduledTalkId: string } | null;
  jobsite: { id: string; name: string } | null;
  team: { id: string; name: string; leadName: string } | null;
  presenter: { personId: string | null; name: string; role: string; signature: Signature | null };
  heldAt: string;
  gps: { latitude: number; longitude: number; accuracyMeters: number } | null;
  /** A makeup for an earlier week. Date, week and GPS above stay real; this says which week it covers and why. */
  makeup?: { weekStart: string; reason: string } | null;
};

/** The JSON sent to save_talk_record(). Field names match supabase/migrations/…_talk_records.sql. */
export function recordPayload(r: RecordInput) {
  return {
    company_id: r.companyId,
    client_id: r.clientId,
    talk_id: r.talkId,
    language: r.language,
    content: r.content,
    week_number: r.week?.number ?? null,
    week_start: r.week?.start ?? null,
    scheduled_talk_id: r.week?.scheduledTalkId ?? null,
    jobsite_id: r.jobsite?.id ?? null,
    jobsite_name: r.jobsite?.name ?? "",
    team_id: r.team?.id ?? null,
    team_name: r.team?.name ?? "",
    team_lead_name: r.team?.leadName ?? "",
    presenter_person_id: r.presenter.personId,
    presenter_name: r.presenter.name,
    presenter_role: r.presenter.role,
    presenter_signature: r.presenter.signature?.image ?? null,
    presenter_signed_at: r.presenter.signature?.signedAt ?? null,
    held_at: r.heldAt,
    latitude: r.gps?.latitude ?? null,
    longitude: r.gps?.longitude ?? null,
    gps_accuracy_m: r.gps?.accuracyMeters ?? null,
    makeup_for_week: r.makeup?.weekStart ?? null,
    makeup_reason: r.makeup?.reason.trim() || null,
  };
}
export type RecordPayload = ReturnType<typeof recordPayload>;

/** Names of people who are here but haven't signed, so the presenter can be told before saving. */
export function unsignedPresent(roster: RosterEntry[], present: Record<string, boolean>, signatures: Record<string, Signature>): string[] {
  return roster.filter((r) => present[r.key] && !signatures[r.key]).map((r) => r.name);
}
