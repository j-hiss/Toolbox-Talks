"use client";

// Reports → Safety profile: the company's own summary of its safety program, built from its signed records, and the
// two PDFs it can hand to its agent or carrier (12-month renewal packet, monthly summary). Company first: nothing here
// is shared with anyone; the company downloads and sends it when it chooses. Math: src/core/profile.ts. PDF:
// buildProfilePdf in src/lib/pdf.ts. Self-reported pieces (EMR, documents): src/lib/data/profile.ts.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildCompliance, type ReportPerson, type ReportRecord } from "@/core/compliance";
import { periodKeys } from "@/core/makeup";
import { buildProfile, profileRange, DOCUMENT_KINDS, type DocumentKind, type EmrEntry, type ProfileEvent, type ProfileIssue, type ProfileRecord } from "@/core/profile";
import { climateFor } from "@/core/climate";
import { isoDay, mondayOf, parseDay, weekLabel } from "@/core/weeks";
import { LANGUAGES } from "@/core/languages";
import { reportPeople, reportRecords, listDailyPlans } from "@/lib/data/reports";
import { listRecords } from "@/lib/data/records";
import { listEvents } from "@/lib/data/safety";
import { listIssues } from "@/lib/data/issues";
import { addEmr, documentUrl, listDocuments, listEmr, uploadDocument, type StoredDocument } from "@/lib/data/profile";
import type { Membership } from "@/lib/data/types";
import { usePlan } from "@/lib/usePlan";
import { saveFile } from "@/lib/download";
import { RequireCompany } from "@/components/Guard";
import { Button, ErrorNotice, Eyebrow, Field, FileButton, GroupHeading, Loading, Notice, Shell, Title, inputClass } from "@/components/ui";

export default function ProfilePage() {
  return <RequireCompany admin>{(m) => <Profile m={m} />}</RequireCompany>;
}

