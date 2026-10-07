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
import { weekLabel, parseDay } from "@/core/weeks";
import { LANGUAGES, type LanguageId } from "@/core/languages";
import { buildAttendees, recordPayload, unsignedPresent, type RosterEntry, type Signature } from "@/core/record";
import { countStatuses } from "@/core/attendance";
import { listJobsites, listPeople, listRoles, listTeams } from "@/lib/data/company";
import { saveTalkRecord, signedForWeek } from "@/lib/data/records";
import { usePlan } from "@/lib/usePlan";
import { useOpenMakeups, type OpenMakeups } from "@/lib/useOpenMakeups";
import { checkHeat } from "@/lib/weather";
import { alertWorthy, HEAT_LABEL, type HeatLevel } from "@/core/heat";
import { HEAT_REMINDER_VERSION, heatReminder, heatReminderReviewed } from "@/content/heat";
import { addDays, isoDay } from "@/core/weeks";
import { readWalkinCompanies, rememberWalkinCompany, writeLastSetup } from "@/lib/lastSetup";
import { buzz, toast } from "@/components/toast";
import type { Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { clearDraft, newDraft, readDraft, useDraft, writeDraft, type DraftIssue, type TalkDraft } from "@/lib/draft";
import { enqueue, flush, pending } from "@/lib/outbox";
import { CrewPhoto } from "@/components/CrewPhoto";
import { getLocation } from "@/lib/location";
import { speakLines, speechAvailable, stopSpeaking } from "@/lib/speech";
import { RequireCompany } from "@/components/Guard";
import { SignaturePad } from "@/components/SignaturePad";
import { readChosenJobsite } from "@/components/JobsitePicker";
import { Button, Eyebrow, Field, GroupHeading, Loading, NavLink, Notice, Shell, Title, inputClass } from "@/components/ui";

export default function TalkPage() {
  return <RequireCompany>{(m) => <Talk m={m} />}</RequireCompany>;
}

type Org = { people: Person[]; teams: Team[]; roles: Role[]; jobsites: Jobsite[] };
type Done = { title: string; uploaded: boolean; counts: ReturnType<typeof countStatuses>; presenterSigned: boolean; makeupLabel: string | null; issues: number };

function Talk({ m }: { m: Membership }) {
  const co = m.company;
  const router = useRouter();
  const draft = useDraft(co.id);
  const [org, setOrg] = useState<Org | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([listPeople(co.id), listTeams(co.id), listRoles(co.id), listJobsites(co.id)])
      .then(([people, teams, roles, jobsites]) => live && setOrg({ people, teams, roles, jobsites }))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [co.id]);

  const { week, input } = usePlan(co);
  const openMakeups = useOpenMakeups(co);

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
  if (done) return <Shell nav={nav}><Saved done={done} /></Shell>;
  if (error) return <Shell nav={nav}><Notice tone="error">Couldn&apos;t load your crew: {error}</Notice></Shell>;
  if (!draft) {
    return (
      <Shell nav={nav}>
        <Eyebrow>Toolbox talk</Eyebrow>
        <Title>No talk in progress</Title>
        <div className="mt-5 flex flex-col gap-3">
          {week && <Button onClick={() => newDraft(co.id, week.talkId, readChosenJobsite(co.id) ?? "")}>Start this week&apos;s talk</Button>}
          <Button variant="ghost" size="sm" onClick={() => newDraft(co.id, null, readChosenJobsite(co.id) ?? "")}>Make up a missed week</Button>
        </div>
      </Shell>
    );
  }
  if (!org) return <Shell nav={nav} tabs={false}><Loading /></Shell>;

  const update = (patch: Partial<TalkDraft>) => writeDraft({ ...draft, ...patch });
  const cancel = (
    <button
      className="text-sm font-semibold text-muted underline"
      onClick={() => { stopSpeaking(); clearDraft(co.id); router.replace("/"); }}
    >
      Discard this talk
    </button>
  );

  return (
    <Shell nav={nav} tabs={false}>
      {draft.step === "makeup" && <MakeupPick weeks={makeupWeeks(input, co.makeup_weeks ?? 4)} draft={draft} update={update} open={openMakeups} />}
      {draft.step === "read" && draft.talkId && <Read draft={draft} update={update} org={org} />}
      {draft.step === "crew" && <Crew org={org} draft={draft} update={update} signedIds={signedIds} />}
      {draft.step === "sign" && (
        <Sign
          m={m}
          org={org}
          draft={draft}
          update={update}
          week={week ? { number: week.n, start: week.key, scheduledTalkId: week.talkId } : null}
          onSaved={(d) => { clearDraft(co.id); setDone(d); }}
        />
      )}
      <div className="mt-10 border-t border-line pt-4 text-center">{cancel}</div>
    </Shell>
  );
}

