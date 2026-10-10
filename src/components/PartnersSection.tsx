"use client";

// Reports → Safety profile → Insurance partners (PILOT, hidden unless NEXT_PUBLIC_PARTNER_PORTAL=pilot; needs
// counsel's privacy review before real use). Invite an agent, broker or carrier; send them this summary (a frozen,
// counts-only copy from shareSnapshot, the same view and PDF as a share link); see each open; withdraw a summary or
// remove the partner. Data: src/lib/data/partners.ts. Partner's side: src/app/partner/page.tsx.
import { useCallback, useEffect, useState } from "react";
import type { SafetyProfile } from "@/core/profile";
import { PARTNER_KINDS, partnerKindName, type Partner, type PartnerKind, type SentReport } from "@/core/partners";
import { shareKind, shareSnapshot } from "@/core/share";
import { invitePartner, listPartners, listSentReports, removePartner, sendPartnerReport, withdrawPartnerReport } from "@/lib/data/partners";
import type { Membership } from "@/lib/data/types";
import { Button, ConfirmButton, Field, GroupHeading, Notice, inputClass } from "./ui";
import { OutsideInvite } from "./OutsideInvite";
import { toast } from "./toast";

const fmt = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function PartnersSection({ p, co, florida, crew }: { p: SafetyProfile; co: Membership["company"]; florida: boolean; crew: number }) {
  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [sent, setSent] = useState<SentReport[]>([]);
  const [kind, setKind] = useState<PartnerKind>("agent");
  const [missing, setMissing] = useState(false);
  const load = useCallback(() => {
    Promise.all([listPartners(co.id), listSentReports(co.id)])
      .then(([a, b]) => { setPartners(a); setSent(b); setMissing(false); })
      .catch(() => setMissing(true)); // a database without migration 0027
  }, [co.id]);
  useEffect(load, [load]);
  if (missing || !partners) return null;

  const send = async (partner: Partner) => {
    try { await sendPartnerReport(co.id, partner.id, shareSnapshot(p, co, { kind: shareKind(p), florida, crew })); toast(`Summary for ${fmt(p.from)} to ${fmt(p.to)} sent to ${partner.name}`); load(); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  return (
    <section aria-label="Insurance partners" className="mt-6">
      <GroupHeading>Insurance partners <span className="ml-1 rounded bg-caution-bg px-1.5 py-0.5 align-middle text-xs font-semibold text-caution-text">Pilot</span></GroupHeading>
      <p className="mt-1 text-sm text-muted">Give your agent, broker or carrier their own sign-in to read the summaries you send them. They see counts and rates only, never names, signatures or injury details. You see every time they open one, and you can withdraw a summary or end their access at any time.</p>
      <div className="mt-2"><Notice tone="caution">Pilot: this needs a privacy review before it&apos;s used with a real partner.</Notice></div>

      <OutsideInvite id="pt" nameLabel="Agency, broker or carrier" namePlaceholder="Example Insurance Agency" buttonLabel="Invite partner"
        extra={<Field label="They are" id="pt-kind"><select id="pt-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as PartnerKind)}>{PARTNER_KINDS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}</select></Field>}
        onInvite={async (email, name) => { await invitePartner(co.id, email, name, kind); load(); }}
        after={(name, email) => `Invited. Ask ${name} to sign in on the website with ${email}. Then send them a summary.`} />

      {partners.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {partners.map((x) => {
            const mine = sent.filter((r) => r.partner_id === x.id);
            return (
              <li key={x.id} className="rounded-lg bg-surface p-3 text-sm shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0"><b className="block truncate">{x.name}</b><small className="block truncate text-muted">{partnerKindName(x.kind)} · {x.email}</small>
                    <small className={`block ${x.accepted_at ? "text-ok" : "text-muted"}`}>{x.accepted_at ? `Signed in ${fmt(x.accepted_at)}` : "Waiting for them to sign in"}</small></span>
                  <ConfirmButton label="Remove" onConfirm={async () => {
                    try { await removePartner(co.id, x.id); toast(`${x.name} can't see anything now. What you sent stays on file.`); load(); } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
                  }} />
                </div>
                <Button size="sm" className="mt-2" onClick={() => send(x)}>Send this summary ({fmt(p.from)} to {fmt(p.to)})</Button>
                {mine.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1" aria-label={`Sent to ${x.name}`}>
                    {mine.map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-2">
                        <small className={r.withdrawn_at ? "text-muted line-through" : ""}>
                          {fmt(r.period_from)} to {fmt(r.period_to)}, sent {fmt(r.sent_at)} · {r.views ? `opened ${r.views} time${r.views === 1 ? "" : "s"}, last ${fmt(r.last_viewed_at!)}` : "not opened yet"}{r.withdrawn_at ? ` · withdrawn ${fmt(r.withdrawn_at)}` : ""}
                        </small>
                        {!r.withdrawn_at && <ConfirmButton label="Withdraw" onConfirm={async () => {
                          try { await withdrawPartnerReport(co.id, r.id); toast("Withdrawn. They can't see it now; it stays on file."); load(); } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
                        }} />}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
