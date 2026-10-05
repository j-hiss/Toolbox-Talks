// The TEST DATA plan for a local database: a made-up company with crews, people, places and about three months of
// talks. Pure (no database): given today and a seed number it always plans the same history, so a test is repeatable.
// Uses the app's own rules (plan weeks, makeup limit, heat levels) instead of inventing its own.
//
// Everything is labelled as an example. Nothing here is a real company, person, signature or photo.
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { alertWorthy, heatLevel } from "@/core/heat";
import { MAKEUP_REASONS, planWeekAt } from "@/core/makeup";
import { addDays, isoDay, mondayOf } from "@/core/weeks";

export const SEED_COMPANY = "Example Test Co (test data)";
export const SEED_WEEKS = 12;         // weeks of history before this week
export const SEED_MAKEUP_LIMIT = 4;   // the company's makeup limit, in weeks

/** Same numbers every run for the same seed (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SeedPerson = {
  key: string; name: string; team: string | null; role: string | null; language: "en" | "es";
  joinedWeeksAgo: number;              // on staff from early on the Monday this many weeks ago
  leftWeeksAgo?: number;               // deactivated in that week (Thursday)
};
export type SeedTeam = { name: string; lead: string };
export type SeedJobsite = { key: string; name: string; address: string; latitude: number | null; longitude: number | null; kind: "site" | "office" };
export type SeedAttendee = { personKey: string; here: boolean; signed: boolean } | { walkin: { name: string; company: string }; here: true; signed: boolean };
export type SeedIssue = { description: string; ownerKey: string; dueInDays: number; fixed?: { afterDays: number; note: string } };
export type SeedTalk = {
  key: string;
  heldAt: Date;
  /** The week this talk counts for: its own week, or the missed week a makeup covers. */
  creditWeek: string;
  talkId: string;
  scheduledTalkId: string | null;
  weekNumber: number | null;
  teamName: string;              // "Example Crew A", or "Still needed it" for a makeup group
  teamKey: string | null;
  presenterKey: string;
  presenterSigned: boolean;
  jobsiteKey: string;
  language: "en" | "es";
  attendees: SeedAttendee[];
  makeup: { weekStart: string; reason: string } | null;
  photo: boolean;
  siteNotes: string;
  heat: { max: number; level: string; reminderRead: boolean } | null;
  issues: SeedIssue[];
};
export type SeedPlan = {
  company: { name: string; industry: "con"; zip: string; program_start: string; makeup_weeks: number; address: string; phone: string; email: string; licenses: string; default_jobsite: string };
  teams: SeedTeam[];
  people: SeedPerson[];
  jobsites: SeedJobsite[];
  talks: SeedTalk[];
};

const TEAMS: { name: string; lead: [string, string]; crew: [string, "en" | "es"][]; site: string }[] = [
  { name: "Example Crew A", lead: ["Example Lead Alvarez", "Foreman"], site: "main", crew: [["Example Diaz", "es"], ["Example Evans", "en"], ["Example Fox", "en"], ["Example Garza", "es"], ["Example Hughes", "en"]] },
  { name: "Example Crew B", lead: ["Example Lead Brooks", "Foreman"], site: "bay", crew: [["Example Ito", "en"], ["Example Jimenez", "es"], ["Example Kim", "en"], ["Example Lopez", "es"], ["Example Moore", "en"]] },
  { name: "Example Shop Crew", lead: ["Example Lead Chen", "Supervisor"], site: "shop", crew: [["Example Nash", "en"], ["Example Ortiz", "es"], ["Example Park", "en"]] },
];
const WALKIN_COMPANIES = ["Example Electric", "Example Plumbing", "Example Drywall", "Example Crane Service"];
const WALKIN_NAMES = ["Example Visitor Quinn", "Example Visitor Reyes", "Example Visitor Shaw", "Example Visitor Tran", "Example Visitor Upton"];
const SITE_NOTES = [
  "Tie off at the ridge anchor, east side.",
  "Crane lift at 10. Stay clear of the swing radius.",
  "Wet deck this morning. Walk the planks, not the felt.",
  "New skylight openings on the north slope are covered and marked.",
  "Dumpster swap at noon. Keep the drive clear.",
];
const ISSUES = [
  "East ladder has a cracked rail",
  "Guardrail missing at the north edge",
  "Extension cord with cut insulation",
  "First-aid kit out of burn gel",
  "Harness webbing frayed on one unit",
  "Debris chute not secured at the top",
  "Fire extinguisher overdue for inspection",
];

