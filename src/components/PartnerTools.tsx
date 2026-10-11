"use client";

// Shared by the trainer and insurance partner portals (migration 0049): your organization (an agency or training
// company whose staff share one client list), your invite link for new clients, and moving a client into the
// organization. Rules: src/core/partnerClients.ts. Data: src/lib/data/partnerClients.ts.
import { useCallback, useEffect, useState } from "react";
import { emailProblem, orgNameProblem, referralLink, type LinkOrgMember, type MyReferral, type OrgKind, type PartnerOrg } from "@/core/partnerClients";
import { createOrg, inviteOrgMember, linkOrgMembers, myOrgs, myReferralCode, myReferrals, removeOrgMember, setLinkOrg } from "@/lib/data/partnerClients";
import { Button, ConfirmButton, Field, GroupHeading, inputClass } from "./ui";
import { toast } from "./toast";
import { appWebAddress } from "@/lib/webAddress";
import { REFERRAL_FREE_MONTHS } from "@/core/plans";

const err = (e: unknown) => toast(e instanceof Error ? e.message : String(e), { tone: "error" });

/** The organizations this account is in, of one kind, reloadable. */
export function useOrgs(kind: OrgKind): { orgs: PartnerOrg[]; reload: () => void } {
  const [orgs, setOrgs] = useState<PartnerOrg[]>([]);
  const [tick, setTick] = useState(0);
  useEffect(() => { let live = true; myOrgs().then((o) => live && setOrgs(o.filter((x) => x.kind === kind))).catch(() => live && setOrgs([])); return () => { live = false; }; }, [kind, tick]);
  return { orgs, reload: useCallback(() => setTick((t) => t + 1), []) };
}

/** Your organization: make one, add your staff, see who's in it. */
export function OrgPanel({ kind, orgs, reload, myEmail }: { kind: OrgKind; orgs: PartnerOrg[]; reload: () => void; myEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const word = kind === "training" ? "training company" : "agency";
  const make = async () => {
    const p = orgNameProblem(name); if (p) { toast(p, { tone: "error" }); return; }
    setBusy(true);
    try { await createOrg(name, kind); setName(""); reload(); toast("Organization made. Add your staff next."); } catch (e) { err(e); }
    setBusy(false);
  };
  return (
    <section aria-label="Your organization" className="mt-6">
      <GroupHeading>Your organization</GroupHeading>
      <p className="mt-1 text-sm text-muted">Put your {word}&apos;s staff on one shared client list. You choose which clients go in it; each company sees your organization and everyone in it, and every summary or card opened is logged by person.</p>
      {orgs.map((o) => {
        const amAdmin = o.members.some((m) => m.email === myEmail.toLowerCase() && m.role === "admin");
        return (
          <div key={o.id} className="mt-3 rounded-xl border border-line bg-surface p-3">
            <b>{o.name}</b>
            <ul aria-label={`People in ${o.name}`} className="mt-2 flex flex-col gap-1 text-sm">
              {o.members.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-2">
                  <span className="min-w-0 flex-1 break-all">{m.email} <small className="text-muted">· {m.role === "admin" ? "Admin" : "Staff"}{m.accepted_at ? "" : " · hasn't signed in yet"}</small></span>
                  {(amAdmin || m.email === myEmail.toLowerCase()) && <ConfirmButton label={m.email === myEmail.toLowerCase() ? "Leave" : "Remove"} confirmLabel="Tap again" onConfirm={() => void removeOrgMember(m.id).then(() => { reload(); toast("Removed. They no longer see the organization's clients."); }).catch(err)} />}
                </li>
              ))}
            </ul>
            {amAdmin && (
              <div className="mt-3 flex flex-col gap-2">
                <Field label="Add someone by email" id={`om-${o.id}`}><input id={`om-${o.id}`} type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} /> Also an admin (can add and remove people)</label>
                <div><Button type="button" size="sm" variant="soft" disabled={busy} onClick={async () => {
                  const p = emailProblem(email); if (p) { toast(p, { tone: "error" }); return; }
                  setBusy(true);
                  try { await inviteOrgMember(o.id, email, admin); setEmail(""); setAdmin(false); reload(); toast("Added. They join when they sign in with that email."); } catch (e) { err(e); }
                  setBusy(false);
                }}>Add to {o.name}</Button></div>
              </div>
            )}
          </div>
        );
      })}
      {orgs.length === 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <Field label={`Your ${word}'s name`} id={`org-name-${kind}`}><input id={`org-name-${kind}`} className={inputClass} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder={kind === "training" ? "Example Safety Training Co" : "Example Insurance Agency"} /></Field>
          <div><Button type="button" size="sm" variant="soft" disabled={busy} onClick={make}>Make an organization</Button></div>
        </div>
      )}
    </section>
  );
}

