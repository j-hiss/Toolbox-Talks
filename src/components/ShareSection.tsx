"use client";

// Reports → Safety profile → "Share with your agent": make a private link to a frozen copy of this summary, copy it,
// see how often each link was opened, switch one off. What a link carries: shareSnapshot (src/core/share.ts).
// Data: src/lib/data/shares.ts. The page a link opens: src/app/share/page.tsx.
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { SafetyProfile } from "@/core/profile";
import { SHARE_DAYS, shareKind, shareLink, shareSnapshot, shareStatus, type ShareDays, type ShareRow } from "@/core/share";
import { createShare, listShares, revokeShare } from "@/lib/data/shares";
import { appWebAddress } from "@/lib/webAddress";
import type { Membership } from "@/lib/data/types";
import { Button, Field, GroupHeading, Notice, inputClass, segmentClass, segmentedClass } from "@/components/ui";

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const fmtDay = (d: string) => fmt(`${d}T12:00:00`);

export function ShareSection({ p, co, florida, crew }: { p: SafetyProfile; co: Membership["company"]; florida: boolean; crew: number }) {
  const [label, setLabel] = useState("");
  const [days, setDays] = useState<ShareDays>(30);
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState<{ link: string; secret: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [rows, setRows] = useState<ShareRow[] | null>(null);
  const [confirmOff, setConfirmOff] = useState<string | null>(null);
  const origin = appWebAddress();

  const load = useCallback(() => {
    // A database without migration 0025 just doesn't show links yet.
    listShares(co.id).then(setRows).catch(() => setRows([]));
  }, [co.id]);
  useEffect(load, [load]);

  const make = async () => {
    if (!origin) return;
    setBusy(true); setMsg(null); setMade(null); setCopied(false);
    try {
      const secret = await createShare(co.id, label, days, shareSnapshot(p, co, { kind: shareKind(p), florida, crew }));
      setMade({ link: shareLink(origin, secret), secret }); setLabel(""); load();
    } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  const copy = async () => {
    if (!made) return;
    try { await navigator.clipboard.writeText(made.link); setCopied(true); }
    catch { setMsg({ tone: "error", text: "Couldn't copy here. Press and hold the link to copy it." }); }
  };
  const send = async () => {
    if (!made) return;
    try { await navigator.share({ title: `${co.name} safety program summary`, text: `${co.name} safety program summary`, url: made.link }); } catch { /* closed */ }
  };
  const off = async (id: string) => {
    if (confirmOff !== id) { setConfirmOff(id); setTimeout(() => setConfirmOff((c) => (c === id ? null : c)), 4000); return; }
    setConfirmOff(null);
    try { await revokeShare(co.id, id); load(); setMsg({ tone: "ok", text: "Link switched off. It won't open again." }); }
    catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
  };

  const now = new Date();
  return (
    <section aria-label="Share with your agent" className="mt-6">
      <GroupHeading>Share with your agent</GroupHeading>
      <p className="mt-1 text-sm text-muted">A private link to this summary for the dates above. It shows a copy made now: counts and rates only, no names or signatures. It stops working when it expires or when you switch it off, and every time it&apos;s opened is logged here.</p>
      {!origin ? (
        <div className="mt-2"><Notice tone="caution">Links need the app&apos;s web address. They can be made once the website is live (NEXT_PUBLIC_APP_URL).</Notice></div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <Field label="Who it's for" id="share-label"><input id="share-label" maxLength={120} className={inputClass} placeholder="Example: Dana at Example Insurance" value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
          <div className={`grid-cols-3 ${segmentedClass}`} role="group" aria-label="Link works for">
            {SHARE_DAYS.map((d) => <button key={d} aria-pressed={days === d} onClick={() => setDays(d)} className={segmentClass(days === d)}>{d} days</button>)}
          </div>
          <Button size="sm" disabled={busy || !label.trim()} onClick={make}>Make private link</Button>
        </div>
      )}
      {made && (
        <div className="mt-3 rounded-lg bg-ok-bg p-3 text-sm">
          <b>Link ready.</b> Copy it now: for privacy, the app can&apos;t show this link again.
          <p className="mt-2 break-all rounded bg-surface px-2 py-1.5 font-mono text-[13px] select-all">{made.link}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
            {typeof navigator !== "undefined" && "share" in navigator && <Button size="sm" variant="ghost" onClick={send}>Send…</Button>}
            <Link href={`/share/#${made.secret}`} className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold underline">See what they&apos;ll see</Link>
          </div>
        </div>
      )}
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      {rows && rows.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5" aria-label="Links you've made">
          {rows.map((r) => {
            const st = shareStatus(r, now);
            return (
              <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                <span className="min-w-0">
                  <b className="block truncate">{r.label}</b>
                  <small className="block text-muted tabular-nums">{fmtDay(r.period_from)} to {fmtDay(r.period_to)} · made {fmt(r.created_at)}</small>
                  <small className={`block tabular-nums ${st === "live" ? "text-ok" : "text-muted"}`}>
                    {st === "live" ? `Works until ${fmt(r.expires_at)}` : st === "expired" ? `Expired ${fmt(r.expires_at)}` : `Switched off ${fmt(r.revoked_at!)}`}
                    {" · "}{r.views ? `opened ${r.views} time${r.views === 1 ? "" : "s"}, last ${fmt(r.last_viewed_at!)}` : "not opened yet"}
                  </small>
                </span>
                {st === "live" && <Button size="sm" variant="danger" className="shrink-0 whitespace-nowrap" onClick={() => off(r.id)}>{confirmOff === r.id ? "Tap again" : "Switch off"}</Button>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
