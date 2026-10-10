"use client";

// Admin → Training → Trainers: invite an outside trainer, tick which people they may see, and approve or decline the
// cards they send. A trainer sees only the people ticked here (name and job title), never records, reports or anyone
// else. An approved card becomes a training card marked "Sent by trainer"; a declined one needs a reason the trainer
// sees. Data: src/lib/data/trainers.ts. Order and labels: src/core/trainers.ts.
import { useCallback, useEffect, useState } from "react";
import { sortSubmissions } from "@/core/trainers";
import { titleOf } from "@/core/presenters";
import { certTypeName } from "@/content/certTypes";
import { cardUrl } from "@/lib/data/certs";
import { decideSubmission, inviteTrainer, listSubmissions, listTrainers, removeTrainer, setTrainerPerson, type CompanySubmission, type Trainer } from "@/lib/data/trainers";
import type { Person, Role } from "@/lib/data/types";
import { Button, ConfirmButton, GroupHeading, Notice, inputClass } from "./ui";
import { OutsideInvite } from "./OutsideInvite";
import { toast } from "./toast";

const day = (iso: string | null) => (iso ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");

export function TrainersSection({ companyId, people, roles, onApproved }: { companyId: string; people: Person[]; roles: Role[]; onApproved: () => void }) {
  const [trainers, setTrainers] = useState<Trainer[] | null>(null);
  const [subs, setSubs] = useState<CompanySubmission[]>([]);
  const [missing, setMissing] = useState(false);
  const load = useCallback(() => {
    Promise.all([listTrainers(companyId), listSubmissions(companyId)])
      .then(([t, s]) => { setTrainers(t); setSubs(s); setMissing(false); })
      .catch(() => setMissing(true)); // a database without migration 0026: no trainer section yet
  }, [companyId]);
  useEffect(load, [load]);
  if (missing || !trainers) return null;

  const name = (id: string) => people.find((p) => p.id === id)?.full_name ?? "Someone no longer on the roster";
  const waiting = sortSubmissions(subs.filter((s) => s.status === "pending"));
  const reviewed = sortSubmissions(subs.filter((s) => s.status !== "pending")).slice(0, 10);
  return (
    <section aria-label="Trainers" className="mt-6">
      <GroupHeading aside={waiting.length ? `${waiting.length} waiting` : undefined}>Trainers</GroupHeading>
      <p className="mt-1 text-sm text-muted">Let an outside trainer send in cards for the people you pick. Each card waits for an owner or admin to approve it. Trainers see only those people&apos;s names and job titles, nothing else.</p>

      {waiting.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2" aria-label="Cards waiting for approval">
          {waiting.map((s) => <Waiting key={s.id} s={s} companyId={companyId} who={name(s.person_id)} done={() => { load(); onApproved(); }} />)}
        </ul>
      )}

      <OutsideInvite id="tr" nameLabel="Trainer or training company" namePlaceholder="Example Training Co" buttonLabel="Invite trainer"
        onInvite={async (email, name) => { await inviteTrainer(companyId, email, name); load(); }}
        after={(name, email) => `Invited. Ask ${name} to sign in on the website with ${email}. Then tick the people they may see.`} />

      {trainers.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {trainers.map((t) => <TrainerRow key={t.id} t={t} companyId={companyId} people={people} roles={roles} done={load} />)}
        </ul>
      )}

      {reviewed.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">Recently reviewed ({reviewed.length})</summary>
          <ul className="flex flex-col gap-1">
            {reviewed.map((s) => (
              <li key={s.id} className="text-muted">
                <b className="text-fg">{certTypeName(s.cert_type, s.custom_name)}</b> for {name(s.person_id)} from {s.trainer_name}: {s.status === "approved" ? "approved" : `declined (${s.decline_reason})`} {day(s.decided_at)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function Waiting({ s, companyId, who, done }: { s: CompanySubmission; companyId: string; who: string; done: () => void }) {
  const [why, setWhy] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const decide = async (approve: boolean) => {
    setMsg(null);
    try { await decideSubmission(companyId, s.id, approve, why); toast(approve ? `Approved: ${certTypeName(s.cert_type, s.custom_name)} added for ${who}` : "Declined. The trainer sees your reason."); done(); }
    catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
  };
  const open = async () => { try { window.open(await cardUrl(s.card_path!), "_blank", "noopener"); } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); } };
  return (
    <li className="rounded-lg bg-surface p-3 text-sm shadow-card">
      <b>{certTypeName(s.cert_type, s.custom_name)}</b> for <b>{who}</b>
      <p className="text-muted">{[s.issued_on && `Issued ${day(s.issued_on)}`, s.expires_on ? `expires ${day(s.expires_on)}` : "no expiry on the card", s.note].filter(Boolean).join(" · ")}</p>
      <p className="text-xs text-muted">Sent by {s.trainer_name} on {day(s.submitted_at)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {s.card_path && <Button size="sm" variant="ghost" onClick={open}>Open card</Button>}
        <Button size="sm" onClick={() => decide(true)}>Approve</Button>
        <input aria-label="Why decline" placeholder="Why decline (the trainer sees this)" className={`${inputClass} flex-1 py-2`} value={why} onChange={(e) => setWhy(e.target.value)} />
        <ConfirmButton label="Decline" disabled={!why.trim()} onConfirm={() => decide(false)} />
      </div>
      {msg && <div className="mt-2"><Notice tone="error">{msg}</Notice></div>}
    </li>
  );
}

function TrainerRow({ t, companyId, people, roles, done }: { t: Trainer; companyId: string; people: Person[]; roles: Role[]; done: () => void }) {
  const [local, setLocal] = useState<Record<string, boolean>>({});
  const active = [...people].filter((p) => p.active !== false).sort((a, b) => a.full_name.localeCompare(b.full_name));
  const given = (id: string) => local[id] ?? t.people.includes(id);
  const count = active.filter((p) => given(p.id)).length;
  const toggle = async (p: Person, on: boolean) => {
    setLocal((l) => ({ ...l, [p.id]: on }));
    try { await setTrainerPerson(companyId, t.id, p.id, on); done(); }
    catch (e) { setLocal((l) => ({ ...l, [p.id]: !on })); toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  return (
    <li className="rounded-lg bg-surface p-3 text-sm shadow-card">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0"><b className="block truncate">{t.name}</b><small className="block truncate text-muted">{t.email}</small>
          <small className={`block ${t.accepted_at ? "text-ok" : "text-muted"}`}>{t.accepted_at ? `Signed in ${day(t.accepted_at)}` : "Waiting for them to sign in"} · sees {count} {count === 1 ? "person" : "people"}</small></span>
        <ConfirmButton label="Remove" onConfirm={async () => {
          try { await removeTrainer(companyId, t.id); toast(`${t.name} removed. Cards they sent stay on file.`); done(); } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
        }} />
      </div>
      <details className="mt-1">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">People {t.name} may see</summary>
        <ul className="flex flex-col">
          {active.map((p) => (
            <li key={p.id}><label className="flex min-h-11 items-center gap-2"><input type="checkbox" className="h-5 w-5" checked={given(p.id)} onChange={(e) => toggle(p, e.target.checked)} aria-label={`${t.name} may see ${p.full_name}`} /> {p.full_name} <small className="text-muted">{titleOf(p, roles)}</small></label></li>
          ))}
        </ul>
      </details>
    </li>
  );
}
