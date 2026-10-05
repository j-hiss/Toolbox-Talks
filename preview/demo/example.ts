// Preview only: fills the current demo company with EXAMPLE history (people named "Example …", eight past weeks of
// talks, a few misses and makeups) so the reports have something to show. Stays in this browser.
import { TALKS } from "@/content/talks";
import { planWeekAt } from "@/core/makeup";
import { climateFor } from "@/core/climate";
import { addDays, isoDay, mondayOf } from "@/core/weeks";
import { db, save, uid } from "./store";

const SIG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

export function seedExample(): string {
  const d = db();
  const user = d.session?.user.id;
  let current: string | null = null;
  try { current = localStorage.getItem("tt-current-company"); } catch { /* none */ }
  const member = d.members.find((m) => m.user_id === user && m.company_id === current) ?? d.members.find((m) => m.user_id === user);
  if (!member) return "Create a company first.";
  const coId = member.company_id;
  const co = d.companies.find((c) => c.id === coId) as { program_start: string; industry: "con"; zip: string | null; makeup_weeks?: number };
  const thisMonday = mondayOf(new Date());
  const start = addDays(thisMonday, -7 * 8);
  if (co.program_start > isoDay(start)) co.program_start = isoDay(start);
  const longAgo = addDays(start, -14).toISOString();

  // Two example teams with a lead and workers.
  const team = (name: string) => {
    const id = uid();
    d.teams.push({ id, company_id: coId, name, lead_person_id: null });
    return id;
  };
  const foreman = ((d.roles as { id: string; company_id: string; name: string }[]).find((r) => r.company_id === coId && r.name === "Foreman")?.id) ?? null;
  const t1 = team("Example Crew A"), t2 = team("Example Crew B");
  const person = (name: string, teamId: string, role: string | null = null, created = longAgo) => {
    const id = uid();
    d.people.push({ id, company_id: coId, full_name: name, role_id: role, team_id: teamId, employee_id: null, phone: null, preferred_language: "en", active: true, created_at: created });
    return { id, name, teamId };
  };
  const leadA = person("Example Lead Alvarez", t1, foreman);
  const leadB = person("Example Lead Brooks", t2, foreman);
  const teams = d.teams as { id: string; lead_person_id: string | null }[];
  teams.find((t) => t.id === t1)!.lead_person_id = leadA.id;
  teams.find((t) => t.id === t2)!.lead_person_id = leadB.id;
  const crewA = ["Example Diaz", "Example Evans", "Example Fox"].map((n) => person(n, t1));
  const crewB = ["Example Gomez", "Example Hall", "Example Ito"].map((n) => person(n, t2));
  const newHire = person("Example New Hire", t2, null, addDays(thisMonday, -10).toISOString());
  const site = { id: uid(), company_id: coId, name: "Example Jobsite", address: "", latitude: null, longitude: null, kind: "site", active: true };
  d.jobsites.push(site);

  const input = { talks: TALKS, industry: co.industry, climate: climateFor(co.zip), programStart: co.program_start };
  const record = (weekKey: string, held: Date, teamName: string, lead: { id: string; name: string }, rows: { p: { id: string; name: string }; s: "signed" | "not_signed" | "absent" }[], makeup?: { week: string; reason: string }) => {
    const realWeek = planWeekAt(input, mondayOf(held));
    const credited = planWeekAt(input, new Date(`${makeup?.week ?? weekKey}T12:00:00`));
    const talk = TALKS.find((t) => t.id === credited?.talkId) ?? TALKS[0];
    d.records.push({
      id: uid(), client_id: uid(), company_id: coId, talk_id: talk.id, language: "en", content: talk.content.en,
      week_number: realWeek?.n ?? null, week_start: isoDay(mondayOf(held)), scheduled_talk_id: realWeek?.talkId ?? null,
      makeup_for_week: makeup?.week ?? null, makeup_reason: makeup?.reason ?? null,
      jobsite_id: site.id, jobsite_name: site.name, team_id: null, team_name: teamName, team_lead_name: lead.name,
      presenter_person_id: lead.id, presenter_name: lead.name, presenter_role: "Foreman", presenter_signature: SIG, presenter_signed_at: held.toISOString(),
      held_at: held.toISOString(), latitude: null, longitude: null, gps_accuracy_m: null,
      attendees: rows.map(({ p, s }) => ({ person_id: p.id, name: p.name, role: "Crew member", team_name: teamName, status: s, signature: s === "signed" ? SIG : null, signed_at: s === "signed" ? held.toISOString() : null })),
    });
  };
  const at = (monday: Date, day: number) => { const x = addDays(monday, day); x.setHours(7, 5, 0, 0); return x; };
  for (let k = 8; k >= 1; k--) {
    const monday = addDays(thisMonday, -7 * k);
    const key = isoDay(monday);
    const skipB = k === 6;                      // Crew B missed week 6 entirely
    const sickA = k === 3 ? crewA[1] : null;    // Evans out sick week 3, made up later
    const offB = k <= 2 ? crewB[2] : null;      // Ito off the last two weeks, not made up yet
    record(key, at(monday, 0), "Example Crew A", leadA, crewA.map((p) => ({ p, s: p === sickA ? "absent" as const : "signed" as const })));
    if (!skipB) record(key, at(monday, 1), "Example Crew B", leadB, crewB.map((p) => ({ p, s: p === offB ? "absent" as const : k === 4 && p === crewB[0] ? "not_signed" as const : "signed" as const })));
  }
  // Makeups: Evans made up week 3 the next week; Crew B made up week 6 (two weeks late) for two of three people.
  const wk = (k: number) => isoDay(addDays(thisMonday, -7 * k));
  record(wk(3), at(addDays(thisMonday, -14), 3), "Example Crew A", leadA, [{ p: crewA[1], s: "signed" }], { week: wk(3), reason: "Out sick" });
  record(wk(6), at(addDays(thisMonday, -28), 2), "Example Crew B", leadB, [{ p: crewB[0], s: "signed" }, { p: crewB[1], s: "signed" }], { week: wk(6), reason: "No work that week (weather, job gap)" });
  void newHire;
  save();
  return "Example history added.";
}
