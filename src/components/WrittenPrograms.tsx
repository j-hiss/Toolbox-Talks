"use client";

// Admin → Programs: the company's written safety programs (src/core/programs.ts, content src/content/programs.ts,
// migration 0047). Owners and admins fill in each element in their own words, approve it and save a version; a yearly
// review with no changes is its own version. Each version prints as a PDF. The app never says a program meets a rule.
import { useCallback, useEffect, useMemo, useState } from "react";
import { PROGRAMS } from "@/content/programs";
import { lastChanged, latestPrograms, programProblem, programState, programsFor, sameAnswers, cleanAnswers, type ProgramRow, type ProgramState, type ProgramTemplate } from "@/core/programs";
import type { IndustryId } from "@/core/industries";
import type { Company } from "@/lib/data/types";
import { listPrograms, saveProgram } from "@/lib/data/programs";
import { saveFile } from "@/lib/download";
import { Button, Field, GroupHeading, Loading, Notice, Sheet, inputClass } from "./ui";
import { toast } from "./toast";

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function stateLabel(s: ProgramState, latest: ProgramRow | undefined): { text: string; warn: boolean } {
  switch (s.kind) {
    case "not_started": return { text: "Not written yet", warn: false };
    case "on_file": return { text: `On file · version ${latest?.version} · ${day(s.at)}${s.reviewDue ? ` · review by ${day(s.reviewDue)}` : ""}`, warn: false };
    case "review_due": return { text: `Yearly review due since ${day(s.reviewDue)}`, warn: true };
    case "template_changed": return { text: `The app's template changed (edition ${s.to}); open it to update`, warn: true };
  }
}

type Edit = { t: ProgramTemplate; answers: Record<string, string>; approved_name: string; approved_title: string; note: string; latest: ProgramRow | null };

