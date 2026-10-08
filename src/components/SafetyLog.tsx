"use client";

// Admin → Safety log: record inspections, walk-arounds, citations, incidents and near misses; write the short crew
// summary; approve it for talks; turn findings into crew issues; attach the report. Also the settings for the
// "Since last talk" section read at talks. Rules: src/core/safetylog.ts. Data: src/lib/data/safety.ts.
// Names and medical details belong in Details (admins only), never in the crew summary.
import { useEffect, useMemo, useState } from "react";
import {
  CASE_STATUSES, EVENT_KINDS, WINDOW_NAMES, bulletinHeading, caseStatusName, crewSummaryProblems, kindName, sinceLastHint,
  sinceLastSettings, type CaseStatus, type EventKind, type SinceLastSettings,
} from "@/core/safetylog";
import { isoDay } from "@/core/weeks";
import type { Company, Jobsite, Person, SafetyEvent } from "@/lib/data/types";
import { updateCompany } from "@/lib/data/company";
import { addFinding } from "@/lib/data/issues";
import {
  approveSummary, eventFileUrl, listEventFiles, listEvents, logEvent, updateEvent, uploadEventFile, withdrawEvent, type EventFile,
} from "@/lib/data/safety";
import { useSession } from "@/lib/session";
import { Button, ConfirmButton, Field, GroupHeading, Loading, Notice, inputClass } from "@/components/ui";
import { toast } from "@/components/toast";

type Props = { company: Company; state: string | undefined; jobsites: Jobsite[]; people: Person[] };

/** Kind-specific details worth keeping. Admin-only; never read to crews. */
const KIND_FIELDS: Record<EventKind, { key: string; label: string; placeholder?: string }[]> = {
  inspection: [
    { key: "what", label: "What was inspected", placeholder: "Scaffold, trench, crane, ladders, harnesses, extinguishers…" },
    { key: "by", label: "Inspected by" },
  ],
  walkaround: [
    { key: "by", label: "Done by (management)" },
    { key: "rep", label: "Crew representative", placeholder: "The employee the crew picked" },
  ],
  citation: [
    { key: "agency", label: "Agency", placeholder: "Federal OSHA, or the state plan" },
    { key: "inspection_no", label: "Inspection number" },
    { key: "standard", label: "Standard cited", placeholder: "Like 1926.501(b)(1)" },
    { key: "classification", label: "Classification", placeholder: "Serious, other-than-serious, repeat…" },
    { key: "abatement", label: "Abatement date", placeholder: "YYYY-MM-DD" },
  ],
  incident: [
    { key: "type", label: "Type", placeholder: "Injury, illness, property damage, spill" },
    { key: "cause", label: "Cause found" },
  ],
  near_miss: [{ key: "cause", label: "What almost happened and why" }],
};

export function SafetyLog({ company, state, jobsites, people }: Props) {
  const [events, setEvents] = useState<SafetyEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<EventKind | "all">("all");
  const reload = () => setVersion((v) => v + 1);
  const roster = useMemo(() => people.map((p) => p.full_name), [people]);

  useEffect(() => {
    let live = true;
    listEvents(company.id).then((e) => live && setEvents(e)).catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [company.id, version]);

  const shown = (events ?? []).filter((e) => filter === "all" || e.kind === filter);
  return (
    <>
      <SinceLastSettingsCard company={company} state={state} />
      <div className="mt-5 flex items-center justify-between gap-2">
        <GroupHeading aside={events ? `${events.length}` : undefined}>Safety log</GroupHeading>
        {!adding && <Button size="sm" className="shrink-0" onClick={() => setAdding(true)}>+ Log</Button>}
      </div>
      <p className="mt-1 text-sm text-muted">
        Inspections, walk-arounds, citations, incidents and near misses. Only the crew summary is ever read to crews,
        after you approve it. Keep names and medical details in Details.
      </p>
      {adding && <NewEventForm company={company} jobsites={jobsites} roster={roster} onDone={(saved) => { setAdding(false); if (saved) reload(); }} />}
      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Show">
        {[{ id: "all" as const, name: "All" }, ...EVENT_KINDS].map((k) => (
          <button key={k.id} aria-pressed={filter === k.id} onClick={() => setFilter(k.id)}
            className={`min-h-9 rounded-full border px-3 text-sm font-semibold ${filter === k.id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted"}`}>
            {k.name}
          </button>
        ))}
      </div>
      {!events ? <Loading /> : shown.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing logged yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {shown.map((e) => <EventCard key={e.id} e={e} company={company} roster={roster} people={people} jobsites={jobsites} onChange={reload} />)}
        </ul>
      )}
    </>
  );
}

