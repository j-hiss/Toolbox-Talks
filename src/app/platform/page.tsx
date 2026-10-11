"use client";

// The operator console (/platform/): for the people running the service, never for customer companies. Every company
// with its plan and counts; set a plan, pause (read-only) or resume; open a company's records to help them (a reason
// every time, logged and shown to the company); remove a company 30 days after its owner asked to close; the trial
// length; and the log of every operator action. Every call is checked in the database (migration 0042).
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CLOSE_WAIT_DAYS, PLAN_LABEL, removableFrom, type Plan } from "@/core/account";
import { INDUSTRIES } from "@/core/industries";
import {
  amPlatformAdmin, platformAudit, platformCompanies, platformPause, platformPurge, platformResume, platformSetPlan, platformSetTrialDays,
  platformSettings, platformSupportView, type AuditRow, type PlatformCompany, type SupportView,
} from "@/lib/data/platform";
import { useSession } from "@/lib/session";
import { NotConfigured } from "@/components/Guard";
import { Button, ConfirmButton, ErrorNotice, Eyebrow, Field, GroupHeading, Loading, Notice, Sheet, Shell, Title, inputClass } from "@/components/ui";
import { toast } from "@/components/toast";

const PLANS: Plan[] = ["trial", "pilot", "paid", "comp"];
const day = (iso: string | Date) => new Date(typeof iso === "string" && iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const err = (e: unknown) => toast(e instanceof Error ? e.message : String(e), { tone: "error" });

export default function PlatformPage() {
  const s = useSession();
  const router = useRouter();
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => { if (s.status === "signed-out") router.replace("/sign-in/"); }, [s.status, router]);
  useEffect(() => { if (s.status === "signed-in") amPlatformAdmin().then(setAdmin); }, [s.status]);
  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status !== "signed-in" || admin === null) return <Shell tabs={false}><Loading /></Shell>;
  if (!admin) return <Shell tabs={false}><Notice>This page is for the people running the service.</Notice></Shell>;
  return <Console />;
}

