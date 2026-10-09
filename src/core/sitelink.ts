// Jobsite QR stickers. Pure module: the link a sticker carries and how Home reads it back.
//
// The sticker holds only a link to the app with the jobsite's id: no company name, no people, no data. Scanning it
// with the phone camera opens the app, which sets today's jobsite only if that jobsite belongs to the company the
// person is signed in to. Crews never sign in; the presenter's phone does.

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The link printed on a jobsite's sticker. `origin` is where the app runs (its website address). */
export function jobsiteLink(origin: string, jobsiteId: string): string {
  if (!ID.test(jobsiteId)) throw new Error("Not a jobsite id");
  return `${origin.replace(/\/+$/, "")}/?site=${jobsiteId.toLowerCase()}`;
}

/** The jobsite id in a scanned link's query string, or null when there isn't a valid one. */
export function siteFromSearch(search: string): string | null {
  const v = new URLSearchParams(search).get("site");
  return v && ID.test(v) ? v.toLowerCase() : null;
}

/** What Home does with a scanned id: pick the site if it's one of this company's, else say it isn't. */
export function resolveScannedSite<T extends { id: string; name: string }>(scanned: string | null, sites: T[]):
  { kind: "none" } | { kind: "found"; site: T } | { kind: "not_ours" } {
  if (!scanned) return { kind: "none" };
  const site = sites.find((s) => s.id.toLowerCase() === scanned);
  return site ? { kind: "found", site } : { kind: "not_ours" };
}
