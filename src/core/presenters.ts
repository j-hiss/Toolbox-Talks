// Who can give a talk: anyone whose job title presents, plus each team's lead. Everyone else signs only.
// Pure module; used by the talk screens ("Presented by") and Admin → Job titles.
type P = { id: string; role_id: string | null };
type R = { id: string; name: string; presents?: boolean };
type T = { lead_person_id: string | null };

export const NO_TITLE = "Team member";

/** The job title shown next to a person ("Team member" when none). */
export function titleOf(p: P, roles: R[]): string {
  return roles.find((r) => r.id === p.role_id)?.name ?? NO_TITLE;
}

/** People who can present, in the order given. A title with `presents` unset (older data) counts as presenting. */
export function presentersFrom<X extends P>(people: X[], roles: R[], teams: T[]): X[] {
  const presenting = new Set(roles.filter((r) => r.presents !== false).map((r) => r.id));
  const leads = new Set(teams.map((t) => t.lead_person_id).filter(Boolean));
  return people.filter((p) => (p.role_id && presenting.has(p.role_id)) || leads.has(p.id));
}
