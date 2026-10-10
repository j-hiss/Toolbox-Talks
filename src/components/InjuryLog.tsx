"use client";

// Admin → Injury log: the OSHA 300 log and 300A summary, owners and admins only (src/core/oshaLog.ts, migration 0031).
// The app keeps the log and builds the forms; deciding what is recordable stays with the company. Every save is a new
// version, so the five years of updates keep their history. Nothing here reaches shared summaries or partners.
import { useEffect, useMemo, useState } from "react";
import {
  BLANK_301, KINDS, MAX_DAYS, OUTCOMES, PRIVACY_REASONS, caseLabel, caseProblem, incidentGaps, latestCases, latestSummary, logRates, logTotals,
  nameInNarrative, postingWindow, type CaseDraft, type InjuryCase, type InjurySummary,
} from "@/core/oshaLog";
import { filingDue, filingDuty, itaCaseCsv, itaCaseProblems, itaSummaryCsv, itaSummaryProblems } from "@/core/oshaFiling";
import { INDUSTRIES } from "@/core/industries";
import { listInjuryCases, listInjurySummaries, removeInjuryCase, saveInjuryCase, saveInjurySummary } from "@/lib/data/injuries";
import type { Company, Person, Role } from "@/lib/data/types";
import { saveFile } from "@/lib/download";
import { Button, ConfirmButton, Field, GroupHeading, Loading, Notice, Sheet, inputClass } from "@/components/ui";
import { toast } from "@/components/toast";

const OTHER = "__other";
const thisYear = () => new Date().getFullYear();
const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const blank = (): CaseDraft => ({
  ...BLANK_301, person_id: null, employee_name: "", job_title: "", injury_date: "", location: "", description: "",
  outcome: "other", days_away: 0, days_restricted: 0, kind: "injury", privacy: false, privacy_reason: null,
});

// Only the fields a person fills in: numbers, versions and times come from the database.
const toDraft = (c: InjuryCase): CaseDraft => {
  const { case_key: _k, version: _v, year: _y, case_no: _n, removed: _r, removed_reason: _rr, created_at: _c, ...d } = c;
  void _k; void _v; void _y; void _n; void _r; void _rr; void _c;
  return d;
};