type RangeId = "year" | "month" | "custom";
type Data = {
  people: ReportPerson[]; reportRecs: ReportRecord[]; records: ProfileRecord[]; daily: { held_at: string }[];
  events: ProfileEvent[]; issues: ProfileIssue[]; emr: EmrEntry[]; documents: StoredDocument[];
};
const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);
const fmtDay = (iso: string) => parseDay(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const fmtMonth = (ym: string) => parseDay(`${ym}-01`).toLocaleDateString(undefined, { month: "short", year: "numeric" });
const STATUS = { records: "Shown by app records", some: "Partly shown", outside: "Outside the app" } as const;
const STATUS_TONE = { records: "text-ok", some: "text-caution", outside: "text-muted" } as const;

function Profile({ m }: { m: Membership }) {
  const co = m.company;
  const { input } = usePlan(co);
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState<RangeId>("year");
  const [custom, setCustom] = useState(() => profileRange("year", today));
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reload = () => setTick((t) => t + 1);

  const programStart = isoDay(mondayOf(parseDay(co.program_start)));
  const { from, to } = range === "custom" ? custom : profileRange(range, today);
  const keys = useMemo(() => periodKeys(input, from < programStart ? programStart : from, today), [input, from, programStart, today]);
  const fetchFrom = keys.at(-1)?.key ?? from;

  useEffect(() => {
    let live = true;
    Promise.all([reportPeople(co.id), reportRecords(co.id, fetchFrom), listRecords(co.id, 1000), listDailyPlans(co.id, from), listEvents(co.id), listIssues(co.id), listEmr(co.id), listDocuments(co.id)])
      .then(([people, reportRecs, recs, daily, events, issues, emr, documents]) => live && setData({
        people, reportRecs, daily, events, issues, emr, documents,
        records: recs.map((r) => ({ id: r.id, talk_id: r.talk_id, language: r.language, held_at: r.held_at, makeup_for_week: r.makeup_for_week, kind: r.kind })),
      }))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [co.id, from, fetchFrom, tick]);

  const profile = useMemo(() => {
    if (!data) return null;
    const compliance = buildCompliance({ people: data.people, records: data.reportRecs, weeks: keys, makeupWeeks: co.makeup_weeks ?? 4, today });
    return buildProfile({ compliance, records: data.records, daily: data.daily, events: data.events, issues: data.issues, emr: data.emr, documents: data.documents, from, to, today });
  }, [data, keys, co.makeup_weeks, today, from, to]);

  if (error) return <Shell><ErrorNotice what="Couldn't load the safety profile." detail={error} onRetry={() => { setError(null); reload(); }} /></Shell>;
  if (!data || !profile) return <Shell><Loading /></Shell>;

  const p = profile;
  const crew = data.people.filter((x) => !x.deactivatedAt).length;
  const florida = climateFor(co.zip).state === "FL";
  const lang = (id: string) => LANGUAGES.find((l) => l.id === id)?.label ?? id;

  return (
    <Shell>
      <Eyebrow>Reports · {co.name}</Eyebrow>
      <Title>Safety profile</Title>
      <p className="mt-1 text-sm text-muted">Your safety program, counted from your own signed records. It stays private to your company until you download it and send it to your agent or carrier.</p>
      <p className="mt-2"><Link href="/reports/" className="text-sm font-semibold underline">← Back to reports</Link></p>

      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-line" role="group" aria-label="Profile range">
        {([["year", "Last 12 months"], ["month", "Last month"], ["custom", "Pick dates"]] as const).map(([id, label]) => (
          <button key={id} aria-pressed={range === id} onClick={() => setRange(id)}
            className={`min-h-11 px-2 text-sm font-semibold ${range === id ? "bg-brand text-brand-ink" : "bg-surface"}`}>{label}</button>
        ))}
      </div>
      {range === "custom" && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Field label="From" id="pf-from"><input id="pf-from" type="date" className={inputClass} value={custom.from} max={custom.to} onChange={(e) => e.target.value && setCustom((c) => ({ ...c, from: e.target.value }))} /></Field>
          <Field label="To" id="pf-to"><input id="pf-to" type="date" className={inputClass} value={custom.to} min={custom.from} max={isoDay(today)} onChange={(e) => e.target.value && setCustom((c) => ({ ...c, to: e.target.value }))} /></Field>
        </div>
      )}
      <p className="mt-2 text-sm text-muted tabular-nums">{fmtDay(p.from)} to {fmtDay(p.to)} · {crew} on the crew roster</p>

      <Downloads p={p} co={co} florida={florida} crew={crew} />

      <GroupHeading>What the records show</GroupHeading>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Fig label="Weekly talks held" value={p.periodsEnded ? `${p.periodsWithTalk} of ${p.periodsEnded}` : "–"} note={p.periodsMissed ? `${p.periodsMissed} with no talk` : p.periodsEnded ? "no missed weeks" : "no full weeks yet"} warn={p.periodsMissed > 0} />
        <Fig label="Crew sign-in rate" value={pct(p.signIn)} note={p.onTime === null ? "" : `${pct(p.onTime)} on time`} />
        <Fig label="Toolbox talks" value={String(p.talks)} note={`${p.topics} topics${p.makeups ? `, ${p.makeups} makeups` : ""}`} />
        <Fig label="Daily plans" value={String(p.dailyDays)} note="days with a signed plan" />
        <Fig label="Inspections" value={String(p.log.inspections + p.log.walkarounds)} note={`${p.log.walkarounds} walk-arounds`} />
        <Fig label="Issues fixed" value={`${p.issues.fixed} of ${p.issues.raised}`} note={p.issues.medianDaysToFix === null ? "" : `typically ${p.issues.medianDaysToFix} days`} />
      </dl>

      {p.missedKeys.length > 0 && (
        <div className="mt-3"><Notice tone="caution">
          <b>Weeks with no talk recorded ({p.missedKeys.length}):</b> {p.missedKeys.map((k) => weekLabel(parseDay(k))).join(", ")}. These are listed in the PDF too. A makeup talk for a week shows it was covered late.
        </Notice></div>
      )}

      {p.months.length > 0 && (
        <>
          <GroupHeading>Month by month</GroupHeading>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="text-left text-xs uppercase text-muted"><th className="py-1 pr-2">Month</th><th className="pr-2">Weeks held</th><th className="pr-2">Talks</th><th className="pr-2">Sign-in</th><th>On time</th></tr></thead>
              <tbody>
                {p.months.map((r) => (
                  <tr key={r.month} className="border-t border-line">
                    <td className="py-1.5 pr-2">{fmtMonth(r.month)}</td>
                    <td className={`pr-2 ${r.missed ? "font-semibold text-warn" : ""}`}>{r.periods ? `${r.periods - r.missed} of ${r.periods}` : "–"}</td>
                    <td className="pr-2">{r.talks}</td><td className="pr-2">{pct(r.signIn)}</td><td>{pct(r.onTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {p.languages.length > 0 && <p className="mt-2 text-sm text-muted">Talks given in {p.languages.map((l) => `${lang(l.language)} (${l.talks})`).join(", ")}.</p>}

      <GroupHeading>{florida ? "Program elements (Florida, s. 440.1025)" : "Program elements"}</GroupHeading>
      <p className="mt-1 text-sm text-muted">Where your records show each part of a safety program. Your insurer decides whether a program earns a premium credit.</p>
      <ul className="mt-3 flex flex-col gap-2">
        {p.elements.map((e) => (
          <li key={e.id} className="rounded-lg border border-line bg-surface p-3 text-sm">
            <div className="flex items-start justify-between gap-2"><b>{e.name}</b><span className={`shrink-0 text-xs font-semibold ${STATUS_TONE[e.status]}`}>{STATUS[e.status]}</span></div>
            <p className="mt-1 text-muted">{e.evidence}</p>
            {e.id === "policy" && e.status === "outside" && <p className="mt-1 text-xs">Attach your written program below to show it here.</p>}
          </li>
        ))}
      </ul>

      <EmrSection companyId={co.id} emr={p.emr} reload={reload} />
      <DocumentsSection companyId={co.id} docs={data.documents} reload={reload} />
      <p className="mt-6 text-xs text-muted">Counts and rates only. Worker names, signatures, phone numbers and injury details never go in these summaries. This app documents safety meetings; it doesn&apos;t certify compliance.</p>
    </Shell>
  );
}

function Fig({ label, value, note, warn }: { label: string; value: string; note: string; warn?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <dt className="text-xs font-semibold uppercase text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</dd>
      {note && <dd className={`text-xs ${warn ? "font-semibold text-warn" : "text-muted"}`}>{note}</dd>}
    </div>
  );
}

function Downloads({ p, co, florida, crew }: { p: ReturnType<typeof buildProfile>; co: Membership["company"]; florida: boolean; crew: number }) {
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const get = async (kind: "renewal" | "monthly") => {
    setBusy(true); setMsg(null);
    try {
      const { buildProfilePdf, profilePdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(profilePdfFileName(kind, p, co), buildProfilePdf(p, co, { kind, florida, crew }).output("blob"));
      setMsg(res === "canceled" ? null : { tone: "ok", text: kind === "renewal" ? "Renewal packet ready. Send it to your agent or carrier when you choose." : "Monthly summary ready." });
    } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button disabled={busy} onClick={() => get("renewal")}>Download renewal packet (PDF)</Button>
      <Button variant="ghost" disabled={busy} onClick={() => get("monthly")}>Download monthly summary (PDF)</Button>
      <p className="text-xs text-muted">Both use the dates above. The renewal packet is made for the 12 months before your policy renews.</p>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
    </div>
  );
}

function EmrSection({ companyId, emr, reload }: { companyId: string; emr: EmrEntry[]; reload: () => void }) {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const n = Number(value);
  const valid = /^\d{4}$/.test(year) && value !== "" && n > 0 && n < 10;
  const save = async () => {
    setBusy(true); setMsg(null);
    try { await addEmr(companyId, { rating_year: Number(year), emr: Math.round(n * 100) / 100, note: note.trim() }); setValue(""); setNote(""); reload(); setMsg({ tone: "ok", text: "EMR saved. A later entry for the same year replaces it in the summary." }); }
    catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  return (
    <section aria-label="Experience mod" className="mt-6">
      <GroupHeading>Experience mod (EMR)</GroupHeading>
      <p className="mt-1 text-sm text-muted">Optional. Type it from your rating worksheet. It shows as self-reported; the app never calculates it.</p>
      {emr.length > 0 && <p className="mt-2 text-sm tabular-nums">{emr.map((e) => `${e.rating_year}: ${e.emr.toFixed(2)}`).join(" · ")}</p>}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Field label="Rating year" id="emr-year"><input id="emr-year" inputMode="numeric" className={inputClass} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))} /></Field>
        <Field label="EMR" id="emr-value"><input id="emr-value" inputMode="decimal" placeholder="0.85" className={inputClass} value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))} /></Field>
      </div>
      <div className="mt-2"><Field label="Note (optional)" id="emr-note"><input id="emr-note" maxLength={300} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} /></Field></div>
      <Button size="sm" className="mt-2" disabled={busy || !valid} onClick={save}>Save EMR</Button>
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
    </section>
  );
}

function DocumentsSection({ companyId, docs, reload }: { companyId: string; docs: StoredDocument[]; reload: () => void }) {
  const [kind, setKind] = useState<DocumentKind>("safety_program");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const kindName = (k: DocumentKind) => DOCUMENT_KINDS.find((d) => d.id === k)?.name ?? k;
  const save = async () => {
    if (!file) return;
    setBusy(true); setMsg(null);
    try { await uploadDocument(companyId, kind, title.trim() || file.name, file); setFile(null); setTitle(""); reload(); setMsg({ tone: "ok", text: "Document saved to your company's private files." }); }
    catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  const open = async (path: string) => {
    try { window.open(await documentUrl(path), "_blank", "noopener"); } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
  };
  return (
    <section aria-label="Program documents" className="mt-6">
      <GroupHeading aside={docs.length ? `${docs.length}` : undefined}>Program documents</GroupHeading>
      <p className="mt-1 text-sm text-muted">Optional. Your written safety program, EMR worksheet or OSHA 300A summary. Private to your company&apos;s admins; the PDF lists titles only.</p>
      {docs.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
              <span className="min-w-0"><b className="block truncate">{d.title}</b><small className="text-muted">{kindName(d.kind)} · {fmtDay(d.uploaded_at.slice(0, 10))}</small></span>
              <Button size="sm" variant="ghost" onClick={() => open(d.path)}>Open</Button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex flex-col gap-2">
        <select aria-label="Document type" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as DocumentKind)}>
          {DOCUMENT_KINDS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <Field label="Title" id="doc-title"><input id="doc-title" maxLength={200} className={inputClass} placeholder="Safety manual 2026" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <FileButton label="Choose file (PDF or photo)" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} chosen={file?.name} onFile={setFile} />
        <Button size="sm" disabled={busy || !file} onClick={save}>Save document</Button>
      </div>
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
    </section>
  );
}

