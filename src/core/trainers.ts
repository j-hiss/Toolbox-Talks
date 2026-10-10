// Trainer portal: how a trainer's roster groups by company, and how a sent-in card reads. Pure module.
// A trainer sees each company that invited them and, for the people they were given, the name and job title only.
// Database: supabase/migrations/20261010000026_trainer_portal.sql.

export type RosterRow = { company_id: string; company_name: string; trainer_id: string; person_id: string | null; full_name: string | null; job_title: string | null };
export type RosterCompany = { companyId: string; companyName: string; trainerId: string; people: { id: string; name: string; title: string }[] };

export type SubmissionStatus = "pending" | "approved" | "declined";
export type Submission = {
  id: string; company_id: string; trainer_id: string; person_id: string; cert_type: string; custom_name: string;
  issued_on: string | null; expires_on: string | null; note: string; card_path: string | null;
  submitted_at: string; status: SubmissionStatus; decided_at: string | null; decline_reason: string;
};

/** One entry per company, people sorted by name. A company that hasn't given any people yet still shows (empty). */
export function groupRoster(rows: RosterRow[]): RosterCompany[] {
  const by = new Map<string, RosterCompany>();
  for (const r of rows) {
    const c = by.get(r.company_id) ?? { companyId: r.company_id, companyName: r.company_name, trainerId: r.trainer_id, people: [] };
    if (r.person_id && r.full_name) c.people.push({ id: r.person_id, name: r.full_name, title: r.job_title ?? "" });
    by.set(r.company_id, c);
  }
  const list = [...by.values()];
  list.forEach((c) => c.people.sort((a, b) => a.name.localeCompare(b.name)));
  return list.sort((a, b) => a.companyName.localeCompare(b.companyName));
}

export const SUBMISSION_LABEL: Record<SubmissionStatus, string> = {
  pending: "Waiting for the company",
  approved: "Approved, on file",
  declined: "Declined",
};

/** Pending first (oldest first, so nothing waits forever), then reviewed ones newest first. */
export function sortSubmissions<S extends Pick<Submission, "status" | "submitted_at">>(list: S[]): S[] {
  return [...list].sort((a, b) => {
    const pa = a.status === "pending" ? 0 : 1, pb = b.status === "pending" ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return pa === 0 ? a.submitted_at.localeCompare(b.submitted_at) : b.submitted_at.localeCompare(a.submitted_at);
  });
}