function Steps({ n, label }: { n: 1 | 2 | 3; label: string }) {
  return (
    <div className="mb-3">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded ${i <= n ? "bg-brand" : "bg-line"}`} />)}
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-muted">Step {n} of 3 · {label}</p>
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
      makeup: { weekStart: w.key, weekNumber: w.n }, talkId: w.talkId,
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
      <Title>Make up a missed week</Title>
      <p className="mt-2 text-sm text-muted">Saved with today&apos;s real date, marked as a makeup for the week you pick.</p>
      <GroupHeading>Which week?</GroupHeading>
      {weeks.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No earlier weeks to make up yet.</p>
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
                  <small className="text-muted">Week {w.n} · {weekLabel(w.monday)}</small>
                  {open && (
                    <small className={`block ${people.length ? "font-semibold" : "text-muted"}`}>
                      {people.length ? `${people.length} still need it: ${people.map((p) => p.name).join(", ")}` : "Everyone has this week"}
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
function Read({ draft, update, org }: { draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; org: Org }) {
  const talk = TALKS.find((t) => t.id === draft.talkId)!;
  const { text } = talkText(talk, draft.lang);
  const ui = crewText(draft.lang);
  const [line, setLine] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  // Bigger text for reading in sun glare; remembered on this phone.
  const [size, setSizeState] = useState<number>(() => { try { return Number(localStorage.getItem("tt-text-size")) || 0; } catch { return 0; } });
  const setSize = (n: number) => { setSizeState(n); try { localStorage.setItem("tt-text-size", String(n)); } catch { /* fine */ } };
  const textSize = ["text-base", "text-lg", "text-xl", "text-2xl"][size];
  const stopRef = useRef<(() => void) | null>(null);
  useEffect(() => () => stopRef.current?.(), []);
  const [editingNotes, setEditingNotes] = useState(false);

  // Heat: check today's forecast for the chosen place (or this phone's GPS). Hot days add the heat reminder to the
  // talk. Quiet when offline or when the weather service can't be reached.
  const site = org.jobsites.find((j) => j.id === draft.jobsiteId);
  const point = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : draft.gps;
  const [heatMsg, setHeatMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!point || draft.heat) return;
    let live = true;
    checkHeat(point)
      .then((h) => {
        const cur = readDraft(draft.companyId); // latest draft, so notes typed meanwhile aren't lost
        if (!live || !h || !cur) return;
        writeDraft({ ...cur, heat: { max_heat_index_f: h.maxHeatIndexF, level: h.level, reminder_read: false, checked_at: h.checkedAt, source: h.source, place: h.place } });
      })
      .catch((e) => live && setHeatMsg(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.latitude, point?.longitude]);
  const hot = !!draft.heat && alertWorthy(draft.heat.level as HeatLevel) && talk.id !== "heat";
  const reminder = heatReminder(draft.lang);
  const notes = draft.siteNotes.trim();

  type Line = { text: string; heading?: boolean; kind: "title" | "hook" | "h" | "item" | "askh" | "ask" | "noteh" | "note" | "heath" | "heat" };
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
    text.sections.forEach((s) => {
      out.push({ text: s.heading, heading: true, kind: "h" });
      s.items.forEach((i) => out.push({ text: i, kind: "item" }));
    });
    out.push({ text: ui.ask, heading: true, kind: "askh" }, { text: text.ask, kind: "ask" });
    return out;
  }, [text, ui.ask, notes, hot, reminder, draft.lang, draft.heat]);

  const voice = LANGUAGES.find((l) => l.id === draft.lang)!.voice;
  const playing = line !== null;
  const toggle = () => {
    if (playing) { stopRef.current?.(); setLine(null); setStatus(null); return; }
    if (!speechAvailable()) { setStatus(ui.noVoice); return; }
    setStatus(ui.reading);
    stopRef.current = speakLines(lines, voice, {
      onLine: (i) => { setLine(i); document.getElementById(`line-${i}`)?.scrollIntoView({ block: "center", behavior: "smooth" }); },
      onDone: () => { setLine(null); setStatus(null); },
      onError: () => { setLine(null); setStatus(ui.noVoice); },
    });
  };
  const hl = (i: number) => (line === i ? "rounded bg-caution-bg shadow-[0_0_0_4px_var(--caution-bg)]" : "");

  return (
    <>
      <Steps n={1} label="Read to the crew" />
      <MakeupBanner draft={draft} />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Language">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            disabled={!l.ready || !talk.content[l.id]}
            aria-pressed={draft.lang === l.id}
            onClick={() => { stopRef.current?.(); setLine(null); update({ lang: l.id as LanguageId }); }}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold disabled:opacity-40 ${draft.lang === l.id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
          >
            {l.label}{!l.ready && <small className="ml-1 font-normal">soon</small>}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5" role="group" aria-label="Text size">
        <span className="mr-1 text-sm text-muted">Text size</span>
        <button className="min-h-10 min-w-10 rounded-md border border-line bg-surface text-sm font-semibold disabled:opacity-40" disabled={size === 0} onClick={() => setSize(size - 1)} aria-label="Smaller text">A−</button>
        <button className="min-h-10 min-w-10 rounded-md border border-line bg-surface text-lg font-semibold disabled:opacity-40" disabled={size === 3} onClick={() => setSize(size + 1)} aria-label="Bigger text">A+</button>
      </div>
      {draft.lang !== "en" && (talk.translationStatus[draft.lang] !== "reviewed" || (hot && !heatReminderReviewed[draft.lang])) && (
        <p className="mt-2 text-xs text-muted">This translation hasn&apos;t been reviewed by a native speaker yet.</p>
      )}

      {draft.heat && alertWorthy(draft.heat.level as HeatLevel) && (
        <p className="mt-3 rounded-lg border-2 border-warn bg-warn-bg px-3 py-2 text-sm">
          <b>{HEAT_LABEL[draft.heat.level as HeatLevel]}: heat index up to {draft.heat.max_heat_index_f}°F today</b>
          {draft.heat.place ? ` · ${draft.heat.place}` : ""}. {talk.id === "heat" ? "Good week for this talk." : "The heat reminder is added to this talk."}
        </p>
      )}
      {heatMsg && !draft.heat && <p className="mt-2 text-xs text-muted">Heat check unavailable: {heatMsg}</p>}

      <div className="mt-3">
        {editingNotes || notes ? (
          <div className="rounded-lg border border-dashed border-line bg-surface p-3">
            <label htmlFor="site-notes" className="text-sm font-semibold">Today on this site <small className="font-normal text-muted">read to the crew, saved with the record</small></label>
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

      <h1 id="line-0" className={`mt-4 font-display text-4xl font-semibold leading-none text-balance tracking-tight ${hl(0)}`}>{text.title}</h1>
      {status && <p className="mt-2 text-sm text-muted" aria-live="polite">{status}</p>}

      <div className={`mt-4 rounded-xl bg-surface p-4 ${textSize}`}>
        {lines.slice(1).map((l, j) => {
          const i = j + 1;
          if (l.kind === "hook") return <p key={i} id={`line-${i}`} className={`font-semibold ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "noteh" || l.kind === "heath") return <h3 key={i} id={`line-${i}`} className={`mt-4 font-display text-lg font-semibold ${l.kind === "heath" ? "text-warn-text" : ""} ${hl(i)}`}>{l.text}</h3>;
          if (l.kind === "note") return <p key={i} id={`line-${i}`} className={`mt-1 rounded-r border-l-4 border-fg bg-bg px-3 py-2 font-semibold ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "heat") return <p key={i} id={`line-${i}`} className={`mt-1.5 border-l-4 border-warn pl-4 before:-ml-2 before:mr-2 before:content-['•'] ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "h" || l.kind === "askh") return <h3 key={i} id={`line-${i}`} className={`mt-4 font-display text-lg font-semibold ${hl(i)}`}>{l.text}</h3>;
          if (l.kind === "ask") return <p key={i} id={`line-${i}`} className={`mt-1 rounded-r border-l-4 border-brand bg-bg px-3 py-2 ${hl(i)}`}>{l.text}</p>;
          return <p key={i} id={`line-${i}`} className={`mt-1.5 pl-4 before:-ml-4 before:mr-2 before:content-['•'] ${hl(i)}`}>{l.text}</p>;
        })}
      </div>

      {draft.makeup && <div className="mt-4"><Button size="sm" variant="ghost" onClick={() => { stopRef.current?.(); update({ step: "makeup" }); }}>Change week or reason</Button></div>}

      {/* Always in reach while reading: play/stop and done. */}
      <div className="sticky bottom-0 -mx-4 mt-5 flex gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button size="sm" onClick={toggle} className="shrink-0 bg-fg text-bg" aria-label={playing ? ui.stop : ui.play}>{playing ? `■ ${ui.stop}` : `▶ ${ui.play}`}</Button>
        <Button className="!py-3" onClick={() => {
          stopRef.current?.();
          update({ step: "crew", siteNotes: draft.siteNotes.trim(), heat: draft.heat ? { ...draft.heat, reminder_read: hot } : null });
        }}>Done reading</Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function MakeupBanner({ draft }: { draft: TalkDraft }) {
  if (!draft.makeup) return null;
  return (
    <p className="mb-3 rounded-xl bg-surface px-3 py-2 text-sm">
      <b>Makeup for Week {draft.makeup.weekNumber}</b> ({weekLabel(parseDay(draft.makeup.weekStart))}) · {makeupReasonText(draft.makeupPick, draft.makeupNote)}
    </p>
  );
}