export function WrittenPrograms({ company }: { company: Company }) {
  const [rows, setRows] = useState<ProgramRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reload = useCallback(() => {
    listPrograms(company.id).then((r) => { setRows(r); setError(null); }).catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [company.id]);
  useEffect(() => { reload(); }, [reload]);

  const { mine, more } = useMemo(() => programsFor(PROGRAMS, company.industry as IndustryId), [company.industry]);
  const latest = useMemo(() => latestPrograms(rows ?? []), [rows]);

  if (error) return <Notice tone="error">Couldn&apos;t load written programs. {error}</Notice>;
  if (!rows) return <Loading />;

  const open = (t: ProgramTemplate) => {
    const l = latest.get(t.id) ?? null;
    setProblem(null);
    setEdit({ t, answers: { ...(l?.answers ?? {}) }, approved_name: l?.approved_name ?? "", approved_title: l?.approved_title ?? "", note: "", latest: l });
  };
  const save = async (reviewOnly: boolean) => {
    if (!edit) return;
    const d = { answers: cleanAnswers(edit.t, edit.answers), approved_name: edit.approved_name, approved_title: edit.approved_title, note: edit.note };
    const p = programProblem(edit.t, d);
    if (p) { setProblem(p); return; }
    setBusy(true); setProblem(null);
    try {
      const version = (edit.latest?.version ?? 0) + 1;
      await saveProgram(company.id, edit.t.id, edit.t.version, version, d, reviewOnly);
      toast(reviewOnly ? `${edit.t.title}: review saved (version ${version}).` : `${edit.t.title} saved (version ${version}).`);
      setEdit(null); reload();
    } catch (e) { setProblem(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const pdf = async (t: ProgramTemplate) => {
    const row = latest.get(t.id); if (!row) return;
    try {
      const { buildProgramPdf, programPdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(programPdfFileName(t, row), buildProgramPdf(t, row, rows.filter((r) => r.program_key === t.id), company).output("blob"));
      if (res !== "canceled") toast("PDF ready.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };

  const unchanged = edit?.latest ? sameAnswers(edit.t, edit.answers, edit.latest.answers) && edit.latest.template_version === edit.t.version : false;
  const list = (ts: ProgramTemplate[], label: string) => (
    <section aria-label={label} className="mt-4">
      <GroupHeading>{label}</GroupHeading>
      <ul className="mt-2 flex flex-col gap-2">
        {ts.map((t) => {
          const l = latest.get(t.id); const s = stateLabel(programState(t, l), l);
          return (
            <li key={t.id} className="rounded-xl border border-line bg-surface p-3 shadow-card">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1">
                  <b className="block">{t.title}</b>
                  <small className="block text-muted">{t.rule}</small>
                  <small className={`block ${s.warn ? "font-semibold text-warn-text" : "text-muted"}`}>{s.text}</small>
                </div>
                <div className="flex gap-2">
                  {l && <Button type="button" size="sm" variant="ghost" onClick={() => pdf(t)}>PDF</Button>}
                  <Button type="button" size="sm" variant={l ? "soft" : "primary"} onClick={() => open(t)}>{l ? "Open" : "Write"}</Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <div>
      <p className="text-sm">The written programs OSHA asks for, one element at a time. You write how your company does each one; the app keeps every version and prints it. It never says a program meets the rule.</p>
      {list(mine, "For your industry")}
      {more.length > 0 && list(more, "More programs")}
      <Sheet title={edit ? edit.t.title : ""} open={!!edit} onClose={() => setEdit(null)}>
        {edit && (
          <div className="flex flex-col gap-3">
            <div className="text-sm">
              <p><b>Rule:</b> {edit.t.rule}</p>
              <p className="mt-1"><b>Who needs it:</b> {edit.t.appliesIf}</p>
              <p className="mt-1"><b>Where it&apos;s kept:</b> {edit.t.keep}</p>
              {edit.t.review && <p className="mt-1"><b>Review:</b> {edit.t.review.what}</p>}
              {edit.latest && <p className="mt-1 text-muted">Version {edit.latest.version}, approved by {edit.latest.approved_name}, {day(edit.latest.created_at)}{(() => { const c = lastChanged(rows, edit.t.id); return c && c.version !== edit.latest!.version ? ` · last changed in version ${c.version}` : ""; })()}.</p>}
              {edit.latest && edit.latest.template_version < edit.t.version && <div className="mt-2"><Notice tone="caution">This was written on an older edition of the template. Check each section, then save a new version.</Notice></div>}
            </div>
            {edit.t.sections.map((s) => (
              <Field key={s.id} id={`pg-${s.id}`} label={s.optional ? `${s.heading} (if this applies)` : s.heading} hint={s.rule}>
                <p className="mb-1.5 text-sm">{s.ask}</p>
                {s.example && <p className="mb-1.5 text-xs text-muted">{s.example}</p>}
                <textarea id={`pg-${s.id}`} rows={4} maxLength={4000} className={inputClass} value={edit.answers[s.id] ?? ""} onChange={(e) => setEdit({ ...edit, answers: { ...edit.answers, [s.id]: e.target.value } })} />
              </Field>
            ))}
            <Field id="pg-approved" label="Approved by"><input id="pg-approved" className={inputClass} maxLength={120} value={edit.approved_name} onChange={(e) => setEdit({ ...edit, approved_name: e.target.value })} placeholder="Name" /></Field>
            <Field id="pg-title" label="Their title (optional)"><input id="pg-title" className={inputClass} maxLength={120} value={edit.approved_title} onChange={(e) => setEdit({ ...edit, approved_title: e.target.value })} placeholder="Example: Owner" /></Field>
            <Field id="pg-note" label="What changed, or a note (optional)"><input id="pg-note" className={inputClass} maxLength={500} value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} /></Field>
            <p className="text-xs text-muted">Saving makes a new version. Earlier versions stay on file and appear in the PDF&apos;s history.</p>
            {problem && <Notice tone="error">{problem}</Notice>}
            {unchanged
              ? <Button type="button" disabled={busy} onClick={() => save(true)}>{busy ? "Saving…" : "Reviewed, no changes"}</Button>
              : <Button type="button" disabled={busy} onClick={() => save(false)}>{busy ? "Saving…" : edit.latest ? "Save new version" : "Save program"}</Button>}
          </div>
        )}
      </Sheet>
    </div>
  );
}

/**
 * Everyone's read-only view (My record): the company's written programs on file, each as a PDF. The rules say the
 * written program is available to employees; this is where they find it.
 */
export function ProgramsOnFile({ company }: { company: Company }) {
  const [rows, setRows] = useState<ProgramRow[] | null>(null);
  useEffect(() => { listPrograms(company.id).then(setRows).catch(() => setRows([])); }, [company.id]);
  const latest = useMemo(() => latestPrograms(rows ?? []), [rows]);
  const onFile = PROGRAMS.filter((t) => latest.has(t.id));
  if (!rows || !onFile.length) return null;
  const pdf = async (t: ProgramTemplate) => {
    const row = latest.get(t.id)!;
    try {
      const { buildProgramPdf, programPdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(programPdfFileName(t, row), buildProgramPdf(t, row, rows.filter((r) => r.program_key === t.id), company).output("blob"));
      if (res !== "canceled") toast("PDF ready.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  return (
    <section aria-label="Company safety programs" className="mt-6">
      <GroupHeading>Company safety programs</GroupHeading>
      <ul className="mt-2 flex flex-col gap-1.5">
        {onFile.map((t) => (
          <li key={t.id} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
            <span className="min-w-0 flex-1">{t.title} <small className="block text-muted">Version {latest.get(t.id)!.version} · {day(latest.get(t.id)!.created_at)}</small></span>
            <Button type="button" size="sm" variant="ghost" onClick={() => pdf(t)}>PDF</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
