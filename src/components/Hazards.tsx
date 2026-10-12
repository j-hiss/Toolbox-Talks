"use client";

// Crew hazard and near-miss reports (migration 0055): the form (Home, the employee's Home, and the jobsite sticker
// page), the reporter's own list, and the office's list with review. Rules: src/core/hazards.ts.
// Data: src/lib/data/hazards.ts. Sent from the app, a report goes onto the phone first (src/lib/hazardOutbox.ts).
import { useCallback, useEffect, useState } from "react";
import { HAZARD_KINDS, HAZARD_NAME_MAX, HAZARD_WHAT_MAX, HAZARD_WHERE_MAX, hazardCounts, hazardKindName, hazardProblem, reporterLabel, sortHazards, type HazardDraft, type HazardReport } from "@/core/hazards";
import { hazardPhoto, listHazards, reportHazard, reviewHazard } from "@/lib/data/hazards";
import { hazardQueue } from "@/lib/hazardOutbox";
import { listJobsites } from "@/lib/data/company";
import { shrinkPhoto } from "@/lib/photo";
import { isoDay, addDays } from "@/core/weeks";
import type { Jobsite, Person } from "@/lib/data/types";
import { Button, Field, FileButton, GroupHeading, Loading, Notice, Sheet, inputClass, segmentClass, segmentedClass } from "./ui";
import { toast } from "./toast";

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

export type HazardFormResult = HazardDraft & { photo: string | null; name: string };