export function InjuryLog({ company, people, roles }: { company: Company; people: Person[]; roles: Role[] }) {
  const [year, setYear] = useState(thisYear());
  const [rows, setRows] = useState<InjuryCase[] | null>(null);
  const [sums, setSums] = useState<InjurySummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [edit, setEdit] = useState<{ prev: InjuryCase | null; draft: CaseDraft } | null>(null);
  const [busy, setBusy] = useState(false);
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    let live = true;
    Promise.all([listInjuryCases(company.id, year), listInjurySummaries(company.id)])
      .then(([c, s]) => { if (live) { setRows(c); setSums(s); setError(null); } })
      .catch((e) => { if (live) setError(e instanceof Error ? e.message : String(e)); });
    return () => { live = false; };
  }, [company.id, year, version]);

  const cases = useMemo(() => latestCases(rows ?? []), [rows]);
  const removed = useMemo(() => latestCases(rows ?? [], true).filter((c) => c.removed), [rows]);
  const sum = latestSummary(sums, year);
  const totals = logTotals(cases);
  const rates = logRates(totals, sum?.hours_worked ?? null);
  const today = new Date();
  const lastYear = today.getFullYear() - 1;
  const posting = postingWindow(lastYear);
  const inPostingSeason = today.getMonth() <= 3; // January to April: last year's summary is due or posted

  const pdf = async (what: "300" | "300A" | "privacy" | "301", one?: InjuryCase) => {
    setBusy(true);
    try {
      const { buildOsha300Pdf, buildOsha300APdf, buildPrivacyListPdf, buildOsha301Pdf, oshaFileName } = await import("@/lib/pdf");
      const doc = what === "300" ? buildOsha300Pdf(cases, company, year, sum) : what === "300A" ? buildOsha300APdf(cases, company, year, sum)
        : what === "301" && one ? buildOsha301Pdf(one, company) : buildPrivacyListPdf(cases, company, year);
      const res = await saveFile(oshaFileName(company, year, what, one ? caseLabel(one) : undefined), doc.output("blob"));
      if (res !== "canceled") toast("PDF ready.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
    setBusy(false);
  };
  const duty = filingDuty(sum?.naics ?? "", sum?.peak_employees ?? null);
  const summaryIssues = itaSummaryProblems(sum, cases);
  const caseIssues = itaCaseProblems(cases);
  const ita = async (what: "ita-summary" | "ita-cases") => {
    if (!sum) return;
    try {
      const { oshaFileName } = await import("@/lib/pdf");
      const csv = what === "ita-summary" ? itaSummaryCsv(sum, cases, year) : itaCaseCsv(sum.establishment, cases, year);
      const res = await saveFile(oshaFileName(company, year, what), new Blob([csv], { type: "text/csv" }));
      if (res !== "canceled") toast("File ready to upload on OSHA's Injury Tracking Application.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };

  return (
    <section>
      <p className="text-sm text-muted">
        Your OSHA 300 log and 300A summary. Record a case within 7 calendar days of learning about it. The app keeps the log
        and builds the forms; deciding what&apos;s recordable is yours (29 CFR 1904.4 to 1904.7). Only owners and admins see this.
      </p>
      <p className="mt-2 text-sm text-muted">
        Report a work-related death to OSHA within 8 hours, and an in-patient hospitalization, amputation or loss of an eye
        within 24 hours (1904.39). That&apos;s a call or report to OSHA; this log doesn&apos;t send it.
      </p>
      {inPostingSeason && (
        <div className="mt-3"><Notice tone="caution">Post the {lastYear} summary (300A) where notices go, from {short(posting.from)} to {short(posting.to)}, certified by a company executive.</Notice></div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <label htmlFor="osha-year" className="text-sm font-semibold">Year</label>
        <select id="osha-year" className={`${inputClass} max-w-32`} value={year} onChange={(e) => { setRows(null); setYear(Number(e.target.value)); }}>
          {Array.from({ length: 6 }, (_, i) => thisYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span className="text-xs text-muted">Keep five years after each year ends (1904.33).</span>
      </div>

      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
      {!rows && !error ? <Loading /> : rows && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={`${year} totals`}>
            {OUTCOMES.map((o) => (
              <div key={o.id} className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
                <p className="font-display text-2xl font-bold">{totals[o.col]}</p>
                <p className="text-xs text-muted">({o.col}) {o.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm">
            <b>{totals.K}</b> days away · <b>{totals.L}</b> days restricted or transferred
            {rates ? <> · rates per 100 full-time workers: <b>{rates.recordable}</b> recordable, <b>{rates.dart}</b> days away, restricted or transferred</> : <span className="text-muted"> · add hours worked below to see rates</span>}
          </p>

          <GroupHeading aside={`${cases.length}`}>{year} cases</GroupHeading>
          {cases.length === 0 && <p className="mt-2 text-sm text-muted">No recordable cases logged for {year}. The summary still gets posted, with zeros.</p>}
          <ul className="mt-2 flex flex-col gap-2">
            {cases.map((c) => <CaseRow key={c.case_key} c={c} onPdf={() => pdf("301", c)} onEdit={() => setEdit({ prev: c, draft: toDraft(c) })} onRemove={async (reason) => {
              try { await removeInjuryCase(company.id, c, reason); reload(); toast(`${caseLabel(c)} taken off the log. Its history stays.`); }
              catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
            }} />)}
          </ul>
          <div className="mt-3"><Button type="button" onClick={() => setEdit({ prev: null, draft: { ...blank(), injury_date: "" } })}>Add a case</Button></div>
          {removed.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-semibold">Taken off the log ({removed.length})</summary>
              <ul className="mt-2 flex flex-col gap-1 text-muted">
                {removed.map((c) => <li key={c.case_key}>{caseLabel(c)} · {short(c.injury_date)} · {c.removed_reason}</li>)}
              </ul>
            </details>
          )}

          <GroupHeading>Summary (300A) details</GroupHeading>
          <SummaryForm key={`${year}-${sum?.version ?? 0}`} company={company} year={year} sum={sum} onSaved={reload} />

          <GroupHeading>Forms</GroupHeading>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" disabled={busy} onClick={() => pdf("300")}>{year} log (300) PDF</Button>
            <Button type="button" variant="soft" disabled={busy} onClick={() => pdf("300A")}>{year} summary (300A) PDF</Button>
            {cases.some((c) => c.privacy) && <Button type="button" variant="ghost" disabled={busy} onClick={() => pdf("privacy")}>Privacy case list (confidential)</Button>}
          </div>
          <GroupHeading>Filing online with OSHA</GroupHeading>
          <section aria-label="Filing online with OSHA" className="mt-2 rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
            <p className="font-semibold">
              {duty.log === "unknown" ? "Add your NAICS code and headcount to see what applies."
                : duty.file300_301 ? `File the ${year} 300A, 300 and 301 online by ${short(filingDue(year))}.`
                : duty.file300A ? `File the ${year} 300A online by ${short(filingDue(year))}.`
                : duty.log === "keep" ? "No online filing for your size and industry, unless OSHA asks." : "The log isn't required for you, unless OSHA asks."}
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-muted">{duty.why.map((w) => <li key={w}>{w}</li>)}</ul>
            <p className="mt-2 text-xs text-muted">From your NAICS code and headcount, using OSHA&apos;s 2012-NAICS lists. If your code is newer, confirm on OSHA&apos;s Injury Tracking Application. This isn&apos;t legal advice.</p>
            {(duty.file300A || duty.file300_301) && (
              <div className="mt-3 flex flex-col gap-2">
                {summaryIssues.length > 0 && <Notice tone="caution">Before the 300A file: {summaryIssues.join(" ")}</Notice>}
                <Button type="button" variant="soft" disabled={summaryIssues.length > 0} onClick={() => ita("ita-summary")}>300A file for OSHA&apos;s upload (CSV)</Button>
                {duty.file300_301 && (
                  <>
                    {caseIssues.length > 0 && <Notice tone="caution">Finish the 301 for: {caseIssues.join("; ")}.</Notice>}
                    <Button type="button" variant="soft" disabled={summaryIssues.length > 0 || caseIssues.length > 0 || cases.length === 0} onClick={() => ita("ita-cases")}>300 and 301 cases file (CSV, no names)</Button>
                  </>
                )}
              </div>
            )}
          </section>
          <p className="mt-2 text-xs text-muted">
            Built from the OSHA 300 and 300A columns. If you give the log to an employee or their representative, privacy cases already
            show &quot;Privacy case&quot;; never hand out the confidential list.
          </p>
        </>
      )}
      {edit && (
        <CaseEditor company={company} people={people} roles={roles} edit={edit} setEdit={setEdit}
          onSaved={() => { setEdit(null); reload(); }} />
      )}
    </section>
  );
}

function CaseRow({ c, onEdit, onPdf, onRemove }: { c: InjuryCase; onEdit: () => void; onPdf: () => void; onRemove: (reason: string) => Promise<void> }) {
  const gaps = incidentGaps(c);
  const [removing, setRemoving] = useState(false);
  const [reason, setReason] = useState("");
  const o = OUTCOMES.find((x) => x.id === c.outcome)!;
  return (
    <li className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <b className="block">{caseLabel(c)} · {c.privacy ? <>Privacy case <span className="font-normal text-muted">({c.employee_name})</span></> : c.employee_name}</b>
          <span className="block text-xs text-muted">{short(c.injury_date)}{c.job_title ? ` · ${c.job_title}` : ""}{c.location ? ` · ${c.location}` : ""}</span>
          <span className="mt-1 block text-sm">{c.description}</span>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${c.outcome === "other" ? "bg-fg/[0.06]" : "bg-warn-bg text-warn"}`}>({o.col}) {o.label}</span>
      </div>
      <p className="mt-1 text-xs text-muted">
        {c.days_away} days away · {c.days_restricted} restricted · {KINDS.find((k) => k.id === c.kind)!.label}{c.version > 1 ? ` · version ${c.version}` : ""}
      </p>
      {removing ? (
        <div className="mt-2 flex flex-col gap-2">
          <input aria-label="Why it comes off the log" className={inputClass} placeholder="Why it comes off the log (e.g. found not work-related)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2">
            <ConfirmButton label="Take off the log" confirmLabel="Tap again to take it off" disabled={!reason.trim()} onConfirm={() => void onRemove(reason)} />
            <Button size="sm" variant="ghost" type="button" onClick={() => setRemoving(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="ghost" type="button" onClick={onEdit}>Update</Button>
          <Button size="sm" variant="ghost" type="button" onClick={onPdf}>301 report{gaps.length ? ` (${gaps.length} to fill)` : ""}</Button>
          <Button size="sm" variant="ghost" type="button" onClick={() => setRemoving(true)}>Not recordable…</Button>
        </div>
      )}
    </li>
  );
}

function CaseEditor({ company, people, roles, edit, setEdit, onSaved }: {
  company: Company; people: Person[]; roles: Role[];
  edit: { prev: InjuryCase | null; draft: CaseDraft }; setEdit: (e: { prev: InjuryCase | null; draft: CaseDraft } | null) => void; onSaved: () => void;
}) {
  const d = edit.draft;
  const set = (p: Partial<CaseDraft>) => setEdit({ ...edit, draft: { ...d, ...p } });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const active = people.filter((p) => p.active || p.id === d.person_id);
  const pick = (id: string) => {
    if (id === OTHER) { set({ person_id: null }); return; }
    const p = people.find((x) => x.id === id);
    if (p) set({ person_id: p.id, employee_name: p.full_name, job_title: d.job_title || (roles.find((r) => r.id === p.role_id)?.name ?? "") });
  };
  const save = async () => {
    const problem = caseProblem(d);
    if (problem) { setError(problem); return; }
    if (edit.prev && Number(d.injury_date.slice(0, 4)) !== edit.prev.year) { setError(`A case stays in the year it was logged. Take this one off the ${edit.prev.year} log and add it to ${d.injury_date.slice(0, 4)}.`); return; }
    setBusy(true); setError(null);
    try {
      await saveInjuryCase(company.id, { ...d, employee_name: d.employee_name.trim(), job_title: d.job_title.trim(), location: d.location.trim(), description: d.description.trim(), privacy_reason: d.privacy ? d.privacy_reason : null }, edit.prev);
      toast(edit.prev ? `${caseLabel(edit.prev)} updated (version ${edit.prev.version + 1}).` : "Case added to the log.");
      onSaved();
    } catch (e) {
      setError(typeof navigator !== "undefined" && navigator.onLine === false ? "No signal. The case is still here; save again when you're connected." : e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  };
  return (
    <Sheet title={edit.prev ? `Update ${caseLabel(edit.prev)}` : "Add a case"} open onClose={() => setEdit(null)}>
      <div className="flex flex-col gap-4">
        <Field label="Who" id="inj-person">
          <select id="inj-person" className={inputClass} value={d.person_id ?? OTHER} onChange={(e) => pick(e.target.value)}>
            <option value={OTHER}>Someone not on the list</option>
            {active.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </Field>
        {!d.person_id && (
          <Field label="(B) Employee's name" id="inj-name">
            <input id="inj-name" className={inputClass} maxLength={120} value={d.employee_name} onChange={(e) => set({ employee_name: e.target.value })} />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="(C) Job title" id="inj-title"><input id="inj-title" className={inputClass} maxLength={120} value={d.job_title} onChange={(e) => set({ job_title: e.target.value })} /></Field>
          <Field label="(D) Date" hint="or illness began" id="inj-date"><input id="inj-date" type="date" className={inputClass} value={d.injury_date} onChange={(e) => set({ injury_date: e.target.value })} /></Field>
        </div>
        <Field label="(E) Where it happened" id="inj-where"><input id="inj-where" className={inputClass} maxLength={200} placeholder="e.g. Example Jobsite, north roof" value={d.location} onChange={(e) => set({ location: e.target.value })} /></Field>
        <Field label="(F) What happened" hint="injury or illness, part of the body, and what caused it" id="inj-desc">
          <textarea id="inj-desc" rows={3} className={inputClass} maxLength={1000} placeholder="e.g. Sprained left ankle stepping off a ladder onto uneven decking" value={d.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <fieldset>
          <legend className="text-sm font-semibold">Classify the case <small className="font-normal text-muted">the most serious outcome, one box</small></legend>
          <div className="mt-2 flex flex-col gap-1.5" role="radiogroup">
            {OUTCOMES.map((o) => (
              <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${d.outcome === o.id ? "border-brand bg-surface" : "border-line bg-surface"}`}>
                <input type="radio" name="inj-outcome" className="mt-1 size-5 shrink-0 accent-[var(--brand)]" checked={d.outcome === o.id}
                  onChange={() => set({ outcome: o.id, ...(o.id === "other" ? { days_away: 0, days_restricted: 0 } : o.id === "restricted" ? { days_away: 0 } : {}) })} />
                <span><b>({o.col}) {o.label}</b><span className="block text-xs text-muted">{o.hint}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        {d.outcome === "death" && <Notice tone="caution">Report a work-related death to OSHA within 8 hours of learning about it (1904.39).</Notice>}
        {d.outcome !== "other" && (
          <div className="grid grid-cols-2 gap-3">
            {d.outcome !== "restricted" && (
              <Field label="(K) Days away" id="inj-away"><input id="inj-away" type="number" inputMode="numeric" min={0} max={MAX_DAYS} className={inputClass} value={d.days_away} onChange={(e) => set({ days_away: Math.max(0, Math.round(Number(e.target.value) || 0)) })} /></Field>
            )}
            <Field label="(L) Days restricted or transferred" id="inj-restr"><input id="inj-restr" type="number" inputMode="numeric" min={0} max={MAX_DAYS} className={inputClass} value={d.days_restricted} onChange={(e) => set({ days_restricted: Math.max(0, Math.round(Number(e.target.value) || 0)) })} /></Field>
            <p className="col-span-2 text-xs text-muted">Calendar days starting the day after, weekends and days off included. Enter {MAX_DAYS} if it ran longer. Update the case as days add up.</p>
          </div>
        )}
        <Field label="(M) Type" id="inj-kind">
          <select id="inj-kind" className={inputClass} value={d.kind} onChange={(e) => set({ kind: e.target.value as CaseDraft["kind"] })}>
            {KINDS.map((k) => <option key={k.id} value={k.id}>({k.n}) {k.label}</option>)}
          </select>
        </Field>
        <label className="flex items-start gap-3 rounded-xl border border-line p-3">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--brand)]" checked={d.privacy} onChange={(e) => set({ privacy: e.target.checked, privacy_reason: e.target.checked ? d.privacy_reason : null })} />
          <span className="text-sm"><b>Privacy case.</b> The log prints &quot;Privacy case&quot; instead of the name; the name goes on a separate confidential list. Describe it in general terms if the details would identify the person.</span>
        </label>
        {d.privacy && (
          <Field label="Why" id="inj-why">
            <select id="inj-why" className={inputClass} value={d.privacy_reason ?? ""} onChange={(e) => set({ privacy_reason: (e.target.value || null) as CaseDraft["privacy_reason"] })}>
              <option value="">Choose one…</option>
              {PRIVACY_REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
        )}
        <Incident301 d={d} set={set} />
        {error && <Notice tone="error">{error}</Notice>}
        <div className="sticky -bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] -mb-[calc(1rem+env(safe-area-inset-bottom,0px))] grid grid-cols-[1fr_auto] gap-2 border-t border-line bg-bg pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-3">
          <Button type="button" className="whitespace-nowrap" disabled={busy} onClick={save}>{busy ? "Saving…" : edit.prev ? `Save as version ${edit.prev.version + 1}` : "Add to the log"}</Button>
          <Button type="button" variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
        </div>
      </div>
    </Sheet>
  );
}

function SummaryForm({ company, year, sum, onSaved }: { company: Company; year: number; sum: InjurySummary | null; onSaved: () => void }) {
  const [f, setF] = useState<InjurySummary>(() => sum ?? {
    year, version: 0, establishment: company.name, address: company.address ?? "", industry: "", naics: "",
    avg_employees: null, hours_worked: null, certifier_name: "", certifier_title: "", certifier_phone: company.phone ?? "",
    legal_name: company.name, ein: "", street: "", city: "", state: "", zip: company.zip ?? "", peak_employees: null, establishment_type: 1,
  });
  const suggestions = INDUSTRIES.find((i) => i.id === company.industry)?.naics ?? [];
  const [busy, setBusy] = useState(false);
  const set = (p: Partial<InjurySummary>) => setF({ ...f, ...p });
  const num = (v: string) => (v.trim() === "" ? null : Math.max(0, Number(v.replace(/,/g, "")) || 0));
  const save = async () => {
    if (f.naics && !/^\d{2,6}$/.test(f.naics)) { toast("NAICS is 2 to 6 digits, or leave it blank.", { tone: "error" }); return; }
    if (f.ein && !/^\d{9}$/.test(f.ein)) { toast("EIN is 9 digits, or leave it blank.", { tone: "error" }); return; }
    if (f.zip && !/^\d{5}(\d{4})?$/.test(f.zip)) { toast("ZIP is 5 or 9 digits.", { tone: "error" }); return; }
    setBusy(true);
    try { await saveInjurySummary(company.id, { ...f, year, version: (sum?.version ?? 0) + 1, avg_employees: f.avg_employees === null ? null : Math.round(f.avg_employees), peak_employees: f.peak_employees === null ? null : Math.round(f.peak_employees) }); toast("Summary details saved."); onSaved(); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
    setBusy(false);
  };
  const id = (k: string) => `sum-${k}`;
  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Establishment name" id={id("est")}><input id={id("est")} className={inputClass} maxLength={200} value={f.establishment} onChange={(e) => set({ establishment: e.target.value })} /></Field>
        <Field label="Legal company name" id={id("legal")}><input id={id("legal")} className={inputClass} maxLength={100} value={f.legal_name} onChange={(e) => set({ legal_name: e.target.value })} /></Field>
        <Field label="Street address" hint="not a PO box" id={id("street")}><input id={id("street")} className={inputClass} maxLength={100} value={f.street} onChange={(e) => set({ street: e.target.value })} /></Field>
        <div className="grid grid-cols-[1fr_4.5rem_6.5rem] gap-2">
          <Field label="City" id={id("city")}><input id={id("city")} className={inputClass} maxLength={100} value={f.city} onChange={(e) => set({ city: e.target.value })} /></Field>
          <Field label="State" id={id("state")}><input id={id("state")} className={inputClass} maxLength={2} value={f.state} onChange={(e) => set({ state: e.target.value.toUpperCase().replace(/[^A-Z]/g, "") })} /></Field>
          <Field label="ZIP" id={id("zip")}><input id={id("zip")} inputMode="numeric" className={inputClass} maxLength={9} value={f.zip} onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "") })} /></Field>
        </div>
        <Field label="EIN" hint="9 digits, for online filing" id={id("ein")}><input id={id("ein")} inputMode="numeric" className={inputClass} maxLength={10} value={f.ein} onChange={(e) => set({ ein: e.target.value.replace(/\D/g, "").slice(0, 9) })} /></Field>
        <Field label="Industry description" id={id("ind")}><input id={id("ind")} className={inputClass} maxLength={200} placeholder="e.g. Roofing contractor" value={f.industry} onChange={(e) => set({ industry: e.target.value })} /></Field>
        <Field label="NAICS code" hint="6 digits" id={id("naics")}>
          <input id={id("naics")} inputMode="numeric" list={id("naics-list")} className={inputClass} maxLength={6} placeholder={suggestions[0] ? `e.g. ${suggestions[0].code}` : "e.g. 238160"} value={f.naics} onChange={(e) => set({ naics: e.target.value.replace(/\D/g, "") })} />
          <datalist id={id("naics-list")}>{suggestions.map((n) => <option key={n.code} value={n.code}>{n.name}</option>)}</datalist>
          {suggestions.length > 0 && !f.naics && (
            <span className="flex flex-wrap gap-1.5">{suggestions.map((n) => (
              <button key={n.code} type="button" className="rounded-full border border-line px-2.5 py-1 text-xs" onClick={() => set({ naics: n.code, industry: f.industry || n.name })}>{n.code} · {n.name}</button>
            ))}</span>
          )}
        </Field>
        <Field label="Everyone employed at any time this year" hint="full, part-time, seasonal, temporary" id={id("peak")}><input id={id("peak")} inputMode="numeric" className={inputClass} value={f.peak_employees ?? ""} onChange={(e) => set({ peak_employees: num(e.target.value) })} /></Field>
        <Field label="Annual average number of employees" id={id("avg")}><input id={id("avg")} inputMode="numeric" className={inputClass} value={f.avg_employees ?? ""} onChange={(e) => set({ avg_employees: num(e.target.value) })} /></Field>
        <Field label="Total hours worked by all employees" id={id("hours")}><input id={id("hours")} inputMode="decimal" className={inputClass} value={f.hours_worked ?? ""} onChange={(e) => set({ hours_worked: num(e.target.value) })} /></Field>
        <Field label="Certified by (company executive)" id={id("cname")}><input id={id("cname")} className={inputClass} maxLength={120} value={f.certifier_name} onChange={(e) => set({ certifier_name: e.target.value })} /></Field>
        <Field label="Title" id={id("ctitle")}><input id={id("ctitle")} className={inputClass} maxLength={120} placeholder="e.g. President" value={f.certifier_title} onChange={(e) => set({ certifier_title: e.target.value })} /></Field>
        <Field label="Phone" id={id("cphone")}><input id={id("cphone")} className={inputClass} maxLength={40} value={f.certifier_phone} onChange={(e) => set({ certifier_phone: e.target.value })} /></Field>
      </div>
      <p className="text-xs text-muted">The executive signs and dates the printed summary. An owner (sole proprietor or partner), a corporate officer, or the highest-ranking person at the site, or their supervisor, can certify it (1904.32(b)(4)).</p>
      <Button type="button" variant="soft" disabled={busy} onClick={save}>Save summary details</Button>
    </div>
  );
}

/** Form 301 boxes in the case sheet, folded until opened. Boxes 14-17 go to OSHA's online filing, so no names there. */
function Incident301({ d, set }: { d: CaseDraft; set: (p: Partial<CaseDraft>) => void }) {
  const gaps = incidentGaps(d);
  const named = nameInNarrative(d);
  const yn = (v: boolean | null, on: (b: boolean) => void, label: string, n: number) => (
    <fieldset>
      <legend className="text-sm font-semibold">{n}) {label}</legend>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {[true, false].map((b) => (
          <label key={String(b)} className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border ${v === b ? "border-brand bg-surface" : "border-line bg-surface"}`}>
            <input type="radio" className="size-4 accent-[var(--brand)]" checked={v === b} onChange={() => on(b)} />{b ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
  const txt = (k: "activity_before" | "what_happened" | "injury_detail" | "object_substance", n: number, label: string, ph: string) => (
    <Field label={`${n}) ${label}`} id={`inj-${k}`}>
      <textarea id={`inj-${k}`} rows={2} className={inputClass} placeholder={ph} value={d[k]} onChange={(e) => set({ [k]: e.target.value } as Partial<CaseDraft>)} />
    </Field>
  );
  return (
    <details className="rounded-xl border border-line p-3" open={gaps.length < 10}>
      <summary className="cursor-pointer font-semibold">Incident report (Form 301) <span className="font-normal text-muted">{gaps.length ? `· ${gaps.length} to fill` : "· complete"}</span></summary>
      <p className="mt-2 text-xs text-muted">Fill it in within 7 calendar days too. The online filing never gets the name, address, doctor or facility.</p>
      <div className="mt-3 flex flex-col gap-3">
        <Field label="2) Employee's street, city, state, ZIP" id="inj-addr"><input id="inj-addr" className={inputClass} maxLength={300} value={d.employee_address} onChange={(e) => set({ employee_address: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="3) Date of birth" id="inj-dob"><input id="inj-dob" type="date" className={inputClass} value={d.birth_date ?? ""} onChange={(e) => set({ birth_date: e.target.value || null })} /></Field>
          <Field label="4) Date hired" id="inj-hired"><input id="inj-hired" type="date" className={inputClass} value={d.hire_date ?? ""} onChange={(e) => set({ hire_date: e.target.value || null })} /></Field>
        </div>
        <Field label="5) Sex" hint="optional" id="inj-sex">
          <select id="inj-sex" className={inputClass} value={d.sex} onChange={(e) => set({ sex: e.target.value as CaseDraft["sex"] })}>
            <option value="">Not given</option><option value="M">Male</option><option value="F">Female</option>
          </select>
        </Field>
        <Field label="6) Physician or other health care professional" id="inj-prov"><input id="inj-prov" className={inputClass} maxLength={120} value={d.provider_name} onChange={(e) => set({ provider_name: e.target.value })} /></Field>
        <Field label="7) Where treated, if away from the worksite" hint="facility and address" id="inj-fac"><input id="inj-fac" className={inputClass} maxLength={300} value={d.provider_facility} onChange={(e) => set({ provider_facility: e.target.value })} /></Field>
        {yn(d.er_visit, (b) => set({ er_visit: b }), "Treated in an emergency room?", 8)}
        {yn(d.inpatient, (b) => set({ inpatient: b }), "Hospitalized overnight as an in-patient?", 9)}
        {d.inpatient && <Notice tone="caution">An in-patient hospitalization gets reported to OSHA within 24 hours (1904.39).</Notice>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="12) Time began work" id="inj-start"><input id="inj-start" type="time" className={inputClass} value={d.time_started?.slice(0, 5) ?? ""} onChange={(e) => set({ time_started: e.target.value || null })} /></Field>
          <Field label="13) Time of event" id="inj-time"><input id="inj-time" type="time" className={inputClass} disabled={d.time_unknown} value={d.time_of_event?.slice(0, 5) ?? ""} onChange={(e) => set({ time_of_event: e.target.value || null })} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-[var(--brand)]" checked={d.time_unknown} onChange={(e) => set({ time_unknown: e.target.checked, time_of_event: e.target.checked ? null : d.time_of_event })} />Time of event can&apos;t be determined</label>
        {txt("activity_before", 14, "What were they doing just before?", "The activity, and the tools, equipment or material")}
        {txt("what_happened", 15, "What happened?", "How the injury occurred")}
        {txt("injury_detail", 16, "What was the injury or illness?", "The part of the body and how it was affected")}
        {txt("object_substance", 17, "What object or substance directly harmed them?", "Leave blank if not applicable")}
        {named && <Notice tone="caution">Boxes 14 to 17 mention &quot;{named}&quot;. Leave names out of these boxes: OSHA&apos;s online filing receives them.</Notice>}
        {d.outcome === "death" && (
          <Field label="18) Date of death" id="inj-dod"><input id="inj-dod" type="date" className={inputClass} value={d.death_date ?? ""} onChange={(e) => set({ death_date: e.target.value || null })} /></Field>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Completed by" id="inj-by"><input id="inj-by" className={inputClass} maxLength={120} value={d.completed_by} onChange={(e) => set({ completed_by: e.target.value })} /></Field>
          <Field label="Title" id="inj-bytitle"><input id="inj-bytitle" className={inputClass} maxLength={120} value={d.completed_title} onChange={(e) => set({ completed_title: e.target.value })} /></Field>
          <Field label="Phone" id="inj-byphone"><input id="inj-byphone" className={inputClass} maxLength={40} value={d.completed_phone} onChange={(e) => set({ completed_phone: e.target.value })} /></Field>
        </div>
      </div>
    </details>
  );
}