// Settings ---------------------------------------------------------------------------------------------------------
function SinceLastSettingsCard({ company, state }: { company: Company; state: string | undefined }) {
  const s = useSession();
  const [cfg, setCfg] = useState<SinceLastSettings>(() => sinceLastSettings(company));
  const [busy, setBusy] = useState(false);
  const saved = sinceLastSettings(company);
  const changed = JSON.stringify(cfg) !== JSON.stringify(saved);
  const hint = sinceLastHint(state);
  const save = async () => {
    setBusy(true);
    try {
      await updateCompany(company.id, {
        since_last_enabled: cfg.enabled, since_last_window: cfg.window, since_last_scope: cfg.scope,
        since_last_kinds: cfg.kinds, since_last_open_only: cfg.openOnly,
      });
      await s.refresh();
      toast("Saved");
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), { tone: "error" });
    }
    setBusy(false);
  };
  const toggleKind = (k: EventKind) => setCfg((c) => ({ ...c, kinds: c.kinds.includes(k) ? c.kinds.filter((x) => x !== k) : [...c.kinds, k] }));
  return (
    <section aria-label="Since last talk" className="rounded-lg border border-line bg-surface p-3">
      <h2 className="font-display text-lg font-semibold">Read at talks: &ldquo;Since last talk&rdquo;</h2>
      <p className="text-sm text-muted">Adds approved crew summaries to each talk. The presenter reads each one and checks it off.</p>
      {hint && <p className="mt-2 text-sm"><b>Your state:</b> {hint}</p>}
      <label className="mt-2 flex min-h-11 items-center gap-2 font-semibold">
        <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
        Add it to talks
      </label>
      {cfg.enabled && (
        <div className="mt-2 flex flex-col gap-3">
          <Field id="sl-window" label="What to include">
            <select id="sl-window" className={inputClass} value={cfg.window} onChange={(e) => setCfg({ ...cfg, window: e.target.value as SinceLastSettings["window"] })}>
              {WINDOW_NAMES.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </Field>
          <Field id="sl-scope" label="Which jobsites">
            <select id="sl-scope" className={inputClass} value={cfg.scope} onChange={(e) => setCfg({ ...cfg, scope: e.target.value as SinceLastSettings["scope"] })}>
              <option value="jobsite">The talk&apos;s jobsite, plus company-wide items</option>
              <option value="all">Every jobsite</option>
            </select>
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold">Kinds</legend>
            <div className="mt-1 flex flex-wrap gap-x-4">
              {EVENT_KINDS.map((k) => (
                <label key={k.id} className="flex min-h-10 items-center gap-2 text-sm">
                  <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={cfg.kinds.includes(k.id)} onChange={() => toggleKind(k.id)} />
                  {k.name}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex min-h-10 items-center gap-2 text-sm">
            <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={cfg.openOnly} onChange={(e) => setCfg({ ...cfg, openOnly: e.target.checked })} />
            Only items still open
          </label>
        </div>
      )}
      {changed && <Button className="mt-3" size="sm" disabled={busy || (cfg.enabled && cfg.kinds.length === 0)} onClick={save}>Save settings</Button>}
    </section>
  );
}

// New event --------------------------------------------------------------------------------------------------------
function NewEventForm({ company, jobsites, roster, onDone }: { company: Company; jobsites: Jobsite[]; roster: string[]; onDone: (saved: boolean) => void }) {
  const [kind, setKind] = useState<EventKind>("inspection");
  const [on, setOn] = useState(isoDay(new Date()));
  const [jobsiteId, setJobsiteId] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [caseStatus, setCaseStatus] = useState<CaseStatus>("open");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const problems = summary.trim() ? crewSummaryProblems(summary, roster) : [];
  const site = jobsites.find((j) => j.id === jobsiteId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const clean = Object.fromEntries(Object.entries(fields).filter(([k, v]) => v.trim() && KIND_FIELDS[kind].some((f) => f.key === k)));
      const id = await logEvent(company.id, {
        kind, occurredOn: on, jobsiteId: site?.id ?? null, jobsiteName: site?.name ?? "", title, details, fields: clean,
        caseStatus: kind === "citation" ? caseStatus : null, crewSummary: summary,
      });
      if (file) await uploadEventFile(company.id, id, file);
      toast("Logged. Approve the crew summary when it's ready.");
      onDone(true);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : String(e2));
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col gap-3 rounded-lg border border-brand bg-surface p-3">
      <Field id="ev-kind" label="What happened">
        <select id="ev-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as EventKind)}>
          {EVENT_KINDS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
        </select>
      </Field>
      <p className="-mt-2 text-xs text-muted">{EVENT_KINDS.find((k) => k.id === kind)!.sub}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="ev-on" label="Date"><input id="ev-on" type="date" className={inputClass} value={on} max={isoDay(new Date())} onChange={(e) => setOn(e.target.value)} required /></Field>
        <Field id="ev-site" label="Jobsite">
          <select id="ev-site" className={inputClass} value={jobsiteId} onChange={(e) => setJobsiteId(e.target.value)}>
            <option value="">Company-wide</option>
            {jobsites.filter((j) => j.active).map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
          </select>
        </Field>
      </div>
      <Field id="ev-title" label="Short title" hint="for your list">
        <input id="ev-title" className={inputClass} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Like: Weekly scaffold check, north elevation" required />
      </Field>
      {kind === "citation" && (
        <Field id="ev-case" label="Case status" hint="crews hear it as alleged until final">
          <select id="ev-case" className={inputClass} value={caseStatus} onChange={(e) => setCaseStatus(e.target.value as CaseStatus)}>
            {CASE_STATUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      )}
      {KIND_FIELDS[kind].map((f) => (
        <Field key={f.key} id={`ev-f-${f.key}`} label={f.label}>
          <input id={`ev-f-${f.key}`} className={inputClass} placeholder={f.placeholder} value={fields[f.key] ?? ""} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
        </Field>
      ))}
      <Field id="ev-details" label="Details" hint="admins only, never read to crews">
        <textarea id="ev-details" rows={3} maxLength={5000} className={inputClass} value={details} onChange={(e) => setDetails(e.target.value)} />
      </Field>
      {(kind === "incident") && (
        <Notice>For an injury, keep the person&apos;s name and any medical details here in Details only. Crews hear what happened and the fix, not who.</Notice>
      )}
      <Field id="ev-summary" label="Crew summary" hint="what's read at the next talk, after you approve it">
        <textarea id="ev-summary" rows={3} maxLength={600} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)}
          placeholder={kind === "citation" ? "Like: OSHA alleges a missing guardrail on the east roof edge. A guardrail is going up this week; until then, tie off." : "Like: A cracked plank on the north scaffold was found and replaced. Check planks before you step on."} />
      </Field>
      {problems.length > 0 && <Notice tone="error">{problems.join(" ")}</Notice>}
      <Field id="ev-file" label="Report or photo" hint="optional · PDF or picture, up to 10 MB, admins only">
        <input id="ev-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </Field>
      {err && <Notice tone="error">{err}</Notice>}
      <div className="flex gap-2">
        <Button size="sm" type="submit" disabled={busy || !title.trim()}>Save</Button>
        <Button size="sm" variant="ghost" type="button" onClick={() => onDone(false)}>Cancel</Button>
      </div>
    </form>
  );
}

// One event --------------------------------------------------------------------------------------------------------
function EventCard({ e, company, roster, people, jobsites, onChange }: {
  e: SafetyEvent; company: Company; roster: string[]; people: Person[]; jobsites: Jobsite[]; onChange: () => void;
}) {
  const s = useSession();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState(e.crew_summary);
  const [reason, setReason] = useState("");
  const [finding, setFinding] = useState({ description: "", ownerId: "", due: "" });
  const [files, setFiles] = useState<EventFile[] | null>(null);
  const [busy, setBusy] = useState(false);
  const draft = e.summary_status === "draft";
  const problems = crewSummaryProblems(draft ? summary : e.crew_summary, roster);

  useEffect(() => {
    if (!open) return;
    let live = true;
    listEventFiles(company.id, e.id).then((f) => live && setFiles(f)).catch(() => live && setFiles([]));
    return () => { live = false; };
  }, [open, company.id, e.id]);

  const run = (fn: () => Promise<void>, msg: string) => async () => {
    setBusy(true);
    try { await fn(); toast(msg); onChange(); } catch (err) { toast(err instanceof Error ? err.message : String(err), { tone: "error" }); }
    setBusy(false);
  };
  const owner = people.find((p) => p.id === finding.ownerId);
  const site = jobsites.find((j) => j.id === e.jobsite_id);

  return (
    <li className={`rounded-lg border bg-surface ${e.withdrawn_at ? "border-line opacity-60" : "border-line"}`}>
      <button className="w-full p-3 text-left" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded bg-brand-soft px-2 py-0.5 font-semibold text-brand-text">{kindName(e.kind)}</span>
          {e.kind === "citation" && <span className="rounded border border-line px-2 py-0.5 font-semibold">{caseStatusName(e.case_status)}</span>}
          <span className={`rounded px-2 py-0.5 font-semibold ${draft ? "bg-caution-bg text-caution-text" : "bg-ok-bg text-ok-text"}`}>{draft ? "Summary draft" : "Approved for talks"}</span>
          {e.status === "closed" && <span className="rounded border border-line px-2 py-0.5">Closed</span>}
          {e.withdrawn_at && <span className="rounded border border-line px-2 py-0.5">Withdrawn</span>}
        </span>
        <b className="mt-1 block">{e.title}</b>
        <small className="text-muted">{bulletinHeading(e)}</small>
      </button>
      {open && (
        <div className="flex flex-col gap-3 border-t border-line p-3 text-sm">
          {Object.keys(e.fields).length > 0 && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              {Object.entries(e.fields).map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-muted">{KIND_FIELDS[e.kind].find((f) => f.key === k)?.label ?? k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}
          {e.details && <p className="whitespace-pre-wrap"><b>Details (admins only):</b> {e.details}</p>}

          <div>
            <p className="font-semibold">Crew summary</p>
            {draft && !e.withdrawn_at ? (
              <>
                <textarea aria-label="Crew summary" rows={3} maxLength={600} className={`${inputClass} mt-1`} value={summary} onChange={(ev) => setSummary(ev.target.value)} />
                {problems.length > 0 && <div className="mt-1"><Notice tone="error">{problems.join(" ")}</Notice></div>}
                <div className="mt-2 flex flex-wrap gap-2">
                  {summary !== e.crew_summary && <Button size="sm" variant="ghost" disabled={busy} onClick={run(() => updateEvent(company.id, e.id, { crew_summary: summary.trim() }), "Saved")}>Save summary</Button>}
                  <Button size="sm" disabled={busy || problems.length > 0 || summary !== e.crew_summary} onClick={run(() => approveSummary(company.id, e.id), "Approved. It'll be read at the next talk.")}>
                    Approve for talks
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted">Once approved, it can&apos;t be changed. A different wording is a new entry.</p>
              </>
            ) : (
              <p className="mt-1 rounded-r border-l-4 border-brand bg-bg px-3 py-2">{e.crew_summary || "None"}</p>
            )}
          </div>

          {e.kind === "citation" && (
            <Field id={`case-${e.id}`} label="Case status">
              <select id={`case-${e.id}`} className={inputClass} value={e.case_status ?? "open"} disabled={busy}
                onChange={(ev) => void run(() => updateEvent(company.id, e.id, { case_status: ev.target.value as CaseStatus }), "Case status updated")()}>
                {CASE_STATUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          )}

          <div>
            <p className="font-semibold">Files</p>
            {files === null ? <p className="text-muted">Loading…</p> : files.length === 0 ? <p className="text-muted">None attached.</p> : (
              <ul className="mt-1 flex flex-col gap-1">
                {files.map((f) => (
                  <li key={f.path}>
                    <button className="font-semibold text-brand-text underline" onClick={async () => {
                      try { window.open(await eventFileUrl(f.path), "_blank", "noopener"); } catch (err) { toast(err instanceof Error ? err.message : String(err), { tone: "error" }); }
                    }}>{f.name}</button>
                  </li>
                ))}
              </ul>
            )}
            <input aria-label="Attach a file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-1 text-sm" disabled={busy}
              onChange={(ev) => { const f = ev.target.files?.[0]; if (f) void run(() => uploadEventFile(company.id, e.id, f), "File attached")(); }} />
          </div>

          <div>
            <p className="font-semibold">Add a finding to the issues list</p>
            <input aria-label="Finding" className={`${inputClass} mt-1`} maxLength={1000} placeholder="Like: Guardrail missing on the east roof edge" value={finding.description} onChange={(ev) => setFinding({ ...finding, description: ev.target.value })} />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <select aria-label="Owner" className={inputClass} value={finding.ownerId} onChange={(ev) => setFinding({ ...finding, ownerId: ev.target.value })}>
                <option value="">No owner yet</option>
                {people.filter((p) => p.active).map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
              <input aria-label="Fix by" type="date" className={inputClass} value={finding.due} onChange={(ev) => setFinding({ ...finding, due: ev.target.value })} />
            </div>
            <Button size="sm" className="mt-2" variant="ghost" disabled={busy || !finding.description.trim()} onClick={run(async () => {
              await addFinding(company.id, {
                eventId: e.id, description: finding.description, jobsiteId: site?.id ?? null, jobsiteName: e.jobsite_name,
                ownerId: owner?.id ?? null, ownerName: owner?.full_name ?? "", dueDate: finding.due || null, raisedBy: s.user?.email ?? "Admin",
              });
              setFinding({ description: "", ownerId: "", due: "" });
            }, "Added to issues")}>Add to issues</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <Button size="sm" variant="ghost" disabled={busy} onClick={run(() => updateEvent(company.id, e.id, { status: e.status === "open" ? "closed" : "open" }), e.status === "open" ? "Closed" : "Reopened")}>
              {e.status === "open" ? "Mark closed" : "Reopen"}
            </Button>
            {!e.withdrawn_at && (
              <>
                <input aria-label="Why withdraw" className={`${inputClass} !w-auto flex-1`} placeholder="Why withdraw it from talks?" value={reason} onChange={(ev) => setReason(ev.target.value)} />
                <ConfirmButton label="Withdraw" disabled={busy || !reason.trim()} onConfirm={() => void run(() => withdrawEvent(company.id, e.id, reason), "Withdrawn from talks")()} />
              </>
            )}
            {e.withdrawn_at && <p className="text-muted">Withdrawn: {e.withdrawn_reason}</p>}
          </div>
        </div>
      )}
    </li>
  );
}
