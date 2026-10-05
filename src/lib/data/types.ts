// Row shapes as stored in Supabase (snake_case, matching supabase/migrations/).
import type { IndustryId } from "@/core/industries";
import type { LanguageId } from "@/core/languages";

export type Access = "owner" | "admin" | "presenter";

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
};

export type Membership = { company: Company; access: Access };

export type Role = { id: string; company_id: string; name: string };
export type Team = { id: string; company_id: string; name: string; lead_person_id: string | null };
export type Person = {
  id: string;
  company_id: string;
  full_name: string;
  role_id: string | null; // null = crew member
  team_id: string | null;
  employee_id: string | null;
  phone: string | null;
  preferred_language: LanguageId;
  active: boolean;
};

export const canAdmin = (access: Access | undefined) => access === "owner" || access === "admin";

export type Jobsite = {
  id: string;
  company_id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  kind: "site" | "office"; // office or shop: talks there are normal, not a flag
  active: boolean;
};

export type AttendanceRow = {
  person_id: string | null;
  name: string;
  role: string;
  team_name: string;
  status: "signed" | "not_signed" | "absent";
  signature: string | null;
  signed_at: string | null;
};

/** A saved talk as listed (no signatures). */
export type TalkRecordSummary = {
  id: string;
  client_id: string;
  talk_id: string;
  language: string;
  title: string;
  week_number: number | null;
  week_start: string | null;
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
  content: { title: string; hook: string; sections: { heading: string; items: string[] }[]; ask: string; en?: unknown };
  scheduled_talk_id: string | null;
  team_lead_name: string;
  presenter_role: string;
  presenter_signature: string | null;
  presenter_signed_at: string | null;
  latitude: number | null;
  longitude: number | null;
  attendees: AttendanceRow[];
};
