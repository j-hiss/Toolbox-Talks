"use client";

// Plans and prices (src/core/plans.ts): why the price is fair, the three sizes and what each adds, and which one this
// company is on. Shown from Admin -> Company -> Plan and account. Payment happens outside the app for now.
import { FAIR_PRICE, PLAN_SIZES, TRIAL_DAYS, YEARLY_MONTHS, sizeForPeople, yearly, type Tier } from "@/core/plans";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PlansPrices({ current, people }: { current?: Tier | null; people?: number | null }) {
  const fits = people != null ? sizeForPeople(people) : null;
  return (
    <div className="flex flex-col gap-4">
      <section aria-label="Why the price is fair">
        <h3 className="font-display text-lg font-bold">An affordable, fair price</h3>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm">
          {FAIR_PRICE.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </section>
      <ul aria-label="Plans" className="grid gap-3 sm:grid-cols-3">
        {PLAN_SIZES.map((s, i) => (
          <li key={s.id} className={`flex flex-col gap-2 rounded-xl border p-3 ${current === s.id ? "border-brand bg-brand/5" : "border-line bg-surface"}`}>
            <div className="flex items-baseline justify-between gap-2">
              <b className="text-lg">{s.name}</b>
              {current === s.id && <small className="font-semibold text-brand-text">Your plan</small>}
            </div>
            <p className="tabular-nums"><span className="font-display text-2xl font-bold">{money(s.monthly)}</span><span className="text-sm text-muted"> a month</span></p>
            <p className="text-xs text-muted tabular-nums">or {money(yearly(s))} a year ({12 - YEARLY_MONTHS} months free) · up to {s.people} people</p>
            <p className="text-sm">{s.forWho}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{i === 0 ? "Includes" : `Everything in ${PLAN_SIZES[i - 1].name}, plus`}</p>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">{s.adds.map((a) => <li key={a}>{a}</li>)}</ul>
          </li>
        ))}
      </ul>
      {people != null && (
        <p className="text-sm">
          You have <b className="tabular-nums">{people}</b> {people === 1 ? "person" : "people"} on the roster{fits ? <>; the <b>{fits.name}</b> plan covers you.</> : <>, more than our largest plan. Contact us for a price.</>}
        </p>
      )}
      <p className="text-xs text-muted">Every plan starts with {TRIAL_DAYS} days of everything. Trainers and insurance agents never pay. Moving down never locks anything you already have; it only stops starting new things the smaller plan doesn&apos;t include.</p>
    </div>
  );
}
