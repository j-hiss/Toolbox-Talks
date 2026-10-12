// Crew hazard and near-miss reports (migration 0055). Sent through database functions (in the app, or from a jobsite
// sticker with no account); read by owners, admins and office; reviewed once. Rules: src/core/hazards.ts.
import { supabase } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { byteaToDataUrl, splitDataUrl, type HazardKind, type HazardReport } from "@/core/hazards";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export type HazardSend = { clientId: string; kind: HazardKind; what: string; where: string; jobsiteId: string | null; anonymous: boolean; photo: string | null; name?: string };

const photoArgs = (photo: string | null) => {
  const p = photo ? splitDataUrl(photo) : null;
  return { photo: p?.base64 ?? null, photo_mime: p?.mime ?? null };
};

/** Signed in, any role. Sending the same clientId twice keeps one report. */
export async function reportHazard(companyId: string, r: HazardSend): Promise<string> {
  return check(await supabase().rpc("report_hazard", {
    co: companyId, client_id: r.clientId, kind: r.kind, what: r.what.trim(), where_text: r.where.trim(), site: r.jobsiteId, anonymous: r.anonymous, ...photoArgs(r.photo),
  })) as string;
}

/** From a jobsite sticker, no account. Leaving the name blank sends it with no name. */
export async function reportHazardAtSite(site: string, r: HazardSend): Promise<string> {
  return check(await supabase().rpc("report_hazard_at_site", {
    site, client_id: r.clientId, kind: r.kind, what: r.what.trim(), where_text: r.where.trim(), reporter_name: r.anonymous ? "" : (r.name ?? "").trim(), ...photoArgs(r.photo),
  })) as string;
}

/** The company and jobsite names for a sticker, or null when the sticker isn't active. */
export async function hazardSiteInfo(site: string): Promise<{ company: string; jobsite: string } | null> {
  return check(await supabase().rpc("hazard_site_info", { site })) as { company: string; jobsite: string } | null;
}

const COLUMNS = "id, client_id, kind, what, where_text, jobsite_id, jobsite_name, anonymous, reporter_name, via, has_photo, created_at, reviewed_at, action";

/** Owners, admins and office: every report. Anyone else: only their own named reports (the database decides). */
export async function listHazards(companyId: string, sb: SupabaseClient = supabase()): Promise<HazardReport[]> {
  return check(await sb.from("hazard_reports").select(COLUMNS).eq("company_id", companyId).order("created_at", { ascending: false }).limit(500)) as HazardReport[];
}

export async function hazardPhoto(companyId: string, reportId: string): Promise<string | null> {
  const row = check(await supabase().from("hazard_report_photos").select("mime, data").eq("company_id", companyId).eq("report_id", reportId).maybeSingle()) as { mime: string; data: string } | null;
  return row ? byteaToDataUrl(row.data, row.mime) : null;
}

/** Mark reviewed with what was done; optionally put it on the issues list. Returns the new issue's id, if any. */
export async function reviewHazard(companyId: string, reportId: string, action: string, issue: { ownerPersonId: string | null; due: string | null } | null): Promise<string | null> {
  return check(await supabase().rpc("review_hazard", {
    co: companyId, report: reportId, action: action.trim(), add_issue: !!issue, owner_person: issue?.ownerPersonId ?? null, due: issue?.due ?? null,
  })) as string | null;
}
