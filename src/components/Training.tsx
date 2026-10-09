"use client";

// Admin → Training: each person's training cards (forklift, OSHA 10, first aid...), what each job title needs, and
// what's expiring, expired or missing. Expiry dates are typed from the card; the app never works one out from a rule.
// Cards are append-only: a renewal is a new card, a mistake is withdrawn with a reason. Status: src/core/certs.ts.
import { useEffect, useMemo, useState } from "react";
import { EXPIRING_DAYS, personTraining, trainingSummary, type CertState, type TrainingRow } from "@/core/certs";
import { CERT_TYPES, certTypeName } from "@/content/certTypes";
import { repeatNoteText } from "@/content/repeats";
import { titleOf } from "@/core/presenters";
import { addCert, cardUrl, listCerts, listRequirements, setRequirement, withdrawCert, type StoredCert } from "@/lib/data/certs";
import type { CertRequirement } from "@/core/certs";
import type { Person, Role } from "@/lib/data/types";
import { Button, ConfirmButton, Field, FileButton, GroupHeading, Loading, Notice, Sheet, inputClass } from "./ui";
import { toast } from "./toast";

export const CERT_CHIP: Record<CertState, { label: string; tone: string }> = {
  current: { label: "Current", tone: "bg-ok-bg text-ok-text" },
  expiring: { label: "Expiring", tone: "bg-caution-bg text-caution-text" },
  expired: { label: "Expired", tone: "bg-warn text-warn-ink" },
  missing: { label: "Missing", tone: "border border-dashed border-warn text-warn-text" },
};
const day = (iso: string | null) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");
const rowName = (r: TrainingRow) => certTypeName(r.cert_type, r.cert?.custom_name ?? r.name ?? "");

