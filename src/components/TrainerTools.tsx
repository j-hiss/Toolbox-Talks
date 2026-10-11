"use client";

// The trainer's own screens (migrations 0050-0052): classes with sign-ins, certificates they issued, finding companies
// that are looking for a trainer, and their plan. Also the insurance partner's plan panel. Rules:
// src/core/trainerTools.ts. Data: src/lib/data/trainerTools.ts.
import { useCallback, useEffect, useMemo, useState } from "react";
import { CERT_TYPES, certTypeName } from "@/content/certTypes";
import { INDUSTRIES } from "@/core/industries";
import { partnerPlanFor, REFERRAL_FREE_MONTHS } from "@/core/plans";
import type { RosterCompany } from "@/core/trainers";
import {
  certificateCurrent, certificateTotals, classProblem, filterLooking, lookingState, newClassProblem, partnerActive, partnerPlanLine,
  type Certificate, type LookingCompany, type NewClass, type PartnerAccount, type PartnerCredit, type PartnerKind, type TrainingClass,
} from "@/core/trainerTools";
import { closeClass, createClass, findCompanies, myCertificates, myClasses, myCredits, openPartnerAccount, requestConnect, setClassResult, signClass } from "@/lib/data/trainerTools";
import { saveFile } from "@/lib/download";
import { formatCode } from "@/core/verify";
import { isoDay } from "@/core/weeks";
import { SignaturePad } from "./SignaturePad";
import { Button, ConfirmButton, Field, GroupHeading, Notice, Sheet, inputClass } from "./ui";
import { toast } from "./toast";

const err = (e: unknown) => toast(e instanceof Error ? e.message : String(e), { tone: "error" });
const day = (iso: string | null) => (iso ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");

/** This account's plan for one kind (opens a 30-day trial the first time). */
export function usePartnerAccount(kind: PartnerKind): { account: PartnerAccount | null; credits: PartnerCredit[]; reload: () => void } {
  const [account, setAccount] = useState<PartnerAccount | null>(null);
  const [credits, setCredits] = useState<PartnerCredit[]>([]);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    openPartnerAccount(kind).then((a) => live && setAccount(a)).catch(() => live && setAccount(null));
    myCredits().then((c) => live && setCredits(c.filter((x) => x.kind === kind))).catch(() => live && setCredits([]));
    return () => { live = false; };
  }, [kind, tick]);
  return { account, credits, reload: useCallback(() => setTick((t) => t + 1), []) };
}

/** Your plan: where it stands, the price, and the free months you've earned. */
export function PartnerPlanPanel({ kind, account, credits }: { kind: PartnerKind; account: PartnerAccount | null; credits: PartnerCredit[] }) {
  const plan = partnerPlanFor(kind);
  const earned = credits.reduce((s, c) => s + c.months, 0);
  return (
    <section aria-label="Your plan" className="mt-6">
      <GroupHeading>Your plan</GroupHeading>
      <div className="mt-2 rounded-xl border border-line bg-surface p-3">
        <p className="font-semibold">{plan.name} · ${plan.monthly} a month</p>
        <p className={`mt-1 text-sm ${partnerActive(account) ? "" : "font-semibold text-warn-text"}`}>{partnerPlanLine(account)}</p>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm">{plan.includes.map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="mt-2 text-sm">Every company that signs up with your invite link and starts paying earns you <b>{REFERRAL_FREE_MONTHS} free months</b>. They stack.{earned ? <> You&apos;ve earned <b>{earned}</b> {earned === 1 ? "month" : "months"} from {credits.length} {credits.length === 1 ? "company" : "companies"}.</> : null}</p>
        <p className="mt-2 text-xs text-muted">Your clients, their summaries and cards never lock, whatever your plan. Questions about paying: contact us.</p>
      </div>
    </section>
  );
}

// Classes ---------------------------------------------------------------------------------------------------------------

