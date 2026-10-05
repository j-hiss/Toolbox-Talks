"use client";

// Saved talks for the current company, newest first, plus any still waiting on this phone to upload.
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { IssuesList } from "@/components/Issues";
import { isoDay, mondayOf, weekLabel } from "@/core/weeks";
import Link from "next/link";
import { listRecords } from "@/lib/data/records";
import type { Membership, TalkRecordSummary } from "@/lib/data/types";
import { countStatuses } from "@/core/attendance";
import { useOutbox } from "@/lib/useOutbox";
import { RequireCompany } from "@/components/Guard";
import { Button, Eyebrow, FlagChip, GroupHeading, Loading, MakeupTag, Notice, Shell, Title, inputClass } from "@/components/ui";

export default function RecordsPage() {
  return <RequireCompany>{(m) => <Records m={m} />}</RequireCompany>;
}

// Talks or Issues, kept in the URL hash (/records/#issues) so Home can link straight to issues.
const subscribeHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
const useView = () => useSyncExternalStore(subscribeHash, () => (window.location.hash === "#issues" ? "issues" : "talks"), () => "talks");

const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Records({ m }: { m: Membership }) {
  const [rows, setRows] = useState<TalkRecordSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const outbox = useOutbox(m.company.id);
  const view = useView();
  const [team, setTeam] = useState("all");
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const teams = useMemo(() => [...new Set((rows ?? []).map((r) => r.team_name).filter(Boolean))].sort(), [rows]);
  // Newest week first; each week's talks newest first. Grouped by the week the talk was given.
  const weeks = useMemo(() => {
    const out = new Map<string, TalkRecordSummary[]>();
    for (const r of rows ?? []) {
      if (team !== "all" && r.team_name !== team) continue;
      const c = countStatuses(r.statuses.map((status) => ({ status })));
      if (onlyFlagged && c.flagged + (r.presenter_signed ? 0 : 1) === 0) continue;
      const k = isoDay(mondayOf(new Date(r.held_at)));
      out.set(k, [...(out.get(k) ?? []), r]);
    }
    return [...out.entries()];
  }, [rows, team, onlyFlagged]);
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
        {(["talks", "issues"] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => { window.location.hash = v === "issues" ? "issues" : ""; }}
            className={`min-h-10 flex-1 rounded-full border px-3.5 font-display text-base font-semibold ${view === v ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted"}`}>
            {v === "talks" ? "Talks" : "Issues"}
          </button>
        ))}
      </div>
      {view === "issues" ? <IssuesList companyId={m.company.id} /> : (<>

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
        <div className="mt-3"><Notice tone="error">Couldn&apos;t load records: {error}</Notice></div>
      ) : !rows ? (
        <Loading />
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No talks recorded yet. Start this week&apos;s talk from Home.</p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {teams.length > 1 && (
              <select aria-label="Crew" className={`${inputClass} w-auto py-2`} value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="all">All crews</option>
                {teams.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} />
              Only flagged
            </label>
          </div>
          {weeks.length === 0 && <p className="mt-3 text-sm text-muted">Nothing matches.</p>}
          {weeks.map(([k, list]) => {
            const monday = new Date(`${k}T12:00:00`);
            const wk = list.find((r) => r.week_number && !r.makeup_for_week)?.week_number ?? list[0].week_number;
            return (
              <section key={k} className="mt-5">
                <h3 className="sticky top-[3.6rem] z-10 -mx-4 bg-bg/95 px-4 py-1.5 font-display text-sm font-semibold text-muted backdrop-blur">
                  {wk ? `Week ${wk} · ` : ""}{weekLabel(monday)} <span className="font-sans font-normal normal-case tracking-normal">· {list.length} talk{list.length === 1 ? "" : "s"}</span>
                </h3>
                <ul className="mt-1 flex flex-col gap-2">
                  {list.map((r) => {
                    const c = countStatuses(r.statuses.map((status) => ({ status })));
                    return (
                      <li key={r.id}>
                        <Link href={`/record/#${r.id}`} className="flex items-start justify-between gap-3 rounded-xl bg-surface p-3 hover:ring-2 hover:ring-brand">
                          <span className="min-w-0">
                            <b className="block">{r.title}</b>
                            {r.makeup_for_week && <MakeupTag weekStart={r.makeup_for_week} reason={r.makeup_reason} />}
                            <small className="text-muted tabular-nums">
                              {when(r.held_at)}{r.team_name ? ` · ${r.team_name}` : ""}{r.jobsite_name ? ` · ${r.jobsite_name}` : ""}
                            </small>
                          </span>
                          <span className="flex shrink-0 flex-col items-end gap-1 text-sm tabular-nums">
                            <span>{c.signed}/{c.total} signed</span>
                            <FlagChip n={c.flagged + (r.presenter_signed ? 0 : 1)} />
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
