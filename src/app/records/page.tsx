"use client";

// Saved talks for the current company, newest first, plus any still waiting on this phone to upload.
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { IssuesList } from "@/components/Issues";
import { HazardList } from "@/components/Hazards";
import { RecordBadges } from "@/components/RecordBadges";
import { RECORD_FILTERS, matchesRecordFilter, type RecordFilter } from "@/core/recordType";
import { WeeklyEmail } from "@/components/WeeklyEmail";
import { listPeople } from "@/lib/data/company";
import type { Person } from "@/lib/data/types";
import { isoDay, mondayOf, periodLabel } from "@/core/weeks";
import { weekNumbers } from "@/core/plan";
import Link from "next/link";
import { listRecords } from "@/lib/data/records";
import type { Membership, TalkRecordSummary } from "@/lib/data/types";
import { countStatuses, signedSummary } from "@/core/attendance";
import { useOutbox } from "@/lib/useOutbox";
import { RequireCompany } from "@/components/Guard";
import { Button, ErrorNotice, Eyebrow, FlagChip, GroupHeading, Loading, MakeupTag, Shell, Title, inputClass } from "@/components/ui";

export default function RecordsPage() {
  return <RequireCompany need="staff">{(m) => <Records m={m} />}</RequireCompany>;
}

// Talks, Issues or Crew reports, kept in the URL hash (/records/#issues, #reports) so Home can link straight there.
const subscribeHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
type View = "talks" | "issues" | "reports";
const useView = () => useSyncExternalStore(subscribeHash, (): View => (window.location.hash === "#issues" ? "issues" : window.location.hash === "#reports" ? "reports" : "talks"), (): View => "talks");