export function TrainerClasses({ roster, onChanged }: { roster: RosterCompany[]; onChanged: () => void }) {
  const [classes, setClasses] = useState<TrainingClass[] | null>(null);
  const [making, setMaking] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const load = useCallback(() => {
    const mine = new Set(roster.map((r) => r.trainerId));
    myClasses().then((c) => setClasses(c.filter((x) => mine.has(x.trainer_id)))).catch(() => setClasses([]));
  }, [roster]);
  useEffect(load, [load]);
  const open = classes?.find((c) => c.id === openId) ?? null;
  const co = (id: string) => roster.find((r) => r.companyId === id);
  if (!classes) return null;
  return (
    <section aria-label="Classes" className="mt-4">
      <GroupHeading aside={`${classes.length}`}>Classes</GroupHeading>
      <p className="mt-1 text-sm text-muted">Run a class for a client: people sign in on this phone, you mark who passed, and each pass goes to the company as a card to approve.</p>
      <div className="mt-2"><Button type="button" size="sm" onClick={() => setMaking(true)} disabled={!roster.some((r) => r.people.length)}>New class</Button></div>
      {!roster.some((r) => r.people.length) && <p className="mt-2 text-sm text-muted">A client needs to share people with you first.</p>}
      <ul className="mt-3 flex flex-col gap-1.5">
        {classes.map((c) => {
          const passed = c.people.filter((p) => p.result === "passed").length, signed = c.people.filter((p) => p.signed_at).length;
          return (
            <li key={c.id}>
              <button type="button" className="flex w-full items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2.5 text-left text-sm shadow-card" onClick={() => setOpenId(c.id)} aria-label={`Open class ${certTypeName(c.cert_type, c.custom_name)} on ${day(c.held_on)}`}>
                <span className="min-w-0"><b className="block">{certTypeName(c.cert_type, c.custom_name)} · {co(c.company_id)?.companyName ?? "Client"}</b>
                  <small className="text-muted tabular-nums">{day(c.held_on)}{c.place ? ` · ${c.place}` : ""} · {signed} of {c.people.length} signed{c.closed_at ? ` · ${passed} passed` : ""}</small></span>
                <small className={`shrink-0 font-semibold ${c.closed_at ? "text-muted" : "text-brand-text"}`}>{c.closed_at ? "Closed" : "Open ›"}</small>
              </button>
            </li>
          );
        })}
      </ul>
      <NewClassSheet open={making} roster={roster} onClose={() => setMaking(false)} onMade={(id) => { setMaking(false); load(); setOpenId(id); }} />
      {open && <RunClass c={open} people={co(open.company_id)?.people ?? []} companyName={co(open.company_id)?.companyName ?? ""} onClose={() => setOpenId(null)} onChanged={() => { load(); onChanged(); }} />}
    </section>
  );
}

function NewClassSheet({ open, roster, onClose, onMade }: { open: boolean; roster: RosterCompany[]; onClose: () => void; onMade: (id: string) => void }) {
  const withPeople = roster.filter((r) => r.people.length);
  const blank = (): NewClass => ({ companyId: withPeople[0]?.companyId ?? "", certType: CERT_TYPES[0].id, customName: "", heldOn: isoDay(new Date()), place: "", expiresOn: null, note: "", people: [] });
  const [n, setN] = useState<NewClass>(blank);
  const [busy, setBusy] = useState(false);
  const co = withPeople.find((r) => r.companyId === n.companyId);
  const save = async () => {
    const p = newClassProblem(n, isoDay(new Date())); if (p) { toast(p, { tone: "error" }); return; }
    setBusy(true);
    try { const id = await createClass(n); setN(blank()); onMade(id); toast("Class started. Hand the phone around to sign in."); } catch (e) { err(e); }
    setBusy(false);
  };
  return (
    <Sheet title="New class" open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="Client" id="cl-co"><select id="cl-co" className={inputClass} value={n.companyId} onChange={(e) => setN({ ...n, companyId: e.target.value, people: [] })}>{withPeople.map((r) => <option key={r.companyId} value={r.companyId}>{r.companyName}</option>)}</select></Field>
        <Field label="Training" id="cl-type"><select id="cl-type" className={inputClass} value={n.certType} onChange={(e) => setN({ ...n, certType: e.target.value })}>{CERT_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}<option value="custom">Other (type a name)</option></select></Field>
        {n.certType === "custom" && <Field label="Training name" id="cl-name"><input id="cl-name" className={inputClass} maxLength={100} value={n.customName} onChange={(e) => setN({ ...n, customName: e.target.value })} /></Field>}
        <Field label="Class date" id="cl-date"><input id="cl-date" type="date" className={inputClass} value={n.heldOn} onChange={(e) => setN({ ...n, heldOn: e.target.value })} /></Field>
        <Field label="Where (optional)" id="cl-place"><input id="cl-place" className={inputClass} maxLength={200} value={n.place} onChange={(e) => setN({ ...n, place: e.target.value })} placeholder="Example: company yard" /></Field>
        <Field label="Card expires (optional)" hint="The date printed on the card, if it has one" id="cl-exp"><input id="cl-exp" type="date" className={inputClass} value={n.expiresOn ?? ""} onChange={(e) => setN({ ...n, expiresOn: e.target.value || null })} /></Field>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-sm font-semibold">Who&apos;s in the class</legend>
          {co?.people.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={n.people.includes(p.id)} onChange={(e) => setN({ ...n, people: e.target.checked ? [...n.people, p.id] : n.people.filter((x) => x !== p.id) })} /> {p.name} <small className="text-muted">{p.title}</small></label>
          ))}
          <button type="button" className="self-start text-sm font-semibold text-brand-text underline" onClick={() => setN({ ...n, people: co?.people.map((p) => p.id) ?? [] })}>Everyone</button>
        </fieldset>
        <Button type="button" disabled={busy} onClick={save}>{busy ? "Starting…" : "Start class"}</Button>
      </div>
    </Sheet>
  );
}

