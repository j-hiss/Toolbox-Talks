"use client";

// One saved talk: what was read, where, by whom, and every person's status and signature. Read-only by design.
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getRecord } from "@/lib/data/records";
import { saveFile } from "@/lib/download";
import { listIssuesForRecord } from "@/lib/data/issues";
import type { Issue } from "@/lib/data/types";
import { HEAT_LABEL, type HeatLevel } from "@/core/heat";
import { isOverdue } from "@/components/Issues";
import type { Membership, TalkRecord } from "@/lib/data/types";
import { countStatuses, signedSummary, STATUS_LABEL } from "@/core/attendance";
import { TALKS } from "@/content/talks";
import { LANGUAGES } from "@/core/languages";
import { mapsLink } from "@/core/geo";
import { weekNumbers } from "@/core/plan";
import { RequireCompany } from "@/components/Guard";
import { Button, ErrorNotice, Eyebrow, FlagChip, GroupHeading, Loading, MakeupTag, NavLink, Notice, STATUS_CHIP, Shell, Title } from "@/components/ui";

export default function RecordPage() {
  return <RequireCompany>{(m) => <RecordView m={m} />}</RequireCompany>;
}

// The record id lives in the URL hash (/record/#<id>) so this works as a static page.
const subscribe = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
const useHashId = () => useSyncExternalStore(subscribe, () => window.location.hash.slice(1), () => "");

