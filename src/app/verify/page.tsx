"use client";

// The page a record PDF's QR code opens (/verify/#CODE), or where someone types the code printed on it. No account
// needed. Shows what was saved under that code, straight from the database: company, talk, date, and the counts.
// No names, signatures or places: the paper has those; this shows the paper matches what was saved.
// Code rules: src/core/verify.ts. Data: src/lib/data/verify.ts (migration 0030).
import { useEffect, useState } from "react";
import { cleanCode, formatCode, verifySummary, type VerifiedRecord } from "@/core/verify";
import { verifyInspection, verifyRecord, type VerifiedInspection } from "@/lib/data/verify";
import { parseDay, weekLabel } from "@/core/weeks";
import { Button, Eyebrow, Loading, Mark, Notice, Title, inputClass } from "@/components/ui";
import { BRAND } from "@/content/brand";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "none"; code: string } | { kind: "error"; text: string } | { kind: "ok"; code: string; rec: VerifiedRecord } | { kind: "inspection"; code: string; insp: VerifiedInspection };

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [bad, setBad] = useState(false);

  const look = (raw: string) => {
    const code = cleanCode(raw);
    if (!code) { setBad(true); return; }
    setBad(false); setState({ kind: "loading" });
    // A talk record first, then an inspection: both PDFs carry the same kind of code.
    verifyRecord(code)
      .then(async (rec) => {
        if (rec) return setState({ kind: "ok", code, rec });
        const insp = await verifyInspection(code);
        setState(insp ? { kind: "inspection", code, insp } : { kind: "none", code });
      })
      .catch((e) => setState({ kind: "error", text: e instanceof Error ? e.message : String(e) }));
  };

  // A scanned QR code carries the code after "#": look it up straight away.
  useEffect(() => {
    const fromHash = cleanCode(window.location.hash);
    if (!fromHash) return;
    const t = setTimeout(() => { setInput(formatCode(fromHash)); look(fromHash); }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 pb-12">
      <header className="-mx-4 flex items-center gap-2.5 border-b border-line/60 px-5 py-3">
        <Mark size={28} /><span className="text-[15px] font-semibold">{BRAND.name}</span>
        <span className="ml-auto text-xs text-muted">Check a record</span>
      </header>
      <main className="page-in pt-6">
        <Eyebrow>Toolbox talk records</Eyebrow>
        <Title>Check a record</Title>
        <p className="mt-2 text-sm text-muted">
          Type the check code printed on a talk record, or scan its QR code. You&apos;ll see what was saved for that talk, so you
          can compare it with the paper. No names are shown.
        </p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); look(input); }}>
          <input aria-label="Check code" placeholder="XXXX-XXXX-XXXX-XXXX" autoCapitalize="characters" autoComplete="off" spellCheck={false}
            className={`${inputClass} font-mono tracking-wider`} value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" disabled={state.kind === "loading"}>Check</Button>
        </form>
        {bad && <div className="mt-3"><Notice tone="error">That isn&apos;t a full check code. It&apos;s 16 letters and numbers, printed in groups of four.</Notice></div>}
        <div className="mt-5">
          {state.kind === "loading" && <Loading />}
          {state.kind === "none" && (
            <Notice tone="caution">No record has the code {formatCode(state.code)}. Check each character against the paper. If it still doesn&apos;t match, ask the company for the record.</Notice>
          )}
          {state.kind === "error" && <Notice tone="error">Couldn&apos;t check right now. Check the connection and try again. ({state.text})</Notice>}
          {state.kind === "ok" && <Found code={state.code} r={state.rec} />}
          {state.kind === "inspection" && <FoundInspection code={state.code} r={state.insp} />}
        </div>
        <p className="mt-8 text-xs text-muted">A record documents a safety meeting. It doesn&apos;t by itself certify OSHA compliance.</p>
      </main>
    </div>
  );
}

function Found({ code, r }: { code: string; r: VerifiedRecord }) {
  const flagged = r.not_signed + r.absent + (r.presenter_signed ? 0 : 1);
  const rows: [string, string][] = [
    ["Company", r.company],
    [r.kind === "daily" ? "Daily pre-task plan" : "Talk", r.title + (r.title_en && r.title_en !== r.title ? ` (English: ${r.title_en})` : "")],
    ["Held", when(r.held_at)],
    ...(r.makeup_for_week ? [["Makeup for", `Week of ${weekLabel(parseDay(r.makeup_for_week))}`] as [string, string]] : []),
    ...(r.week_number && r.kind !== "daily" ? [[r.makeup_for_week ? "Given in" : "Plan week", `Week ${r.week_number} of 52`] as [string, string]] : []),
    ["Saved", when(r.saved_at)],
    ["Code", formatCode(code)],
  ];
  return (
    <section aria-label="What was saved" className="rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm font-semibold text-ok">✓ A record with this code is on file</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="min-w-0 font-semibold">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {([["Signed", r.signed, "text-ok"], ["Didn't sign", r.not_signed, r.not_signed ? "text-warn" : ""], ["Absent", r.absent, r.absent ? "text-warn" : ""]] as const).map(([k, n, c]) => (
          <div key={k} className="rounded-xl bg-fg/[0.04] p-2">
            <p className={`font-display text-2xl font-bold ${c}`}>{n}</p>
            <p className="text-xs text-muted">{k}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm">{verifySummary(r)}</p>
      {flagged > 0 && <p className="mt-1 text-sm text-muted">Flags are shown as saved; the app never hides them.</p>}
      <p className="mt-3 text-xs text-muted">If the paper shows different counts, a different date or a different talk, it doesn&apos;t match what was saved.</p>
    </section>
  );
}

function FoundInspection({ code, r }: { code: string; r: VerifiedInspection }) {
  const rows: [string, string][] = [
    ["Company", r.company], ["Inspection", r.title],
    ["Done", when(r.inspected_at)], ["Saved", when(r.saved_at)], ["Rule", r.rule], ["Code", formatCode(code)],
  ];
  return (
    <section aria-label="What was saved" className="rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm font-semibold text-ok">✓ An inspection with this code is on file</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
        {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="min-w-0 font-semibold">{v}</dd></div>)}
      </dl>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {([["Passed", r.passed, "text-ok"], ["Failed", r.failed, r.failed ? "text-warn" : ""], ["Not applicable", r.na, ""]] as const).map(([k, n, c]) => (
          <div key={k} className="rounded-xl bg-fg/[0.04] p-2"><p className={`font-display text-2xl font-bold ${c}`}>{n}</p><p className="text-xs text-muted">{k}</p></div>
        ))}
      </div>
      <p className="mt-3 text-sm">{r.items} items checked. Results show as saved; failed items are never hidden.</p>
      <p className="mt-3 text-xs text-muted">If the paper shows different results, a different date or a different checklist, it doesn&apos;t match what was saved.</p>
    </section>
  );
}
