"use client";

// Home: this week's talk from the company's own 52-week plan. The talk flow (read, attendance, sign) is next.
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { buildPlan, thisWeek } from "@/core/plan";
import { weekLabel, parseDay } from "@/core/weeks";
import { talkText } from "@/core/talks";
import { INDUSTRIES } from "@/core/industries";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { canAdmin, type Membership } from "@/lib/data/types";
import { RequireCompany } from "@/components/Guard";
import { JobsitePicker } from "@/components/JobsitePicker";
import { Button, Eyebrow, GroupHeading, NavLink, Notice, Shell, Title } from "@/components/ui";

export default function HomePage() {
  return <RequireCompany>{(m) => <Home m={m} />}</RequireCompany>;
}

function Home({ m }: { m: Membership }) {
  const s = useSession();
  const co = m.company;
  const today = new Date();
  const climate = climateFor(co.zip);
  const plan = buildPlan({ talks: TALKS, industry: co.industry, climate, programStart: co.program_start, today });
  const week = thisWeek(plan, today);
  const talk = week ? TALKS.find((t) => t.id === week.talkId) : undefined;
  const text = talk ? talkText(talk, "en").text : undefined;
  const nextIdx = week ? week.n : 0;
  const upcoming = plan.slice(nextIdx, nextIdx + 4).map((w) => ({ w, t: TALKS.find((t) => t.id === w.talkId)! }));
  const industry = INDUSTRIES.find((i) => i.id === co.industry)?.name;

  return (
    <Shell nav={canAdmin(m.access) ? <NavLink href="/admin/">Admin</NavLink> : undefined}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {s.memberships.length > 1 ? (
          <select
            aria-label="Company"
            className="rounded-full border border-line bg-surface px-3 py-1 font-bold"
            value={co.id}
            onChange={(e) => s.setCurrent(e.target.value)}
          >
            {s.memberships.map((x) => <option key={x.company.id} value={x.company.id}>{x.company.name}</option>)}
          </select>
        ) : (
          <span className="rounded-full border border-line px-3 py-1 font-bold">{co.name}</span>
        )}
        <span className="rounded-full border border-line px-3 py-1 text-muted">{industry}</span>
        <span className="rounded-full border border-line px-3 py-1 text-muted">{climate.state ? climate.label : "No ZIP set"}</span>
      </div>

      {!co.zip && canAdmin(m.access) && (
        <div className="mt-4">
          <Notice>Add your ZIP code in <Link className="font-bold underline" href="/admin/#company">Admin</Link> so heat, cold and storm talks land in the right weeks.</Notice>
        </div>
      )}

      {week && talk && text ? (
        <section className="mt-6">
          <Eyebrow>Week {week.n} of 52 · {weekLabel(week.monday)}</Eyebrow>
          <Title>{text.title}</Title>
          <p className="mt-3 font-bold">{text.hook}</p>
          <p className="mt-2 text-sm text-muted">{talk.code} · about {talk.minutes} min to read aloud</p>
          <div className="mt-5">
            <Button disabled title="Coming in the next build">Start this talk</Button>
            <p className="mt-2 text-center text-xs text-muted">Reading, attendance and signatures come in the next build.</p>
          </div>
        </section>
      ) : (
        <div className="mt-6">
          <Notice>
            Your 52-week plan starts the week of {parseDay(co.program_start).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.
          </Notice>
        </div>
      )}

      <JobsitePicker companyId={co.id} isAdmin={canAdmin(m.access)} />

      {upcoming.length > 0 && (
        <section>
          <GroupHeading>Coming up</GroupHeading>
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
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
        <span>Signed in as {s.user?.email}</span>
        <div className="flex gap-2">
          <Link href="/setup/" className="rounded-md border border-line px-2.5 py-1.5 font-bold text-fg">New company</Link>
          <Button size="sm" variant="ghost" onClick={() => s.signOut()}>Sign out</Button>
        </div>
      </div>
    </Shell>
  );
}