function Console() {
  const [rows, setRows] = useState<PlatformCompany[] | null>(null);
  const [trialDays, setTrialDays] = useState<number | null>(null);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [support, setSupport] = useState<{ name: string; view: SupportView } | null>(null);
  const load = useCallback(() => {
    Promise.all([platformCompanies(), platformSettings(), platformAudit(100)])
      .then(([c, st, a]) => { setRows(c); setTrialDays(st.trial_days); setAudit(a); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(load, [load]);

  if (error) return <Shell tabs={false} wide><ErrorNotice what="Couldn't load the console." detail={error} onRetry={load} /></Shell>;
  if (!rows) return <Shell tabs={false} wide><Loading /></Shell>;
  const shown = rows.filter((r) => r.name.toLowerCase().includes(filter.trim().toLowerCase()));
  const totals = { companies: rows.length, paid: rows.filter((r) => r.plan === "paid").length, paused: rows.filter((r) => r.paused_at).length, active30: rows.filter((r) => r.talks_30d > 0).length };

  return (
    <Shell tabs={false} wide>
      <Eyebrow>Service console</Eyebrow>
      <Title>Companies</Title>
      <p className="mt-2 text-sm text-muted">Everyone using the app. Counts only here; open a company&apos;s records with a reason when helping them (they see each look).</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Totals">
        {([["Companies", totals.companies], ["Paid", totals.paid], ["Active in the last 30 days", totals.active30], ["Paused", totals.paused]] as const).map(([k, n]) => (
          <div key={k} className="rounded-xl border border-line bg-surface p-3 text-center shadow-[var(--shadow-card)]"><p className="font-display text-2xl font-bold">{n}</p><p className="text-xs text-muted">{k}</p></div>
        ))}
      </div>
      <div className="mt-4"><Field label="Find a company" id="pf-find"><input id="pf-find" className={inputClass} value={filter} onChange={(e) => setFilter(e.target.value)} /></Field></div>
      <ul aria-label="Companies" className="mt-3 flex flex-col gap-3">
        {shown.map((c) => <CompanyRow key={c.id} c={c} onChanged={load} onSupport={(view) => setSupport({ name: c.name, view })} />)}
        {shown.length === 0 && <li className="text-sm text-muted">No companies match.</li>}
      </ul>

      <GroupHeading>Trials</GroupHeading>
      <TrialSetting days={trialDays} onSaved={load} />

      <GroupHeading>Log of operator actions</GroupHeading>
      <ul aria-label="Operator log" className="mt-2 flex flex-col gap-1 text-sm">
        {audit.map((a, i) => <li key={`${a.at}-${i}`}><b>{new Date(a.at).toLocaleString()}</b> · {a.action.replace(/_/g, " ")}{a.company_name ? ` · ${a.company_name}` : ""}{typeof a.detail.reason === "string" ? ` · ${a.detail.reason}` : ""}{a.action === "purge" && a.company_id ? <> · files: <code>npm run ops:purge-company -- --files-only {a.company_id}</code></> : null}</li>)}
        {audit.length === 0 && <li className="text-muted">Nothing yet.</li>}
      </ul>

      <Sheet title={support ? `Support view: ${support.name}` : ""} open={!!support} onClose={() => setSupport(null)}>
        {support && <SupportPanel v={support.view} />}
      </Sheet>
    </Shell>
  );
}

function CompanyRow({ c, onChanged, onSupport }: { c: PlatformCompany; onChanged: () => void; onSupport: (v: SupportView) => void }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>(c.plan);
  const [trialEnd, setTrialEnd] = useState(c.trial_ends_at ?? "");
  const [reason, setReason] = useState("");
  const [why, setWhy] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const act = async (f: () => Promise<void>, ok: string) => { setBusy(true); try { await f(); toast(ok); onChanged(); } catch (e) { err(e); } setBusy(false); };
  const removable = c.closure_requested_at ? removableFrom(c.closure_requested_at) : null;
  const canPurge = !!removable && removable <= new Date();
  const industry = INDUSTRIES.find((i) => i.id === c.industry)?.name ?? c.industry;
  return (
    <li className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
      <button type="button" className="flex w-full flex-wrap items-baseline justify-between gap-2 text-left" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span><b>{c.name}</b> <span className="text-sm text-muted">· {industry} · since {day(c.created_at)}</span></span>
        <span className="text-sm font-semibold">{PLAN_LABEL[c.plan]}{c.plan === "trial" && c.trial_ends_at ? ` to ${day(c.trial_ends_at)}` : ""}{c.paused_at ? " · Paused" : ""}{c.closure_requested_at ? " · Closing" : ""}</span>
      </button>
      <p className="mt-1 text-sm text-muted">{c.members} account{c.members === 1 ? "" : "s"} · {c.people_active} people · {c.talks_30d} talks in 30 days ({c.talks_total} total) · {c.inspections_total} inspections · last talk {c.last_talk_at ? day(c.last_talk_at) : "none yet"}</p>
      {open && (
        <div className="mt-3 flex flex-col gap-4 border-t border-line pt-3">
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Plan" id={`pl-${c.id}`}><select id={`pl-${c.id}`} className={inputClass} value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>{PLANS.map((p) => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}</select></Field>
            {plan === "trial" && <Field label="Trial ends" hint="empty = no end" id={`te-${c.id}`}><input id={`te-${c.id}`} type="date" className={inputClass} value={trialEnd} onChange={(e) => setTrialEnd(e.target.value)} /></Field>}
            <Button type="button" variant="soft" disabled={busy} onClick={() => act(() => platformSetPlan(c.id, plan, plan === "trial" && trialEnd ? trialEnd : null), `${c.name}: plan saved.`)}>Save plan</Button>
          </div>

          <div className="flex flex-col gap-2">
            <Field label="Help this company: what did they ask for?" hint="They'll see this reason and when you looked." id={`why-${c.id}`}>
              <input id={`why-${c.id}`} className={inputClass} value={why} maxLength={300} onChange={(e) => setWhy(e.target.value)} placeholder="Example: owner asked why last week shows missed" />
            </Field>
            <div><Button type="button" disabled={busy || why.trim().length < 5} onClick={async () => {
              setBusy(true);
              try { onSupport(await platformSupportView(c.id, why)); setWhy(""); onChanged(); } catch (e) { err(e); }
              setBusy(false);
            }}>Open their records (logged)</Button></div>
          </div>

          {c.paused_at ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm">Paused since {day(c.paused_at)}{c.pause_reason ? `: ${c.pause_reason}` : ""}. They can view and download everything; nothing new saves.</p>
              <div><Button type="button" variant="soft" disabled={busy} onClick={() => act(() => platformResume(c.id), `${c.name} resumed.`)}>Resume</Button></div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Field label="Pause (read-only): reason" hint="Shown to their owners and admins." id={`pr-${c.id}`}><input id={`pr-${c.id}`} className={inputClass} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="Example: invoice overdue" /></Field>
              <div><ConfirmButton label="Pause this company" confirmLabel="Tap again to pause" disabled={busy || !reason.trim()} onConfirm={() => void act(() => platformPause(c.id, reason), `${c.name} paused (read-only).`)} /></div>
            </div>
          )}

          {c.closure_requested_at && (
            <div className="flex flex-col gap-2">
              <Notice tone="caution">Their owner asked to close on {day(c.closure_requested_at)}. {canPurge ? "The 30 days are up." : `Data can be removed from ${day(removable!)} (${CLOSE_WAIT_DAYS} days after asking).`}</Notice>
              {canPurge && (
                <>
                  <p className="text-sm">Removing is permanent. Best: run <code>npm run ops:purge-company</code> on your Mac (it removes their rows, then their files). Removing rows here leaves their files; finish with that script&apos;s <code>--files-only</code>. Type the company&apos;s exact name.</p>
                  <input aria-label="Company name to remove" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder={c.name} autoComplete="off" />
                  <div><ConfirmButton label="Remove this company's rows for good" confirmLabel="Tap again: this can't be undone" disabled={busy || name !== c.name} onConfirm={() => void act(() => platformPurge(c.id, name), `${c.name}'s rows removed. Now remove its files: npm run ops:purge-company -- --files-only ${c.id}`)} /></div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function TrialSetting({ days, onSaved }: { days: number | null; onSaved: () => void }) {
  const [v, setV] = useState(days === null ? "" : String(days));
  return (
    <div className="mt-2 flex flex-wrap items-end gap-2">
      <Field label="New companies start a trial of (days)" hint="empty = trials don't end" id="pf-trial"><input id="pf-trial" inputMode="numeric" className={`${inputClass} max-w-32`} value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} /></Field>
      <Button type="button" variant="soft" onClick={async () => {
        const n = v.trim() === "" ? null : Number(v);
        if (n !== null && (n < 1 || n > 365)) { toast("1 to 365 days, or empty.", { tone: "error" }); return; }
        try { await platformSetTrialDays(n); toast("Saved. Applies to companies created from now."); onSaved(); } catch (e) { err(e); }
      }}>Save</Button>
    </div>
  );
}

const STATUS: Record<string, string> = { signed: "signed", not_signed: "not signed", absent: "absent" };

/** Read-only: what the company sees, minus injury details and images. */
function SupportPanel({ v }: { v: SupportView }) {
  const injuries = Object.entries(v.injury_log_counts);
  return (
    <div className="flex flex-col gap-1 text-sm">
      <Notice>Read-only. This look is logged with your reason and shown to the company. Never shown here: the injury log&apos;s details, incident titles, signature and photo images, phone numbers. Issue text is what the crew typed.</Notice>
      <GroupHeading>Setup</GroupHeading>
      <p>{INDUSTRIES.find((i) => i.id === v.company.industry)?.name ?? v.company.industry} · {v.company.work_setting ?? "no work setting"} · plan started {day(v.company.program_start)} · makeups {v.company.makeup_weeks ?? 4} weeks · daily plans {v.company.daily_enabled ? "on" : "off"}</p>
      <GroupHeading aside={`${v.members.length}`}>Accounts</GroupHeading>
      <ul>{v.members.map((m, i) => <li key={i}>{m.email || "(no email)"} · {m.access}</li>)}</ul>
      <GroupHeading aside={`${v.people.filter((p) => p.active).length} active`}>People</GroupHeading>
      <ul>{v.people.map((p, i) => <li key={i} className={p.active ? "" : "text-muted"}>{p.name}{p.job_title ? ` · ${p.job_title}` : ""}{p.team ? ` · ${p.team}` : ""}{p.active ? "" : " · inactive"}{p.has_account ? " · has an account" : ""}</li>)}</ul>
      <GroupHeading aside={`${v.talks.length}`}>Latest talks</GroupHeading>
      <ul className="flex flex-col gap-2">{v.talks.map((t, i) => (
        <li key={i}><b>{day(t.held_at)}</b> · {t.title || "(no title)"} · {t.team} · {t.presenter}{t.makeup_for_week ? ` · makeup for ${day(t.makeup_for_week)}` : ""}{t.kind === "daily" ? " · daily plan" : ""}
          <span className="block text-muted">{t.attendees.map((a) => `${a.name} (${STATUS[a.status] ?? a.status})`).join(", ") || "no one on the roster"}</span></li>
      ))}</ul>
      <GroupHeading aside={`${v.issues.length}`}>Issues</GroupHeading>
      <ul>{v.issues.map((x, i) => <li key={i}>{x.status} · {x.description}{x.owner ? ` · ${x.owner}` : ""}{x.due ? ` · due ${day(x.due)}` : ""}</li>)}</ul>
      <GroupHeading aside={`${v.inspections.length}`}>Inspections</GroupHeading>
      <ul>{v.inspections.map((x, i) => <li key={i}>{day(x.inspected_at)} · {x.title}{x.subject ? ` · ${x.subject}` : ""} · {x.inspector} · {x.failed} of {x.items} failed</li>)}</ul>
      <GroupHeading aside={`${v.safety_log.length}`}>Safety log</GroupHeading>
      <ul>{v.safety_log.map((x, i) => <li key={i}>{day(x.occurred_on)} · {x.kind.replace(/_/g, " ")} · {x.title || "(details hidden)"} · {x.status}</li>)}</ul>
      <GroupHeading aside={`${v.training_cards.length}`}>Training cards</GroupHeading>
      <ul>{v.training_cards.map((x, i) => <li key={i}>{x.person} · {x.card}{x.expires_on ? ` · expires ${day(x.expires_on)}` : ""}</li>)}</ul>
      <GroupHeading>Injury log</GroupHeading>
      <p>{injuries.length ? injuries.map(([y, n]) => `${y}: ${n} case${n === 1 ? "" : "s"}`).join(" · ") : "No cases."} Details are never shown to support.</p>
    </div>
  );
}
