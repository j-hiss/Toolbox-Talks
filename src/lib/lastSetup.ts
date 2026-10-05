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

// Companies walk-ins came from on this phone (subs, suppliers), newest first, so the next one is one tap.
const companiesKey = (companyId: string) => `tt-walkin-companies-${companyId}`;

export function readWalkinCompanies(companyId: string): string[] {
  try { return JSON.parse(localStorage.getItem(companiesKey(companyId)) || "[]") as string[]; } catch { return []; }
}

export function rememberWalkinCompany(companyId: string, name: string) {
  const n = name.trim();
  if (!n) return;
  const list = [n, ...readWalkinCompanies(companyId).filter((x) => x.toLowerCase() !== n.toLowerCase())].slice(0, 12);
  try { localStorage.setItem(companiesKey(companyId), JSON.stringify(list)); } catch { /* fine */ }
}
