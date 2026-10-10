"use client";

// Giving a talk: (choose a missed week, for makeups) → read → who's here → sign → saved. This week's talk is locked:
// every crew gives the same one. A makeup gives a missed week's talk, keeps today's real date and GPS, and says why. The talk in progress lives in a draft on the phone
// (src/lib/draft.ts), and the finished record goes through the offline outbox (src/lib/outbox.ts).
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TALKS } from "@/content/talks";
import { crewText, signingStatement } from "@/content/ui";
import { talkText } from "@/core/talks";
import { MAKEUP_REASONS, makeupReasonText, makeupWeeks, stillNeeds } from "@/core/makeup";
import { parseDay, periodLabel } from "@/core/weeks";
import { weekNumbers } from "@/core/plan";
import { LANGUAGES, type LanguageId } from "@/core/languages";
import { buildAttendees, recordPayload, unsignedPresent, type RosterEntry, type Signature } from "@/core/record";
import { countStatuses, signedSummary } from "@/core/attendance";
import { presentersFrom, titleOf } from "@/core/presenters";
import { listJobsites, listPeople, listRoles, listTeams } from "@/lib/data/company";
import { saveTalkRecord, signedForWeek } from "@/lib/data/records";
import { usePlan } from "@/lib/usePlan";
import { useOpenMakeups, type OpenMakeups } from "@/lib/useOpenMakeups";
import { useHeatCheck } from "@/lib/useHeatCheck";
import { alertWorthy, HEAT_LABEL, type HeatLevel } from "@/core/heat";
import { HEAT_REMINDER_VERSION, heatReminder, heatReminderReviewed } from "@/content/heat";
import { REPEAT_NOTES, repeatNoteText } from "@/content/repeats";
import { addDays, isoDay } from "@/core/weeks";
import { readWalkinCompanies, rememberWalkinCompany, writeLastSetup } from "@/lib/lastSetup";
import { buzz, dismissToast, toast } from "@/components/toast";
import type { Company, Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { sinceLastSettings, sinceLastSnapshot } from "@/core/safetylog";
import { loadSinceLast } from "@/lib/sinceLast";
import { clearDraft, newDailyDraft, newDraft, readDraft, useDraft, writeDraft, type DraftIssue, type TalkDraft } from "@/lib/draft";
import { enqueue, flush, pending } from "@/lib/outbox";
import { CrewPhoto } from "@/components/CrewPhoto";
import { PretaskPlanStep } from "@/components/PretaskPlanStep";
import { SignatureRule } from "@/components/Logo";
import { DAILY_STATEMENT, DAILY_STATEMENT_VERSION, PRETASK_TALK_ID, pretaskContent, tidyPlan } from "@/core/pretask";
import { getLocation } from "@/lib/location";
import { speakLines, speechAvailable, stopSpeaking } from "@/lib/speech";
import { RequireCompany } from "@/components/Guard";
import { SignaturePad } from "@/components/SignaturePad";
import { readChosenJobsite } from "@/components/JobsitePicker";
import { Button, ConfirmButton, ErrorNotice, Eyebrow, Field, GroupHeading, Loading, NavLink, Notice, Shell, Title, inputClass, Avatar } from "@/components/ui";

export default function TalkPage() {
  return <RequireCompany need="present">{(m) => <Talk m={m} />}</RequireCompany>;
}

type Org = { people: Person[]; teams: Team[]; roles: Role[]; jobsites: Jobsite[] };
type Done = { kind: "weekly" | "daily"; talkId: string; jobsiteId: string; title: string; uploaded: boolean; counts: ReturnType<typeof countStatuses>; presenterSigned: boolean; makeupLabel: string | null; issues: number };

function Talk({ m }: { m: Membership }) {
  const co = m.company;
  const router = useRouter();
  const draft = useDraft(co.id);
  const [org, setOrg] = useState<Org | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    Promise.all([listPeople(co.id), listTeams(co.id), listRoles(co.id), listJobsites(co.id)])
      .then(([people, teams, roles, jobsites]) => { if (live) { setError(null); setOrg({ people, teams, roles, jobsites }); } })
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [co.id, attempt]);

  // A message (like "marked absent · Undo") belongs to the step it was shown on. Moving on, or saving, clears it,
  // so an old Undo can never write a talk back after it was saved.
  const step = draft?.step;
  useEffect(() => { dismissToast(); }, [step, done]);

  const { week, input } = usePlan(co);
  const openMakeups = useOpenMakeups(co, input);

  // Who has already signed for the week this talk counts toward, for the "everyone who still needs it" roster.
  const creditKey = draft?.makeup?.weekStart ?? week?.key ?? null;
  const [signed, setSigned] = useState<{ key: string; ids: string[] } | null>(null);
  useEffect(() => {
    if (!creditKey) return;
    let live = true;
    signedForWeek(co.id, creditKey).then((ids) => live && setSigned({ key: creditKey, ids })).catch(() => { /* offline: option hidden */ });
    return () => { live = false; };
  }, [co.id, creditKey]);
  const signedIds = signed && signed.key === creditKey ? signed.ids : null;

  const nav = <NavLink href="/">Home</NavLink>;
  if (done) {
    return (
      <Shell nav={nav}>
        <Saved done={done} onAnother={() => {
          // Same talk (or a fresh daily plan) for the next crew, with the roster cleared.
          const d = done.kind === "daily" ? newDailyDraft(co.id, done.jobsiteId) : newDraft(co.id, done.talkId, done.jobsiteId);
          writeDraft({ ...d, teamId: "" }); setDone(null);
        }} />
      </Shell>
    );
  }
  if (error) return <Shell nav={nav}><ErrorNotice what="Couldn't load your team." detail={error} onRetry={() => { setError(null); setAttempt((a) => a + 1); }} /></Shell>;
  if (!draft) {
    return (
      <Shell nav={nav}>
        <Eyebrow>Toolbox talk</Eyebrow>
        <Title>No talk in progress</Title>
        <div className="mt-5 flex flex-col gap-3">
          {week && <Button onClick={() => newDraft(co.id, week.talkId, readChosenJobsite(co.id) ?? "")}>Start this week&apos;s talk</Button>}
          {co.daily_enabled && <Button variant="soft" onClick={() => newDailyDraft(co.id, readChosenJobsite(co.id) ?? "")}>Start today&apos;s pre-task plan</Button>}
          {/* Only when someone owes a past talk (or we can't tell, offline): never a button into a dead end. */}
          {(openMakeups === null || [...openMakeups.values()].some((p) => p.length > 0)) && (
            <Button variant="ghost" size="sm" onClick={() => newDraft(co.id, null, readChosenJobsite(co.id) ?? "")}>Make up a missed talk</Button>
          )}
        </div>
      </Shell>
    );
  }
  if (!org) return <Shell nav={nav} tabs={false}><Loading /></Shell>;

  const update = (patch: Partial<TalkDraft>) => writeDraft({ ...draft, ...patch });
  // Discarding throws away everything collected, signatures included, so it takes a second tap.
  const nSigs = Object.keys(draft.signatures).length + (draft.presenterSignature ? 1 : 0);
  const cancel = (
    <ConfirmButton
      label="Discard this talk"
      confirmLabel={nSigs ? `Tap again to delete ${nSigs} ${nSigs === 1 ? "signature" : "signatures"}` : "Tap again to discard"}
      onConfirm={() => { stopSpeaking(); dismissToast(); clearDraft(co.id); router.replace("/"); }}
    />
  );

  // While the phone is going hand to hand for signatures, leaving takes a second tap (the talk stays saved here).
  const signing = draft.step === "sign";
  const exit = <ConfirmButton label="Exit" confirmLabel="Tap again to leave" onConfirm={() => { stopSpeaking(); router.push("/"); }} />;
  return (
    <Shell nav={signing ? exit : nav} tabs={false} lockHeader={signing}>
      {draft.step === "makeup" && <MakeupPick weeks={makeupWeeks(input, co.makeup_weeks ?? 4)} draft={draft} update={update} open={openMakeups} />}
      {draft.step === "read" && draft.talkId && <Read co={co} draft={draft} update={update} org={org} />}
      {draft.step === "plan" && draft.pretask && <PretaskPlanStep draft={draft} update={update} jobsites={org.jobsites} />}
      {draft.step === "crew" && <Crew org={org} draft={draft} update={update} signedIds={signedIds} />}
      {draft.step === "sign" && (
        <Sign
          m={m}
          org={org}
          draft={draft}
          update={update}
          week={week ? { number: week.n, start: week.key, scheduledTalkId: week.talkId, weeks: week.weeks } : null}
          onSaved={(d) => { dismissToast(); clearDraft(co.id); setDone(d); }}
        />
      )}
      <div className="mt-10 border-t border-line pt-4 text-center">{cancel}</div>
    </Shell>
  );
}

