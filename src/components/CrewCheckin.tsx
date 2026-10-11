"use client";

// "Crew signs on their own phones" on the signing screens: the presenter shows a QR code, each crew member scans it,
// picks their name and signs on their own phone (/checkin/). Their signatures drop into this talk as they come in,
// then the talk saves exactly as before. Needs signal on both phones; without it, everyone signs on this phone.
// Rules: src/core/checkin.ts. Data: src/lib/data/checkin.ts (migration 0043).
//
// - Whether phone signing is on lives in the talk draft (phoneSigning), so it survives the app being closed.
// - The merge is done by the caller against the latest saved draft (never a stale copy), and each signature taken
//   is deleted from the waiting area, so nothing comes back after the presenter changes it.
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { checkinLink, checkinRoster, type WaitingSignature } from "@/core/checkin";
import type { Signature } from "@/core/record";
import { closeCheckin, openCheckin, takeCheckinSignatures, waitingSignatures } from "@/lib/data/checkin";
import { Button, Notice, Sheet } from "./ui";
import { toast } from "./toast";

type Entry = { key: string; name: string; personId: string | null };
/** Applies waiting signatures to the latest draft and returns the names added. */
export type TakeSignatures = (waiting: WaitingSignature[]) => string[];

/**
 * Collect anything waiting, apply it, and delete it from the waiting area. Returns the names added. Used by the
 * polling below and once more right before the talk saves.
 */
export async function collectPhoneSignatures(companyId: string, clientId: string, take: TakeSignatures): Promise<string[]> {
  const waiting = await waitingSignatures(companyId, clientId);
  if (!waiting.length) return [];
  const added = take(waiting);
  await takeCheckinSignatures(companyId, clientId, waiting.map((w) => w.roster_key)).catch(() => { /* taken list in the draft keeps them out */ });
  return added;
}

/** The talk is saved or discarded: delete its check-ins and anything still waiting (best effort; they expire anyway). */
export async function endCheckin(companyId: string, clientId: string): Promise<void> {
  await closeCheckin(companyId, clientId).catch(() => { /* cleared within a day of expiring */ });
}

export function CrewCheckin({ companyId, clientId, roster, present, signatures, statement, title, team, active, setActive, take, onOpened, hidden = false }: {
  companyId: string; clientId: string; roster: Entry[]; present: Record<string, boolean>; signatures: Record<string, Signature>;
  statement: string; title: string;
  /** The team the presenter picked; its people are the names offered. */
  team: string;
  active: boolean; setActive: (on: boolean) => void; take: TakeSignatures;
  /** A new code opened for these names: they may sign by phone again. */
  onOpened: (keys: string[]) => void;
  /** Keep collecting while the crew pass the phone, without showing anything. */
  hidden?: boolean;
}) {
  const [sheet, setSheet] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const takeRef = useRef(take);
  useEffect(() => { takeRef.current = take; });
  const pulling = useRef(false);

  // One pull at a time: every 3 seconds while the code is showing, every 8 otherwise.
  const pull = async () => {
    if (pulling.current) return;
    pulling.current = true;
    try {
      const added = await collectPhoneSignatures(companyId, clientId, (w) => takeRef.current(w));
      if (added.length) toast(added.length === 1 ? `${added[0]} signed on their phone` : `${added.length} people signed on their phones`);
    } finally { pulling.current = false; }
  };
  useEffect(() => {
    if (!active) return;
    let live = true;
    const tick = () => { if (live && navigator.onLine !== false) pull().catch(() => { /* try again next tick */ }); };
    tick();
    const t = setInterval(tick, sheet ? 3000 : 8000);
    return () => { live = false; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sheet, companyId, clientId]);

  if (hidden) return null;

  const open = async () => {
    setError(null);
    if (typeof navigator !== "undefined" && navigator.onLine === false) { setError("Phone signing needs signal on this phone. Everyone can still sign here."); return; }
    const who = checkinRoster(roster, present, signatures);
    if (!who.length) { setError("Everyone here has signed."); return; }
    setBusy(true);
    try {
      const secret = await openCheckin(companyId, clientId, who, statement, title); // an earlier code stops; its signatures still wait
      setQr(await QRCode.toDataURL(checkinLink(window.location.origin, secret), { errorCorrectionLevel: "M", margin: 1, width: 560 }));
      onOpened(who.map((w) => w.key)); setActive(true); setSheet(true);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const stop = async () => {
    await pull().catch(() => { /* nothing waiting */ });
    setActive(false); setSheet(false); setQr(null);
    await endCheckin(companyId, clientId);
    toast("Phone signing stopped.");
  };

  const onRoster = roster.filter((r) => r.personId && present[r.key] !== false);
  const signed = onRoster.filter((r) => signatures[r.key]).length;
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="soft" disabled={busy} onClick={() => (active && qr ? setSheet(true) : open())}>
          {busy ? "Starting…" : active ? "Show the sign-in code" : "Crew signs on their own phones"}
        </Button>
        {active && <span className="text-sm text-muted">Phone signing is on · {signed} of {onRoster.length} signed</span>}
      </div>
      {error && <div className="mt-2"><Notice tone="caution">{error}</Notice></div>}
      <Sheet title={team ? `Scan to sign · ${team}` : "Scan to sign"} open={sheet} onClose={() => setSheet(false)}>
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-sm">{team ? <>{team}: open </> : "Crew: open "}your phone&apos;s camera, scan this, pick your name and sign. No app or account needed.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr && <img src={qr} alt="QR code for crew to sign on their phones" className="w-full max-w-[280px] rounded-xl bg-white p-2" />}
          <p className="text-center text-xs text-muted">Only the people on {team || "this team"} who are marked here are listed. Works only for this talk, once each, for 1 hour. Signatures appear here as they come in; check each one is someone who&apos;s here.</p>
        </div>
        <ul aria-label="Who has signed" className="mt-4 flex flex-col gap-1.5">
          {onRoster.map((r) => (
            <li key={r.key} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${signatures[r.key] ? "border-ok bg-ok-bg" : "border-line"}`}>
              <span aria-hidden className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${signatures[r.key] ? "bg-ok text-white" : "border-2 border-line"}`}>{signatures[r.key] ? "✓" : ""}</span>
              <span className="flex-1">{r.name}</span>
              <small className="text-muted">{signatures[r.key] ? "Signed" : "Waiting"}</small>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          <Button type="button" onClick={() => setSheet(false)}>Done showing the code</Button>
          <Button type="button" variant="ghost" onClick={stop}>Stop phone signing</Button>
        </div>
      </Sheet>
    </div>
  );
}