function RecordView({ m }: { m: Membership }) {
  const id = useHashId();
  const [rec, setRec] = useState<TalkRecord | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pdf, setPdf] = useState<{ busy: boolean; msg: string | null }>({ busy: false, msg: null });

  useEffect(() => {
    if (!id) return;
    let live = true;
    getRecord(m.company.id, id)
      .then((r) => live && setRec(r))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    listIssuesForRecord(m.company.id, id)
      .then((i) => live && setIssues(i))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [m.company.id, id]);

  const nav = <NavLink href="/records/">Records</NavLink>;
  if (error) return <Shell nav={nav}><ErrorNotice what="Couldn't load this record." detail={error} onRetry={() => location.reload()} /></Shell>;
  if (!id || rec === null) return <Shell nav={nav}><Notice tone="error">That record wasn&apos;t found in this company.</Notice></Shell>;
  if (rec === undefined) return <Shell nav={nav}><Loading /></Shell>;

  const downloadPdf = async () => {
    setPdf({ busy: true, msg: null });
    try {
      const { buildRecordPdf, pdfFileName } = await import("@/lib/pdf"); // loaded only when needed
      const result = await saveFile(pdfFileName(rec), buildRecordPdf(rec, m.company, issues).output("blob"));
      setPdf({ busy: false, msg: result === "canceled" ? "Canceled." : null });
    } catch (e) {
      setPdf({ busy: false, msg: e instanceof Error ? e.message : String(e) });
    }
  };

  const c = countStatuses(rec.attendees);
  const flagged = c.flagged + (rec.presenter_signature ? 0 : 1);
  const scheduled = rec.scheduled_talk_id && rec.scheduled_talk_id !== rec.talk_id ? TALKS.find((t) => t.id === rec.scheduled_talk_id)?.content.en.title : null;
  const when = new Date(rec.held_at).toLocaleString([], { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const time = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "");
  const details: [string, string][] = [
    ["When", when],
    ["Where", rec.jobsite_name || "Not set"],
    ["Crew", rec.team_name ? `${rec.team_name}${rec.team_lead_name ? ` (lead: ${rec.team_lead_name})` : ""}` : "Not set"],
    ["Presented by", `${rec.presenter_name}${rec.presenter_role ? `, ${rec.presenter_role}` : ""}`],
    ["Language", LANGUAGES.find((l) => l.id === rec.language)?.label ?? rec.language],
  ];

  return (
    <Shell nav={nav}>
      <Eyebrow>
        {rec.week_number ? `${rec.makeup_for_week ? "Given in " : ""}${weekNumbers({ n: rec.week_number, weeks: rec.period_weeks ?? 1 })} of 52 · ` : ""}{rec.kind === "daily" ? "Daily pre-task plan · separate from the weekly talk" : rec.makeup_for_week ? "Makeup talk" : rec.scheduled_talk_id ? (scheduled ? "Different from the plan" : "Scheduled talk") : "Talk record"}
      </Eyebrow>
      <Title>{rec.title}</Title>
      {rec.makeup_for_week && <MakeupTag weekStart={rec.makeup_for_week} reason={rec.makeup_reason} />}
      {scheduled && !rec.makeup_for_week && <p className="mt-1 text-sm text-muted">Scheduled for that week: {scheduled}</p>}

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {details.map(([k, v]) => (
          <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
        ))}
        {rec.latitude != null && rec.longitude != null && (
          <div className="contents"><dt className="text-muted">Location</dt><dd><a className="font-semibold text-brand-text underline underline-offset-2" target="_blank" rel="noreferrer" href={mapsLink({ latitude: rec.latitude, longitude: rec.longitude })}>Open in Maps</a></dd></div>
        )}
      </dl>

      <div className={`mt-4 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 text-sm tabular-nums ${flagged ? "border-warn bg-warn-bg" : "border-ok bg-surface"}`}>
        <span><b>{signedSummary(c)}</b> · {rec.presenter_signature ? "presenter signed" : "presenter not signed"}</span>
        <span className="ml-auto"><FlagChip n={flagged} /></span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={downloadPdf} disabled={pdf.busy}>{pdf.busy ? "Building PDF…" : "Download PDF"}</Button>
        {pdf.msg && <span className="text-sm text-muted" role="status">{pdf.msg}</span>}
      </div>

      <GroupHeading>Sign-in sheet</GroupHeading>
      <ul className="mt-3 flex flex-col gap-2">
        {rec.attendees.map((a, i) => (
          <li key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${a.status === "signed" ? "border-line bg-surface" : "border-warn bg-warn-bg"}`}>
            <span className="min-w-0 flex-1">
              <b className="block">{a.name}</b>
              <small className="text-muted">{[a.role, a.team_name, a.company_name].filter(Boolean).join(" · ")}{a.signed_at ? ` · ${time(a.signed_at)}` : ""}</small>
            </span>
            {a.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.signature} alt={`Signature of ${a.name}`} className="h-12 w-32 rounded bg-white object-contain" />
            ) : (
              <span className={`rounded px-2 py-0.5 font-display text-xs font-semibold ${STATUS_CHIP[a.status]}`}>{STATUS_LABEL[a.status]}</span>
            )}
          </li>
        ))}
      </ul>

      <GroupHeading>Talk delivered by</GroupHeading>
      <div className={`mt-3 flex items-center gap-3 rounded-lg border p-3 ${rec.presenter_signature ? "border-line bg-surface" : "border-warn bg-warn-bg"}`}>
        <span className="min-w-0 flex-1"><b className="block">{rec.presenter_name}</b><small className="text-muted">{rec.presenter_role}{rec.presenter_signed_at ? ` · ${time(rec.presenter_signed_at)}` : ""}</small></span>
        {rec.presenter_signature ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={rec.presenter_signature} alt={`Signature of ${rec.presenter_name}`} className="h-12 w-32 rounded bg-white object-contain" />
        ) : (
          <span className={`rounded px-2 py-0.5 font-display text-xs font-semibold ${STATUS_CHIP.not_signed}`}>Not signed</span>
        )}
      </div>

      {rec.photo && (
        <>
          <GroupHeading aside={rec.photo_taken_at ? time(rec.photo_taken_at) : undefined}>Crew photo</GroupHeading>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rec.photo} alt="Crew photo taken at this talk" className="mt-3 max-h-96 w-full rounded-xl object-cover" />
        </>
      )}
      {rec.sheet && (
        <>
          <GroupHeading aside={rec.sheet_taken_at ? time(rec.sheet_taken_at) : undefined}>Paper sign-in sheet</GroupHeading>
          <p className="mt-1 px-1 text-sm text-muted">A photo kept as evidence. The statuses above come from signatures on the phone; this sheet doesn&apos;t change them.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rec.sheet} alt="Paper sign-in sheet for this talk" className="mt-3 w-full rounded-xl bg-white object-contain" />
        </>
      )}

      {rec.content.since_last && (
        <>
          <GroupHeading>Since last talk</GroupHeading>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {rec.content.since_last.status === "unavailable" && <p className="text-muted">The safety log couldn&apos;t be loaded when this talk was given.</p>}
            {rec.content.since_last.status !== "unavailable" && rec.content.since_last.items.length === 0 && <p className="text-muted">No new inspections, citations, incidents or near misses logged.</p>}
            {rec.content.since_last.items.map((it) => (
              <div key={it.event_id} className="rounded-xl bg-surface px-3 py-2">
                <small className="block font-semibold text-muted">{it.heading}</small>
                <p>{it.text}</p>
                <small className="text-muted">Reviewed with the crew {new Date(it.reviewed_with_crew_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</small>
              </div>
            ))}
          </div>
        </>
      )}

      {(rec.site_notes || rec.heat || issues.length > 0) && (
        <>
          <GroupHeading>On site</GroupHeading>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {rec.site_notes && <p className="rounded-r border-l-4 border-fg bg-surface px-3 py-2"><b>Today on this site:</b> {rec.site_notes}</p>}
            {rec.heat && (
              <p className="rounded-xl bg-surface px-3 py-2">
                <b>Heat index up to {rec.heat.max_heat_index_f}°F</b> ({HEAT_LABEL[rec.heat.level as HeatLevel] ?? rec.heat.level}){rec.heat.reminder_read ? " · heat reminder read with this talk" : ""}
              </p>
            )}
            {issues.length > 0 && (
              <div className="rounded-xl bg-surface px-3 py-2">
                <b>Raised by the crew ({issues.length})</b>
                <ul className="mt-1 flex flex-col gap-1">
                  {issues.map((i) => (
                    <li key={i.id}>
                      <Link href="/records/#issues" className="underline-offset-2 hover:underline">{i.description}</Link>
                      <small className={`block ${isOverdue(i) ? "font-semibold text-warn-text" : "text-muted"}`}>
                        {i.owner_name || "No owner"}{i.status === "fixed" ? " · fixed" : i.due_date ? ` · fix by ${i.due_date}${isOverdue(i) ? " (overdue)" : ""}` : ""}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <GroupHeading>What was covered</GroupHeading>
      <div className="mt-3 rounded-xl bg-surface p-4 text-sm">
        <p className="font-semibold">{rec.content.hook}</p>
        {rec.content.sections.map((s) => (
          <div key={s.heading} className="mt-3">
            <h3 className="font-display font-semibold">{s.heading}</h3>
            <ul className="mt-1 list-disc pl-5">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
        <p className="mt-3"><b>Crew question:</b> {rec.content.ask}</p>
      </div>

      <p className="mt-6 text-xs text-muted">Records can&apos;t be edited. This documents a safety meeting; it does not by itself certify OSHA compliance.</p>
    </Shell>
  );
}
