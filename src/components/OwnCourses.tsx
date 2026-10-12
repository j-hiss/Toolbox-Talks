"use client";

// Your own trainings (migration 0053): certifications that aren't OSHA's, made by a company (Admin → Training), a
// trainer, or a training company (trainer portal). One manager for all three. Rules: src/core/courses.ts.
// Data: src/lib/data/courses.ts. A renamed or retired training never changes a card already given.
import { useEffect, useState } from "react";
import { COURSE_DESCRIPTION_MAX, COURSE_NAME_MAX, COURSE_RENEW_MAX, courseProblem, renewText, type CourseDraft, type CourseOwnerKind, type TrainingCourse } from "@/core/courses";
import { retireCourse, saveCourse, trainingsForCompany } from "@/lib/data/courses";
import { Button, ConfirmButton, Field, GroupHeading, inputClass } from "./ui";
import { toast } from "./toast";

const err = (e: unknown) => toast(e instanceof Error ? e.message : String(e), { tone: "error" });

export function CourseManager({ ownerKind, owner, courses, canEdit, reload, intro, heading = "Your own trainings" }: {
  ownerKind: CourseOwnerKind; owner: string | null; courses: TrainingCourse[]; canEdit: boolean; reload: () => void; intro: string; heading?: string;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const shown = [...courses].sort((a, b) => Number(a.retired) - Number(b.retired) || a.name.localeCompare(b.name));
  return (
    <section aria-label={heading} className="mt-6">
      <GroupHeading aside={courses.length ? `${courses.filter((c) => !c.retired).length}` : undefined}>{heading}</GroupHeading>
      <p className="mt-1 text-sm text-muted">{intro}</p>
      <ul aria-label={`${heading} list`} className="mt-2 flex flex-col gap-2">
        {shown.map((c) => (
          <li key={c.code} className={`rounded-xl p-3 text-sm ${c.retired ? "border border-line opacity-70" : "bg-surface shadow-card"}`}>
            {editing === c.code ? (
              <CourseForm initial={{ name: c.name, description: c.description, renewMonths: c.renew_months }} saveLabel="Save changes" onCancel={() => setEditing(null)}
                onSave={async (d) => { await saveCourse(ownerKind, owner, c.code, d); setEditing(null); reload(); toast("Saved. Cards already given keep the name they had."); }} />
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-2"><b>{c.name}</b><small className="shrink-0 text-muted">{c.retired ? "Retired" : renewText(c.renew_months)}</small></div>
                {c.description && <p className="mt-1 whitespace-pre-line text-muted">{c.description}</p>}
                {canEdit && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {!c.retired && <Button size="sm" variant="ghost" onClick={() => setEditing(c.code)} aria-label={`Change ${c.name}`}>Change</Button>}
                    {c.retired
                      ? <Button size="sm" variant="ghost" onClick={() => void retireCourse(c.code, false).then(() => { reload(); toast("It can be given again."); }).catch(err)}>Bring back</Button>
                      : <ConfirmButton label="Retire" confirmLabel="Tap again to retire" onConfirm={() => void retireCourse(c.code, true).then(() => { reload(); toast("Retired. Cards already given stay on file."); }).catch(err)} />}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {courses.length === 0 && <p className="mt-2 text-sm text-muted">None yet.</p>}
      {canEdit && (editing === "new"
        ? <div className="mt-3 rounded-xl border border-line p-3"><CourseForm initial={{ name: "", description: "", renewMonths: null }} saveLabel="Make the training" onCancel={() => setEditing(null)}
            onSave={async (d) => { await saveCourse(ownerKind, owner, null, d); setEditing(null); reload(); toast(ownerKind === "company" ? "Made. Pick it when you add a card or set what a job title needs." : "Made. Pick it when you start a class or send a card."); }} /></div>
        : <div className="mt-3"><Button size="sm" variant="soft" onClick={() => setEditing("new")}>Make a training</Button></div>)}
    </section>
  );
}

function CourseForm({ initial, saveLabel, onSave, onCancel }: { initial: CourseDraft; saveLabel: string; onSave: (d: CourseDraft) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [months, setMonths] = useState(initial.renewMonths ? String(initial.renewMonths) : "");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    const d: CourseDraft = { name, description, renewMonths: months.trim() ? Number(months) : null };
    const p = courseProblem(d); if (p) { toast(p, { tone: "error" }); return; }
    setBusy(true);
    try { await onSave(d); } catch (e) { err(e); }
    setBusy(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <Field label="Training name" id="course-name"><input id="course-name" className={inputClass} maxLength={COURSE_NAME_MAX} value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Skid steer checkout" /></Field>
      <Field label="What it covers (optional)" id="course-desc"><textarea id="course-desc" className={inputClass} rows={3} maxLength={COURSE_DESCRIPTION_MAX} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Topics, hands-on test, who can sign off" /></Field>
      <Field label="Renew every" id="course-months" hint="months; blank for no expiry">
        <input id="course-months" type="number" inputMode="numeric" min={1} max={COURSE_RENEW_MAX} className={inputClass} value={months} onChange={(e) => setMonths(e.target.value)} placeholder="24" />
      </Field>
      <p className="text-xs text-muted">The renewal is only a suggestion for a card&apos;s expiry date. The person adding the card can change it.</p>
      <div className="flex gap-2"><Button size="sm" disabled={busy} onClick={save}>{saveLabel}</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button></div>
    </div>
  );
}

/** The trainings that count for one company (its own and its trainers'), reloaded when the company changes. */
export function useTrainingsFor(companyId: string | null): TrainingCourse[] {
  const [rows, setRows] = useState<{ co: string; list: TrainingCourse[] } | null>(null);
  useEffect(() => {
    if (!companyId) return;
    let live = true;
    trainingsForCompany(companyId).then((list) => live && setRows({ co: companyId, list })).catch(() => live && setRows({ co: companyId, list: [] }));
    return () => { live = false; };
  }, [companyId]);
  return rows && rows.co === companyId ? rows.list : [];
}
