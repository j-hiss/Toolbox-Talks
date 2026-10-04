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