/** The one report form. `askName`: the sticker page (no account) asks for an optional name instead of "leave my name off". */
export function HazardForm({ jobsites = [], askName = false, busy = false, onSend }: {
  jobsites?: Pick<Jobsite, "id" | "name">[]; askName?: boolean; busy?: boolean; onSend: (r: HazardFormResult) => Promise<void>;
}) {
  const blank = { kind: "hazard" as const, what: "", where: "", jobsiteId: null, anonymous: false };
  const [d, setD] = useState<HazardDraft>(blank);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const send = async () => {
    const p = hazardProblem(d); if (p) { setMsg(p); return; }
    setMsg(null);
    try {
      await onSend({ ...d, anonymous: askName ? !name.trim() : d.anonymous, photo, name: name.trim() });
      setD(blank); setPhoto(null); setPhotoName(null); setName("");
    } catch (e) { setMsg(errText(e)); }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className={`${segmentedClass} grid-cols-2`} role="radiogroup" aria-label="What are you reporting">
        {HAZARD_KINDS.map((k) => (
          <button key={k.id} type="button" role="radio" aria-checked={d.kind === k.id} className={segmentClass(d.kind === k.id)} onClick={() => setD({ ...d, kind: k.id })}>{k.name}</button>
        ))}
      </div>
      <p className="text-xs text-muted">{HAZARD_KINDS.find((k) => k.id === d.kind)?.hint}</p>
      <Field label={d.kind === "near_miss" ? "What happened" : "What did you see"} id="hz-what">
        <textarea id="hz-what" rows={4} maxLength={HAZARD_WHAT_MAX} className={inputClass} value={d.what} onChange={(e) => setD({ ...d, what: e.target.value })}
          placeholder={d.kind === "near_miss" ? "Example: a bundle slid off the roof edge near the driveway" : "Example: open hole by the north ladder, no cover"} />
      </Field>
      {jobsites.length > 0 && (
        <Field label="Jobsite" id="hz-site">
          <select id="hz-site" className={inputClass} value={d.jobsiteId ?? ""} onChange={(e) => setD({ ...d, jobsiteId: e.target.value || null })}>
            <option value="">Not at a jobsite / not listed</option>
            {jobsites.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
          </select>
        </Field>
      )}
      <Field label="Where exactly (optional)" id="hz-where"><input id="hz-where" maxLength={HAZARD_WHERE_MAX} className={inputClass} value={d.where} onChange={(e) => setD({ ...d, where: e.target.value })} placeholder="Example: back stairs, second floor" /></Field>
      <FileButton label={photoName ? "Change the photo" : "Add a photo (optional)"} accept="image/*" chosen={photoName} disabled={busy} onFile={async (f) => {
        if (!f) { setPhoto(null); setPhotoName(null); return; }
        try { setPhoto(await shrinkPhoto(f)); setPhotoName(f.name); } catch (e) { setMsg(errText(e)); }
      }} />
      {askName
        ? <Field label="Your name (optional)" id="hz-name" hint="leave blank to send it with no name"><input id="hz-name" maxLength={HAZARD_NAME_MAX} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        : <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={d.anonymous} onChange={(e) => setD({ ...d, anonymous: e.target.checked })} /> Leave my name off (nothing about who sent it is kept)</label>}
      <Button disabled={busy} onClick={send}>{busy ? "Sending…" : "Send report"}</Button>
      {msg && <Notice tone="error">{msg}</Notice>}
    </div>
  );
}

/** Home's "Report a hazard" button and sheet, for anyone signed in to the company. Saves on the phone first. */
export function ReportHazard({ companyId, userId }: { companyId: string; userId: string | null }) {
  const [open, setOpen] = useState(false);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [waiting, setWaiting] = useState(() => hazardQueue.waiting(userId, (h) => h.companyId === companyId).length);
  const [mine, setMine] = useState<HazardReport[]>([]);
  const flush = useCallback(async () => {
    const r = await hazardQueue.flush(userId, (h) => reportHazard(h.companyId!, h));
    setWaiting(hazardQueue.waiting(userId, (h) => h.companyId === companyId).length);
    return r;
  }, [userId, companyId]);
  useEffect(() => {
    const off = hazardQueue.onChange(() => setWaiting(hazardQueue.waiting(userId, (h) => h.companyId === companyId).length));
    const first = setTimeout(() => { void flush(); }, 0);
    const online = () => { void flush(); };
    window.addEventListener("online", online);
    return () => { off(); clearTimeout(first); window.removeEventListener("online", online); };
  }, [flush, userId, companyId]);
  useEffect(() => { if (open) listHazards(companyId).then(setMine).catch(() => setMine([])); }, [open, companyId, waiting]);
  // Staff pick from the company's jobsites; an employee account can't read them and types the place instead.
  useEffect(() => { if (open) listJobsites(companyId).then(setJobsites).catch(() => setJobsites([])); }, [open, companyId]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left shadow-card">
        <span><b className="block">Report a hazard or near miss</b><small className="text-muted">Anyone can, any time. Add a photo. Your name is optional.</small></span>
        <span aria-hidden className="text-xl">›</span>
      </button>
      {waiting > 0 && <p className="mt-1 text-xs text-muted">{waiting === 1 ? "1 report is" : `${waiting} reports are`} saved on this phone, sending when there&apos;s signal.</p>}
      <Sheet title="Report a hazard" open={open} onClose={() => setOpen(false)}>
        <HazardForm jobsites={jobsites} onSend={async (r) => {
          const item = { ...r, clientId: crypto.randomUUID(), companyId };
          hazardQueue.add(item.clientId, userId, item);
          const res = await flush();
          toast(res.sent ? "Sent. Thank you: the office will see it." : "Saved on this phone. It sends when there's signal.");
        }} />
        {mine.filter((h) => !h.anonymous).length > 0 && (
          <>
            <GroupHeading>Your reports</GroupHeading>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {mine.filter((h) => !h.anonymous).slice(0, 10).map((h) => (
                <li key={h.id} className="rounded-lg bg-surface p-3 shadow-card">
                  <b>{hazardKindName(h.kind)}</b> <small className="text-muted">· {when(h.created_at)}</small>
                  <p className="mt-1">{h.what}</p>
                  <p className="mt-1 text-xs text-muted">{h.reviewed_at ? `Done: ${h.action}` : "Waiting for the office to review"}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </Sheet>
    </>
  );
}

/** Records → Crew reports: owners, admins and office see every report and write what was done. */
export function HazardList({ companyId, people }: { companyId: string; people: Person[] }) {
  const [rows, setRows] = useState<HazardReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<HazardReport | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    listHazards(companyId).then((r) => live && setRows(r)).catch((e) => live && setError(errText(e)));
    return () => { live = false; };
  }, [companyId, tick]);
  if (error) return <div className="mt-3"><Notice tone="error">Couldn&apos;t load reports: {error}</Notice></div>;
  if (!rows) return <Loading />;
  const c = hazardCounts(rows, addDays(new Date(), -7).toISOString());
  return (
    <section aria-label="Crew reports" className="mt-3">
      <p className="text-sm text-muted">Hazards and near misses anyone sent from the app or a jobsite sticker. Each stays &quot;New&quot; until someone writes what was done. Reports never change and aren&apos;t deleted.</p>
      <p className="mt-2 text-sm tabular-nums"><b className={c.waiting ? "text-warn-text" : ""}>{c.waiting}</b> waiting for review · <b>{c.newSince}</b> in the last 7 days ({c.nearMissSince} near {c.nearMissSince === 1 ? "miss" : "misses"})</p>
      <ul aria-label="Crew reports list" className="mt-2 flex flex-col gap-2">
        {sortHazards(rows).map((h) => (
          <li key={h.id}>
            <button type="button" onClick={() => setOpen(h)} className={`w-full rounded-xl p-3 text-left text-sm ${h.reviewed_at ? "border border-line" : "bg-surface shadow-card"}`} aria-label={`Open report: ${h.what.slice(0, 40)}`}>
              <span className="flex items-baseline justify-between gap-2">
                <b>{hazardKindName(h.kind)}{h.jobsite_name ? ` · ${h.jobsite_name}` : ""}</b>
                <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${h.reviewed_at ? "bg-ok-bg text-ok-text" : "bg-caution-bg text-caution-text"}`}>{h.reviewed_at ? "Reviewed" : "New"}</span>
              </span>
              <span className="mt-1 block line-clamp-2">{h.what}</span>
              <small className="mt-1 block text-muted">{when(h.created_at)} · {reporterLabel(h)}{h.has_photo ? " · photo" : ""}</small>
            </button>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="mt-3 text-sm text-muted">No reports yet. Anyone can send one from Home, or by scanning a jobsite sticker.</p>}
      {open && <ReviewSheet companyId={companyId} report={open} people={people} onClose={() => setOpen(null)} onDone={() => { setOpen(null); setTick((t) => t + 1); }} />}
    </section>
  );
}

function ReviewSheet({ companyId, report: h, people, onClose, onDone }: { companyId: string; report: HazardReport; people: Person[]; onClose: () => void; onDone: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [addIssue, setAddIssue] = useState(h.kind === "hazard");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState(isoDay(addDays(new Date(), 7)));
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (h.has_photo) hazardPhoto(companyId, h.id).then(setPhoto).catch(() => setPhoto(null)); }, [companyId, h.id, h.has_photo]);
  const save = async () => {
    if (!action.trim()) { toast("Say what was done.", { tone: "error" }); return; }
    setBusy(true);
    try {
      await reviewHazard(companyId, h.id, action, addIssue ? { ownerPersonId: owner || null, due: due || null } : null);
      toast(addIssue ? "Reviewed and added to the issues list." : "Reviewed."); onDone();
    } catch (e) { toast(errText(e), { tone: "error" }); }
    setBusy(false);
  };
  return (
    <Sheet title={hazardKindName(h.kind)} open onClose={onClose}>
      <p className="text-sm text-muted">{when(h.created_at)} · {reporterLabel(h)}{h.jobsite_name ? ` · ${h.jobsite_name}` : ""}{h.where_text ? ` · ${h.where_text}` : ""}</p>
      <p className="mt-3 whitespace-pre-line">{h.what}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {photo && <img src={photo} alt="Photo sent with the report" className="mt-3 max-h-80 w-full rounded-lg object-contain" />}
      {h.reviewed_at ? (
        <div className="mt-4"><Notice tone="ok">Reviewed {when(h.reviewed_at)}: {h.action}</Notice></div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <Field label="What was done" id="hz-action"><textarea id="hz-action" rows={3} maxLength={1000} className={inputClass} value={action} onChange={(e) => setAction(e.target.value)} placeholder="Example: covered the hole and talked to the crew" /></Field>
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={addIssue} onChange={(e) => setAddIssue(e.target.checked)} /> Also put it on the issues list to fix</label>
          {addIssue && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Who fixes it" id="hz-owner"><select id="hz-owner" className={inputClass} value={owner} onChange={(e) => setOwner(e.target.value)}><option value="">No one yet</option>{people.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select></Field>
              <Field label="Fix by" id="hz-due"><input id="hz-due" type="date" className={inputClass} value={due} onChange={(e) => setDue(e.target.value)} /></Field>
            </div>
          )}
          <Button disabled={busy} onClick={save}>{busy ? "Saving…" : "Mark reviewed"}</Button>
          <p className="text-xs text-muted">The review is written once. A reporter who gave their name sees what was done.</p>
        </div>
      )}
    </Sheet>
  );
}
