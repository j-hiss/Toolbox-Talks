"use client";

// Giving a talk: (choose a missed week, for makeups) → read → who's here → sign → saved. This week's talk is locked:
// every crew gives the same one. A makeup gives a missed week's talk, keeps today's real date and GPS, and says why. The talk in progress lives in a draft on the phone
// (src/lib/draft.ts), and the finished record goes through the offline outbox (src/lib/outbox.ts).
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TALKS } from "@/content/talks";
import { crewText } from "@/content/ui";
import { talkText } from "@/core/talks";
import { MAKEUP_REASONS, makeupReasonText, makeupWeeks, stillNeeds } from "@/core/makeup";
import { weekLabel, parseDay } from "@/core/weeks";
import { LANGUAGES, type LanguageId } from "@/core/languages";
import { buildAttendees, recordPayload, unsignedPresent, type RosterEntry, type Signature } from "@/core/record";
import { countStatuses } from "@/core/attendance";
import { listJobsites, listPeople, listRoles, listTeams } from "@/lib/data/company";
import { saveTalkRecord, signedForWeek } from "@/lib/data/records";
import { usePlan } from "@/lib/usePlan";
import { writeLastSetup } from "@/lib/lastSetup";
import { buzz, toast } from "@/components/toast";
import type { Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { clearDraft, newDraft, useDraft, writeDraft, type TalkDraft } from "@/lib/draft";
import { enqueue, flush, pending } from "@/lib/outbox";
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
type Done = { title: string; uploaded: boolean; counts: ReturnType<typeof countStatuses>; presenterSigned: boolean; makeupLabel: string | null };

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
      className="text-sm font-bold text-muted underline"
      onClick={() => { stopSpeaking(); clearDraft(co.id); router.replace("/"); }}
    >
      Discard this talk
    </button>
  );

  return (
    <Shell nav={nav} tabs={false}>
      {draft.step === "makeup" && <MakeupPick weeks={makeupWeeks(input, co.makeup_weeks ?? 4)} draft={draft} update={update} />}
      {draft.step === "read" && draft.talkId && <Read draft={draft} update={update} />}
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
        {[1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded ${i <= n ? "bg-hivis" : "bg-line"}`} />)}
      </div>
      <p className="mt-3 font-display text-sm font-bold uppercase tracking-widest text-muted">Step {n} of 3 · {label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function MakeupPick({ weeks, draft, update }: { weeks: ReturnType<typeof makeupWeeks>; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const reason = makeupReasonText(draft.makeupPick, draft.makeupNote);
  return (
    <>
      <Eyebrow>Makeup talk</Eyebrow>
      <Title>Make up a missed week</Title>
      <p className="mt-2 text-sm text-muted">
        For people who missed a week&apos;s talk. It&apos;s saved with today&apos;s real date and location, marked as a makeup for the week
        you pick, with the reason.
      </p>
      <GroupHeading>Which week?</GroupHeading>
      {weeks.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No earlier weeks to make up yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Week to make up">
          {weeks.map((w) => {
            const t = TALKS.find((x) => x.id === w.talkId)!;
            const on = draft.makeup?.weekStart === w.key;
            return (
              <button
                key={w.key}
                role="radio"
                aria-checked={on}
                onClick={() => update({ makeup: { weekStart: w.key, weekNumber: w.n }, talkId: w.talkId, teamId: draft.teamId === "needs" ? "" : draft.teamId, needIds: null })}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${on ? "border-hivis bg-surface shadow-[0_0_0_2px_var(--hivis)]" : "border-line bg-surface"}`}
              >
                <span className="whitespace-nowrap rounded bg-hivis px-2 py-0.5 font-display text-xs font-bold text-hivis-ink">{t.code}</span>
                <span className="min-w-0 flex-1"><b className="block">{t.content.en.title}</b><small className="text-muted">Week {w.n} · {weekLabel(w.monday)}</small></span>
              </button>
            );
          })}
        </div>
      )}
      <GroupHeading>Why is it being made up?</GroupHeading>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Reason">
        {MAKEUP_REASONS.map((r) => (
          <button
            key={r}
            aria-pressed={draft.makeupPick === r}
            onClick={() => update({ makeupPick: r })}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${draft.makeupPick === r ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}
          >
            {r}
          </button>
        ))}
      </div>
      <input
        aria-label="Note"
        placeholder={draft.makeupPick === "Other" ? "Say why (required)" : "Note (optional)"}
        className={`${inputClass} mt-3`}
        value={draft.makeupNote}
        onChange={(e) => update({ makeupNote: e.target.value })}
      />
      {msg && <div className="mt-4"><Notice tone="error">{msg}</Notice></div>}
      <div className="mt-5">
        <Button
          disabled={weeks.length === 0}
          onClick={() => {
            if (!draft.makeup || !draft.talkId) return setMsg("Pick the week being made up.");
            if (!reason) return setMsg(draft.makeupPick === "Other" ? "Add a note saying why." : "Pick a reason.");
            setMsg(null);
            update({ step: "read" });
          }}
        >
          Continue to the talk
        </Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function Read({ draft, update }: { draft: TalkDraft; update: (p: Partial<TalkDraft>) => void }) {
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

  const lines = useMemo(() => {
    const out: { text: string; heading?: boolean; kind: "title" | "hook" | "h" | "item" | "askh" | "ask" }[] = [
      { text: text.title, heading: true, kind: "title" },
      { text: text.hook, kind: "hook" },
    ];
    text.sections.forEach((s) => {
      out.push({ text: s.heading, heading: true, kind: "h" });
      s.items.forEach((i) => out.push({ text: i, kind: "item" }));
    });
    out.push({ text: ui.ask, heading: true, kind: "askh" }, { text: text.ask, kind: "ask" });
    return out;
  }, [text, ui.ask]);

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
  const hl = (i: number) => (line === i ? "rounded bg-hivis text-hivis-ink shadow-[0_0_0_4px_var(--hivis)]" : "");

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
            className={`rounded-full border px-3 py-1.5 text-sm font-bold disabled:opacity-40 ${draft.lang === l.id ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}
          >
            {l.label}{!l.ready && <small className="ml-1 font-normal uppercase">soon</small>}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5" role="group" aria-label="Text size">
        <span className="mr-1 text-sm text-muted">Text size</span>
        <button className="min-h-10 min-w-10 rounded-md border border-line bg-surface text-sm font-bold disabled:opacity-40" disabled={size === 0} onClick={() => setSize(size - 1)} aria-label="Smaller text">A−</button>
        <button className="min-h-10 min-w-10 rounded-md border border-line bg-surface text-lg font-bold disabled:opacity-40" disabled={size === 3} onClick={() => setSize(size + 1)} aria-label="Bigger text">A+</button>
      </div>
      {draft.lang !== "en" && talk.translationStatus[draft.lang] !== "reviewed" && (
        <p className="mt-2 text-xs text-muted">This translation hasn&apos;t been reviewed by a native speaker yet.</p>
      )}

      <h1 id="line-0" className={`mt-4 font-display text-4xl font-extrabold uppercase leading-none text-balance ${hl(0)}`}>{text.title}</h1>
      {status && <p className="mt-2 text-sm text-muted" aria-live="polite">{status}</p>}

      <div className={`mt-4 rounded-lg border border-line bg-surface p-4 ${textSize}`}>
        {lines.slice(1).map((l, j) => {
          const i = j + 1;
          if (l.kind === "hook") return <p key={i} id={`line-${i}`} className={`font-bold ${hl(i)}`}>{l.text}</p>;
          if (l.kind === "h" || l.kind === "askh") return <h3 key={i} id={`line-${i}`} className={`mt-4 font-display text-lg font-bold uppercase tracking-wide ${hl(i)}`}>{l.text}</h3>;
          if (l.kind === "ask") return <p key={i} id={`line-${i}`} className={`mt-1 rounded-r border-l-4 border-hivis bg-bg px-3 py-2 ${hl(i)}`}>{l.text}</p>;
          return <p key={i} id={`line-${i}`} className={`mt-1.5 pl-4 before:-ml-4 before:mr-2 before:content-['•'] ${hl(i)}`}>{l.text}</p>;
        })}
      </div>

      {draft.makeup && <div className="mt-4"><Button size="sm" variant="ghost" onClick={() => { stopRef.current?.(); update({ step: "makeup" }); }}>Change week or reason</Button></div>}

      {/* Always in reach while reading: play/stop and done. */}
      <div className="sticky bottom-0 -mx-4 mt-5 flex gap-2 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <Button size="sm" onClick={toggle} className="shrink-0 bg-fg text-bg" aria-label={playing ? ui.stop : ui.play}>{playing ? `■ ${ui.stop}` : `▶ ${ui.play}`}</Button>
        <Button className="!py-3" onClick={() => { stopRef.current?.(); update({ step: "crew" }); }}>Done reading</Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
function MakeupBanner({ draft }: { draft: TalkDraft }) {
  if (!draft.makeup) return null;
  return (
    <p className="mb-3 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
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
    .concat(draft.walkins.map((name, i): RosterEntry => ({ key: `walkin:${i}`, personId: null, name, role: "Not on roster", teamName: "" })));
}

function Crew({ org, draft, update, signedIds }: { org: Org; draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; signedIds: string[] | null }) {
  const [walkin, setWalkin] = useState("");
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
                  <input type="checkbox" className="h-6 w-6 accent-[var(--hivis)]" checked={isHere} onChange={(e) => update({ present: { ...draft.present, [r.key]: e.target.checked } })} />
                  <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{[r.role, r.teamName].filter(Boolean).join(" · ")}</small></span>
                  {!isHere && <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">Absent</span>}
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const n = walkin.trim();
          if (!n) return;
          const key = `walkin:${draft.walkins.length}`;
          update({ walkins: [...draft.walkins, n], present: { ...draft.present, [key]: true } });
          setWalkin("");
        }}
      >
        <input aria-label="Add someone not on the roster" placeholder="Add someone not on the roster" className={inputClass} value={walkin} onChange={(e) => setWalkin(e.target.value)} />
        <Button size="sm" type="submit">Add</Button>
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
    ...presentRoster.map((r) => ({ key: r.key, name: r.name, sub: [r.role, r.teamName].filter(Boolean).join(" · "), presenter: false })),
  ];
  const sigOf = (t: Turn) => (t.presenter ? draft.presenterSignature : draft.signatures[t.key] ?? null);
  const firstOpen = turns.findIndex((t) => !sigOf(t));
  const [idx, setIdx] = useState(firstOpen === -1 ? turns.length : firstOpen);
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
      });
      if (record.team_id === "") record.team_id = null;
      enqueue(record, attendees);
      writeLastSetup(m.company.id, { presenterId: draft.presenterId, teamId: draft.teamId, jobsiteId: draft.jobsiteId });
      await flush(saveTalkRecord);
      const uploaded = !pending(m.company.id).some((i) => i.record.client_id === draft.clientId);
      buzz(30);
      onSaved({
        title: text.title, uploaded, counts: countStatuses(attendees), presenterSigned: !!draft.presenterSignature,
        makeupLabel: draft.makeup ? `Makeup for Week ${draft.makeup.weekNumber}` : null,
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
                    <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">Sign now</span>
                  )}
                </button>
              </li>
            );
          })}
          {absent.map((r) => (
            <li key={r.key} className="flex items-center gap-3 rounded-lg border border-warn bg-warn-bg p-3">
              <span className="min-w-0 flex-1"><b className="block">{r.name}</b><small className="text-muted">{r.role}</small></span>
              <button className="min-h-11 px-2 text-sm font-bold underline" onClick={() => update({ present: { ...draft.present, [r.key]: true } })}>Is here</button>
              <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">Absent</span>
            </li>
          ))}
        </ul>
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
  const setSig = (s: Signature | null) => {
    if (s) buzz();
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
        <p className="font-display text-sm font-bold uppercase tracking-widest text-muted tabular-nums">Signing {idx + 1} of {turns.length}</p>
        <button className="min-h-11 text-sm font-bold underline" onClick={() => go(turns.length)}>Review all</button>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {turns.map((x, i) => (
          <span key={x.key} className={`h-1.5 flex-1 rounded ${sigOf(x) ? "bg-ok" : i === idx ? "bg-hivis" : "bg-line"}`} />
        ))}
      </div>
      <MakeupBanner draft={draft} />
      <p className="mt-5 text-sm text-muted">{t.presenter ? "Presenter signs first" : "Pass the phone to"}</p>
      <h1 className="font-display text-5xl font-extrabold uppercase leading-none text-balance">{t.name}</h1>
      <p className="mt-1 text-muted">{t.sub}</p>
      <div className="mt-4">
        <SignaturePad key={t.key} tall label={t.name} value={sig} onChange={setSig} hint={ui.signHere} />
      </div>
      <p className="mt-2 text-sm text-muted">{ui.signedBy}{draft.lang !== "en" ? ` · ${crewText("en").signedBy}` : ""}</p>

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
      <p className="mt-4 tabular-nums">
        <b>{c.signed}</b> signed · <b>{c.not_signed}</b> not signed · <b>{c.absent}</b> absent
        {(c.flagged > 0 || !done.presenterSigned) && (
          <span className="ml-2 rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">
            {c.flagged + (done.presenterSigned ? 0 : 1)} flagged
          </span>
        )}
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/records/" className="rounded-lg bg-hivis px-4 py-4 text-center font-display text-xl font-extrabold uppercase tracking-wide text-hivis-ink">See records</Link>
        <Link href="/" className="rounded-lg border border-line px-4 py-3 text-center font-bold">Home</Link>
      </div>
    </>
  );
}
