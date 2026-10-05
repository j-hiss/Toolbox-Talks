"use client";

// Saved talks for the current company, newest first, plus any still waiting on this phone to upload.
import { useEffect, useState } from "react";
import Link from "next/link";
import { listRecords } from "@/lib/data/records";
import type { Membership, TalkRecordSummary } from "@/lib/data/types";
import { countStatuses } from "@/core/attendance";
import { useOutbox } from "@/lib/useOutbox";
import { RequireCompany } from "@/components/Guard";
import { Button, Eyebrow, FlagChip, GroupHeading, Loading, NavLink, Notice, Shell, Title } from "@/components/ui";

export default function RecordsPage() {
  return <RequireCompany>{(m) => <Records m={m} />}</RequireCompany>;
}

const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Records({ m }: { m: Membership }) {
  const [rows, setRows] = useState<TalkRecordSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const outbox = useOutbox(m.company.id);
  const waitingCount = outbox.items.length;

  useEffect(() => {
    let live = true;
    listRecords(m.company.id)
      .then((r) => live && setRows(r))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [m.company.id, waitingCount]); // reload after waiting talks upload

  return (
    <Shell nav={<NavLink href="/">Home</NavLink>}>
      <Eyebrow>{m.company.name}</Eyebrow>
      <Title>Records</Title>

      {outbox.items.length > 0 && (
        <>
          <GroupHeading aside={`${outbox.items.length}`}>Waiting to upload</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {outbox.items.map((i) => {
              const c = countStatuses(i.attendees);
              return (
                <li key={i.record.client_id} className="rounded-lg border border-dashed border-line bg-surface p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span><b className="block">{i.record.content.title}</b><small className="text-muted">{when(i.record.held_at)} · saved on this phone</small></span>
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
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map((r) => {
            const c = countStatuses(r.statuses.map((status) => ({ status })));
            return (
              <li key={r.id}>
                <Link href={`/record/#${r.id}`} className="flex items-start justify-between gap-3 rounded-lg border border-line bg-surface p-3 hover:border-hivis">
                  <span className="min-w-0">
                    <b className="block">{r.title}</b>
                    <small className="text-muted tabular-nums">
                      {r.week_number ? `Week ${r.week_number} · ` : ""}{when(r.held_at)}{r.team_name ? ` · ${r.team_name}` : ""}{r.jobsite_name ? ` · ${r.jobsite_name}` : ""}
                    </small>
                  </span>
                  <span className="flex flex-col items-end gap-1 text-sm tabular-nums">
                    <span>{c.signed}/{c.total} signed</span>
                    <FlagChip n={c.flagged + (r.presenter_signed ? 0 : 1)} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
