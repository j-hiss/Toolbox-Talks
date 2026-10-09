// Turns a finished talk (who was on the roster, who was there, who signed) into the record that gets saved.
// Pure module: the one place statuses are decided for a saved talk. Origin: prototype saveSession.
import type { PretaskPlan } from "./pretask";
import { resolveStatus, type AttendanceStatus } from "./attendance";
import type { TalkText } from "./talks";
import type { LanguageId } from "./languages";

/** A finger signature, and when the signer tapped the signing statement before signing (see SigningStatement). */
export type Signature = { image: string; signedAt: string; confirmedAt?: string };

/** The exact statement each crew member tapped before signing, saved with the record so the PDF matches. */
export type SigningStatement = { text: string; en: string; language: string; version: number };

export type RosterEntry = {
  key: string;            // person id, or "walkin:<n>" for someone added on the spot
  personId: string | null;
  name: string;
  role: string;
  teamName: string;
  /** For walk-ins: the company they work for (a sub, a supplier). Optional. */
  company?: string;
};

export type AttendeeRow = {
  person_id: string | null;
  name: string;
  role: string;
  team_name: string;
  company_name: string;
  status: AttendanceStatus;
  signature: string | null;
  signed_at: string | null;
  confirmed_at: string | null; // when they tapped the signing statement (null on records from before it existed)
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
      company_name: (r.company ?? "").trim(),
      status,
      signature: status === "signed" ? sig!.image : null,
      signed_at: status === "signed" ? sig!.signedAt : null,
      confirmed_at: status === "signed" ? sig!.confirmedAt ?? null : null,
    };
  });
}

export type RecordInput = {
  companyId: string;
  clientId: string;
  talkId: string;
  language: LanguageId;
  content: TalkText & { en?: TalkText };
  /** The plan period this talk belongs to: first week number, first Monday, and how many weeks it covers (1 = weekly). */
  week: { number: number; start: string; scheduledTalkId: string; weeks?: number } | null;
  jobsite: { id: string; name: string } | null;
  team: { id: string; name: string; leadName: string } | null;
  presenter: { personId: string | null; name: string; role: string; signature: Signature | null };
  heldAt: string;
  gps: { latitude: number; longitude: number; accuracyMeters: number } | null;
  /** A makeup for an earlier week. Date, week and GPS above stay real; this says which week it covers and why. */
  makeup?: { weekStart: string; reason: string } | null;
  /** An optional photo of the crew at the talk (JPEG data URL, already shrunk) and when it was taken. */
  photo?: { image: string; takenAt: string } | null;
  /**
   * An optional photo of a paper sign-in sheet (when the phone couldn't go around). Evidence kept with the record;
   * it never changes anyone's status: people who didn't sign on the phone stay "not signed".
   */
  sheet?: { image: string; takenAt: string } | null;
  /** A line or two the presenter added for this site today. Read to the crew; saved with the record. */
  siteNotes?: string;
  /** The heat forecast checked for this talk (src/core/heat.ts), and whether the heat reminder was read. */
  heat?: { max_heat_index_f: number; level: string; reminder_read: boolean; checked_at: string; source: string; reminder?: { title: string; items: string[]; version: number } } | null;
  /** The statement crew members tapped before signing. */
  signingStatement?: SigningStatement | null;
  /** A daily pre-task plan instead of a weekly talk (src/core/pretask.ts): no week, never a makeup, never scored. */
  pretask?: PretaskPlan | null;
};

/** Something the crew raised at a talk: a hazard or problem to fix, with an owner and a fix-by date. */
export type IssuePayload = {
  client_id: string;
  description: string;
  owner_person_id: string | null;
  owner_name: string;
  due_date: string | null;       // YYYY-MM-DD
  raised_by_name: string;
  raised_at: string;
};

