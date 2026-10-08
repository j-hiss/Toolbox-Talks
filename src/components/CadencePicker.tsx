"use client";

// Admin → Plan: how often the company gives a new talk. A change starts when the current talk period ends, so no
// period is cut short and past periods keep their shape; the database enforces that (company_cadences lock).
// The rules live in src/core/plan.ts (CADENCES, cadenceFor, nextCadenceWeek) and src/core/staterules.ts.
import { useState } from "react";
import { CADENCES, cadenceFor, nextCadenceWeek, type Cadence, type CadenceSetting, type PlanInput } from "@/core/plan";
import { cadenceWarning } from "@/core/staterules";
import type { IndustryId } from "@/core/industries";
import { isoDay, parseDay, weekLabel } from "@/core/weeks";
import { removeCadence, saveCadence } from "@/lib/data/plan";
import { Button, Notice } from "@/components/ui";

type Msg = { tone: "error" | "ok"; text: string } | null;
type Props = {
  companyId: string; industry: IndustryId; state: string | undefined;
  input: Omit<PlanInput, "today">; cadences: CadenceSetting[]; reload: () => void;
  /** Kept by the parent so the message survives the reload after a save. */
  msg: Msg; setMsg: (m: Msg) => void;
};

const nameOf = (w: Cadence) => CADENCES.find((c) => c.weeks === w)?.name ?? `Every ${w} weeks`;

export function CadencePicker({ companyId, industry, state, input, cadences, reload, msg, setMsg }: Props) {
  const today = isoDay(new Date());
  const startWeek = nextCadenceWeek(input);
  const pending = cadences.find((c) => c.from_week > today) ?? null;
  const now = cadenceFor(cadences, today);
  const upcoming = pending?.weeks ?? now;
  const [pick, setPick] = useState<Cadence>(upcoming);
  const [busy, setBusy] = useState(false);
  const warning = cadenceWarning(state, industry, pick);

  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true); setMsg(null);
    try { await fn(); reload(); setMsg({ tone: "ok", text: ok }); }
    catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  const save = () =>
    // Going back to what's in effect now just cancels the waiting change.
    pick === now && pending
      ? run(() => removeCadence(companyId, pending.from_week), `Staying with ${nameOf(now).toLowerCase()}.`)
      : run(() => saveCadence(companyId, startWeek, pick), `${nameOf(pick)} starts the week of ${weekLabel(parseDay(startWeek))}.`);

  return (
    <section aria-label="How often" className="rounded-lg border border-line bg-surface p-3">
      <h2 className="font-display text-lg font-semibold">How often</h2>
      <p className="text-sm text-muted">
        Now: {nameOf(now).toLowerCase()}.
        {pending ? ` Changing to ${nameOf(pending.weeks).toLowerCase()} the week of ${weekLabel(parseDay(pending.from_week))}.` : ""}
      </p>
      <div role="radiogroup" aria-label="How often" className="mt-2 flex flex-col gap-1.5">
        {CADENCES.map((c) => (
          <label key={c.weeks} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-2.5 ${pick === c.weeks ? "border-brand" : "border-line"}`}>
            <input type="radio" name="cadence" className="mt-1 size-5 shrink-0 accent-[var(--brand)]" checked={pick === c.weeks} onChange={() => setPick(c.weeks)} />
            <span><span className="block font-semibold">{c.name}</span><span className="block text-xs text-muted">{c.sub}</span></span>
          </label>
        ))}
      </div>
      {warning && <div className="mt-2"><Notice tone="error">{warning}</Notice></div>}
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      {pick !== upcoming && (
        <Button className="mt-2" type="button" disabled={busy} onClick={save}>
          {pick === now && pending ? `Keep ${nameOf(now).toLowerCase()}` : `Switch to ${nameOf(pick).toLowerCase()} · starts ${weekLabel(parseDay(startWeek))}`}
        </Button>
      )}
      <p className="mt-2 text-xs text-muted">A change starts when the current talk period ends. Talks already planned and given stay as they are.</p>
    </section>
  );
}
