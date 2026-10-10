"use client";

// The safety profile's body: headline figures, weeks with no talk, month by month, languages and program elements.
// One view for both the company's own Safety profile screen and the page a shared link opens (src/app/share), so
// what an agent sees is exactly what the company saw when it shared. Counts and rates only.
import type { SafetyProfile } from "@/core/profile";
import { DOCUMENT_KINDS } from "@/core/profile";
import { parseDay, weekLabel } from "@/core/weeks";
import { LANGUAGES } from "@/core/languages";
import { GroupHeading, Notice } from "@/components/ui";

const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);
const fmtMonth = (ym: string) => parseDay(`${ym}-01`).toLocaleDateString(undefined, { month: "short", year: "numeric" });
const STATUS = { records: "Shown by app records", some: "Partly shown", outside: "Outside the app" } as const;
const STATUS_TONE = { records: "text-ok", some: "text-caution", outside: "text-muted" } as const;

/** `shared`: the page a link opens. Adds the self-reported EMR and document titles, drops the company's own hints. */
export function ProfileSummary({ p, florida, shared = false }: { p: SafetyProfile; florida: boolean; shared?: boolean }) {
  const lang = (id: string) => LANGUAGES.find((l) => l.id === id)?.label ?? id;
  const kindName = (k: string) => DOCUMENT_KINDS.find((d) => d.id === k)?.name ?? k;
  return (
    <>
      <GroupHeading>What the records show</GroupHeading>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Fig label="Weekly talks held" value={p.periodsEnded ? `${p.periodsWithTalk} of ${p.periodsEnded}` : "–"} note={p.periodsMissed ? `${p.periodsMissed} with no talk` : p.periodsEnded ? "no missed weeks" : "no full weeks yet"} warn={p.periodsMissed > 0}
          meter={p.periodsEnded ? p.periodsWithTalk / p.periodsEnded : null} />
        <Fig label="Team sign-in rate" value={pct(p.signIn)} note={p.onTime === null ? "" : `${pct(p.onTime)} on time`} meter={p.signIn} />
        <Fig label="Toolbox talks" value={String(p.talks)} note={`${p.topics} topics${p.makeups ? `, ${p.makeups} makeups` : ""}`} />
        <Fig label="Daily plans" value={String(p.dailyDays)} note="days with a signed plan" />
        <Fig label="Inspections" value={String(p.log.inspections + p.log.walkarounds)} note={`${p.log.walkarounds} walk-arounds`} />
        <Fig label="Issues fixed" value={`${p.issues.fixed} of ${p.issues.raised}`} note={p.issues.medianDaysToFix === null ? "" : `typically ${p.issues.medianDaysToFix} days`}
          meter={p.issues.raised ? p.issues.fixed / p.issues.raised : null} />
      </dl>

      {p.missedKeys.length > 0 && (
        <div className="mt-3"><Notice tone="caution">
          <b>Weeks with no talk recorded ({p.missedKeys.length}):</b> {p.missedKeys.map((k) => weekLabel(parseDay(k))).join(", ")}. These are listed in the PDF too. A makeup talk for a week shows it was covered late.
        </Notice></div>
      )}

      {p.months.length > 0 && (
        <>
          <GroupHeading>Month by month</GroupHeading>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="text-left text-xs font-medium text-muted"><th className="py-1 pr-2">Month</th><th className="pr-2">Weeks held</th><th className="pr-2">Talks</th><th className="pr-2">Sign-in</th><th>On time</th></tr></thead>
              <tbody>
                {p.months.map((r) => (
                  <tr key={r.month} className="border-t border-line">
                    <td className="py-1.5 pr-2">{fmtMonth(r.month)}</td>
                    <td className={`pr-2 ${r.missed ? "font-semibold text-warn" : ""}`}>{r.periods ? `${r.periods - r.missed} of ${r.periods}` : "–"}</td>
                    <td className="pr-2">{r.talks}</td><td className="pr-2">{pct(r.signIn)}</td><td>{pct(r.onTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {p.languages.length > 0 && <p className="mt-2 text-sm text-muted">Talks given in {p.languages.map((l) => `${lang(l.language)} (${l.talks})`).join(", ")}.</p>}

      <GroupHeading>{florida ? "Program elements (Florida, s. 440.1025)" : "Program elements"}</GroupHeading>
      <p className="mt-1 text-sm text-muted">Where the records show each part of a safety program. The insurer decides whether a program earns a premium credit.</p>
      <ul className="mt-3 flex flex-col gap-2">
        {p.elements.map((e) => (
          <li key={e.id} className="rounded-lg bg-surface shadow-card p-3 text-sm">
            <div className="flex items-start justify-between gap-2"><b>{e.name}</b><span className={`shrink-0 text-xs font-semibold ${STATUS_TONE[e.status]}`}>{STATUS[e.status]}</span></div>
            <p className="mt-1 text-muted">{e.evidence}</p>
            {!shared && e.id === "policy" && e.status === "outside" && <p className="mt-1 text-xs">Attach your written program below to show it here.</p>}
          </li>
        ))}
      </ul>

      {shared && p.emr.length > 0 && (
        <>
          <GroupHeading>Experience mod (self-reported)</GroupHeading>
          <p className="mt-2 text-sm tabular-nums">{p.emr.map((e) => `${e.rating_year}: ${e.emr.toFixed(2)}`).join(" · ")}</p>
          <p className="mt-1 text-xs text-muted">Typed in by the company from its rating worksheet. The app doesn&apos;t calculate it.</p>
        </>
      )}
      {shared && p.documents.length > 0 && (
        <>
          <GroupHeading>Program documents on file</GroupHeading>
          <ul className="mt-2 text-sm">{p.documents.map((d, i) => <li key={i}>{kindName(d.kind)} <span className="text-muted">(uploaded {new Date(d.uploaded_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })})</span></li>)}</ul>
          <p className="mt-1 text-xs text-muted">The kind of document only. Ask the company for a copy.</p>
        </>
      )}
    </>
  );
}

/** A figure tile. `meter` (0 to 1) draws how full a rate is; a shortfall shows in red only when `warn` says so. */
function Fig({ label, value, note, warn, meter }: { label: string; value: string; note: string; warn?: boolean; meter?: number | null }) {
  return (
    <div className="flex flex-col rounded-xl bg-surface shadow-card p-3">
      <dt className="text-[13px] font-medium text-muted">{label}</dt>
      <dd className="mt-1 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] tabular-nums">{value}</dd>
      {meter != null && (
        <dd aria-hidden className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
          <span className={`block h-full rounded-full ${warn ? "bg-warn" : "bg-ok"}`} style={{ width: `${Math.round(Math.max(0, Math.min(1, meter)) * 100)}%` }} />
        </dd>
      )}
      {note && <dd className={`mt-1 text-xs ${warn ? "font-semibold text-warn" : "text-muted"}`}>{note}</dd>}
    </div>
  );
}