export function Training({ companyId, people, roles }: { companyId: string; people: Person[]; roles: Role[] }) {
  const [certs, setCerts] = useState<StoredCert[] | null>(null);
  const [reqs, setReqs] = useState<CertRequirement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [onlyAttention, setOnlyAttention] = useState(false);
  const [open, setOpen] = useState<Person | null>(null);
  const today = useMemo(() => new Date(), []);
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    let live = true;
    Promise.all([listCerts(companyId), listRequirements(companyId)])
      .then(([c, r]) => { if (live) { setCerts(c); setReqs(r); setError(null); } })
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [companyId, version]);

  if (!certs) return error ? <Notice tone="error">{error}</Notice> : <Loading />;
  const sum = trainingSummary(people, certs, reqs, today);
  const shown = [...people].filter((p) => !onlyAttention || sum.needAttention.includes(p.id)).sort((a, b) => a.full_name.localeCompare(b.full_name));

  return (
    <>
      <p className="text-sm text-muted">Each person&apos;s training cards, and what their job title needs. Type the expiry date printed on the card; cards with no expiry stay current.</p>
      <p className="mt-3 text-sm tabular-nums">
        <b>{sum.current}</b> current · <b className={sum.expiring ? "text-caution-text" : ""}>{sum.expiring}</b> expiring within {EXPIRING_DAYS} days · <b className={sum.expired ? "text-warn-text" : ""}>{sum.expired}</b> expired · <b className={sum.missing ? "text-warn-text" : ""}>{sum.missing}</b> missing
      </p>
      <label className="mt-2 flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={onlyAttention} onChange={(e) => setOnlyAttention(e.target.checked)} /> Only people who need attention ({sum.needAttention.length})</label>

      <ul className="mt-2 flex flex-col gap-2">
        {shown.map((p) => {
          const rows = personTraining(p.id, p.role_id, certs, reqs, today);
          return (
            <li key={p.id}>
              <button className="w-full rounded-lg bg-surface shadow-card p-3 text-left text-sm" onClick={() => setOpen(p)} aria-label={`Training for ${p.full_name}`}>
                <span className="flex items-baseline justify-between gap-2"><b>{p.full_name}</b><small className="text-muted">{titleOf(p, roles)}</small></span>
                <span className="mt-1.5 flex flex-wrap gap-1.5">
                  {rows.length === 0 ? <small className="text-muted">No cards on file</small> : rows.map((r) => (
                    <span key={`${r.cert_type}${r.cert?.id ?? ""}`} className={`rounded px-2 py-0.5 text-xs font-semibold ${CERT_CHIP[r.state].tone}`}>{rowName(r)}{r.state !== "current" ? ` · ${CERT_CHIP[r.state].label}` : ""}</span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="mt-3 text-sm text-muted">{onlyAttention ? "Everyone's cards are current." : "Add people first."}</p>}

      <TitleNeeds companyId={companyId} roles={roles} reqs={reqs} reload={reload} />
      {open && <PersonSheet companyId={companyId} person={open} roles={roles} certs={certs} reqs={reqs} today={today} onClose={() => setOpen(null)} reload={reload} />}
    </>
  );
}

function PersonSheet({ companyId, person, roles, certs, reqs, today, onClose, reload }: {
  companyId: string; person: Person; roles: Role[]; certs: StoredCert[]; reqs: CertRequirement[]; today: Date; onClose: () => void; reload: () => void;
}) {
  const rows = personTraining(person.id, person.role_id, certs, reqs, today);
  const history = certs.filter((c) => c.person_id === person.id);
  const [type, setType] = useState(rows.find((r) => r.state === "missing")?.cert_type ?? CERT_TYPES[0].id);
  const [custom, setCustom] = useState("");
  const [issued, setIssued] = useState("");
  const [expires, setExpires] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [why, setWhy] = useState<Record<string, string>>({});
  const info = CERT_TYPES.find((c) => c.id === type);
  const bad = (type === "custom" && !custom.trim()) || (!!issued && !!expires && expires < issued);

  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      await addCert(companyId, { personId: person.id, certType: type, customName: custom, issuedOn: issued || null, expiresOn: expires || null, note }, file);
      toast(`${certTypeName(type, custom)} added for ${person.full_name}`);
      setIssued(""); setExpires(""); setNote(""); setFile(null); setCustom("");
      reload();
    } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const open = async (path: string) => { try { window.open(await cardUrl(path), "_blank", "noopener"); } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); } };
  const suggest = () => {
    if (!info?.suggestMonths || !issued) return;
    const d = new Date(`${issued}T12:00:00`); d.setMonth(d.getMonth() + info.suggestMonths);
    setExpires(d.toISOString().slice(0, 10));
  };

  return (
    <Sheet title={person.full_name} open onClose={onClose}>
      <p className="text-sm text-muted">{titleOf(person, roles)}</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {rows.length === 0 && <li className="text-sm text-muted">No cards on file, and their job title doesn&apos;t need any.</li>}
        {rows.map((r) => (
          <li key={`${r.cert_type}${r.cert?.id ?? ""}`} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
            <span className="min-w-0"><b className="block">{rowName(r)}</b>
              <small className="text-muted">{r.cert ? (r.cert.expires_on ? `Expires ${day(r.cert.expires_on)}` : "No expiry on the card") : "Needed for their job title"}{r.required ? "" : " · not required"}</small></span>
            <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${CERT_CHIP[r.state].tone}`}>{CERT_CHIP[r.state].label}</span>
          </li>
        ))}
      </ul>

      <GroupHeading>Add a card</GroupHeading>
      <div className="mt-3 flex flex-col gap-3">
        <Field label="Training" id="ct-type">
          <select id="ct-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            {CERT_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value="custom">Other (type a name)</option>
          </select>
        </Field>
        {type === "custom" && <Field label="Name" id="ct-custom"><input id="ct-custom" maxLength={100} className={inputClass} value={custom} onChange={(e) => setCustom(e.target.value)} /></Field>}
        {info?.note && <Notice tone="caution">{repeatNoteText(info.note).replace(/ This talk.*$/, "")}</Notice>}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Issued" id="ct-issued"><input id="ct-issued" type="date" className={inputClass} value={issued} onChange={(e) => setIssued(e.target.value)} onBlur={() => !expires && suggest()} /></Field>
          <Field label="Expires" id="ct-expires" hint="from the card"><input id="ct-expires" type="date" className={inputClass} value={expires} min={issued || undefined} onChange={(e) => setExpires(e.target.value)} /></Field>
        </div>
        {info?.suggestMonths && issued && !expires && <button className="text-left text-sm font-semibold text-brand-text underline" onClick={suggest}>Use {info.suggestMonths / 12} years from the issue date</button>}
        <Field label="Note (optional)" id="ct-note"><input id="ct-note" maxLength={300} className={inputClass} placeholder="Trainer, card number last 4, equipment" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        <FileButton label="Photo of the card (optional)" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} chosen={file?.name} onFile={setFile} />
        <Button size="sm" disabled={busy || bad} onClick={save}>Save card</Button>
        {msg && <Notice tone="error">{msg}</Notice>}
      </div>

      {history.length > 0 && (
        <>
          <GroupHeading aside={`${history.length}`}>On file</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {history.map((c) => (
              <li key={c.id} className={`rounded-lg p-3 text-sm ${c.withdrawn_at ? "opacity-60" : "bg-surface shadow-card"}`}>
                <b>{certTypeName(c.cert_type, c.custom_name)}</b>
                <p className="text-muted">{[c.issued_on && `Issued ${day(c.issued_on)}`, c.expires_on ? `expires ${day(c.expires_on)}` : "no expiry", c.note].filter(Boolean).join(" · ")}</p>
                {c.withdrawn_at && <p className="text-muted">Withdrawn: {c.withdrawn_reason}</p>}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {c.card_path && <Button size="sm" variant="ghost" onClick={() => open(c.card_path!)}>Open card</Button>}
                  {!c.withdrawn_at && (
                    <>
                      <input aria-label={`Why withdraw ${certTypeName(c.cert_type, c.custom_name)}`} placeholder="Why withdraw (e.g. wrong person)" className={`${inputClass} flex-1 py-2`} value={why[c.id] ?? ""} onChange={(e) => setWhy((w) => ({ ...w, [c.id]: e.target.value }))} />
                      <ConfirmButton label="Withdraw" disabled={!why[c.id]?.trim()} onConfirm={async () => {
                        try { await withdrawCert(companyId, c.id, why[c.id]); toast("Withdrawn. It stays on file."); reload(); } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
                      }} />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Sheet>
  );
}

function TitleNeeds({ companyId, roles, reqs, reload }: { companyId: string; roles: Role[]; reqs: CertRequirement[]; reload: () => void }) {
  const [roleId, setRoleId] = useState("");
  const role = roles.find((r) => r.id === roleId);
  // Shows the tick at once; the saved list catches up on reload (and an error puts the tick back).
  const [local, setLocal] = useState<Record<string, boolean>>({});
  const toggle = async (certType: string, on: boolean) => {
    const k = `${roleId}|${certType}`;
    setLocal((l) => ({ ...l, [k]: on }));
    try { await setRequirement(companyId, roleId, certType, on); reload(); }
    catch (e) { setLocal((l) => ({ ...l, [k]: !on })); toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  const counts = new Map(roles.map((r) => [r.id, reqs.filter((q) => q.role_id === r.id).length]));
  return (
    <section aria-label="What each job title needs" className="mt-6">
      <GroupHeading>What each job title needs</GroupHeading>
      <p className="mt-1 text-sm text-muted">Pick a job title, then tick the training it needs. Anyone with that title shows &quot;Missing&quot; until a card is on file.</p>
      <select aria-label="Job title" className={`${inputClass} mt-2`} value={roleId} onChange={(e) => setRoleId(e.target.value)}>
        <option value="">Choose a job title</option>
        {[...roles].sort((a, b) => a.name.localeCompare(b.name)).map((r) => <option key={r.id} value={r.id}>{r.name}{counts.get(r.id) ? ` (${counts.get(r.id)})` : ""}</option>)}
      </select>
      {role && (
        <ul className="mt-2 flex flex-col gap-1">
          {CERT_TYPES.map((c) => {
            const on = local[`${role.id}|${c.id}`] ?? reqs.some((q) => q.role_id === role.id && q.cert_type === c.id);
            return (
              <li key={c.id}>
                <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={on} onChange={(e) => toggle(c.id, e.target.checked)} aria-label={`${role.name} needs ${c.name}`} /> {c.name}</label>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