function RunClass({ c, people, companyName, onClose, onChanged }: { c: TrainingClass; people: RosterCompany["people"]; companyName: string; onClose: () => void; onChanged: () => void }) {
  const [signing, setSigning] = useState<string | null>(null);
  const [sig, setSig] = useState<import("@/core/record").Signature | null>(null);
  const name = (id: string) => people.find((p) => p.id === id)?.name ?? "Someone no longer shared with you";
  const act = async (f: () => Promise<unknown>, ok?: string) => { try { await f(); onChanged(); if (ok) toast(ok); } catch (e) { err(e); } };
  const problem = classProblem(c);
  return (
    <Sheet title={`${certTypeName(c.cert_type, c.custom_name)} · ${companyName}`} open onClose={onClose}>
      <p className="text-sm text-muted">{day(c.held_on)}{c.place ? ` · ${c.place}` : ""}{c.expires_on ? ` · card expires ${day(c.expires_on)}` : ""}</p>
      {c.closed_at && <div className="mt-2"><Notice tone="ok">Closed {day(c.closed_at)}. {(() => { const n = c.people.filter((p) => p.result === "passed").length; return `${n} ${n === 1 ? "card" : "cards"}`; })()} went to {companyName} for approval. This record doesn&apos;t change.</Notice></div>}
      <ul aria-label="Class sign-in" className="mt-3 flex flex-col gap-2">
        {c.people.map((p) => (
          <li key={p.person_id} className="rounded-lg border border-line p-2.5 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0"><b>{name(p.person_id)}</b> <small className={p.signed_at ? "text-ok" : "text-muted"}>{p.signed_at ? "· Signed" : "· Not signed"}</small></span>
              {!c.closed_at && (
                <span className="flex flex-wrap gap-1.5">
                  {!p.signed_at && <Button type="button" size="sm" variant="soft" onClick={() => { setSigning(p.person_id); setSig(null); }}>Sign in</Button>}
                  <Button type="button" size="sm" variant={p.result === "passed" ? "primary" : "ghost"} aria-pressed={p.result === "passed"} onClick={() => act(() => setClassResult(c.id, p.person_id, true))}>Passed</Button>
                  <Button type="button" size="sm" variant={p.result === "not_passed" ? "primary" : "ghost"} aria-pressed={p.result === "not_passed"} onClick={() => act(() => setClassResult(c.id, p.person_id, false))}>Not passed</Button>
                </span>
              )}
              {c.closed_at && <small className={p.result === "passed" ? "font-semibold text-ok" : "text-muted"}>{p.result === "passed" ? "Passed · card sent" : "Not passed"}</small>}
            </div>
            {signing === p.person_id && (
              <div className="mt-2 flex flex-col gap-2">
                <SignaturePad label={name(p.person_id)} value={sig} onChange={setSig} />
                <Button type="button" size="sm" disabled={!sig} onClick={() => act(() => signClass(c.id, p.person_id, sig!.image), `${name(p.person_id)} signed in.`).then(() => setSigning(null))}>Save signature</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!c.closed_at && (
        <div className="mt-4 flex flex-col gap-2">
          {problem && <p className="text-sm text-muted">{problem}</p>}
          <ConfirmButton label="Close class and send cards" confirmLabel="Tap again: this can't be changed after" disabled={!!problem}
            onConfirm={() => void act(async () => { const n = await closeClass(c.id); toast(`${n} ${n === 1 ? "card" : "cards"} sent to ${companyName} for approval.`); })} />
        </div>
      )}
    </Sheet>
  );
}

// Certificates ----------------------------------------------------------------------------------------------------------

export function TrainerCertificates() {
  const [certs, setCerts] = useState<Certificate[] | null>(null);
  useEffect(() => { myCertificates().then(setCerts).catch(() => setCerts([])); }, []);
  if (!certs) return null;
  const t = certificateTotals(certs);
  const pdf = async (c: Certificate) => {
    try {
      const { buildCertificatePdf, certificatePdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(certificatePdfFileName(c), buildCertificatePdf(c).output("blob"));
      if (res !== "canceled") toast("Certificate ready.");
    } catch (e) { err(e); }
  };
  return (
    <section aria-label="Certificates" className="mt-4">
      <GroupHeading aside={`${t.all}`}>Certificates you issued</GroupHeading>
      <p className="mt-1 text-sm text-muted tabular-nums">{t.thisYear} this year for {t.clients} {t.clients === 1 ? "client" : "clients"}. Each certificate carries a check code anyone can verify. Only cards a company approved show here.</p>
      {certs.length === 0 && <p className="mt-2 text-sm text-muted">None yet. Cards appear here once a company approves them.</p>}
      <ul className="mt-2 flex flex-col gap-1.5">
        {certs.map((c) => (
          <li key={c.submission_id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm shadow-card">
            <span className="min-w-0"><b className="block">{certTypeName(c.cert_type, c.custom_name)} · {c.person_name}</b>
              <small className="text-muted">{c.company_name} · {c.issued_on ? `issued ${day(c.issued_on)}` : `approved ${day(c.approved_at)}`}{c.expires_on ? ` · expires ${day(c.expires_on)}` : ""} · <span className={certificateCurrent(c) ? "text-ok" : "font-semibold text-warn-text"}>{c.withdrawn ? "Withdrawn by the company" : certificateCurrent(c) ? "Current" : "Expired"}</span></small>
              <small className="block font-mono text-muted">{formatCode(c.verify_code)}</small></span>
            <Button type="button" size="sm" variant="ghost" onClick={() => pdf(c)}>Certificate</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Finding companies -----------------------------------------------------------------------------------------------------

export function FindCompanies({ account, myName }: { account: PartnerAccount | null; myName: string }) {
  const [rows, setRows] = useState<LookingCompany[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [training, setTraining] = useState("");
  const [ask, setAsk] = useState<LookingCompany | null>(null);
  const [name, setName] = useState(myName);
  const [msg, setMsg] = useState("");
  const active = partnerActive(account);
  const load = useCallback(() => { if (!active) return; findCompanies().then((r) => { setRows(r); setError(null); }).catch((e) => setError(e instanceof Error ? e.message : String(e))); }, [active]);
  useEffect(load, [load]);
  const states = useMemo(() => [...new Set((rows ?? []).map(lookingState).filter(Boolean))].sort(), [rows]);
  const shown = rows ? filterLooking(rows, state, training) : [];
  return (
    <section aria-label="Find companies" className="mt-4">
      <GroupHeading>Find companies looking for a trainer</GroupHeading>
      <p className="mt-1 text-sm text-muted">Companies that turned on &ldquo;We&apos;re looking for a trainer&rdquo; and the trainings they want. Ask to connect; if they accept, they become your client and choose which people you see.</p>
      {!active && <div className="mt-2"><Notice tone="caution">Finding companies is part of the trainer plan. Your trial or free months have ended. Contact us to keep using it; your clients and certificates stay either way.</Notice></div>}
      {error && <div className="mt-2"><Notice tone="error">{error}</Notice></div>}
      {active && rows && (
        <>
          <div className="mt-2 flex flex-wrap gap-2">
            <select aria-label="State" className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm" value={state} onChange={(e) => setState(e.target.value)}><option value="">Any state</option>{states.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <select aria-label="Training" className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm" value={training} onChange={(e) => setTraining(e.target.value)}><option value="">Any training</option>{CERT_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </div>
          {shown.length === 0 && <p className="mt-2 text-sm text-muted">No company matches right now.</p>}
          <ul aria-label="Companies looking for a trainer" className="mt-2 flex flex-col gap-1.5">
            {shown.map((r) => (
              <li key={r.company_id} className="rounded-lg bg-surface p-3 text-sm shadow-card">
                <b className="block">{r.name}</b>
                <small className="text-muted">{INDUSTRIES.find((i) => i.id === r.industry)?.name ?? r.industry} · {lookingState(r) || "ZIP " + r.zip} · {r.size} · listed {day(r.listed_since)}</small>
                {r.trainings.length > 0 && <p className="mt-1">Wants: {r.trainings.map((t) => certTypeName(t)).join(", ")}</p>}
                {r.note && <p className="mt-1 text-muted">&ldquo;{r.note}&rdquo;</p>}
                <div className="mt-2">{r.requested ? <small className="font-semibold text-muted">Request sent</small> : <Button type="button" size="sm" variant="soft" onClick={() => setAsk(r)}>Ask to connect</Button>}</div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Sheet title={ask ? `Ask ${ask.name} to connect` : ""} open={!!ask} onClose={() => setAsk(null)}>
        <div className="flex flex-col gap-3">
          <Field label="Your name or training company" id="fc-name"><input id="fc-name" className={inputClass} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Message" hint="What you offer and where" id="fc-msg"><textarea id="fc-msg" rows={4} maxLength={500} className={inputClass} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Example: we run forklift and fall protection classes in Lee County" /></Field>
          <Button type="button" onClick={async () => {
            if (!ask) return;
            try { await requestConnect(ask.company_id, name, msg); toast(`Request sent to ${ask.name}.`); setAsk(null); setMsg(""); load(); } catch (e) { err(e); }
          }}>Send request</Button>
        </div>
      </Sheet>
    </section>
  );
}

// Company side --------------------------------------------------------------------------------------------------------

/**
 * Admin -> Training -> Trainers: "We're looking for a trainer" (opt-in; trainers on a plan can find the company and
 * ask to connect) and the requests that came in. Accepting invites the trainer; the company still picks who they see.
 */
export function FindTrainerSetting({ companyId, onAccepted }: { companyId: string; onAccepted: () => void }) {
  const [listing, setListing] = useState<import("@/core/trainerTools").TrainerListing | null>(null);
  const [requests, setRequests] = useState<import("@/core/trainerTools").ConnectRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    import("@/lib/data/trainerTools").then(async (d) => {
      setListing(await d.getListing(companyId).catch(() => null));
      setRequests(await d.connectRequests(companyId).catch(() => []));
    });
  }, [companyId]);
  useEffect(load, [load]);
  if (!listing) return null;
  const save = async (next: typeof listing) => {
    const before = listing;
    setBusy(true); setListing(next);
    try { const d = await import("@/lib/data/trainerTools"); await d.setListing(companyId, next); toast(next.looking ? "Trainers can now find you and ask to connect." : "You're no longer listed."); } catch (e) { setListing(before); err(e); }
    setBusy(false);
  };
  const answer = async (id: string, accept: boolean, name: string) => {
    try { const d = await import("@/lib/data/trainerTools"); await d.answerConnect(id, accept); toast(accept ? `${name} added as a trainer. Choose who they can see below.` : "Request declined."); load(); if (accept) onAccepted(); } catch (e) { err(e); }
  };
  const open = requests.filter((r) => !r.answered_at);
  return (
    <div className="mt-3 rounded-xl border border-line p-3">
      <label className="flex items-start gap-2 text-sm font-semibold">
        <input type="checkbox" className="mt-1" aria-label="We're looking for a trainer" checked={listing.looking} disabled={busy} onChange={(e) => void save({ ...listing, looking: e.target.checked })} />
        <span>We&apos;re looking for a trainer<small className="block font-normal text-muted">Trainers using the app can find your company (name, industry, ZIP, about how many people, and what you list below) and ask to connect. Nothing else is shown, and you decide on every request.</small></span>
      </label>
      {listing.looking && (
        <div className="mt-3 flex flex-col gap-2">
          <fieldset className="flex flex-wrap gap-x-4 gap-y-1">
            <legend className="mb-1 text-sm font-semibold">Trainings you need</legend>
            {CERT_TYPES.map((c) => (
              <label key={c.id} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={listing.trainings.includes(c.id)} onChange={(e) => setListing({ ...listing, trainings: e.target.checked ? [...listing.trainings, c.id] : listing.trainings.filter((x) => x !== c.id) })} /> {c.name}</label>
            ))}
          </fieldset>
          <Field label="Note for trainers (optional)" id="ft-note"><input id="ft-note" className={inputClass} maxLength={300} value={listing.note} onChange={(e) => setListing({ ...listing, note: e.target.value })} placeholder="Example: forklift evaluations for 6 people, Fort Myers area" /></Field>
          <div><Button type="button" size="sm" variant="soft" disabled={busy} onClick={() => void save(listing)}>Save</Button></div>
        </div>
      )}
      {open.length > 0 && (
        <ul aria-label="Trainers asking to connect" className="mt-3 flex flex-col gap-2">
          {open.map((r) => (
            <li key={r.id} className="rounded-lg bg-surface p-3 text-sm shadow-card">
              <b className="block">{r.name}</b><small className="text-muted break-all">{r.email} · asked {day(r.requested_at)}</small>
              {r.message && <p className="mt-1">&ldquo;{r.message}&rdquo;</p>}
              <div className="mt-2 flex gap-2">
                <Button type="button" size="sm" onClick={() => void answer(r.id, true, r.name)}>Accept</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => void answer(r.id, false, r.name)}>Decline</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
