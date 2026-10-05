// The last presenter, crew and place used on this phone, per company, so the next talk starts filled in.
// A convenience only: the Crew step still shows everything and it can all be changed.
export type LastSetup = { presenterId: string; teamId: string; jobsiteId: string };

const key = (companyId: string) => `tt-last-setup-${companyId}`;

export function readLastSetup(companyId: string): LastSetup | null {
  try {
    const raw = localStorage.getItem(key(companyId));
    return raw ? (JSON.parse(raw) as LastSetup) : null;
  } catch { return null; }
}

export function writeLastSetup(companyId: string, s: LastSetup) {
  // "needs" (everyone who still needs it) depends on the week, so it isn't remembered as a crew choice.
  try { localStorage.setItem(key(companyId), JSON.stringify({ ...s, teamId: s.teamId === "needs" ? "" : s.teamId })); } catch { /* fine */ }
}
