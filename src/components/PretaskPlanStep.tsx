"use client";

// Step 1 of a daily pre-task plan: today's tasks, hazards and controls, PPE, permits, equipment reminders, emergency
// plan. Rules and content in src/core/pretask.ts; the rest of the flow (who's here, signatures, saving) is the same
// as a weekly talk (src/app/talk/page.tsx).
import { Steps } from "./Steps";
import { useState } from "react";
import { EQUIPMENT_PROMPTS, HAZARD_SUGGESTIONS, PERMIT_CHOICES, PPE_CHOICES, pretaskProblems, type EquipmentAnswer, type PretaskPlan } from "@/core/pretask";
import { LANGUAGES, type LanguageId } from "@/core/languages";
import { alertWorthy, HEAT_LABEL, type HeatLevel } from "@/core/heat";
import { heatReminder } from "@/content/heat";
import { writeSiteEmergency } from "@/lib/lastSetup";
import { useHeatCheck } from "@/lib/useHeatCheck";
import type { TalkDraft } from "@/lib/draft";
import type { Jobsite } from "@/lib/data/types";
import { Button, Eyebrow, Field, GroupHeading, Notice, Title, inputClass } from "./ui";

type Props = { draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; jobsites: Jobsite[] };

export function PretaskPlanStep({ draft, update, jobsites }: Props) {
  const plan = draft.pretask!;
  const set = (patch: Partial<PretaskPlan>) => update({ pretask: { ...plan, ...patch } });
  const [task, setTask] = useState("");
  const [hazard, setHazard] = useState({ hazard: "", control: "" });
  const [problems, setProblems] = useState<string[]>([]);
  const heatMsg = useHeatCheck(draft, jobsites);
  const hot = !!draft.heat && alertWorthy(draft.heat.level as HeatLevel);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const eq = (id: string) => plan.equipment.find((e) => e.id === id);
  const setEq = (id: string, next: EquipmentAnswer | null) =>
    set({ equipment: next ? [...plan.equipment.filter((e) => e.id !== id), next] : plan.equipment.filter((e) => e.id !== id) });
  const site = jobsites.find((j) => j.id === draft.jobsiteId);

  return (
    <>
      <Steps n={1} label="Plan the day" names={["Plan", "Who's here", "Sign"]} />
      <Eyebrow>Daily pre-task plan{site ? ` · ${site.name}` : ""}</Eyebrow>
      <Title>Plan today with the team</Title>
      <p className="mt-2 text-sm text-muted">Go over it together, then everyone signs. Separate from the weekly toolbox talk; it doesn&apos;t count toward it.</p>

      {hot && draft.heat && (
        <p className="mt-3 rounded-lg border-2 border-warn bg-warn-bg px-3 py-2 text-sm">
          <b>{HEAT_LABEL[draft.heat.level as HeatLevel]}: heat index up to {draft.heat.max_heat_index_f}°F today.</b> Read this heat reminder with the plan; it&apos;s saved with it.
          <span className="mt-1 block">{heatReminder(draft.lang).items.join(" ")}</span>
        </p>
      )}
      {heatMsg && !draft.heat && <p className="mt-2 text-sm text-muted">Heat check unavailable: {heatMsg}</p>}

      <GroupHeading aside={plan.tasks.length ? `${plan.tasks.length}` : undefined}>Today&apos;s tasks</GroupHeading>
      <ul className="mt-2 flex flex-col gap-1.5">
        {plan.tasks.map((t, i) => (
          <li key={`${t}-${i}`} className="flex items-center gap-2 rounded-xl bg-surface shadow-card px-3 py-2">
            <span className="min-w-0 flex-1 break-words">{t}</span>
            <button className="min-h-11 px-2 text-sm font-semibold text-brand-text underline underline-offset-2" aria-label={`Remove task: ${t}`} onClick={() => set({ tasks: plan.tasks.filter((_, j) => j !== i) })}>Remove</button>
          </li>
        ))}
      </ul>
      <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = task.trim(); if (v) { set({ tasks: [...plan.tasks, v] }); setTask(""); } }}>
        <input aria-label="Add a task" placeholder="Like: Tear off the north slope" maxLength={300} className={inputClass} value={task} onChange={(e) => setTask(e.target.value)} />
        <Button size="sm" type="submit" disabled={!task.trim()}>Add</Button>
      </form>

      <GroupHeading aside={plan.hazards.length ? `${plan.hazards.length}` : undefined}>Hazards and controls</GroupHeading>
      <ul className="mt-2 flex flex-col gap-1.5">
        {plan.hazards.map((h, i) => (
          <li key={`${h.hazard}-${i}`} className="rounded-xl bg-surface shadow-card p-3">
            <div className="flex items-start justify-between gap-2">
              <b className="min-w-0 break-words">{h.hazard}</b>
              <button className="min-h-11 px-2 text-sm font-semibold text-brand-text underline underline-offset-2" aria-label={`Remove hazard: ${h.hazard}`} onClick={() => set({ hazards: plan.hazards.filter((_, j) => j !== i) })}>Remove</button>
            </div>
            <input aria-label={`How you'll control: ${h.hazard}`} className={`${inputClass} mt-1`} maxLength={300} value={h.control}
              onChange={(e) => set({ hazards: plan.hazards.map((x, j) => (j === i ? { ...x, control: e.target.value } : x)) })} />
          </li>
        ))}
      </ul>
      <details className="mt-2 rounded-xl bg-surface shadow-card p-3">
        <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-brand-text">Pick from common hazards</summary>
        <p className="mt-1 text-sm text-muted">Starting points. Edit the control to fit today&apos;s job.</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {HAZARD_SUGGESTIONS.filter((s) => !plan.hazards.some((h) => h.hazard === s.hazard)).map((s) => (
            <button key={s.hazard} className="min-h-11 rounded-md border border-line px-3 text-sm" onClick={() => set({ hazards: [...plan.hazards, { ...s }] })}>+ {s.hazard}</button>
          ))}
        </div>
      </details>
      <form className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-line p-3" onSubmit={(e) => {
        e.preventDefault();
        if (!hazard.hazard.trim()) return;
        set({ hazards: [...plan.hazards, { hazard: hazard.hazard.trim(), control: hazard.control.trim() }] });
        setHazard({ hazard: "", control: "" });
      }}>
        <input aria-label="Another hazard" placeholder="Another hazard" maxLength={200} className={inputClass} value={hazard.hazard} onChange={(e) => setHazard({ ...hazard, hazard: e.target.value })} />
        <input aria-label="How you'll control it" placeholder="How you'll control it" maxLength={300} className={inputClass} value={hazard.control} onChange={(e) => setHazard({ ...hazard, control: e.target.value })} />
        <Button size="sm" type="submit" variant="ghost" disabled={!hazard.hazard.trim()}>Add hazard</Button>
      </form>

      <GroupHeading>PPE</GroupHeading>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PPE_CHOICES.map((p) => (
          <button key={p} aria-pressed={plan.ppe.includes(p)} onClick={() => set({ ppe: toggle(plan.ppe, p) })}
            className={`min-h-11 rounded-full border px-3 text-sm font-semibold ${plan.ppe.includes(p) ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}>{p}</button>
        ))}
      </div>

      <GroupHeading>Permits</GroupHeading>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PERMIT_CHOICES.map((p) => (
          <button key={p} aria-pressed={plan.permits.includes(p)} onClick={() => set({ permits: toggle(plan.permits, p) })}
            className={`min-h-11 rounded-full border px-3 text-sm font-semibold ${plan.permits.includes(p) ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}>{p}</button>
        ))}
      </div>

      <GroupHeading>Equipment today</GroupHeading>
      <p className="mt-1 px-1 text-sm text-muted">Tick what the team uses. Each shows what the rule asks someone to check. The app records your answer; it doesn&apos;t do the inspection.</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {EQUIPMENT_PROMPTS.map((x) => {
          const a = eq(x.id);
          return (
            <li key={x.id} className="rounded-xl bg-surface shadow-card p-3">
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={!!a} onChange={(e) => setEq(x.id, e.target.checked ? { id: x.id, answer: "done", by: "" } : null)} />
                <b>{x.name}</b>
              </label>
              {a && (
                <div className="mt-1 flex flex-col gap-2 text-sm">
                  <p>{x.reminder} <span className="text-muted">({x.cite})</span></p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${x.name} today`}>
                    <button role="radio" aria-checked={a.answer === "done"} onClick={() => setEq(x.id, { ...a, answer: "done" })}
                      className={`min-h-11 rounded-full border px-3 font-semibold ${a.answer === "done" ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>Checked</button>
                    <button role="radio" aria-checked={a.answer === "na"} onClick={() => setEq(x.id, { ...a, answer: "na", by: "" })}
                      className={`min-h-11 rounded-full border px-3 font-semibold ${a.answer === "na" ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>Not used today</button>
                  </div>
                  {a.answer === "done" && (
                    <input aria-label={`Who checked the ${x.name.toLowerCase()}`} placeholder="Checked by (name)" maxLength={120} className={inputClass} value={a.by} onChange={(e) => setEq(x.id, { ...a, by: e.target.value })} />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <GroupHeading>Emergency</GroupHeading>
      <div className="mt-2 flex flex-col gap-3">
        <Field label="Meeting point" id="pt-muster" hint="where everyone goes in an emergency">
          <input id="pt-muster" maxLength={200} className={inputClass} value={plan.muster} onChange={(e) => set({ muster: e.target.value })} placeholder="Like: Front gate by the dumpster" />
        </Field>
        <Field label="Emergency plan" id="pt-emergency" hint="who calls 911, nearest hospital">
          <input id="pt-emergency" maxLength={300} className={inputClass} value={plan.emergency} onChange={(e) => set({ emergency: e.target.value })} placeholder="Like: Foreman calls 911; nearest ER on Main St" />
        </Field>
        <Field label="Other work nearby" id="pt-nearby" hint="optional · other trades, traffic, the public">
          <input id="pt-nearby" maxLength={300} className={inputClass} value={plan.nearby} onChange={(e) => set({ nearby: e.target.value })} />
        </Field>
      </div>

      <GroupHeading>Team signs in</GroupHeading>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Language for the signing statement">
        {LANGUAGES.filter((l) => l.ready).map((l) => (
          <button key={l.id} aria-pressed={draft.lang === l.id} onClick={() => update({ lang: l.id as LanguageId })}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${draft.lang === l.id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}>{l.label}</button>
        ))}
      </div>

      {problems.length > 0 && <div className="mt-4"><Notice tone="error">{problems.join(" ")}</Notice></div>}
      <div className="sticky bottom-0 -mx-4 mt-5 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button onClick={() => {
          const p = pretaskProblems(plan);
          setProblems(p);
          if (p.length) return;
          writeSiteEmergency(draft.companyId, draft.jobsiteId, { muster: plan.muster.trim(), emergency: plan.emergency.trim() });
          update({ step: "crew", heat: draft.heat ? { ...draft.heat, reminder_read: hot } : null });
        }}>Who&apos;s here</Button>
      </div>
    </>
  );
}