const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Records({ m }: { m: Membership }) {
  const [rows, setRows] = useState<TalkRecordSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const outbox = useOutbox(m.company.id);
  const view = useView();
  // Crew hazard reports (migration 0055): owners, admins and office.
  const seesReports = m.access === "owner" || m.access === "admin" || m.access === "office";
  const [people, setPeople] = useState<Person[]>([]);
  useEffect(() => { if (seesReports && view === "reports") listPeople(m.company.id).then(setPeople).catch(() => setPeople([])); }, [seesReports, view, m.company.id]);
  const [team, setTeam] = useState("all");
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [type, setType] = useState<RecordFilter>("all");
  const teams = useMemo(() => [...new Set((rows ?? []).map((r) => r.team_name).filter(Boolean))].sort(), [rows]);
  // Newest week first; each week's talks newest first. Grouped by the week the talk was given.
  const weeks = useMemo(() => {
    const out = new Map<string, TalkRecordSummary[]>();
    for (const r of rows ?? []) {
      if (team !== "all" && r.team_name !== team) continue;
      if (!matchesRecordFilter(r, type)) continue;
      const c = countStatuses(r.statuses.map((status) => ({ status })));
      if (onlyFlagged && c.flagged + (r.presenter_signed ? 0 : 1) === 0) continue;
      const k = isoDay(mondayOf(new Date(r.held_at)));
      out.set(k, [...(out.get(k) ?? []), r]);
    }
    return [...out.entries()];
  }, [rows, team, onlyFlagged, type]);
  const waitingCount = outbox.items.length;

  useEffect(() => {
    let live = true;
    listRecords(m.company.id)
      .then((r) => live && setRows(r))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [m.company.id, waitingCount]); // reload after waiting talks upload

  return (
    <Shell>
      <Eyebrow>{m.company.name}</Eyebrow>
      <Title>Records</Title>
      <div className="mt-4 flex gap-1.5" role="tablist">
        {(seesReports ? (["talks", "issues", "reports"] as const) : (["talks", "issues"] as const)).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => { window.location.hash = v === "talks" ? "" : v; }}
            className={`min-h-10 flex-1 rounded-full border px-3.5 text-base font-semibold ${view === v ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted"}`}>
            {v === "talks" ? "Talks" : v === "issues" ? "Issues" : "Crew reports"}
          </button>
        ))}
      </div>
      {view === "reports" && seesReports ? <><HazardList companyId={m.company.id} people={people} />{m.access === "office" && <WeeklyEmail company={m.company} admin={false} />}</> : view === "issues" ? <IssuesList companyId={m.company.id} /> : (<>

      {outbox.items.length > 0 && (
        <>
          <GroupHeading aside={`${outbox.items.length}`}>Waiting to upload</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {outbox.items.map((i) => {
              const c = countStatuses(i.attendees);
              return (
                <li key={i.record.client_id} className="rounded-lg border border-dashed border-line bg-surface p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span><b className="block">{i.record.content.title}</b>{i.record.makeup_for_week && <MakeupTag weekStart={i.record.makeup_for_week} reason={i.record.makeup_reason} />}<small className="text-muted">{when(i.record.held_at)} · saved on this phone</small></span>
                    <FlagChip n={c.flagged + (i.record.presenter_signature ? 0 : 1)} />
                  </div>
                  {i.lastError && <p className="mt-1 text-xs text-muted">Last try: {i.lastError}</p>}
                </li>
              );
            })}
          </ul>
          <div className="mt-2"><Button size="sm" variant="ghost" disabled={outbox.busy} onClick={() => outbox.upload()}>{outbox.busy ? "Uploading…" : "Upload now"}</Button></div>
        </>
      )}

      <GroupHeading aside={rows ? `${rows.length}` : undefined}>Saved</GroupHeading>
      {error ? (
        <div className="mt-3"><ErrorNotice what="Couldn't load records." detail={error} onRetry={() => location.reload()} /></div>
      ) : !rows ? (
        <Loading />
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No talks recorded yet. Start this week&apos;s talk from Home.</p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {teams.length > 1 && (
              <select aria-label="Team" className={`${inputClass} w-auto py-2`} value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="all">All teams</option>
                {teams.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <select aria-label="Type of talk" className={`${inputClass} w-auto py-2`} value={type} onChange={(e) => setType(e.target.value as RecordFilter)}>
              {RECORD_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} />
              Only flagged
            </label>
          </div>
          {weeks.length === 0 && <p className="mt-3 text-sm text-muted">Nothing matches.</p>}
          {weeks.map(([k, list]) => {
            const monday = new Date(`${k}T12:00:00`);
            const first = list.find((r) => r.week_number && !r.makeup_for_week) ?? list[0];
            const wk = first.week_number;
            const len = first.period_weeks ?? 1;
            return (
              <section key={k} className="mt-5">
                <h3 className="sticky top-[3.6rem] z-10 -mx-4 flex items-baseline gap-2 bg-bg/95 px-4 py-2 backdrop-blur">
                  {wk ? <b className="font-display text-[17px] font-extrabold tracking-[-0.01em]">{weekNumbers({ n: wk, weeks: len })}</b> : null}
                  <span className="text-sm text-muted tabular-nums">{periodLabel(monday, len)}</span>
                  <span className="ml-auto rounded-full bg-fg/[0.06] px-2.5 py-0.5 text-[13px] font-semibold tabular-nums text-muted">{list.length} talk{list.length === 1 ? "" : "s"}</span>
                </h3>
                <ul className="mt-1 flex flex-col gap-2">
                  {list.map((r) => {
                    const c = countStatuses(r.statuses.map((status) => ({ status })));
                    const held = new Date(r.held_at);
                    return (
                      <li key={r.id}>
                        <Link href={`/record/#${r.id}`} className="flex gap-3 rounded-xl bg-surface shadow-card p-3 hover:ring-2 hover:ring-brand">
                          {/* The day it was held, like a page in the logbook. */}
                          <span aria-hidden className="flex w-12 shrink-0 flex-col items-center justify-center self-start rounded-lg bg-brand-soft py-1.5 text-brand-text">
                            <span className="text-[11px] font-semibold leading-none">{held.toLocaleDateString(undefined, { weekday: "short" })}</span>
                            <b className="font-display text-[22px] font-extrabold leading-tight tabular-nums">{held.getDate()}</b>
                            <span className="text-[11px] font-semibold leading-none">{held.toLocaleDateString(undefined, { month: "short" })}</span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-2">
                              <b className="block leading-snug">{r.title}</b>
                              <FlagChip n={c.flagged + (r.presenter_signed ? 0 : 1)} />
                            </span>
                            <RecordBadges r={r} className="mt-1" />
                            {r.makeup_for_week && <MakeupTag weekStart={r.makeup_for_week} reason={r.makeup_reason} pill={false} />}
                            <small className="block text-muted tabular-nums">
                              <span className="sr-only">{when(r.held_at)} · </span>
                              <span aria-hidden>{held.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>{r.team_name ? ` · ${r.team_name}` : ""}{r.jobsite_name ? ` · ${r.jobsite_name}` : ""}
                            </small>
                            <AttendanceBar c={c} />
                            <small className="mt-1 block text-[13px] tabular-nums">{signedSummary(c)}</small>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </>
      )}
      </>)}
    </Shell>
  );
}

/** Signed, not signed and absent as one bar: each status keeps its own color, so a gap is never hidden. */
function AttendanceBar({ c }: { c: { signed: number; not_signed: number; absent: number; total: number } }) {
  if (!c.total) return null;
  return (
    <span aria-hidden className="mt-2 flex h-1.5 gap-px overflow-hidden rounded-full bg-line">
      {c.signed > 0 && <span className="bg-ok" style={{ flex: c.signed }} />}
      {c.not_signed > 0 && <span className="bg-warn" style={{ flex: c.not_signed }} />}
      {c.absent > 0 && <span className="bg-muted/45" style={{ flex: c.absent }} />}
    </span>
  );
}
