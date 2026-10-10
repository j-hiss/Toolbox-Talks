"use client";

// Home: this week's talk from the company's own 52-week plan (locked for the week: every crew gives the same one),
// plus a way to make up a missed week.
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { parseDay, periodLabel } from "@/core/weeks";
import { weekNumbers } from "@/core/plan";
import { talkText } from "@/core/talks";
import { INDUSTRIES } from "@/core/industries";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { canAdmin, canPresent, canReport, type Membership } from "@/lib/data/types";
import { EmployeeHome } from "@/components/EmployeeHome";
import { TrainingAlert } from "@/components/TrainingAlert";
import { RequireCompany } from "@/components/Guard";
import { JobsitePicker, readChosenJobsite } from "@/components/JobsitePicker";
import { newDailyDraft, newDraft, useDraft } from "@/lib/draft";
import { useOutbox } from "@/lib/useOutbox";
import { usePlan } from "@/lib/usePlan";
import { readLastSetup } from "@/lib/lastSetup";
import { GettingStarted, MomentumHero, WeekStatusCard, useHomeStatus } from "@/components/HomeCards";
import { workSettingFor } from "@/core/worksetting";
import { WeatherCard } from "@/components/Weather";
import type { Jobsite } from "@/lib/data/types";
import { useEffect, useState } from "react";
import { planReminders } from "@/core/reminders";
import { applyReminders, remindersOn, remindersSupported, setReminders } from "@/lib/reminders";
import { useRouter } from "next/navigation";
import { Button, GroupHeading, Notice, Shell } from "@/components/ui";

export default function HomePage() {
  return <RequireCompany>{(m) => (m.access === "employee" ? <EmployeeHome m={m} /> : <Home m={m} />)}</RequireCompany>;
}