/** The JSON sent to save_talk_record(). Field names match supabase/migrations/…_talk_records.sql. */
export function recordPayload(r: RecordInput) {
  return {
    company_id: r.companyId,
    client_id: r.clientId,
    talk_id: r.talkId,
    language: r.language,
    content: r.content,
    // A daily plan has no week: it never fills or locks a weekly talk period.
    week_number: r.pretask ? null : r.week?.number ?? null,
    week_start: r.pretask ? null : r.week?.start ?? null,
    period_weeks: r.pretask ? 1 : r.week?.weeks ?? 1,
    scheduled_talk_id: r.pretask ? null : r.week?.scheduledTalkId ?? null,
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
    makeup_for_week: r.pretask ? null : r.makeup?.weekStart ?? null,
    makeup_reason: r.pretask ? null : r.makeup?.reason.trim() || null,
    site_notes: (r.siteNotes ?? "").trim(),
    heat: r.heat ?? null,
    signing_statement: r.signingStatement ?? null,
    photo: r.photo?.image ?? null,
    photo_taken_at: r.photo?.takenAt ?? null,
    sheet: r.sheet?.image ?? null,
    sheet_taken_at: r.sheet?.takenAt ?? null,
    record_kind: (r.pretask ? "daily" : "weekly") as "daily" | "weekly",
    pretask: r.pretask ?? null,
  };
}
export type RecordPayload = ReturnType<typeof recordPayload>;

/** Names of people who are here but haven't signed, so the presenter can be told before saving. */
export function unsignedPresent(roster: RosterEntry[], present: Record<string, boolean>, signatures: Record<string, Signature>): string[] {
  return roster.filter((r) => present[r.key] && !signatures[r.key]).map((r) => r.name);
}

// Files ------------------------------------------------------------------------------------------------------------
// Signatures and the crew photo are stored as private files, not inside the record. On the phone (draft, outbox) they
// stay as images so a talk saves with no signal; at upload time they become files at
// <company_id>/<client_id>/<name>, and the record points at them. The database checks each path (migration 0009).

export const TALK_FILES_BUCKET = "talk-files";

export type TalkFile = { path: string; image: string; contentType: "image/png" | "image/jpeg" };

const contentTypeOf = (image: string): TalkFile["contentType"] => (/^data:image\/jpe?g/i.test(image) ? "image/jpeg" : "image/png");

/** The folder a talk's files live in. */
export const talkFolder = (companyId: string, clientId: string) => `${companyId}/${clientId}/`;

/**
 * Split a record into the files to upload and the record that points at them. Pure and deterministic: the same talk
 * always gets the same paths, so retrying a half-finished upload never makes a second copy.
 */
export function toUpload(record: RecordPayload, attendees: AttendeeRow[]) {
  const folder = talkFolder(record.company_id, record.client_id);
  const files: TalkFile[] = [];
  const put = (name: string, image: string | null): string | null => {
    if (!image) return null;
    const contentType = contentTypeOf(image);
    const path = folder + name + (contentType === "image/jpeg" ? ".jpg" : ".png");
    files.push({ path, image, contentType });
    return path;
  };
  const { presenter_signature, photo, sheet, ...rest } = record;
  const stored = {
    ...rest,
    presenter_signature_path: put("presenter", presenter_signature),
    photo_path: put("photo", photo),
    photo_taken_at: photo ? record.photo_taken_at : null,
    sheet_path: put("sheet", sheet),
    sheet_taken_at: sheet ? record.sheet_taken_at : null,
  };
  const storedAttendees = attendees.map(({ signature, ...a }, i) => ({ ...a, signature_path: put(`sig-${i}`, signature) }));
  return { files, record: stored, attendees: storedAttendees };
}

/**
 * A signature needs some real ink: total stroke length on the pad, in screen pixels. A tap or a dot doesn't count
 * as signing. 60 px is about a short initial.
 */
export const MIN_INK_PX = 60;
export const enoughInk = (strokeLengthPx: number) => strokeLengthPx >= MIN_INK_PX;