function rosterFor(org: Org, draft: TalkDraft): RosterEntry[] {
  const roleName = (p: Person) => {
    if (org.teams.some((t) => t.lead_person_id === p.id)) return "Team lead";
    return org.roles.find((r) => r.id === p.role_id)?.name ?? "Crew member";
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
  const presenters = org.people.filter((p) => p.role_id);
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
              {presenters.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {org.roles.find((r) => r.id === p.role_id)?.name}</option>)}
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
            {(signedIds || draft.teamId === "needs") && <option value="needs">{needsLabel}</option>}
          </select>
        </Field>
        <Field label="Where" id="jobsite">
          <select id="jobsite" className={inputClass} value={draft.jobsiteId} onChange={(e) => update({ jobsiteId: e.target.value })}>
            <option value="">{org.jobsites.length ? "Choose a jobsite or the office" : "No places set up"}</option>
            {org.jobsites.map((j) => <option key={j.id} value={j.id}>{j.name}{j.kind === "office" ? " (office or shop)" : ""}</option>)}
          </select>
        </Field>
      </div>

      <GroupHeading aside={roster.length ? `${here} here · ${absent} absent` : undefined}>Roster</GroupHeading>
      {roster.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{draft.teamId === "needs" ? "Everyone has this week covered. Add walk-ins below if needed." : draft.teamId ? "No one on this team yet. Add walk-ins below, or add people in Admin." : "Choose a team to load its roster."}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {roster.map((r) => {
            const isHere = draft.present[r.key] !== false;
            return (
              <li key={r.key}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${isHere ? "border-line bg-surface" : "border-warn bg-warn-bg"}`}>
                  <input type="checkbox" className="h-6 w-6 accent-[var(--brand)]" checked={isHere} onChange={(e) => update({ present: { ...draft.present, [r.key]: e.target.checked } })} />
                  <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{r.personId ? [r.role, r.teamName].filter(Boolean).join(" · ") : ["Walk-in", r.company].filter(Boolean).join(" · ")}</small></span>
                  {!isHere && <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-semibold text-warn-ink">Absent</span>}
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <form
        className="mt-3 rounded-xl bg-surface p-3"
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
      <p className="mt-2 text-xs text-muted">Unchecked people are recorded as absent.{draft.gps ? " Location captured." : ""}</p>

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
        <Button size="sm" variant="ghost" onClick={() => update({ step: "read" })}>Back to the talk</Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Sign({
  m, org, draft, update, week, onSaved,
}: {
  m: Membership; org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void;
  week: { number: number; start: string; scheduledTalkId: string } | null; onSaved: (d: Done) => void;
}) {
  const ui = crewText(draft.lang);
  const presenter = org.people.find((p) => p.id === draft.presenterId);
  const presenterRole = org.roles.find((r) => r.id === presenter?.role_id)?.name ?? "";
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
      const talk = TALKS.find((t) => t.id === draft.talkId)!;
      const { text, lang } = talkText(talk, draft.lang);
      const team = org.teams.find((t) => t.id === draft.teamId);
      const lead = team ? org.people.find((p) => p.id === team.lead_person_id) : undefined;
      const jobsite = org.jobsites.find((j) => j.id === draft.jobsiteId);
      const attendees = buildAttendees(roster, presentMap, draft.signatures);
      const record = recordPayload({
        companyId: m.company.id,
        clientId: draft.clientId,
        talkId: talk.id,
        language: lang,
        content: lang === "en" ? text : { ...text, en: talk.content.en },
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
        signingStatement: signingStatement(lang),
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
        <p className="mt-2 tabular-nums"><b>{signedCount}</b> of {presentRoster.length} signed{absent.length ? ` · ${absent.length} absent` : ""}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {turns.map((t, i) => {
            const sig = sigOf(t);
            return (
              <li key={t.key}>
                <button onClick={() => go(i)} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${sig ? "border-line bg-surface" : "border-warn bg-warn-bg"}`}>
                  <span className="min-w-0 flex-1"><b className="block">{t.name}</b><small className="text-muted">{t.sub}</small></span>
                  {sig ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sig.image} alt={`Signature of ${t.name}`} className="h-10 w-24 rounded bg-white object-contain" />
                  ) : (
                    <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-semibold text-warn-ink">Sign now</span>
                  )}
                </button>
              </li>
            );
          })}
          {absent.map((r) => (
            <li key={r.key} className="flex items-center gap-3 rounded-lg border border-warn bg-warn-bg p-3">
              <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{r.role}</small></span>
              <button className="min-h-11 px-2 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => update({ present: { ...draft.present, [r.key]: true } })}>Is here</button>
              <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-semibold text-warn-ink">Absent</span>
            </li>
          ))}
        </ul>
        <IssuesEditor org={org} draft={draft} update={update} />
        <CrewPhoto draft={draft} update={update} />

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
  const nextName = (() => { const n = nextOpen(idx); return n < turns.length ? turns[n].name : null; })();
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold text-muted tabular-nums">Signing {idx + 1} of {turns.length}</p>
        <button className="min-h-11 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => go(turns.length)}>Review all</button>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {turns.map((x, i) => (
          <span key={x.key} className={`h-1.5 flex-1 rounded ${sigOf(x) ? "bg-ok" : i === idx ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>
      <MakeupBanner draft={draft} />
      <p className="mt-5 text-sm text-muted">{t.presenter ? "Presenter signs first" : "Pass the phone to"}</p>
      <h1 className="font-display text-5xl font-semibold leading-none text-balance tracking-tight">{t.name}</h1>
      <p className="mt-1 text-muted">{t.sub}</p>
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
            <span className="block text-base font-semibold">{ui.signedBy}</span>
            {draft.lang !== "en" && <span className="block text-sm text-muted">{crewText("en").signedBy}</span>}
          </span>
        </button>
      )}
      <div className="mt-3">
        <SignaturePad key={t.key} tall label={t.name} value={sig} onChange={setSig} hint={ui.signHere}
          locked={!t.presenter && !confirmedAt ? ui.tapFirst : null} />
      </div>

      <div className="sticky bottom-0 -mx-4 mt-5 flex flex-col gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button onClick={() => go(nextOpen(idx))} disabled={!sig}>
          {nextName ? `Next: ${nextName}` : "Done signing"}
        </Button>
        <div className="flex gap-2">
          {idx > 0 && <Button size="sm" variant="ghost" className="flex-1" onClick={() => go(idx - 1)}>Back</Button>}
          {!t.presenter && (
            <Button size="sm" variant="ghost" className="flex-1" onClick={() => {
              const present = { ...draft.present, [t.key]: false };
              const signatures = { ...draft.signatures };
              delete signatures[t.key];
              update({ present, signatures });
              toast(`${t.name} marked absent`, { action: { label: "Undo", run: () => update({ present: { ...present, [t.key]: true } }) } });
              // the list shrinks by one, so the same index now points at the next person
              setIdx((i) => Math.min(i, turns.length - 1));
            }}>Isn&apos;t here</Button>
          )}
          {!sig && <Button size="sm" variant="ghost" className="flex-1" onClick={() => go(nextOpen(idx))}>Skip</Button>}
        </div>
        {idx === 0 && <Button size="sm" variant="ghost" onClick={() => update({ step: "crew" })}>Back to who&apos;s here</Button>}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
/** "Anything the crew raised?" Each item gets an owner (the presenter by default) and a fix-by date (a week out). */
function IssuesEditor({ org, draft, update }: { org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void }) {
  const [text, setText] = useState("");
  const set = (list: DraftIssue[]) => update({ issues: list });
  const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const people = [...org.people].sort((a, b) => a.full_name.localeCompare(b.full_name));
  return (
    <section className="mt-6">
      <GroupHeading aside={draft.issues.length ? `${draft.issues.length}` : undefined}>Anything the crew raised?</GroupHeading>
      <p className="mt-2 text-sm text-muted">Hazards or problems to fix, like a damaged ladder or missing guardrail. Each one gets an owner and a fix-by date.</p>
      <ul className="mt-3 flex flex-col gap-2">
        {draft.issues.map((x, i) => (
          <li key={x.clientId} className="rounded-xl bg-surface p-3">
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
        <input aria-label="Add something the crew raised" placeholder="Add something the crew raised" maxLength={1000} className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
        <Button size="sm" type="submit">Add</Button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Saved({ done }: { done: Done }) {
  const c = done.counts;
  return (
    <>
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
        <b>{c.signed}</b> signed · <b>{c.not_signed}</b> not signed · <b>{c.absent}</b> absent
        {(c.flagged > 0 || !done.presenterSigned) && (
          <span className="ml-2 rounded bg-warn px-2 py-0.5 font-display text-xs font-semibold text-warn-ink">
            {c.flagged + (done.presenterSigned ? 0 : 1)} flagged
          </span>
        )}
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/records/" className="rounded-lg bg-action px-4 py-4 text-center font-display text-xl font-semibold text-action-ink">See records</Link>
        <Link href="/" className="rounded-lg border border-line px-4 py-3 text-center font-semibold">Home</Link>
      </div>
    </>
  );
}
