"use client";

// One saved talk: what was read, where, by whom, and every person's status and signature. Read-only by design.
import { useEffect, useState, useSyncExternalStore } from "react";
import { getRecord } from "@/lib/data/records";
import type { Membership, TalkRecord } from "@/lib/data/types";
import { countStatuses, STATUS_LABEL } from "@/core/attendance";
import { TALKS } from "@/content/talks";
import { LANGUAGES } from "@/core/languages";
import { mapsLink } from "@/core/geo";
import { RequireCompany } from "@/components/Guard";
import { Eyebrow, FlagChip, GroupHeading, Loading, MakeupTag, NavLink, Notice, STATUS_CHIP, Shell, Title } from "@/components/ui";

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

  useEffect(() => {
    if (!id) return;
    let live = true;
    getRecord(m.company.id, id)
      .then((r) => live && setRec(r))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [m.company.id, id]);

  const nav = <NavLink href="/records/">Records</NavLink>;
  if (error) return <Shell nav={nav}><Notice tone="error">Couldn&apos;t load this record: {error}</Notice></Shell>;
  if (!id || rec === null) return <Shell nav={nav}><Notice tone="error">That record wasn&apos;t found in this company.</Notice></Shell>;
  if (rec === undefined) return <Shell nav={nav}><Loading /></Shell>;

  const c = countStatuses(rec.attendees);
  const flagged = c.flagged + (rec.presenter_signature ? 0 : 1);
  const scheduled = rec.scheduled_talk_id && rec.scheduled_talk_id !== rec.talk_id ? TALKS.find((t) => t.id === rec.scheduled_talk_id)?.content.en.title : null;
  const when = new Date(rec.held_at).toLocaleString([], { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const time = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "");
  const details: [string, string][] = [
    ["When", when],
    ["Where", rec.jobsite_name || "Not set"],
    ["Team", rec.team_name ? `${rec.team_name}${rec.team_lead_name ? ` (lead: ${rec.team_lead_name})` : ""}` : "Not set"],
    ["Presented by", `${rec.presenter_name}${rec.presenter_role ? `, ${rec.presenter_role}` : ""}`],
    ["Language", LANGUAGES.find((l) => l.id === rec.language)?.label ?? rec.language],
  ];

  return (
    <Shell nav={nav}>
      <Eyebrow>
        {rec.week_number ? `${rec.makeup_for_week ? "Given in week" : "Week"} ${rec.week_number} of 52 · ` : ""}{rec.makeup_for_week ? "Makeup talk" : rec.scheduled_talk_id ? (scheduled ? "Different from the plan" : "Scheduled talk") : "Talk record"}
      </Eyebrow>
      <Title>{rec.title}</Title>
      {rec.makeup_for_week && <MakeupTag weekStart={rec.makeup_for_week} reason={rec.makeup_reason} />}
      {scheduled && !rec.makeup_for_week && <p className="mt-1 text-sm text-muted">Scheduled for that week: {scheduled}</p>}

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {details.map(([k, v]) => (
          <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="font-bold">{v}</dd></div>
        ))}
        {rec.latitude != null && rec.longitude != null && (
          <div className="contents"><dt className="text-muted">Location</dt><dd><a className="font-bold underline" target="_blank" rel="noreferrer" href={mapsLink({ latitude: rec.latitude, longitude: rec.longitude })}>Open in Maps</a></dd></div>
        )}
      </dl>

      <div className={`mt-4 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 text-sm tabular-nums ${flagged ? "border-warn bg-warn-bg" : "border-ok bg-surface"}`}>
        <span><b>{c.signed}</b> signed · <b>{c.not_signed}</b> not signed · <b>{c.absent}</b> absent</span>
        <span className="ml-auto"><FlagChip n={flagged} /></span>
      </div>

      <GroupHeading>Sign-in sheet</GroupHeading>
      <ul className="mt-3 flex flex-col gap-2">
        {rec.attendees.map((a, i) => (
          <li key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${a.status === "signed" ? "border-line bg-surface" : "border-warn bg-warn-bg"}`}>
            <span className="min-w-0 flex-1">
              <b className="block">{a.name}</b>
              <small className="text-muted">{[a.role, a.team_name].filter(Boolean).join(" · ")}{a.signed_at ? ` · ${time(a.signed_at)}` : ""}</small>
            </span>
            {a.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.signature} alt={`Signature of ${a.name}`} className="h-12 w-32 rounded bg-white object-contain" />
            ) : (
              <span className={`rounded px-2 py-0.5 font-display text-xs font-bold uppercase ${STATUS_CHIP[a.status]}`}>{STATUS_LABEL[a.status]}</span>
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
          <span className={`rounded px-2 py-0.5 font-display text-xs font-bold uppercase ${STATUS_CHIP.not_signed}`}>Not signed</span>
        )}
      </div>

      <GroupHeading>What was covered</GroupHeading>
      <div className="mt-3 rounded-lg border border-line bg-surface p-4 text-sm">
        <p className="font-bold">{rec.content.hook}</p>
        {rec.content.sections.map((s) => (
          <div key={s.heading} className="mt-3">
            <h3 className="font-display font-bold uppercase tracking-wide">{s.heading}</h3>
            <ul className="mt-1 list-disc pl-5">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
        <p className="mt-3"><b>Crew question:</b> {rec.content.ask}</p>
      </div>

      <p className="mt-6 text-xs text-muted">Records can&apos;t be edited. This documents a safety meeting; it does not by itself certify OSHA compliance.</p>
    </Shell>
  );
}