function Home({ m }: { m: Membership }) {
  const s = useSession();
  const co = m.company;
  const climate = climateFor(co.zip);
  const { plan, week, input } = usePlan(co);
  const talk = week ? TALKS.find((t) => t.id === week.talkId) : undefined;
  const text = talk ? talkText(talk, "en").text : undefined;
  const nextIdx = week ? plan.indexOf(week) + 1 : 0;
  const upcoming = plan.slice(nextIdx, nextIdx + 4).map((w) => ({ w, t: TALKS.find((t) => t.id === w.talkId)! }));
  const industry = INDUSTRIES.find((i) => i.id === co.industry)?.name;
  const router = useRouter();
  const draft = useDraft(co.id);
  const outbox = useOutbox(co.id);
  const draftTitle = draft?.kind === "daily" ? "Daily pre-task plan" : draft?.talkId ? TALKS.find((t) => t.id === draft.talkId)?.content.en.title : null;
  const st = useHomeStatus(co, input, outbox.items.length);
  const [site, setSite] = useState<Jobsite | null>(null);
  const isAdmin = canAdmin(m.access);
  const last = readLastSetup(co.id);
  const lastCrew = last?.teamId === "all" ? "All teams" : st?.teams.find((t) => t.id === last?.teamId)?.name;
  const [remind, setRemind] = useState(() => remindersOn());
  const nextWeek = plan[nextIdx];
  const crewGrid = st?.week.find((g) => g.teamId === (last?.teamId || null))?.weeks[0]?.tally;
  // Keep this phone's reminders matching the latest plan and records (phone app only; nothing on the website).
  useEffect(() => {
    if (!st || !remind) return;
    void applyReminders(planReminders({
      today: new Date(),
      thisWeekTitle: talk?.content.en.title ?? null,
      nextWeekTitle: nextWeek ? TALKS.find((t) => t.id === nextWeek.talkId)?.content.en.title ?? null : null,
      crewName: lastCrew ?? null,
      crewDone: !!crewGrid && crewGrid.expected > 0 && crewGrid.on_time >= crewGrid.expected,
      expiringSoon: st.expiringSoon,
      period: week ? { start: week.monday, weeks: week.weeks } : null,
    })).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st, remind, talk?.id, nextWeek?.key]);
  const start = (talkId: string | null) => {
    newDraft(co.id, talkId, readChosenJobsite(co.id) ?? "");
    router.push("/talk/");
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {s.memberships.length > 1 ? (
          <select
            aria-label="Company"
            className="rounded-md border border-line bg-surface px-3 py-1 font-semibold"
            value={co.id}
            onChange={(e) => s.setCurrent(e.target.value)}
          >
            {s.memberships.map((x) => <option key={x.company.id} value={x.company.id}>{x.company.name}</option>)}
          </select>
        ) : null}
        <span className="rounded-md border border-line px-3 py-1 text-muted">{industry}</span>
        <span className="rounded-md border border-line px-3 py-1 text-muted">{climate.state ? climate.label : "No ZIP set"}</span>
        {s.trainer && <Link href="/trainer/" className="rounded-md border border-line px-3 py-1 font-semibold">Trainer portal ›</Link>}
        {s.partner && <Link href="/partner/" className="rounded-md border border-line px-3 py-1 font-semibold">Partner portal ›</Link>}
      </div>

      {outbox.items.length > 0 && (
        <div className="mt-4">
          <Notice>
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>{outbox.items.length === 1 ? "1 talk is" : `${outbox.items.length} talks are`} saved on this phone, waiting for signal to upload.</span>
              <Button size="sm" variant="ghost" disabled={outbox.busy} onClick={() => outbox.upload()}>{outbox.busy ? "Uploading…" : "Upload now"}</Button>
            </span>
          </Notice>
        </div>
      )}

      {draft && (
        <div className="mt-4">
          <Notice>
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>{draft.kind === "daily" ? "In progress" : "Talk in progress"}{draftTitle ? `: ${draftTitle}` : ""}.</span>
              <Button size="sm" onClick={() => router.push("/talk/")}>Resume</Button>
            </span>
          </Notice>
        </div>
      )}

      {canAdmin(m.access) && <TrainingAlert companyId={co.id} />}

      {!co.zip && canAdmin(m.access) && (
        <div className="mt-4">
          <Notice>Add your ZIP code in <Link className="font-semibold text-brand-text underline underline-offset-2" href="/admin/#company">Admin</Link> so heat, cold and storm talks land in the right weeks.</Notice>
        </div>
      )}

      {/* One column on phones; on a big screen the week sits on the left and the jobsite, weather and what's coming on the right. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
      <div>
      {week && talk && text && st && <MomentumHero st={st} />}

      {week && talk && text ? (
        <section className="mt-3">
          <div className="overflow-hidden rounded-xl bg-surface shadow-card">
            {/* The week as an entry in the year's record: where we are in the 52, then the talk's title. */}
            <div className="border-b border-line px-5 pt-5 pb-4">
              <p className="flex items-baseline justify-between gap-3 text-sm text-muted">
                <span className="font-semibold text-brand-text">{weekNumbers(week)} <span className="font-normal text-muted">of 52</span></span>
                <span className="tabular-nums">{periodLabel(week.monday, week.weeks)}</span>
              </p>
              <div className="mt-3 flex h-[3px] gap-px overflow-hidden rounded-full" aria-hidden>
                <span className="bg-brand/45" style={{ flex: week.n - 1 }} />
                <span className="bg-brand" style={{ flex: week.weeks }} />
                <span className="bg-line" style={{ flex: 52 - (week.n - 1) - week.weeks }} />
              </div>
              <h1 className="mt-4 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">{text.title}</h1>
            </div>
            <div className="px-5 pt-4 pb-5">
              <p className="leading-relaxed">{text.hook}</p>
              <p className="mt-2 text-sm text-muted">{talk.code} · about {talk.minutes} min to read aloud · same talk for every team {week.weeks > 1 ? `through ${periodLabel(week.monday, week.weeks).split(" – ")[1]}` : "this week"}</p>
              {canPresent(m.access) && <div className="mt-4 flex flex-col gap-2">
                <Button size="lg" onClick={() => start(week.talkId)}>Start this talk</Button>
                {lastCrew && <p className="text-center text-sm text-muted">Set up like last time: {lastCrew}</p>}
                {/* Only when someone owes a past talk (or the status hasn't loaded, offline). */}
                {(!st || st.owed > 0) && <Button variant="soft" onClick={() => start(null)}>Make up a missed talk</Button>}
                {/* The daily pre-task plan: its own record, separate from the weekly talk (Admin → Company turns it on). */}
                {co.daily_enabled && <Button variant="ghost" onClick={() => { newDailyDraft(co.id, readChosenJobsite(co.id) ?? ""); router.push("/talk/"); }}>Start today&apos;s pre-task plan</Button>}
              </div>}
            </div>
          </div>
          {st && <WeekStatusCard st={st} isAdmin={canReport(m.access)} onMakeup={canPresent(m.access) ? () => start(null) : undefined} />}
          {isAdmin && st && <GettingStarted st={st} />}
        </section>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {isAdmin && st && <GettingStarted st={st} />}
          <Notice>
            Your 52-week plan starts the week of {parseDay(co.program_start).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.
          </Notice>
        </div>
      )}

      </div>
      <div className="lg:mt-4">
      <JobsitePicker companyId={co.id} isAdmin={isAdmin} onChange={setSite} />
      <WeatherCard key={site?.id ?? "none"} site={site} setting={workSettingFor(co, site)} />

      {upcoming.length > 0 && (
        <section>
          <GroupHeading>Coming up</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {upcoming.map(({ w, t }) => (
              <li key={w.key} className="flex items-center justify-between gap-3 rounded-xl bg-surface shadow-card px-4 py-3">
                <span className="min-w-0">
                  <b className="block">{t.content.en.title}</b>
                  <small className="text-muted">{weekNumbers(w)} · {periodLabel(w.monday, w.weeks)}</small>
                </span>
                <span className="whitespace-nowrap rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-text">{t.code}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
      </div>

      <div className="mt-10 border-t border-line pt-4 text-sm">
        {remindersSupported() ? (
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span><b>Reminders on this phone</b><small className="block text-muted">Monday: this week&apos;s talk · Thursday: if your team hasn&apos;t had it · makeups running out</small></span>
            <input type="checkbox" className="h-6 w-6 accent-[var(--brand)]" checked={remind} onChange={async (e) => setRemind(await setReminders(e.target.checked))} />
          </label>
        ) : (
          <p className="text-muted">Phone reminders (Monday&apos;s talk, Thursday nudge, makeups running out) come with the iPhone and Android app.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
        <span>Signed in as {s.user?.email}</span>
        <div className="flex gap-2">
          <Link href="/setup/" className="rounded-md border border-line px-2.5 py-1.5 font-semibold text-fg">New company</Link>
          <Button size="sm" variant="ghost" onClick={() => s.signOut()}>Sign out</Button>
        </div>
      </div>
    </Shell>
  );
}
