"use client";

// The page a crew member's phone opens from the presenter's QR code (/checkin/#SECRET). No app, no account: pick your
// name from this talk's roster, tap the signing statement, sign. Your signature goes to the presenter's phone and is
// saved with the talk. Works only for that talk, once per name, while the presenter has it open (3 hours at most).
// Rules: src/core/checkin.ts. Data: src/lib/data/checkin.ts (migration 0043).
import { useCallback, useEffect, useState } from "react";
import { secretFromHash } from "@/core/checkin";
import type { Signature } from "@/core/record";
import { checkinSign, checkinView, type CheckinView } from "@/lib/data/checkin";
import { SignaturePad } from "@/components/SignaturePad";
import { Button, Eyebrow, Loading, Mark, Notice, Title } from "@/components/ui";
import { BRAND } from "@/content/brand";

type State = { kind: "loading" } | { kind: "closed" } | { kind: "error"; text: string } | { kind: "open"; view: CheckinView } | { kind: "done"; name: string };

export default function CheckinPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [pick, setPick] = useState<{ key: string; name: string } | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [sig, setSig] = useState<Signature | null>(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback((s: string) => {
    checkinView(s).then((v) => setState(v ? { kind: "open", view: v } : { kind: "closed" }))
      .catch((e) => setState({ kind: "error", text: e instanceof Error ? e.message : String(e) }));
  }, []);
  useEffect(() => {
    const s = secretFromHash(window.location.hash);
    const t = setTimeout(() => { setSecret(s); if (s) load(s); else setState({ kind: "closed" }); }, 0);
    return () => clearTimeout(t);
  }, [load]);

  const send = async () => {
    if (!secret || !pick || !sig || !confirmedAt) return;
    setSending(true); setNotice(null);
    try {
      const ok = await checkinSign(secret, pick.key, sig.image, confirmedAt);
      if (ok) { setState({ kind: "done", name: pick.name }); return; }
      setNotice(`${pick.name} is already signed, or signing has closed. Ask the presenter.`);
      setPick(null); setSig(null); setConfirmedAt(null); load(secret);
    } catch {
      setNotice("No signal. Your signature is still here; try again when you're connected, or sign on the presenter's phone.");
    }
    setSending(false);
  };

  return (
    <div className="mx-auto max-w-xl px-4 pb-12">
      <header className="-mx-4 flex items-center gap-2.5 border-b border-line/60 px-5 py-3">
        <Mark size={28} /><span className="text-[15px] font-semibold">{BRAND.name}</span>
        <span className="ml-auto text-xs text-muted">Sign in to a talk</span>
      </header>
      <main className="page-in pt-6">
        {state.kind === "loading" && <Loading />}
        {state.kind === "closed" && <Notice tone="caution">This sign-in code isn&apos;t open. It may have closed or run out of time. Sign on the presenter&apos;s phone, or ask them to show a new code.</Notice>}
        {state.kind === "error" && <Notice tone="error">Couldn&apos;t open the sign-in. Check your signal and scan again. ({state.text})</Notice>}
        {state.kind === "done" && (
          <section aria-label="Signed">
            <Title>Thanks, {state.name.split(" ")[0]}</Title>
            <div className="mt-4"><Notice tone="ok">Your signature was sent to the presenter. It goes on today&apos;s talk record when they save the talk.</Notice></div>
            <p className="mt-4 text-sm text-muted">You can close this page.</p>
          </section>
        )}
        {state.kind === "open" && !pick && (
          <section aria-label="Pick your name">
            <Eyebrow>{state.view.company}</Eyebrow>
            <Title>{state.view.title || "Toolbox talk"}</Title>
            <p className="mt-2 text-sm">Tap your name to sign.</p>
            {notice && <div className="mt-3"><Notice tone="caution">{notice}</Notice></div>}
            <ul className="mt-4 flex flex-col gap-2">
              {state.view.roster.map((r) => (
                <li key={r.key}>
                  <button type="button" disabled={r.signed} onClick={() => { setPick({ key: r.key, name: r.name }); setNotice(null); window.scrollTo?.(0, 0); }}
                    className={`flex min-h-14 w-full items-center justify-between rounded-xl border px-4 text-left text-lg font-semibold ${r.signed ? "border-ok bg-ok-bg text-muted" : "border-line bg-surface shadow-card"}`}>
                    <span>{r.name}</span>{r.signed ? <small className="text-sm font-normal">Signed ✓</small> : <span aria-hidden className="text-muted">›</span>}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">Not on the list? Sign on the presenter&apos;s phone.</p>
          </section>
        )}
        {state.kind === "open" && pick && (
          <section aria-label="Sign">
            <Eyebrow>{state.view.title || "Toolbox talk"}</Eyebrow>
            <Title>{pick.name}</Title>
            <button
              type="button" role="checkbox" aria-checked={!!confirmedAt}
              className={`mt-4 flex w-full items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left ${confirmedAt ? "border-ok bg-ok-bg" : "border-brand bg-surface"}`}
              onClick={() => { if (confirmedAt) { setConfirmedAt(null); setSig(null); } else setConfirmedAt(new Date().toISOString()); }}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border-2 ${confirmedAt ? "border-ok bg-ok text-white" : "border-brand"}`} aria-hidden>{confirmedAt ? "✓" : ""}</span>
              <span className="whitespace-pre-line text-base font-semibold">{state.view.statement}</span>
            </button>
            <div className="mt-3">
              <SignaturePad tall label={pick.name} value={sig} onChange={setSig} locked={confirmedAt ? null : "Tap the box above first"} />
            </div>
            {notice && <div className="mt-3"><Notice tone="error">{notice}</Notice></div>}
            <div className="mt-5 flex flex-col gap-2">
              <Button type="button" disabled={!sig || !confirmedAt || sending} onClick={send}>{sending ? "Sending…" : "Send my signature"}</Button>
              <Button type="button" variant="ghost" onClick={() => { setPick(null); setSig(null); setConfirmedAt(null); }}>That&apos;s not me</Button>
            </div>
          </section>
        )}
        <p className="mt-8 text-xs text-muted">Your signature is only used for this talk&apos;s record.</p>
      </main>
    </div>
  );
}
