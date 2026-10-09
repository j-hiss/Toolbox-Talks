// Row shapes as stored in Supabase (snake_case, matching supabase/migrations/).
import type { PretaskPlan } from "@/core/pretask";
import type { CaseStatus, EventKind, SinceLastSnapshot, SinceLastWindow } from "@/core/safetylog";
import type { Theme } from "@/core/theme";
import type { IndustryId } from "@/core/industries";
import type { WorkSetting } from "@/core/worksetting";
import type { LanguageId } from "@/core/languages";

/** App role: what someone can do in the app (separate from their job title). Migration 0022. */
export type Access = "owner" | "admin" | "presenter" | "office" | "employee";

export type Company = {
  id: string;
  name: string;
  licenses: string;
  address: string;
  phone: string;
  email: string;
  industry: IndustryId;
  zip: string | null;
  program_start: string; // YYYY-MM-DD, the Monday of Week 1
  default_jobsite: string;
  makeup_weeks: number; // how many weeks back a missed talk can be made up
  work_setting?: WorkSetting | null; // where crews work (Admin → Company); null = the industry default, src/core/worksetting.ts
  theme?: Partial<Theme> | null; // only the colors this company changed (Admin → Brand); see src/core/theme.ts
  // "Since last talk" settings (Admin → Safety log); see sinceLastSettings in src/core/safetylog.ts.
  since_last_enabled?: boolean;
  since_last_window?: SinceLastWindow;
  since_last_scope?: "jobsite" | "all";
  since_last_kinds?: EventKind[];
  since_last_open_only?: boolean;
  /** Home offers a daily pre-task plan (src/core/pretask.ts). */
  daily_enabled?: boolean;
};

export type Membership = { company: Company; access: Access };

/** A job title (Roofer, Foreman, Office). `presents`: people with it appear in "Presented by". */
export type Role = { id: string; company_id: string; name: string; presents: boolean };
export type Team = { id: string; company_id: string; name: string; lead_person_id: string | null };
export type Person = {
  id: string;
  company_id: string;
  full_name: string;
  role_id: string | null; // job title; null = "Team member" (signs only)
  team_id: string | null;
  employee_id: string | null;
  phone: string | null;
  preferred_language: LanguageId;
  active: boolean;
  /** The app account that signs in as this person (employee access), if any. */
  user_id?: string | null;
};

export const canAdmin = (access: Access | undefined) => access === "owner" || access === "admin";
/** Runs talks and daily plans. */
export const canPresent = (access: Access | undefined) => access === "owner" || access === "admin" || access === "presenter";
/** Sees Reports. */
export const canReport = (access: Access | undefined) => access === "owner" || access === "admin" || access === "office";
/** Sees company records and the roster (everyone except an employee account). */
export const isStaff = (access: Access | undefined) => !!access && access !== "employee";

export type Jobsite = {
  id: string;
  company_id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  kind: "site" | "office"; // office or shop: talks there are normal, not a flag
  work_setting?: WorkSetting | null; // where the crew works here; null = the company's setting (src/core/worksetting.ts)
  active: boolean;
};

export type AttendanceRow = {
  person_id: string | null;
  name: string;
  role: string;
  team_name: string;
  company_name?: string; // walk-ins: the company they work for
  status: "signed" | "not_signed" | "absent";
  signature: string | null;
  signed_at: string | null;
  confirmed_at?: string | null; // when they tapped the signing statement
};

/** A saved talk as listed (no signatures). */
export type TalkRecordSummary = {
  id: string;
  /** "daily" = a daily pre-task plan (never scored); weekly talks otherwise. */
  kind?: "weekly" | "daily";
  client_id: string;
  talk_id: string;
  language: string;
  title: string;
  week_number: number | null;
  week_start: string | null;
  /** Weeks in the talk period this record belongs to (1 = weekly; older records have 1). */
  period_weeks?: number;
  makeup_for_week: string | null;
  makeup_reason: string | null;
  held_at: string;
  jobsite_name: string;
  team_name: string;
  presenter_name: string;
  statuses: AttendanceRow["status"][];
  presenter_signed: boolean;
};

/** Admin's swap of one week's talk (week key = that Monday). */
export type PlanOverride = { week_start: string; talk_id: string };

/** A saved talk with everything needed to show it or build its PDF. */
export type TalkRecord = TalkRecordSummary & {
  content: { title: string; hook: string; sections: { heading: string; items: string[] }[]; ask: string; en?: unknown; since_last?: SinceLastSnapshot };
  scheduled_talk_id: string | null;
  team_lead_name: string;
  presenter_role: string;
  presenter_signature: string | null;
  presenter_signed_at: string | null;
  latitude: number | null;
  longitude: number | null;
  site_notes?: string;
  heat?: { max_heat_index_f: number; level: string; reminder_read: boolean; checked_at: string; source: string; reminder?: { title: string; items: string[]; version: number } } | null;
  /** The statement crew members tapped before signing (null on records from before it existed). */
  signing_statement?: { text: string; en: string; language: string; version: number } | null;
  attendees: AttendanceRow[];
  /** Optional crew photo (image loaded from private storage) and when it was taken. */
  photo?: string | null;
  photo_taken_at?: string | null;
  /** Optional photo of a paper sign-in sheet. Evidence only: statuses come from the phone signatures. */
  sheet?: string | null;
  sheet_taken_at?: string | null;
  /** The structured plan, for a daily pre-task plan record. */
  pretask?: PretaskPlan | null;
};

/** Something the crew raised at a talk. */
export type Issue = {
  id: string;
  client_id: string;
  record_id: string | null;
  jobsite_name: string;
  description: string;
  owner_person_id: string | null;
  owner_name: string;
  due_date: string | null;
  status: "open" | "fixed";
  raised_by_name: string;
  raised_at: string;
  fixed_at: string | null;
  fixed_note: string;
  /** The safety-log event this issue came from (a finding), if any. */
  event_id?: string | null;
};

/** A safety-log entry as admins see it (Admin → Safety log). Crews only ever see Bulletin (src/core/safetylog.ts). */
export type SafetyEvent = {
  id: string;
  client_id: string;
  kind: EventKind;
  occurred_on: string;
  jobsite_id: string | null;
  jobsite_name: string;
  title: string;
  details: string;
  fields: Record<string, string>;
  case_status: CaseStatus | null;
  crew_summary: string;
  summary_source: "typed" | "ai";
  summary_status: "draft" | "reviewed";
  reviewed_at: string | null;
  status: "open" | "closed";
  closed_at: string | null;
  withdrawn_at: string | null;
  withdrawn_reason: string;
  created_at: string;
};
