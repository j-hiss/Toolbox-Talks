"use client";

// The account banner at the top of every screen when the company's account is paused, closing or at the end of a
// trial (src/core/account.ts, migration 0042), and the hook that loads the account (kept on the device for offline).
import { useCallback, useEffect, useState } from "react";
import { accountNotice, noticeText, type CompanyAccount } from "@/core/account";
import { getAccount } from "@/lib/data/account";
import { canAdmin, type Membership } from "@/lib/data/types";
import { Notice } from "./ui";

const key = (companyId: string) => `tt-account:${companyId}`;
const listeners = new Set<() => void>();

/** This company's account; the last copy this device saw while offline. `reload` refreshes every screen showing it. */
export function useAccount(companyId: string | undefined): { account: CompanyAccount | null; reload: () => void } {
  const [account, setAccount] = useState<CompanyAccount | null>(() => {
    if (!companyId) return null;
    try { return JSON.parse(localStorage.getItem(key(companyId)) ?? "null"); } catch { return null; }
  });
  const [tick, setTick] = useState(0);
  // Another company (switching companies): start from that company's saved copy, never the last one's.
  const [shownFor, setShownFor] = useState(companyId);
  if (shownFor !== companyId) {
    setShownFor(companyId);
    let saved: CompanyAccount | null = null;
    try { saved = companyId ? JSON.parse(localStorage.getItem(key(companyId)) ?? "null") : null; } catch { /* none */ }
    setAccount(saved);
  }
  useEffect(() => { const f = () => setTick((t) => t + 1); listeners.add(f); return () => { listeners.delete(f); }; }, []);
  useEffect(() => {
    if (!companyId) return;
    let live = true;
    getAccount(companyId).then((a) => {
      try { localStorage.setItem(key(companyId), JSON.stringify(a)); } catch { /* fine */ }
      if (live) setAccount(a);
    }).catch(() => { /* offline: keep the saved copy */ });
    return () => { live = false; };
  }, [companyId, tick]);
  const reload = useCallback(() => { for (const f of listeners) f(); }, []);
  return { account, reload };
}

/** One line at the top of every screen when the account needs attention. Crews only hear what affects them. */
export function AccountBanner({ m }: { m: Membership }) {
  const { account } = useAccount(m.company.id);
  const n = accountNotice(account);
  if (!n) return null;
  const text = noticeText(n, canAdmin(m.access));
  if (!text) return null;
  return <div className="mb-4"><Notice tone={n.kind === "paused" || n.kind === "trial_over" ? "caution" : "info"}>{text}</Notice></div>;
}