/** Your invite link: new companies that sign up with it are marked as yours. It shares nothing by itself. */
export function InviteLinkPanel({ kind, defaultName, orgs }: { kind: OrgKind; defaultName: string; orgs: PartnerOrg[] }) {
  const [link, setLink] = useState<string | null>(null);
  const [refs, setRefs] = useState<MyReferral[]>([]);
  const org = orgs[0] ?? null;
  useEffect(() => { myReferrals().then((r) => setRefs(r.filter((x) => x.kind === kind))).catch(() => setRefs([])); }, [kind, link]);
  const make = async () => {
    const origin = appWebAddress();
    if (!origin) { toast("Invite links need the app's web address (NEXT_PUBLIC_APP_URL) once the site is live.", { tone: "error" }); return; }
    try { setLink(referralLink(origin, await myReferralCode(kind, org?.name ?? defaultName, org?.id ?? null))); } catch (e) { err(e); }
  };
  const copy = async () => {
    if (!link) return;
    try { await navigator.clipboard.writeText(link); toast("Link copied."); } catch { toast("Select the link and copy it.", { tone: "error" }); }
  };
  const signed = refs.reduce((s, r) => s + r.signed_up, 0);
  const connected = [...new Set(refs.flatMap((r) => r.connected))];
  return (
    <section aria-label="Invite link" className="mt-6">
      <GroupHeading>Invite your clients</GroupHeading>
      <p className="mt-1 text-sm text-muted">Send this link to clients who don&apos;t use the app yet. It opens sign-up with your name on it, and suggests they {kind === "training" ? "add you as their trainer" : "send you their safety summary"}. Nothing is shared until they choose to. Every company that signs up with your link and starts paying earns you {REFERRAL_FREE_MONTHS} free months.</p>
      {link ? (
        <div className="mt-2 flex flex-col gap-2">
          <p className="break-all rounded-lg bg-surface p-2 font-mono text-sm" aria-label="Your invite link">{link}</p>
          <div><Button type="button" size="sm" variant="soft" onClick={copy}>Copy link</Button></div>
        </div>
      ) : <div className="mt-2"><Button type="button" size="sm" variant="soft" onClick={make}>Show my invite link</Button></div>}
      {signed > 0 && <p className="mt-2 text-sm"><b>{signed}</b> {signed === 1 ? "company" : "companies"} signed up with your link{connected.length ? <>; connected with you: {connected.join(", ")}</> : "; none has connected with you yet"}.</p>}
    </section>
  );
}

/** Move a client you were invited by into your organization, or back out. */
export function MoveToOrg({ kind, linkId, current, orgs, onMoved }: { kind: "trainer" | "partner"; linkId: string; current: string | null; orgs: PartnerOrg[]; onMoved: () => void }) {
  if (!orgs.length) return null;
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      Shared with
      <select className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-fg" value={current ?? ""} aria-label="Share this client with your organization"
        onChange={(e) => void setLinkOrg(kind, linkId, e.target.value || null).then(() => { onMoved(); toast(e.target.value ? "Your organization can see this client now." : "Only you can see this client now."); }).catch(err)}>
        <option value="">Only me</option>
        {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </label>
  );
}

/**
 * Company side: the partner organizations behind this company's trainers and insurance partners, and everyone in
 * them (they can all see what that partner sees). Shown under Training → Trainers and Safety profile → partners.
 */
export function OrgMembersNote({ companyId }: { companyId: string }) {
  const [rows, setRows] = useState<LinkOrgMember[]>([]);
  useEffect(() => {
    let live = true;
    linkOrgMembers(companyId).then((r) => live && setRows(r)).catch(() => live && setRows([]));
    return () => { live = false; };
  }, [companyId]);
  const orgs = [...new Map(rows.map((r) => [r.org_id, r.org_name]))];
  if (!orgs.length) return null;
  return (
    <div className="mt-3 rounded-lg border border-line p-3 text-sm">
      <b>Shared with organizations</b>
      <p className="mt-1 text-xs text-muted">A partner put your company in their organization&apos;s shared list. Everyone below sees what that partner sees, and each open is logged by person. Removing the partner ends access for all of them.</p>
      {orgs.map(([id, name]) => (
        <p key={id} className="mt-2"><b>{name}:</b> {rows.filter((r) => r.org_id === id).map((r) => `${r.email}${r.accepted ? "" : " (not signed in yet)"}`).join(", ")}</p>
      ))}
    </div>
  );
}
