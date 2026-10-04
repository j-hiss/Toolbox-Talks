"use client";

// Starter home screen. It runs the real core logic (plan + climate + talk library) against an example company so
// you can see the shared code working in the web app and inside the iPhone/Android apps. Sign-in, company setup and
// the talk flow come next, ported screen by screen from prototype/index.html.
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { buildPlan, thisWeek } from "@/core/plan";
import { mondayOf, isoDay, weekLabel } from "@/core/weeks";
import { talkText } from "@/core/talks";

const EXAMPLE = { industry: "con" as const, zip: "33913" };

export default function Home() {
  const today = new Date();
  const climate = climateFor(EXAMPLE.zip);
  const plan = buildPlan({ talks: TALKS, industry: EXAMPLE.industry, climate, programStart: isoDay(mondayOf(today)), today });
  const week = thisWeek(plan, today);
  const talk = week ? TALKS.find((t) => t.id === week.talkId) : undefined;
  const text = talk ? talkText(talk, "en").text : undefined;
  const upcoming = plan.slice(1, 5).map((w) => ({ w, t: TALKS.find((t) => t.id === w.talkId)! }));

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <header className="flex items-center gap-3 border-b border-line pb-3">
        <span
          aria-hidden
          className="h-[18px] w-7 rounded-sm"
          style={{ background: "repeating-linear-gradient(-45deg, var(--hivis) 0 6px, var(--fg) 6px 12px)" }}
        />
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide">Toolbox Talks</h1>
      </header>

      <p className="mt-4 rounded-lg border border-hivis bg-surface px-4 py-3 text-sm">
        Example company: construction, {climate.label}. Real sign-in and company setup come next.
      </p>

      {week && talk && text && (
        <section className="mt-6">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">
            Week {week.n} of 52 · {weekLabel(week.monday)}
          </p>
          <h2 className="font-display text-4xl font-extrabold uppercase leading-none">{text.title}</h2>
          <p className="mt-3 font-bold">{text.hook}</p>
          <p className="mt-2 text-sm text-muted">
            {talk.code} · about {talk.minutes} min to read aloud
          </p>
        </section>
      )}

      <section className="mt-8">
        <h3 className="border-b-2 border-hivis pb-1 font-display text-sm font-bold uppercase tracking-widest text-muted">
          Coming up
        </h3>
        <ul className="mt-3 flex flex-col gap-2">
          {upcoming.map(({ w, t }) => (
            <li key={w.key} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <span className="min-w-0">
                <b className="block">{t.content.en.title}</b>
                <small className="text-muted">Week {w.n} · {weekLabel(w.monday)}</small>
              </span>
              <span className="whitespace-nowrap rounded bg-hivis px-2 py-0.5 font-display text-xs font-bold text-hivis-ink">{t.code}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
