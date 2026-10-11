"use client";

// A company that signed up with a trainer's or insurance partner's invite link (migration 0049). The link only says
// who sent it; nothing is shared until the company chooses. Setup keeps the code; once the company exists it's recorded
// (record_referral) and Admin offers, once, to add that person as the company's trainer or insurance partner.
import { useEffect, useState } from "react";
import { refFromSearch, type ReferralInfo } from "@/core/partnerClients";
import { recordReferral, referralInfo } from "@/lib/data/partnerClients";
import { inviteTrainer } from "@/lib/data/trainers";
import { invitePartner } from "@/lib/data/partners";
import { partnerPortalPilot } from "@/lib/features";
import { Button, Notice } from "./ui";
import { toast } from "./toast";

const KEY = "tt-referral-code";
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v: string | null) => { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch { /* fine */ } };

/** Keep a sign-up link's code (from ?ref=) so it survives signing in. Returns who sent it, if known. */
export function useReferralFromLink(): ReferralInfo | null {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  useEffect(() => {
    const fromUrl = refFromSearch(window.location.search);
    if (fromUrl) write(fromUrl);
    const code = fromUrl ?? read();
    if (code) referralInfo(code).then((i) => { setInfo(i); if (!i) write(null); }).catch(() => {});
  }, []);
  return info;
}

/** After the company is created: record which link brought it in (once). Never blocks setup. */
export async function recordStoredReferral(companyId: string): Promise<void> {
  const code = read();
  if (!code) return;
  try { await recordReferral(companyId, code); } catch { /* not essential */ }
}

/** Shown at the top of Admin until the company adds the partner or says no. */
export function ReferralOffer({ companyId }: { companyId: string }) {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { const c = read(); if (c) referralInfo(c).then(setInfo).catch(() => {}); }, []);
  if (!info) return null;
  const training = info.kind === "training";
  if (!training && !partnerPortalPilot()) return null;
  const done = () => { write(null); setInfo(null); };
  const add = async () => {
    setBusy(true);
    try {
      if (training) await inviteTrainer(companyId, info.email, info.name);
      else await invitePartner(companyId, info.email, info.name, "agent");
      toast(training ? `${info.name} added as your trainer. Choose who they can see in Admin → Training.` : `${info.name} added as your insurance partner. Send a summary from Reports → Safety profile when you're ready.`);
      done();
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
    setBusy(false);
  };
  return (
    <div className="mt-3">
      <Notice>
        <b>{info.name}</b> ({info.email}) sent you here. Add them as your {training ? "trainer, so they can send in training cards" : "insurance partner, so you can send them your safety summary"}? Nothing is shared until you choose who and what.
        <span className="mt-2 flex flex-wrap gap-2">
          <Button type="button" size="sm" disabled={busy} onClick={add}>Add {info.name}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={done}>Not now</Button>
        </span>
      </Notice>
    </div>
  );
}