// The three steps of giving a talk, named, so the presenter always sees what's next. A real sequence, so numbered.
const STEP_NAMES = ["Read", "Who's here", "Sign"] as const;
function Steps({ n, label }: { n: 1 | 2 | 3; label: string }) {
  return (
    <div className="mb-4">
      <p className="sr-only">Step {n} of 3: {label}</p>
      <ol className="flex gap-1.5" aria-hidden>
        {STEP_NAMES.map((name, j) => {
          const i = j + 1;
          return (
            <li key={name} className="flex-1">
              <span className={`block h-1.5 rounded-full ${i <= n ? "bg-brand" : "bg-line"}`} />
              <span className={`mt-1.5 flex items-center gap-1.5 text-[13px] ${i === n ? "font-semibold text-fg" : i < n ? "text-brand-text" : "text-muted"}`}>
                <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${i < n ? "bg-brand text-brand-ink" : i === n ? "bg-fg text-bg" : "bg-line text-muted"}`}>{i < n ? "✓" : i}</span>
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function MakeupPick({ weeks, draft, update, open }: {
  weeks: ReturnType<typeof makeupWeeks>; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; open: OpenMakeups | null;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const reason = makeupReasonText(draft.makeupPick, draft.makeupNote);
  const owed = (key: string) => open?.get(key) ?? [];
  const choose = (w: (typeof weeks)[number]) => {
    const people = owed(w.key);
    update({
      makeup: { weekStart: w.key, weekNumber: w.n, weeks: w.weeks }, talkId: w.talkId,
      // the roster is the people who still owe that week; the presenter can still change it on the next screen
      teamId: people.length ? "needs" : draft.teamId === "needs" ? "" : draft.teamId,
      needIds: people.length ? people.map((p) => p.id) : null,
      present: {},
    });
  };
  // One week with people owing it and nothing chosen yet: pick it for them.
  const withOwed = weeks.filter((w) => owed(w.key).length > 0);
  useEffect(() => {
    if (!draft.makeup && withOwed.length === 1) choose(withOwed[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const chosenPeople = draft.makeup && draft.needIds
    ? draft.needIds.map((id) => owed(draft.makeup!.weekStart).find((p) => p.id === id)?.name).filter(Boolean)
    : [];

  return (
    <>
      <Eyebrow>Makeup talk</Eyebrow>
      <Title>Make up a missed talk</Title>
      <p className="mt-2 text-sm text-muted">Saved with today&apos;s real date, marked as a makeup for the week or talk period you pick.</p>
      <GroupHeading>Which talk?</GroupHeading>
      {weeks.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No earlier talks to make up yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Week to make up">
          {weeks.map((w) => {
            const t = TALKS.find((x) => x.id === w.talkId)!;
            const on = draft.makeup?.weekStart === w.key;
            const people = owed(w.key);
            return (
              <button
                key={w.key}
                role="radio"
                aria-checked={on}
                onClick={() => choose(w)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${on ? "border-brand bg-surface shadow-[0_0_0_2px_var(--brand)]" : "border-line bg-surface"} ${open && !people.length && !on ? "opacity-60" : ""}`}
              >
                <span className="mt-0.5 whitespace-nowrap rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-text">{t.code}</span>
                <span className="min-w-0 flex-1">
                  <b className="block">{t.content.en.title}</b>
                  <small className="text-muted">{weekNumbers(w)} · {periodLabel(w.monday, w.weeks)}</small>
                  {open && (
                    <small className={`block ${people.length ? "font-semibold" : "text-muted"}`}>
                      {people.length ? `${people.length} still need it: ${people.map((p) => p.name).join(", ")}` : `Everyone has this ${w.weeks > 1 ? "talk" : "week"}`}
                    </small>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {draft.makeup && chosenPeople.length > 0 && chosenPeople.length < owed(draft.makeup.weekStart).length && (
        <p className="mt-2 text-sm">Making up for: <b>{chosenPeople.join(", ")}</b></p>
      )}
      <GroupHeading>Why?</GroupHeading>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Reason">
        {MAKEUP_REASONS.map((r) => (
          <button
            key={r}
            aria-pressed={draft.makeupPick === r}
            onClick={() => { setMsg(null); update({ makeupPick: r }); }}
            className={`min-h-11 rounded-full border px-3.5 text-sm font-semibold ${draft.makeupPick === r ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
          >
            {r}
          </button>
        ))}
      </div>
      {(draft.makeupPick === "Other" || draft.makeupNote) && (
        <input
          aria-label="Note"
          placeholder={draft.makeupPick === "Other" ? "Say why (required)" : "Note (optional)"}
          className={`${inputClass} mt-3`}
          value={draft.makeupNote}
          onChange={(e) => update({ makeupNote: e.target.value })}
        />
      )}
      {draft.makeupPick && draft.makeupPick !== "Other" && !draft.makeupNote && (
        <button className="mt-2 min-h-11 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => update({ makeupNote: " " })}>+ Add a note</button>
      )}
      {msg && <div className="mt-4"><Notice tone="error">{msg}</Notice></div>}
      <div className="sticky bottom-0 -mx-4 mt-5 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button
          disabled={weeks.length === 0}
          onClick={() => {
            if (!draft.makeup || !draft.talkId) return setMsg("Pick the week being made up.");
            if (!reason) return setMsg(draft.makeupPick === "Other" ? "Add a note saying why." : "Pick a reason.");
            setMsg(null);
            update({ step: "read", makeupNote: draft.makeupNote.trim() });
          }}
        >
          Continue to the talk
        </Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Read({ co, draft, update, org }: { co: Company; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; org: Org }) {
  const talk = TALKS.find((t) => t.id === draft.talkId)!;
  const { text } = talkText(talk, draft.lang);
  // Only languages this talk can be read in; the rest are one "coming" line, not a row of greyed chips.
  const langs = LANGUAGES.filter((l) => l.ready && !!talk.content[l.id]);
  const ui = crewText(draft.lang);
  // The presenter's own controls stay in the app's language; only the talk and what the crew signs follow theirs.
  const pui = crewText("en");
  const [line, setLine] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  // Bigger text for reading in sun glare; remembered on this phone.
  const [size, setSizeState] = useState<number>(() => { try { return Number(localStorage.getItem("tt-text-size")) || 0; } catch { return 0; } });
  const setSize = (n: number) => { setSizeState(n); try { localStorage.setItem("tt-text-size", String(n)); } catch { /* fine */ } };
  const textSize = ["text-base", "text-lg", "text-xl", "text-2xl"][size];
  const stopRef = useRef<(() => void) | null>(null);
  useEffect(() => () => stopRef.current?.(), []);
  const [editingNotes, setEditingNotes] = useState(false);

  // Heat: hot days add the heat reminder to the talk (src/lib/useHeatCheck.ts).
  const heatMsg = useHeatCheck(draft, org.jobsites);
  // Since last talk: the safety log's approved crew summaries, when the company reads them at talks. Not for makeups
  // (a makeup covers an earlier talk). Loaded once into the draft, so it stays put offline and as the crew reads.
  const useSinceLast = sinceLastSettings(co).enabled && !draft.makeup;
  useEffect(() => {
    if (!useSinceLast || draft.sinceLast) return;
    let live = true;
    loadSinceLast(co, draft.jobsiteId || null).then((sl) => {
      const cur = readDraft(draft.companyId);
      if (live && cur && !cur.sinceLast) writeDraft({ ...cur, sinceLast: sl });
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSinceLast, draft.jobsiteId]);
  const since = useSinceLast ? draft.sinceLast : undefined;
  const sinceItems = since?.status === "read" ? since.items : [];
  const unchecked = sinceItems.filter((i) => !since?.checked[i.event_id]).length;
  const hot = !!draft.heat && alertWorthy(draft.heat.level as HeatLevel) && talk.id !== "heat";
  const reminder = heatReminder(draft.lang);
  const notes = draft.siteNotes.trim();

  type Line = { text: string; heading?: boolean; kind: "title" | "hook" | "h" | "item" | "askh" | "ask" | "noteh" | "note" | "heath" | "heat" | "sinceh" | "sincei" | "since"; eventId?: string };
  const lines = useMemo(() => {
    const out: Line[] = [
      { text: text.title, heading: true, kind: "title" },
      { text: text.hook, kind: "hook" },
    ];
    if (notes) out.push({ text: draft.lang === "es" ? "Hoy en este sitio" : "Today on this site", heading: true, kind: "noteh" }, { text: notes, kind: "note" });
    if (hot) {
      out.push({ text: `${reminder.title} · ${draft.heat!.max_heat_index_f}°F`, heading: true, kind: "heath" });
      reminder.items.forEach((i) => out.push({ text: i, kind: "heat" }));
    }
    if (since && since.status !== "unavailable") {
      out.push({ text: "Since last talk", heading: true, kind: "sinceh" });
      if (since.status === "none") out.push({ text: "No new inspections, citations, incidents or near misses logged.", kind: "since" });
      since.items.forEach((i) => out.push({ text: i.heading, kind: "sincei", eventId: i.event_id }, { text: i.text, kind: "since", eventId: i.event_id }));
    }
    text.sections.forEach((s) => {
      out.push({ text: s.heading, heading: true, kind: "h" });
      s.items.forEach((i) => out.push({ text: i, kind: "item" }));
    });
    out.push({ text: ui.ask, heading: true, kind: "askh" }, { text: text.ask, kind: "ask" });
    return out;
  }, [text, ui.ask, notes, hot, reminder, draft.lang, draft.heat, since]);

  const voice = LANGUAGES.find((l) => l.id === draft.lang)!.voice;
  const playing = line !== null;
  const toggle = () => {
    if (playing) { stopRef.current?.(); setLine(null); setStatus(null); return; }
    if (!speechAvailable()) { setStatus(pui.noVoice); return; }
    setStatus(pui.reading);
    stopRef.current = speakLines(lines, voice, {
      onLine: (i) => { setLine(i); document.getElementById(`line-${i}`)?.scrollIntoView({ block: "center", behavior: "smooth" }); },
      onDone: () => { setLine(null); setStatus(null); },
      onError: () => { setLine(null); setStatus(pui.noVoice); },
    });
  };
  const hl = (i: number) => (line === i ? "rounded bg-caution-bg shadow-[0_0_0_4px_var(--caution-bg)]" : "");

  return (
    <>
      <Steps n={1} label="Read to the team" />
      <MakeupBanner draft={draft} />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Language">
        {langs.map((l) => (
          <button
            key={l.id}
            aria-pressed={draft.lang === l.id}
            onClick={() => { stopRef.current?.(); setLine(null); update({ lang: l.id as LanguageId }); }}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${draft.lang === l.id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
          >
            {l.label}
          </button>
        ))}
        {LANGUAGES.some((l) => !l.ready) && <span className="self-center text-sm text-muted">More languages coming</span>}
      </div>
      <div className="mt-2 flex items-center gap-1.5" role="group" aria-label="Text size">
        <span className="mr-1 text-sm text-muted">Text size</span>
        <button className="min-h-11 min-w-11 rounded-md border border-line bg-surface text-sm font-semibold disabled:opacity-40" disabled={size === 0} onClick={() => setSize(size - 1)} aria-label="Smaller text">A−</button>
        <button className="min-h-11 min-w-11 rounded-md border border-line bg-surface text-lg font-semibold disabled:opacity-40" disabled={size === 3} onClick={() => setSize(size + 1)} aria-label="Bigger text">A+</button>
      </div>
      {draft.lang !== "en" && (talk.translationStatus[draft.lang] !== "reviewed" || (hot && !heatReminderReviewed[draft.lang])) && (
        <div className="mt-2"><Notice tone="caution">This translation hasn&apos;t been reviewed by a native speaker yet. Check anything that sounds wrong against the English.</Notice></div>
      )}

      {draft.heat && alertWorthy(draft.heat.level as HeatLevel) && (
        <p className="mt-3 rounded-lg border-2 border-warn bg-warn-bg px-3 py-2 text-sm">
          <b>{HEAT_LABEL[draft.heat.level as HeatLevel]}: heat index up to {draft.heat.max_heat_index_f}°F today</b>
          {draft.heat.place ? ` · ${draft.heat.place}` : ""}. {talk.id === "heat" ? "Good week for this talk." : "The heat reminder is added to this talk."}
        </p>
      )}
      {heatMsg && !draft.heat && <p className="mt-2 text-xs text-muted">Heat check unavailable: {heatMsg}</p>}
      {/* A rule asks for something on a schedule (yearly training, a 3-year evaluation): say so, and that this talk isn't it. */}
      {REPEAT_NOTES[talk.id] && <div className="mt-2"><Notice tone="caution">{repeatNoteText(REPEAT_NOTES[talk.id])}</Notice></div>}
      {since?.status === "unavailable" && (
        <div className="mt-2"><Notice tone="caution">Couldn&apos;t load the safety log for &ldquo;Since last talk&rdquo; (no signal?). The talk saves without it, marked as not loaded.</Notice></div>
      )}

      <div className="mt-3">
        {editingNotes || notes ? (
          <div className="rounded-lg border border-dashed border-line bg-surface p-3">
            <label htmlFor="site-notes" className="text-sm font-semibold">Today on this site <small className="font-normal text-muted">read to the team, saved with the record</small></label>
            <textarea
              id="site-notes"
              rows={2}
              maxLength={1000}
              placeholder="Like: working over the pool enclosure, tie off at the ridge anchor"
              className={`${inputClass} mt-1`}
              value={draft.siteNotes}
              onChange={(e) => update({ siteNotes: e.target.value })}
            />
          </div>
        ) : (
          <button className="min-h-11 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => setEditingNotes(true)}>+ Add today&apos;s site notes</button>
        )}
      </div>

      <h1 id="line-0" className={`mt-5 font-display text-[36px] font-extrabold leading-[1.04] text-balance tracking-[-0.03em] ${hl(0)}`}>{text.title}</h1>
      <SignatureRule className="mt-3" />
      <p className="mt-2 text-sm text-muted tabular-nums">{talk.code} · about {talk.minutes} min</p>
      {status && <p className="mt-2 text-sm text-muted" aria-live="polite">{status}</p>}

      <div className={`mt-4 rounded-2xl bg-surface shadow-card px-5 py-5 leading-relaxed ${textSize}`}>
        {lines.slice(1).map((l, j) => {
          const i = j + 1;
          if (l.kind === "hook") return <p key={i} id={`line-${i}`} className={`font-display text-[1.15em] font-bold leading-snug tracking-[-0.01em] ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "noteh" || l.kind === "heath") return <h3 key={i} id={`line-${i}`} className={`mt-4 font-display text-lg font-semibold ${l.kind === "heath" ? "text-warn-text" : ""} ${hl(i)}`}>{l.text}</h3>;
          if (l.kind === "note") return <p key={i} id={`line-${i}`} className={`mt-1 rounded-r border-l-4 border-fg bg-bg px-3 py-2 font-semibold ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "heat") return <p key={i} id={`line-${i}`} className={`mt-1.5 border-l-4 border-warn pl-4 before:-ml-2 before:mr-2 before:content-['•'] ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "sinceh") return <h3 key={i} id={`line-${i}`} className={`mt-4 font-display text-lg font-semibold ${hl(i)}`}>{l.text}{draft.lang !== "en" && <small className="ml-2 font-sans text-xs font-normal text-muted">in English</small>}</h3>;
          if (l.kind === "sincei") return <p key={i} id={`line-${i}`} className={`mt-3 text-sm font-semibold text-muted ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "since") {
            const id = l.eventId;
            return (
              <div key={i}>
                <p id={`line-${i}`} className={`mt-1 rounded-r border-l-4 border-brand bg-bg px-3 py-2 ${hl(i)}`}>{l.text}</p>
                {id && (
                  <label className="mt-1 flex min-h-11 items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={!!since?.checked[id]}
                      onChange={(e) => {
                        if (!since) return;
                        const checked = { ...since.checked };
                        if (e.target.checked) checked[id] = new Date().toISOString(); else delete checked[id];
                        update({ sinceLast: { ...since, checked } });
                      }} />
                    Reviewed with the team
                  </label>
                )}
              </div>
            );
          }
          if (l.kind === "h") return <h3 key={i} id={`line-${i}`} className={`mt-6 border-t border-line pt-4 font-display text-[1.1em] font-extrabold tracking-[-0.01em] text-brand-text ${hl(i)}`}>{l.text}</h3>;
          // The question for the crew closes the talk: set apart, so the presenter stops and asks it.
          if (l.kind === "askh") return <h3 key={i} id={`line-${i}`} className={`mt-6 flex items-center gap-2 font-display text-[1.1em] font-extrabold tracking-[-0.01em] text-brand-text ${hl(i)}`}>
            <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>{l.text}</h3>;
          if (l.kind === "ask") return <p key={i} id={`line-${i}`} className={`mt-2 rounded-xl bg-brand-soft px-4 py-3 font-semibold leading-snug ${hl(i)}`}>{l.text}</p>;
          return <p key={i} id={`line-${i}`} className={`relative mt-2 pl-5 before:absolute before:left-0.5 before:top-[0.62em] before:h-[7px] before:w-[7px] before:rounded-full before:bg-brand ${hl(i)}`}>{l.text}</p>;
        })}
      </div>

      {draft.makeup && <div className="mt-4"><Button size="sm" variant="ghost" onClick={() => { stopRef.current?.(); update({ step: "makeup" }); }}>Change week or reason</Button></div>}

      {/* Always in reach while reading: play/stop and done. */}
      <div className="sticky bottom-0 -mx-4 mt-5 flex gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button size="sm" variant="soft" onClick={toggle} className="flex shrink-0 items-center gap-1.5" aria-label={playing ? pui.stop : pui.play}>
          <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {playing ? <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" /> : <><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>}
          </svg>
          {playing ? pui.stop : pui.play}
        </Button>
        <Button className="!py-3" disabled={unchecked > 0} onClick={() => {
          stopRef.current?.();
          update({ step: "crew", siteNotes: draft.siteNotes.trim(), heat: draft.heat ? { ...draft.heat, reminder_read: hot } : null });
        }}>{unchecked > 0 ? `Check off ${unchecked} more` : "Done reading"}</Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function MakeupBanner({ draft }: { draft: TalkDraft }) {
  if (!draft.makeup) return null;
  return (
    <p className="mb-3 rounded-xl bg-surface shadow-card px-3 py-2 text-sm">
      <b>Makeup for {weekNumbers({ n: draft.makeup.weekNumber, weeks: draft.makeup.weeks ?? 1 })}</b> ({periodLabel(parseDay(draft.makeup.weekStart), draft.makeup.weeks ?? 1)}) · {makeupReasonText(draft.makeupPick, draft.makeupNote)}
    </p>
  );
}

function rosterFor(org: Org, draft: TalkDraft): RosterEntry[] {
  const roleName = (p: Person) => {
    if (org.teams.some((t) => t.lead_person_id === p.id)) return "Team lead";
    return titleOf(p, org.roles);
  };
  const teamName = (p: Person) => org.teams.find((t) => t.id === p.team_id)?.name ?? "";
  const people =
    draft.teamId === "all" ? org.people.filter((p) => p.team_id)
    : draft.teamId === "needs" ? org.people.filter((p) => draft.needIds?.includes(p.id))
    : draft.teamId ? org.people.filter((p) => p.team_id === draft.teamId)
    : [];
  const isLead = (p: Person) => org.teams.some((t) => t.lead_person_id === p.id);
  return people
    .filter((p) => p.id !== draft.presenterId)
    .sort((a, b) => Number(isLead(b)) - Number(isLead(a)) || a.full_name.localeCompare(b.full_name))
    .map((p): RosterEntry => ({ key: p.id, personId: p.id, name: p.full_name, role: roleName(p), teamName: teamName(p) }))
    .concat(draft.walkins.map((w, i): RosterEntry => ({ key: `walkin:${i}`, personId: null, name: w.name, role: "Not on roster", teamName: "", company: w.company })));
}

function Crew({ org, draft, update, signedIds }: { org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; signedIds: string[] | null }) {
  const [walkin, setWalkin] = useState("");
  const [walkinCo, setWalkinCo] = useState("");
  const [knownCos] = useState(() => readWalkinCompanies(draft.companyId));
  const [msg, setMsg] = useState<string | null>(null);
  const presenters = presentersFrom(org.people, org.roles, org.teams);
  const roster = rosterFor(org, draft);
  const here = roster.filter((r) => draft.present[r.key] !== false).length;
  const absent = roster.length - here;

  // Grab a GPS point once, quietly, as extra proof of where the talk happened. Never blocks the talk.
  useEffect(() => {
    if (draft.gps) return;
    let live = true;
    getLocation(8000).then((g) => { if (live) writeDraft({ ...draft, gps: g }); }).catch(() => {});
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Everyone on a newly chosen roster starts as "here"; the presenter unchecks who isn't.
  const setTeam = (teamId: string) => {
    const needIds = teamId === "needs" && signedIds ? stillNeeds(org.people, signedIds).map((p) => p.id) : null;
    const next = { ...draft, teamId, needIds };
    const present: Record<string, boolean> = {};
    for (const r of rosterFor(org, next)) present[r.key] = draft.present[r.key] ?? true;
    update({ teamId, needIds, present });
  };
  const needsLabel = draft.makeup ? `Everyone who still needs Week ${draft.makeup.weekNumber}` : "Everyone who hasn't had this week's talk";

  return (
    <>
      <Steps n={2} label="Who's here" />
      <MakeupBanner draft={draft} />
      <Title>Who&apos;s here?</Title>
      <div className="mt-4 flex flex-col gap-4">
        <Field label="Presented by" id="presenter">
          {presenters.length ? (
            <select id="presenter" className={inputClass} value={draft.presenterId} onChange={(e) => update({ presenterId: e.target.value })}>
              <option value="">Choose who is giving the talk</option>
              {presenters.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {org.teams.some((t) => t.lead_person_id === p.id) && !org.roles.find((r) => r.id === p.role_id)?.presents ? "Team lead" : titleOf(p, org.roles)}</option>)}
            </select>
          ) : (
            <Notice>No one can give talks yet. In Admin → People, give someone a role like Foreman or Supervisor.</Notice>
          )}
        </Field>
        <Field label="Team" id="team">
          <select id="team" className={inputClass} value={draft.teamId} onChange={(e) => setTeam(e.target.value)}>
            <option value="">Choose a team</option>
            {org.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            {org.teams.length > 1 && <option value="all">All teams</option>}
            {draft.kind !== "daily" && (signedIds || draft.teamId === "needs") && <option value="needs">{needsLabel}</option>}
          </select>
        </Field>
        <Field label="Where" id="jobsite">
          <select id="jobsite" className={inputClass} value={draft.jobsiteId} onChange={(e) => update({ jobsiteId: e.target.value })}>
            <option value="">{org.jobsites.length ? "Choose a jobsite or the office" : "No places set up"}</option>
            {org.jobsites.map((j) => <option key={j.id} value={j.id}>{j.name}{j.kind === "office" ? " (office or shop)" : ""}</option>)}
          </select>
          {org.jobsites.length === 0 && (
            <Link href="/admin/#jobsites" className="flex min-h-11 items-center text-sm font-semibold text-brand-text underline underline-offset-2">Add a jobsite or your office in Admin</Link>
          )}
        </Field>
      </div>

      <GroupHeading aside={roster.length ? `${here} here · ${absent} absent` : undefined}>Roster</GroupHeading>
      {roster.length > 0 && <p className="mt-1 px-1 text-sm text-muted">Uncheck anyone who isn&apos;t here. They&apos;re recorded as absent.</p>}
      {roster.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{draft.teamId === "needs" ? "Everyone has this week covered. Add walk-ins below if needed." : draft.teamId ? "No one on this team yet. Add walk-ins below, or add people in Admin." : "Choose a team to load its roster."}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {roster.map((r) => {
            const isHere = draft.present[r.key] !== false;
            return (
              <li key={r.key}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 ${isHere ? "bg-surface shadow-card" : "border border-warn bg-warn-bg"}`}>
                  <Avatar name={r.name} muted={!isHere} />
                  <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{r.personId ? [r.role, r.teamName].filter(Boolean).join(" · ") : ["Walk-in", r.company].filter(Boolean).join(" · ")}</small></span>
                  {!isHere && <span className="rounded bg-warn px-2 py-0.5 text-xs font-semibold text-warn-ink">Absent</span>}
                  <input type="checkbox" aria-label={`${r.name} is here`} className="h-6 w-6 shrink-0 accent-[var(--brand)]" checked={isHere} onChange={(e) => update({ present: { ...draft.present, [r.key]: e.target.checked } })} />
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <form
        className="mt-3 rounded-xl bg-surface shadow-card p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const n = walkin.trim();
          if (!n) return;
          const key = `walkin:${draft.walkins.length}`;
          const company = walkinCo.trim();
          update({ walkins: [...draft.walkins, { name: n, company }], present: { ...draft.present, [key]: true } });
          rememberWalkinCompany(draft.companyId, company);
          setWalkin("");
        }}
      >
        <p className="text-sm font-semibold">Someone not on the roster?</p>
        <div className="mt-2 flex flex-col gap-2">
          <input aria-label="Add someone not on the roster" placeholder="Their name" className={inputClass} value={walkin} onChange={(e) => setWalkin(e.target.value)} />
          <div className="flex gap-2">
            <input
              aria-label="Their company"
              placeholder="Their company (optional), e.g. a sub"
              list="walkin-companies"
              className={inputClass}
              value={walkinCo}
              onChange={(e) => setWalkinCo(e.target.value)}
            />
            <Button size="sm" type="submit" disabled={!walkin.trim()}>Add</Button>
          </div>
          <datalist id="walkin-companies">{knownCos.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
      </form>
      {draft.gps && <p className="mt-2 text-sm text-muted">Location captured.</p>}

      {msg && <div className="mt-4"><Notice tone="error">{msg}</Notice></div>}
      <div className="sticky bottom-0 -mx-4 mt-5 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button
          onClick={() => {
            if (!presenters.some((p) => p.id === draft.presenterId)) return setMsg("Choose who is giving the talk.");
            if (here === 0) return setMsg("Check at least one person who is here, or add a walk-in.");
            setMsg(null);
            update({ step: "sign" });
          }}
        >
          Collect signatures
        </Button>
        {draft.kind === "daily"
          ? <Button size="sm" variant="ghost" onClick={() => update({ step: "plan" })}>Back to the plan</Button>
          : <Button size="sm" variant="ghost" onClick={() => update({ step: "read" })}>Back to the talk</Button>}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Sign({
  m, org, draft, update, week, onSaved,
}: {
  m: Membership; org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void;
  week: { number: number; start: string; scheduledTalkId: string; weeks?: number } | null; onSaved: (d: Done) => void;
}) {
  const ui = crewText(draft.lang);
  const presenter = org.people.find((p) => p.id === draft.presenterId);
  const presenterRole = org.roles.find((r) => r.id === presenter?.role_id)?.name ?? (presenter && org.teams.some((t) => t.lead_person_id === presenter.id) ? "Team lead" : "");
  const roster = rosterFor(org, draft);
  const presentRoster = roster.filter((r) => draft.present[r.key] !== false);
  const presentMap = Object.fromEntries(roster.map((r) => [r.key, draft.present[r.key] !== false]));
  const missing = unsignedPresent(roster, presentMap, draft.signatures);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // One person at a time: the presenter, then everyone here, then a review screen. Starts at the first person who
  // still needs to sign, so reopening the app mid-talk picks up where it left off.
  type Turn = { key: string; name: string; sub: string; presenter: boolean };
  const turns: Turn[] = [
    { key: "__presenter", name: presenter?.full_name ?? "Presenter", sub: presenterRole ? `${presenterRole} · presenting` : "Presenting", presenter: true },
    ...presentRoster.map((r) => ({ key: r.key, name: r.name, sub: r.personId ? [r.role, r.teamName].filter(Boolean).join(" · ") : ["Walk-in", r.company].filter(Boolean).join(" · "), presenter: false })),
  ];
  const sigOf = (t: Turn) => (t.presenter ? draft.presenterSignature : draft.signatures[t.key] ?? null);
  const firstOpen = turns.findIndex((t) => !sigOf(t));
  const [idx, setIdx] = useState(firstOpen === -1 ? turns.length : firstOpen);
  // When each crew member tapped the signing statement on this phone (kept with their signature once they sign).
  const [confirmed, setConfirmed] = useState<Record<string, string>>({});
  const signedCount = presentRoster.filter((r) => draft.signatures[r.key]).length;
  const go = (i: number) => { setIdx(i); window.scrollTo?.(0, 0); };
  const nextOpen = (from: number) => {
    for (let i = from + 1; i < turns.length; i++) if (!sigOf(turns[i])) return i;
    return turns.length; // review
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const daily = draft.kind === "daily" && !!draft.pretask;
      const talk = daily ? null : TALKS.find((t) => t.id === draft.talkId)!;
      const { text, lang } = talk ? talkText(talk, draft.lang) : { text: pretaskContent(draft.pretask!), lang: draft.lang };
      const team = org.teams.find((t) => t.id === draft.teamId);
      const lead = team ? org.people.find((p) => p.id === team.lead_person_id) : undefined;
      const jobsite = org.jobsites.find((j) => j.id === draft.jobsiteId);
      const attendees = buildAttendees(roster, presentMap, draft.signatures);
      const record = recordPayload({
        companyId: m.company.id,
        clientId: draft.clientId,
        talkId: talk ? talk.id : PRETASK_TALK_ID,
        language: lang,
        content: {
          // A daily plan saves what the crew went over as sections (src/core/pretask.ts); a talk saves its text.
          ...(lang === "en" || !talk ? text : { ...text, en: talk.content.en }),
          // What was read from the safety log, with when each item was checked off (src/core/safetylog.ts).
          ...(draft.sinceLast ? { since_last: sinceLastSnapshot(draft.sinceLast) } : {}),
        },
        week,
        jobsite: jobsite ? { id: jobsite.id, name: jobsite.name } : null,
        team: team ? { id: team.id, name: team.name, leadName: lead?.full_name ?? "" }
          : draft.teamId === "all" ? { id: "", name: "All teams", leadName: "" }
          : draft.teamId === "needs" ? { id: "", name: "Still needed it", leadName: "" }
          : null,
        presenter: { personId: presenter?.id ?? null, name: presenter?.full_name ?? "", role: presenterRole, signature: draft.presenterSignature },
        heldAt: new Date().toISOString(),
        gps: draft.gps,
        makeup: draft.makeup ? { weekStart: draft.makeup.weekStart, reason: makeupReasonText(draft.makeupPick, draft.makeupNote) } : null,
        siteNotes: draft.siteNotes,
        photo: draft.photo,
        sheet: draft.sheet,
        signingStatement: daily ? dailyStatement(lang) : signingStatement(lang),
        pretask: daily ? tidyPlan(draft.pretask!) : null,
        heat: draft.heat ? {
          max_heat_index_f: draft.heat.max_heat_index_f, level: draft.heat.level, reminder_read: draft.heat.reminder_read,
          checked_at: draft.heat.checked_at, source: draft.heat.source,
          // the exact reminder text that was read, so the record and PDF show what the crew heard
          ...(draft.heat.reminder_read ? { reminder: { ...heatReminder(lang), version: HEAT_REMINDER_VERSION } } : {}),
        } : null,
      });
      if (record.team_id === "") record.team_id = null;
      const raisedAt = new Date().toISOString();
      const issues = draft.issues.filter((x) => x.description.trim()).map((x) => {
        const owner = org.people.find((p) => p.id === x.ownerId);
        return { client_id: x.clientId, description: x.description.trim(), owner_person_id: owner?.id ?? null, owner_name: owner?.full_name ?? "", due_date: x.dueDate || null, raised_by_name: presenter?.full_name ?? "", raised_at: raisedAt };
      });
      enqueue(record, attendees, issues);
      writeLastSetup(m.company.id, { presenterId: draft.presenterId, teamId: draft.teamId, jobsiteId: draft.jobsiteId });
      await flush(saveTalkRecord);
      const uploaded = !pending(m.company.id).some((i) => i.record.client_id === draft.clientId);
      buzz(30);
      onSaved({
        kind: daily ? "daily" : "weekly",
        talkId: talk ? talk.id : PRETASK_TALK_ID, jobsiteId: draft.jobsiteId,
        title: text.title, uploaded, counts: countStatuses(attendees), presenterSigned: !!draft.presenterSignature,
        makeupLabel: draft.makeup ? `Makeup for Week ${draft.makeup.weekNumber}` : null,
        issues: issues.length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSaving(false);
    }
  };

  // Review -------------------------------------------------------------------------------------------------------
  if (idx >= turns.length) {
    const absent = roster.filter((r) => draft.present[r.key] === false);
    return (
      <>
        <Steps n={3} label="Check and save" />
        <MakeupBanner draft={draft} />
        <Title>Ready to save?</Title>
        <p className="mt-2 tabular-nums">
          {signedSummary({ signed: signedCount, not_signed: presentRoster.length - signedCount, absent: absent.length })}
          {" · "}{draft.presenterSignature ? "presenter signed" : "presenter not signed"}
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {turns.map((t, i) => {
            const sig = sigOf(t);
            return (
              <li key={t.key}>
                <button onClick={() => go(i)} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${sig ? "border-ok bg-ok-bg" : "border-warn bg-warn-bg"}`}>
                  {/* Signed rows turn green with a check, so the presenter sees at a glance who's left. */}
                  <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${sig ? "bg-ok text-white" : "border-2 border-warn"}`}>{sig ? "✓" : ""}</span>
                  <span className="min-w-0 flex-1"><b className="block">{t.name}</b><small className="text-muted">{t.sub}</small></span>
                  {sig ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sig.image} alt={`Signature of ${t.name}`} className="h-10 w-24 rounded bg-white object-contain" />
                  ) : (
                    <span className="flex min-h-11 items-center rounded-md border-2 border-brand bg-surface px-3 text-sm font-semibold text-brand-text">Sign now</span>
                  )}
                </button>
              </li>
            );
          })}
          {absent.map((r) => (
            <li key={r.key} className="flex items-center gap-3 rounded-lg border border-warn bg-warn-bg p-3">
              <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{r.role}</small></span>
              <button className="min-h-11 rounded-md border-2 border-brand bg-surface px-3 text-sm font-semibold text-brand-text" onClick={() => update({ present: { ...draft.present, [r.key]: true } })}>Mark here</button>
              <span className="rounded bg-warn px-2 py-0.5 text-xs font-semibold text-warn-ink">Absent</span>
            </li>
          ))}
        </ul>
        <LateArrival onAdd={(name, company) => {
          // Someone who showed up after signing started: added as a walk-in and taken straight to their turn.
          const key = `walkin:${draft.walkins.length}`;
          update({ walkins: [...draft.walkins, { name, company }], present: { ...draft.present, [key]: true } });
          if (company) rememberWalkinCompany(m.company.id, company);
          go(turns.length);
        }} />
        <IssuesEditor org={org} draft={draft} update={update} />
        <CrewPhoto draft={draft} update={update} />
        <CrewPhoto draft={draft} update={update} kind="sheet" />

        {(missing.length > 0 || !draft.presenterSignature) && (
          <div className="mt-4">
            <Notice tone="error">
              {!draft.presenterSignature && <>The presenter hasn&apos;t signed. </>}
              {missing.length > 0 && <>{missing.length === 1 ? "1 person hasn't" : `${missing.length} people haven't`} signed: {missing.join(", ")}. </>}
              Saving now flags them as <b>Not signed</b>. Tap a name to sign.
            </Notice>
          </div>
        )}
        {error && <div className="mt-4"><Notice tone="error">Couldn&apos;t save: {error}</Notice></div>}
        <div className="sticky bottom-0 -mx-4 mt-5 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : missing.length || !draft.presenterSignature ? "Save and flag" : "Save record"}</Button>
          <Button size="sm" variant="ghost" onClick={() => update({ step: "crew" })} disabled={saving}>Back to who&apos;s here</Button>
        </div>
      </>
    );
  }

  // One person ---------------------------------------------------------------------------------------------------
  const t = turns[idx];
  const sig = sigOf(t);
  const confirmedAt = t.presenter ? null : sig?.confirmedAt ?? confirmed[t.key] ?? null;
  const setSig = (s: Signature | null) => {
    if (s) buzz();
    if (s && !t.presenter) s = { ...s, confirmedAt: confirmedAt ?? new Date().toISOString() };
    if (t.presenter) update({ presenterSignature: s });
    else {
      const signatures = { ...draft.signatures };
      if (s) signatures[t.key] = s; else delete signatures[t.key];
      update({ signatures });
    }
  };
  const talkTitle = (() => {
    if (draft.kind === "daily") return draft.lang === "es" ? "Plan de trabajo del día" : "Today's pre-task plan";
    const tk = TALKS.find((x) => x.id === draft.talkId); return tk ? talkText(tk, draft.lang).text.title : "";
  })();
  const nextName = (() => { const n = nextOpen(idx); return n < turns.length ? turns[n].name : null; })();
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted tabular-nums">Step 3 of 3 · Signing {idx + 1} of {turns.length}</p>
        <button className="min-h-11 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => go(turns.length)}>Review all</button>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {turns.map((x, i) => (
          <span key={x.key} className={`h-1.5 flex-1 rounded ${sigOf(x) ? "bg-ok" : i === idx ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>
      <MakeupBanner draft={draft} />
      <div className="mt-5 flex items-center gap-4">
        <Avatar name={t.name} size={64} />
        <div className="min-w-0">
          <p className="text-sm text-muted">{t.presenter ? "Presenter signs first" : "Pass the phone to"}</p>
          <h1 className="font-display text-[40px] font-extrabold leading-[1.02] text-balance tracking-[-0.03em]">{t.name}</h1>
          <p className="mt-0.5 text-muted">{t.sub}</p>
        </div>
      </div>
      {/* Each person sees what they're signing for, in their language. */}
      <p className="mt-4 rounded-xl bg-surface px-4 py-2.5 text-sm shadow-card">{ui.forTalk}: <b>{talkTitle}</b> <span className="text-muted">· {new Date().toLocaleDateString(draft.lang, { month: "short", day: "numeric" })}</span></p>
      {!t.presenter && (
        // The signing statement: a deliberate tap before the pad takes ink, saved with the record (src/content/ui.ts).
        <button
          type="button"
          role="checkbox"
          aria-checked={!!confirmedAt}
          className={`mt-4 flex w-full items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left ${confirmedAt ? "border-ok bg-ok-bg" : "border-brand bg-surface"}`}
          onClick={() => {
            if (confirmedAt) {
              // Taking the statement back takes the signature back too.
              setConfirmed((c) => { const n = { ...c }; delete n[t.key]; return n; });
              if (sig) setSig(null);
            } else setConfirmed((c) => ({ ...c, [t.key]: new Date().toISOString() }));
          }}
        >
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border-2 ${confirmedAt ? "border-ok bg-ok text-white" : "border-brand"}`} aria-hidden>
            {confirmedAt && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>}
          </span>
          <span>
            <span className="block text-base font-semibold">{draft.kind === "daily" ? dailyStatement(draft.lang).text : ui.signedBy}</span>
            {draft.lang !== "en" && <span className="block text-sm text-muted">{draft.kind === "daily" ? DAILY_STATEMENT.en : crewText("en").signedBy}</span>}
          </span>
        </button>
      )}
      <div className="mt-3">
        <SignaturePad key={t.key} tall label={t.name} value={sig} onChange={setSig} hint={ui.signHere} tooShortText={ui.tooShort}
          locked={!t.presenter && !confirmedAt ? ui.tapFirst : null} />
      </div>

      <div className="sticky bottom-0 -mx-4 mt-5 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button onClick={() => go(nextOpen(idx))} disabled={!sig}>
          {!sig ? `Sign to continue${nextName ? ` · next: ${nextName}` : ""}` : nextName ? `Next: ${nextName}` : "Done signing"}
        </Button>
        {/* Same layout for everyone: "Isn't here" is its own full-width button, with Back and Skip set apart below
            it, so a gloved slip can't record the wrong status. */}
        {!t.presenter && (
          <Button variant="ghost" onClick={() => {
            const present = { ...draft.present, [t.key]: false };
            const signatures = { ...draft.signatures };
            delete signatures[t.key];
            update({ present, signatures });
            const clientId = draft.clientId;
            toast(`${t.name} marked absent`, {
              action: {
                label: "Undo",
                // Only while this same talk is still in progress on the phone; never brings a saved talk back.
                run: () => {
                  const cur = readDraft(m.company.id);
                  if (cur && cur.clientId === clientId) writeDraft({ ...cur, present: { ...cur.present, [t.key]: true } });
                },
              },
            });
            // the list shrinks by one, so the same index now points at the next person
            setIdx((i) => Math.min(i, turns.length - 1));
          }}>Isn&apos;t here</Button>
        )}
        <div className="mt-2 flex items-center justify-between gap-6">
          {idx > 0
            ? <Button size="sm" variant="ghost" onClick={() => go(idx - 1)}>Back</Button>
            : <Button size="sm" variant="ghost" onClick={() => update({ step: "crew" })}>Back to who&apos;s here</Button>}
          {!sig && <Button size="sm" variant="ghost" onClick={() => go(nextOpen(idx))}>Skip for now</Button>}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
/** "Someone show up late?" on the review screen: add them without going back to who's here. */
function LateArrival({ onAdd }: { onAdd: (name: string, company: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  if (!open) {
    return (
      <button className="mt-3 flex min-h-11 items-center text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => setOpen(true)}>
        + Someone arrived late
      </button>
    );
  }
  return (
    <form
      className="mt-3 flex flex-col gap-2 rounded-xl bg-surface shadow-card p-3"
      onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return; onAdd(n, company.trim()); setName(""); setCompany(""); setOpen(false); }}
    >
      <label className="text-sm font-semibold" htmlFor="late-name">Late arrival</label>
      <input id="late-name" className={inputClass} placeholder="Their name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <input aria-label="Their company (if not yours)" className={inputClass} placeholder="Their company, if not yours" value={company} onChange={(e) => setCompany(e.target.value)} />
      <div className="flex gap-2">
        <Button size="sm" type="submit" disabled={!name.trim()}>Add and sign</Button>
        <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------------------------------------------
/** "Anything the team raised?" Each item gets an owner (the presenter by default) and a fix-by date (a week out). */
function IssuesEditor({ org, draft, update }: { org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void }) {
  const [text, setText] = useState("");
  const set = (list: DraftIssue[]) => update({ issues: list });
  const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const people = [...org.people].sort((a, b) => a.full_name.localeCompare(b.full_name));
  return (
    <section className="mt-6">
      <GroupHeading aside={draft.issues.length ? `${draft.issues.length}` : undefined}>Anything the team raised?</GroupHeading>
      <p className="mt-2 text-sm text-muted">Hazards or problems to fix, like a damaged ladder or missing guardrail. Each one gets an owner and a fix-by date.</p>
      <ul className="mt-3 flex flex-col gap-2">
        {draft.issues.map((x, i) => (
          <li key={x.clientId} className="rounded-xl bg-surface shadow-card p-3">
            <div className="flex items-start justify-between gap-2">
              <b className="min-w-0 break-words">{x.description}</b>
              <button className="min-h-11 px-2 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => set(draft.issues.filter((_, j) => j !== i))} aria-label={`Remove: ${x.description}`}>Remove</button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select aria-label="Owner" className={inputClass} value={x.ownerId} onChange={(e) => set(draft.issues.map((y, j) => (j === i ? { ...y, ownerId: e.target.value } : y)))}>
                <option value="">No owner yet</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
              <input aria-label="Fix by" type="date" className={inputClass} value={x.dueDate} onChange={(e) => set(draft.issues.map((y, j) => (j === i ? { ...y, dueDate: e.target.value } : y)))} />
            </div>
          </li>
        ))}
      </ul>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const d = text.trim();
          if (!d) return;
          set([...draft.issues, { clientId: uid(), description: d, ownerId: draft.presenterId, dueDate: isoDay(addDays(new Date(), 7)) }]);
          setText("");
        }}
      >
        <input aria-label="Add something the team raised" placeholder="Add something the team raised" maxLength={1000} className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
        <Button size="sm" type="submit">Add</Button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Saved({ done, onAnother }: { done: Done; onAnother: () => void }) {
  const c = done.counts;
  // Only a full roster earns the celebration: every person signed and the presenter too (absent counts as flagged).
  const everyone = c.total > 0 && c.flagged === 0 && done.presenterSigned;
  useEffect(() => { if (everyone) buzz([20, 60, 40]); }, [everyone]);
  return (
    <>
      <div className="mt-2 flex flex-col items-center text-center">
        <svg viewBox="0 0 96 96" className={`h-24 w-24 ${everyone ? "" : "opacity-80"}`} aria-hidden>
          <circle cx="48" cy="48" r="42" fill="none" stroke={everyone ? "var(--ok)" : "var(--line)"} strokeWidth="8" className="done-ring" />
          <path d="M30 49 l12 12 l24 -26" fill="none" stroke={everyone ? "var(--ok)" : "var(--muted)"} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" className="done-check" />
        </svg>
        {everyone && <p className="mt-3 font-display text-[26px] font-extrabold leading-tight tracking-[-0.03em]" role="status">Everyone signed</p>}
        {everyone && <p className="text-sm text-muted">{c.signed} of {c.total} on the roster, plus the presenter.</p>}
      </div>
      <Eyebrow>Recorded{done.makeupLabel ? ` · ${done.makeupLabel}` : ""}</Eyebrow>
      <Title>{done.title}</Title>
      <div className="mt-4">
        {done.uploaded ? (
          <Notice tone="ok">Saved to your company&apos;s records.</Notice>
        ) : (
          <Notice>Saved on this phone. It will upload automatically when you have signal.</Notice>
        )}
      </div>
      {done.issues > 0 && <p className="mt-3 text-sm"><b>{done.issues}</b> {done.issues === 1 ? "issue" : "issues"} logged for follow-up. <Link href="/records/#issues" className="font-semibold text-brand-text underline underline-offset-2">Track issues</Link></p>}
      <p className="mt-4 tabular-nums">
        {signedSummary(c)} · {done.presenterSigned ? "presenter signed" : "presenter not signed"}
        {(c.flagged > 0 || !done.presenterSigned) && (
          <span className="ml-2 rounded bg-warn px-2 py-0.5 text-xs font-semibold text-warn-ink">
            {c.flagged + (done.presenterSigned ? 0 : 1)} flagged
          </span>
        )}
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {/* Several crews a week is normal: the same talk again, with a fresh roster and signatures. */}
        {!done.makeupLabel && <Button onClick={onAnother}>Give it to another team</Button>}
        <Link href="/records/" className="flex min-h-14 items-center justify-center rounded-lg bg-surface shadow-card px-4 text-center font-semibold">See records</Link>
        <Link href="/" className="flex min-h-14 items-center justify-center rounded-lg border border-line px-4 text-center font-semibold">Home</Link>
      </div>
    </>
  );
}

/** The daily plan's signing statement in the language read, with English, versioned (src/core/pretask.ts). */
function dailyStatement(lang: LanguageId) {
  const text = lang === "es" ? DAILY_STATEMENT.es : DAILY_STATEMENT.en;
  return { text, en: DAILY_STATEMENT.en, language: lang, version: DAILY_STATEMENT_VERSION };
}
