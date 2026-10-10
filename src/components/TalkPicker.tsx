"use client";

// Admin → Talks: pick which talks the company's plan draws from. Starts with the industry's talks plus the
// Every-job set; an admin can drop talks or add ones from other industries (a roofer with a shop, a warehouse that
// runs trucks). A new list starts next Monday, so weeks already planned keep their talks; the database enforces it.
// The plan rules themselves live in src/core/plan.ts (talksInPlan, nextListWeek, talkListProblem).
import { useMemo, useState } from "react";
import { useTalks } from "@/lib/library";
import { isOwnTalk } from "@/core/ownTalks";
import { INDUSTRIES, industryTags, type IndustryId } from "@/core/industries";
import { isSeasonal, listFor, nextListWeek, talkListProblem, talksInPlan, type PlanInput, type TalkList } from "@/core/plan";
import { talkFitsClimate, type Talk } from "@/core/talks";
import { isoDay, mondayOf, parseDay, weekLabel } from "@/core/weeks";
import { removeTalkList, saveTalkList } from "@/lib/data/plan";
import { Button, GroupHeading, Notice, inputClass } from "@/components/ui";

const industryName = (id: IndustryId | "all") => (id === "all" ? "Every job" : INDUSTRIES.find((i) => i.id === id)?.name ?? id);

type Msg = { tone: "error" | "ok"; text: string } | null;
type Props = {
  companyId: string; industry: IndustryId; input: Omit<PlanInput, "today">; lists: TalkList[]; reload: () => void;
  /** Kept by the parent so the message survives the reload after a save. */
  msg: Msg; setMsg: (m: Msg) => void;
};

export function TalkPicker({ companyId, industry, input, lists, reload, msg, setMsg }: Props) {
  const startWeek = nextListWeek();
  const thisMonday = isoDay(mondayOf(new Date()));
  const pending = lists.find((l) => l.from_week > thisMonday) ?? null;
  // What the plan will use from next week: a list already waiting for that week, else whatever is in effect now.
  const current = useMemo(() => new Set(talksInPlan(input, startWeek).map((t) => t.id)), [input, startWeek]);
  const [picked, setPicked] = useState<Set<string>>(current);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<"mine" | "all" | IndustryId>("mine");
  const [busy, setBusy] = useState(false);
  const TALKS = useTalks(); // the library plus the company's own talks

  const tags = industryTags(industry);
  const mine = (t: Talk) => t.industries.includes("all") || tags.some((i) => t.industries.includes(i));
  const usable = TALKS.filter((t) => talkFitsClimate(t, input.climate));
  const q = query.trim().toLowerCase();
  const shown = usable.filter((t) => {
    if (show === "mine" && !mine(t) && !picked.has(t.id) && !isOwnTalk(t.id)) return false;
    if (show !== "mine" && show !== "all" && !t.industries.includes(show) && !isOwnTalk(t.id)) return false;
    return !q || `${t.content.en.title} ${t.code}`.toLowerCase().includes(q);
  });
  const groups: { label: string; talks: Talk[] }[] = [
    { label: "Your own talks", talks: shown.filter((t) => isOwnTalk(t.id)) },
    { label: "Every job", talks: shown.filter((t) => t.industries.includes("all")) },
    { label: industryName(industry), talks: shown.filter((t) => !t.industries.includes("all") && mine(t)) },
    { label: "Other industries", talks: shown.filter((t) => !mine(t) && !isOwnTalk(t.id)) },
  ].filter((g) => g.talks.length > 0);

  const changed = picked.size !== current.size || [...picked].some((id) => !current.has(id));
  const problem = talkListProblem(picked, TALKS);
  const rotation = [...picked].filter((id) => !isSeasonal(id)).length;
  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true); setMsg(null);
    try { await fn(); reload(); setMsg({ tone: "ok", text: ok }); }
    catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  const save = () => run(
    () => saveTalkList(companyId, startWeek, TALKS.filter((t) => picked.has(t.id)).map((t) => t.id)),
    "Saved.",
  );
  const undo = (l: TalkList) => run(
    () => removeTalkList(companyId, l.from_week),
    "Change undone. Your plan keeps the talks it has now.",
  );
  const active = listFor(lists, thisMonday);

  return (
    <>
      <p className="text-sm text-muted">
        Pick the talks your plan draws from. Heat, cold and storm prep come up by season; the rest take turns. Changes
        start the week of {weekLabel(parseDay(startWeek))}, so weeks already planned keep their talks.
      </p>
      <p className="mt-2 text-sm text-muted">
        {active ? `Your plan uses ${active.talk_ids.length} picked talks.` : `Your plan uses every talk for ${industryName(industry)} plus the Every-job talks.`}
      </p>
      {pending && (
        <div className="mt-3">
          <Notice>
            A new list of {pending.talk_ids.length} talks starts the week of {weekLabel(parseDay(pending.from_week))}.{" "}
            <button type="button" className="font-semibold underline" disabled={busy} onClick={() => undo(pending)}>Undo it</button>
          </Notice>
        </div>
      )}
      {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input aria-label="Search talks" placeholder="Search talks or OSHA numbers" className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Show talks for" className={`${inputClass} sm:max-w-56`} value={show} onChange={(e) => setShow(e.target.value as typeof show)}>
          <option value="mine">My industry and picked</option>
          <option value="all">All {usable.length} talks</option>
          {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">{picked.size} picked · {rotation} take turns</span>
        <Button size="sm" variant="ghost" type="button" onClick={() => setPicked(new Set(usable.filter((t) => mine(t) || (isOwnTalk(t.id) && picked.has(t.id))).map((t) => t.id)))}>Use my industry&apos;s talks</Button>
      </div>

      {groups.length === 0 && <p className="mt-4 text-sm text-muted">No talks match.</p>}
      {groups.map((g) => (
        <section key={g.label} className="mt-4">
          <GroupHeading aside={`${g.talks.filter((t) => picked.has(t.id)).length} of ${g.talks.length}`}>{g.label}</GroupHeading>
          <ul className="mt-2 flex flex-col gap-1.5">
            {g.talks.map((t) => {
              const on = picked.has(t.id);
              return (
                <li key={t.id}>
                  <label className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3 ${on ? "border-brand bg-surface" : "border-line bg-surface"}`}>
                    <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--brand)]" checked={on} onChange={() => toggle(t.id)} />
                    <span className="min-w-0">
                      <span className="block font-semibold">{t.content.en.title}</span>
                      <span className="block text-xs text-muted">
                        {t.code} · {t.minutes} min{isSeasonal(t.id) ? " · by season" : ""}
                        {t.content.es ? ` · Spanish ${t.translationStatus.es === "reviewed" ? "reviewed" : "draft"}` : ""}
                      </span>
                      {!t.industries.includes("all") && !isOwnTalk(t.id) && (
                        <span className="mt-0.5 block text-xs text-muted">{t.industries.map((i) => industryName(i)).join(", ")}</span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="sticky bottom-0 mt-4 flex flex-col gap-2 border-t border-line bg-bg py-3">
        {changed && problem && <Notice tone="error">{problem}</Notice>}
        <Button type="button" disabled={!changed || !!problem || busy} onClick={save}>
          {changed ? `Save ${picked.size} talks · starts ${weekLabel(parseDay(startWeek))}` : "No changes"}
        </Button>
      </div>
    </>
  );
}