const at = (d: Date, h: number, m: number) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x; };

export function buildSeed(today: Date = new Date(), seed = 7): SeedPlan {
  const rand = rng(seed);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
  const chance = (p: number) => rand() < p;

  const thisMonday = mondayOf(today);
  const mondayAgo = (w: number) => addDays(thisMonday, -7 * w);
  const programStart = isoDay(mondayAgo(SEED_WEEKS));
  const company: SeedPlan["company"] = {
    name: SEED_COMPANY, industry: "con", zip: "33913", program_start: programStart, makeup_weeks: SEED_MAKEUP_LIMIT,
    address: "100 Example Way, Example City (example)", phone: "555-0100", email: "office@example.com",
    licenses: "EXAMPLE-0000 (example)", default_jobsite: "",
  };
  const input = { talks: TALKS, industry: company.industry, climate: climateFor(company.zip), programStart };

  // People: three crews, a new hire, and someone who left mid-history (deactivated, not deleted).
  const people: SeedPerson[] = [];
  const teams: SeedTeam[] = [];
  TEAMS.forEach((t, ti) => {
    const leadKey = `lead-${ti}`;
    people.push({ key: leadKey, name: t.lead[0], team: t.name, role: t.lead[1], language: "en", joinedWeeksAgo: SEED_WEEKS + 4 });
    teams.push({ name: t.name, lead: leadKey });
    t.crew.forEach(([name, language], i) => people.push({ key: `p-${ti}-${i}`, name, team: t.name, role: null, language, joinedWeeksAgo: SEED_WEEKS + 4 }));
  });
  people.push({ key: "new-hire", name: "Example New Hire", team: "Example Crew B", role: null, language: "en", joinedWeeksAgo: 2 });
  people.push({ key: "left", name: "Example Former Worker", team: "Example Crew A", role: null, language: "en", joinedWeeksAgo: SEED_WEEKS + 4, leftWeeksAgo: 5 });

  const jobsites: SeedJobsite[] = [
    { key: "main", name: "Example Jobsite – Main St", address: "1 Example St (example)", latitude: 26.6406, longitude: -81.8723, kind: "site" },
    { key: "bay", name: "Example Jobsite – Bay Rd", address: "2 Example Rd (example)", latitude: 26.5629, longitude: -81.9495, kind: "site" },
    { key: "shop", name: "Example Shop", address: "100 Example Way (example)", latitude: 26.6123, longitude: -81.8810, kind: "office" },
  ];
  company.default_jobsite = jobsites[0].name;

  // Who was on a team's roster in a given week (joined by then, not yet left).
  const onRoster = (team: string, weeksAgo: number) =>
    people.filter((p) => p.team === team && !p.role && p.joinedWeeksAgo >= weeksAgo && (p.leftWeeksAgo === undefined || weeksAgo >= p.leftWeeksAgo));

  const talks: SeedTalk[] = [];
  const missed: { team: string; ti: number; weeksAgo: number; personKey: string; whole: boolean }[] = [];
  let n = 0;

  const issuesFor = (weeksAgo: number, ownerKey: string): SeedIssue[] => {
    if (!chance(0.22)) return [];
    const fixed = weeksAgo >= 2 && chance(0.7) ? { afterDays: 1 + Math.floor(rand() * 5), note: pick(["Replaced", "Fixed on site", "Tagged out and swapped", "Restocked"]) } : undefined;
    return [{ description: pick(ISSUES), ownerKey, dueInDays: 7, fixed }];
  };
  const heatFor = (weeksAgo: number) => {
    if (weeksAgo < 5 || !chance(0.6)) return null; // hotter weeks earlier in the history
    const max = 92 + Math.floor(rand() * 17);
    const level = heatLevel(max);
    return { max, level, reminderRead: alertWorthy(level) };
  };

  for (let w = SEED_WEEKS; w >= 0; w--) {
    const monday = mondayAgo(w);
    const week = planWeekAt(input, monday);
    if (!week) continue;
    TEAMS.forEach((t, ti) => {
      const roster = onRoster(t.name, w);
      // This week so far: only Crew A has had it (earlier today or last week's pattern), the others are still due.
      if (w === 0 && ti !== 0) return;
      const heldAt = at(addDays(monday, w === 0 ? 0 : chance(0.75) ? 0 : 1), 6, 40 + Math.floor(rand() * 35));
      if (heldAt > today) return;
      // About one week in ten a crew doesn't hold it at all (rained out, job gap). Everyone owes that week.
      if (w > 0 && chance(0.1)) {
        roster.forEach((p) => missed.push({ team: t.name, ti, weeksAgo: w, personKey: p.key, whole: true }));
        return;
      }
      const attendees: SeedAttendee[] = roster.map((p) => {
        const here = chance(0.9);
        const signed = here && chance(0.95);
        if (!signed) missed.push({ team: t.name, ti, weeksAgo: w, personKey: p.key, whole: false });
        return { personKey: p.key, here, signed };
      });
      if (chance(0.18)) attendees.push({ walkin: { name: pick(WALKIN_NAMES), company: pick(WALKIN_COMPANIES) }, here: true, signed: chance(0.95) });
      talks.push({
        key: `t${++n}`, heldAt, creditWeek: isoDay(monday), talkId: week.talkId, scheduledTalkId: week.talkId, weekNumber: week.n,
        teamName: t.name, teamKey: t.name, presenterKey: `lead-${ti}`, presenterSigned: chance(0.96), jobsiteKey: t.site,
        language: ti === 1 && chance(0.3) ? "es" : "en", attendees, makeup: null, photo: chance(0.35),
        siteNotes: t.site !== "shop" && chance(0.25) ? pick(SITE_NOTES) : "", heat: t.site !== "shop" ? heatFor(w) : null,
        issues: issuesFor(w, `lead-${ti}`),
      });
    });
  }

  // Makeups: some missed person-weeks get made up a week or two later, inside the limit, with a reason.
  // The rest stay open (recent) or missed (too old) so the reports show every state honestly.
  const groups = new Map<string, typeof missed>();
  for (const m of missed) {
    if (m.weeksAgo < 1 || !chance(0.55)) continue;
    const heldWeeksAgo = Math.max(1, m.weeksAgo - (chance(0.5) ? 1 : 2));
    if (heldWeeksAgo === m.weeksAgo || m.weeksAgo - heldWeeksAgo > SEED_MAKEUP_LIMIT) continue;
    const k = `${m.ti}|${m.weeksAgo}|${heldWeeksAgo}`;
    groups.set(k, [...(groups.get(k) ?? []), m]);
  }
  for (const [k, ms] of groups) {
    const [ti, creditAgo, heldAgo] = k.split("|").map(Number);
    const creditMonday = mondayAgo(creditAgo);
    const credited = planWeekAt(input, creditMonday);
    const real = planWeekAt(input, mondayAgo(heldAgo));
    if (!credited) continue;
    const reason = ms[0].whole ? MAKEUP_REASONS[3] : pick([MAKEUP_REASONS[0], MAKEUP_REASONS[1]]);
    talks.push({
      key: `t${++n}`, heldAt: at(addDays(mondayAgo(heldAgo), 2), 12, 15 + Math.floor(rand() * 30)),
      creditWeek: isoDay(creditMonday), talkId: credited.talkId, scheduledTalkId: real?.talkId ?? null, weekNumber: real?.n ?? null,
      teamName: "Still needed it", teamKey: null, presenterKey: `lead-${ti}`, presenterSigned: true, jobsiteKey: TEAMS[ti].site, language: "en",
      attendees: [...new Set(ms.map((m) => m.personKey))].map((personKey) => ({ personKey, here: true, signed: true })),
      makeup: { weekStart: isoDay(creditMonday), reason }, photo: false, siteNotes: "", heat: null, issues: [],
    });
  }
  talks.sort((a, b) => a.heldAt.getTime() - b.heldAt.getTime());
  return { company, teams, people, jobsites, talks };
}

/** When a seed person was added and (if they left) deactivated, as real dates for the database. */
export function staffDates(p: SeedPerson, today: Date = new Date()): { createdAt: Date; deactivatedAt: Date | null } {
  const thisMonday = mondayOf(today);
  return {
    createdAt: at(addDays(thisMonday, -7 * p.joinedWeeksAgo), 5, 0), // early Monday, before that week's talk
    deactivatedAt: p.leftWeeksAgo === undefined ? null : addDays(addDays(thisMonday, -7 * p.leftWeeksAgo), 3),
  };
}
