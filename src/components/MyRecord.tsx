"use client";

// "My record": the signed-in person's own numbers. Talk weeks closed on time or made up, streak, weeks to make up and
// by when (same math as Reports), and for staff what they did themselves. Only this person sees it; no rankings.
import { useEffect, useMemo, useState } from "react";
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { periodKeys } from "@/core/makeup";
import { myRecord, type MyActivity } from "@/core/myRecord";
import { pct } from "@/core/compliance";
import { isStaff, type Membership } from "@/lib/data/types";
import { myActivity, myRecordData, type MyRecordData } from "@/lib/data/me";
import { useSession } from "@/lib/session";
import { isoDay, mondayOf, parseDay, periodLabel, weekLabel } from "@/core/weeks";
import { GroupHeading, Loading, Notice } from "./ui";

const short = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function MyRecord({ m, compact = false }: { m: Membership; compact?: boolean }) {
  const s = useSession();
  const co = m.company;
  const userId = s.user?.id ?? null;
  const [data, setData] = useState<MyRecordData | null>(null);
  const [act, setAct] = useState<MyActivity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let live = true;
    myRecordData(co.id, userId).then((d) => live && setData(d)).catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    if (isStaff(m.access)) myActivity(co.id, userId).then((a) => live && setAct(a)).catch(() => { /* activity is optional */ });
    return () => { live = false; };
  }, [co.id, userId, m.access]);

  const rec = useMemo(() => {
    if (!data?.person) return null;
    // Only the period lengths matter here, so the plan is built from the library and the company's cadence.
    const input = { talks: TALKS, industry: co.industry, climate: climateFor(co.zip), programStart: co.program_start, overrides: {}, lists: [], cadences: data.cadences, repeats: [] };
    // Periods from the program's first Monday, like Reports; buildCompliance's on-staff rule drops weeks before they joined.
    const periods = periodKeys(input, isoDay(mondayOf(parseDay(co.program_start))));
    return { r: myRecord({ person: data.person, records: data.records, periods, makeupWeeks: co.makeup_weeks ?? 4 }), multi: periods.some((p) => p.weeks > 1) };
  }, [data, co]);

  if (error) return <Notice tone="error">Couldn&apos;t load your record. {error}</Notice>;
  if (!data) return <Loading rows={2} />;
  const unit = rec?.multi ? "talk period" : "week";
  return (
    <section aria-label="My record">
      {rec ? (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat n={pct(rec.r.closedRate)} label={`of ${unit}s closed`} />
            <Stat n={String(rec.r.streak)} label={`${unit}${rec.r.streak === 1 ? "" : "s"} in a row`} />
            <Stat n={String(rec.r.owed.length)} label="to make up" warn={rec.r.owed.length > 0} />
          </div>
          <p className="mt-2 text-sm text-muted tabular-nums">
            {rec.r.tally.on_time} on time · {rec.r.tally.made_up} made up · {rec.r.tally.open} open · {rec.r.tally.missed} missed
            {rec.r.onTimeRate !== null ? ` · ${pct(rec.r.onTimeRate)} on time` : ""}
          </p>
          {rec.r.owed.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {rec.r.owed.map((o) => (
                <li key={o.week} className="rounded-lg bg-caution-bg px-3 py-2 text-sm">
                  Make up the {unit} of <b>{rec.multi ? periodLabel(parseDay(o.week), 1) : weekLabel(parseDay(o.week))}</b> by <b>{short(o.deadline)}</b> ({o.daysLeft} day{o.daysLeft === 1 ? "" : "s"} left). Ask your lead for the makeup talk.
                </li>
              ))}
            </ul>
          )}
        </>
      ) : !compact && (
        <Notice>Your account isn&apos;t linked to a name on the roster, so only what you did shows here, not talks you attended.</Notice>
      )}
      {act && (
        <>
          {!compact && <GroupHeading>What you did</GroupHeading>}
          <div className={`grid grid-cols-2 gap-2 text-center sm:grid-cols-4 ${compact ? "mt-3" : "mt-2"}`}>
            <Stat n={String(act.talksGivenRecent)} label={`${act.talksGivenRecent === 1 ? "talk" : "talks"} saved, 30 days (${act.talksGiven} in all)`} />
            <Stat n={String(act.inspectionsRecent)} label={`${act.inspectionsRecent === 1 ? "inspection" : "inspections"}, 30 days (${act.inspections} in all)`} />
            <Stat n={String(act.issuesRaised)} label={act.issuesRaised === 1 ? "issue raised" : "issues raised"} />
            <Stat n={String(act.issuesFixed)} label={act.issuesFixed === 1 ? "issue fixed" : "issues fixed"} />
          </div>
        </>
      )}
      {!compact && <p className="mt-3 text-xs text-muted">Only you see this page. Your admin sees everyone&apos;s weeks in Reports; there are no rankings.</p>}
    </section>
  );
}

function Stat({ n, label, warn = false }: { n: string; label: string; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-surface p-3 shadow-card">
      <p className={`font-display text-2xl font-bold tabular-nums ${warn ? "text-warn-text" : ""}`}>{n}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
