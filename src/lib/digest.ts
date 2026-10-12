// Loads one company's weekly email (src/core/digest.ts) through the same query functions the app uses, with whatever
// database client it's given: the browser's (in-app preview, scoped by the signed-in person's access) or the server
// function's (supabase/functions/weekly-digest, bundled by `npm run functions:sync`). No query of its own.
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDigest, type Digest } from "@/core/digest";
import { periodKeys } from "@/core/makeup";
import { climateFor } from "@/core/climate";
import { addDays, isoDay, mondayOf, parseDay } from "@/core/weeks";
import type { IndustryId } from "@/core/industries";
import { TALKS } from "@/content/talks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import { listPeople, listTeams } from "@/lib/data/company";
import { listIssues } from "@/lib/data/issues";
import { listCerts, listRequirements } from "@/lib/data/certs";
import { listHazards } from "@/lib/data/hazards";
import { listCadences } from "@/lib/data/plan";

export type DigestCompany = { id: string; name: string; zip: string | null; industry: IndustryId; program_start: string; makeup_weeks: number | null };

/** The plan's periods from the start of the makeup window (or the program's start) to today, newest first. */
export function digestPeriods(co: DigestCompany, cadences: Awaited<ReturnType<typeof listCadences>>, today: Date) {
  const thisMonday = mondayOf(today);
  const limit = co.makeup_weeks ?? 4;
  const start = isoDay(mondayOf(parseDay(co.program_start)));
  if (start > isoDay(thisMonday)) return [];
  const from = [isoDay(addDays(thisMonday, -7 * (limit + 1))), start].sort().at(-1)!;
  return periodKeys({ talks: TALKS, industry: co.industry, climate: climateFor(co.zip), programStart: co.program_start, cadences }, from, today);
}

export async function loadDigest(sb: SupabaseClient, co: DigestCompany, appUrl: string | null, today: Date = new Date()): Promise<Digest> {
  const cadences = await listCadences(co.id, sb);
  const periods = digestPeriods(co, cadences, today);
  const fromKey = periods.at(-1)?.key ?? isoDay(mondayOf(today));
  const [people, records, teams, roster, issues, certs, reqs, hazards] = await Promise.all([
    reportPeople(co.id, sb), reportRecords(co.id, fromKey, sb), listTeams(co.id, sb), listPeople(co.id, sb), listIssues(co.id, sb),
    listCerts(co.id, sb), listRequirements(co.id, sb), listHazards(co.id, sb).catch(() => []),
  ]);
  return buildDigest({
    companyName: co.name, appUrl, today, periods, makeupWeeks: co.makeup_weeks ?? 4, people, records, teams, issues,
    roster: roster.map((p) => ({ id: p.id, role_id: p.role_id })), certs, reqs, hazards,
  });
}
