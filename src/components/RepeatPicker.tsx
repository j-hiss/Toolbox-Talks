"use client";

// Admin → Plan → Repeat talks: a talk that comes back every 3, 6 or 12 months. A change starts next week, so weeks
// already planned keep their talks; the database enforces that (company_repeats lock). Rules in src/core/plan.ts;
// what each rule asks to be repeated in src/content/repeats.ts.
import { useState } from "react";
import { REPEAT_CHOICES, isSeasonal, nextListWeek, repeatsFor, talksInPlan, type PlanInput, type RepeatEvery, type RepeatSetting } from "@/core/plan";
import { REPEAT_NOTES, repeatNoteText } from "@/content/repeats";
import { isoDay, parseDay, weekLabel } from "@/core/weeks";
import { removeRepeat, saveRepeat } from "@/lib/data/plan";
import { Button, Notice, inputClass } from "@/components/ui";

type Props = { companyId: string; input: Omit<PlanInput, "today">; repeats: RepeatSetting[]; reload: () => void };

export function RepeatPicker({ companyId, input, repeats, reload }: Props) {
  const start = nextListWeek();
  const today = isoDay(new Date());
  const now = repeatsFor(repeats, today);
  const upcoming = repeatsFor(repeats, start);
  const pending = repeats.filter((r) => r.from_week > today);
  const talks = talksInPlan(input, start).filter((t) => !isSeasonal(t.id));
  const allTalks = input.talks.filter((t) => !isSeasonal(t.id));
  const name = (id: string) => input.talks.find((t) => t.id === id)?.content.en.title ?? id;
  const [talkId, setTalkId] = useState("");
  const [every, setEvery] = useState<Exclude<RepeatEvery, 0>>(12);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const note = talkId ? REPEAT_NOTES[talkId] : undefined;

  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true); setMsg(null);
    try { await fn(); reload(); setMsg({ tone: "ok", text: ok }); } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  const everyName = (weeks: number) => REPEAT_CHOICES.find((c) => c.weeks === weeks)?.name.toLowerCase() ?? `every ${weeks} weeks`;

  return (
    <section aria-label="Repeat talks" className="mt-4 rounded-lg border border-line bg-surface p-3">
      <h2 className="font-display text-lg font-semibold">Repeat talks</h2>
      <p className="text-sm text-muted">Bring a talk back on a schedule, on top of the rotation. Changes start the week of {weekLabel(parseDay(start))}.</p>

      {upcoming.length + now.length === 0 ? (
        <p className="mt-2 text-sm text-muted">None yet.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {[...new Set([...now, ...upcoming].map((r) => r.talkId))].map((id) => {
            const cur = now.find((r) => r.talkId === id);
            const next = upcoming.find((r) => r.talkId === id);
            const waiting = pending.find((r) => r.talk_id === id);
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-bg px-3 py-2 text-sm">
                <span className="min-w-0">
                  <b className="block">{name(id)}</b>
                  <small className="text-muted">
                    {cur ? `Now ${everyName(cur.weeks)}` : "Not yet"}
                    {waiting ? ` · from ${weekLabel(parseDay(waiting.from_week))}: ${next ? everyName(next.weeks) : "stops"}` : ""}
                  </small>
                </span>
                {waiting ? (
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => run(() => removeRepeat(companyId, id, waiting.from_week), "Change undone.")}>Undo change</Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => run(() => saveRepeat(companyId, id, start, 0), `${name(id)} stops repeating from the week of ${weekLabel(parseDay(start))}.`)}>Stop</Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <select aria-label="Talk to repeat" className={inputClass} value={talkId} onChange={(e) => setTalkId(e.target.value)}>
          <option value="">Choose a talk to repeat</option>
          {(talks.length ? talks : allTalks).map((t) => <option key={t.id} value={t.id}>{t.content.en.title}{REPEAT_NOTES[t.id] ? " · has a yearly rule" : ""}</option>)}
        </select>
        <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-line" role="radiogroup" aria-label="How often">
          {REPEAT_CHOICES.map((c) => (
            <button key={c.months} role="radio" aria-checked={every === c.months} onClick={() => setEvery(c.months)}
              className={`min-h-11 px-2 text-sm font-semibold ${every === c.months ? "bg-brand text-brand-ink" : "bg-surface"}`}>{c.name}</button>
          ))}
        </div>
        {note && <Notice tone="caution">{repeatNoteText(note)}</Notice>}
        <Button size="sm" disabled={busy || !talkId} onClick={() => run(() => saveRepeat(companyId, talkId, start, every),
          `${name(talkId)} comes back ${REPEAT_CHOICES.find((c) => c.months === every)!.name.toLowerCase()}, starting the week of ${weekLabel(parseDay(start))}.`)}>
          Add repeat
        </Button>
      </div>
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      <p className="mt-2 text-xs text-muted">A repeat puts the talk in the first open week of each 3, 6 or 12 months. The rotation carries on after it. Talks already given stay as they are.</p>
    </section>
  );
}
