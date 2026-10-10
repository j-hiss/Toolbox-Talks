"use client";

// The page a "Share with your agent" link opens (/share/#<secret>). No account needed: an agent, broker or carrier just
// taps the link. Shows the frozen copy the company shared (counts and rates only) and its PDF. The secret stays in the
// "#…" part of the link, which browsers never send to a web server. Data: openShare in src/lib/data/shares.ts.
import { useEffect, useState } from "react";
import { secretFromHash, type OpenedShare } from "@/core/share";
import { openShare } from "@/lib/data/shares";
import { saveFile } from "@/lib/download";
import { ProfileSummary } from "@/components/ProfileSummary";
import { Button, Eyebrow, Loading, Mark, Notice, Title } from "@/components/ui";
import { BRAND } from "@/content/brand";

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const fmtDay = (d: string) => fmt(`${d}T12:00:00`);

type State = { kind: "loading" } | { kind: "bad" } | { kind: "gone" } | { kind: "error"; text: string } | { kind: "ok"; share: OpenedShare };

export default function SharePage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  useEffect(() => {
    const secret = secretFromHash(window.location.hash);
    (secret ? openShare(secret) : Promise.resolve(undefined))
      .then((share) => setState(share === undefined ? { kind: "bad" } : share ? { kind: "ok", share } : { kind: "gone" }))
      .catch((e) => setState({ kind: "error", text: e instanceof Error ? e.message : String(e) }));
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 pb-12 md:max-w-3xl md:px-8">
      <header className="-mx-4 flex items-center gap-2.5 border-b border-line/60 px-5 py-3 md:-mx-8 md:px-8">
        <Mark size={28} /><span className="text-[15px] font-semibold">{BRAND.name}</span>
        <span className="ml-auto text-xs text-muted">Shared safety summary</span>
      </header>
      <main className="page-in pt-6">
        {state.kind === "loading" && <Loading />}
        {state.kind === "bad" && <Notice tone="error">This link isn&apos;t complete. Open it again from the message it came in, or ask the company to send it again.</Notice>}
        {state.kind === "gone" && <Notice tone="caution">This link has expired or was switched off by the company. Ask them for a new one.</Notice>}
        {state.kind === "error" && <Notice tone="error">Couldn&apos;t open this summary right now. Check the connection and try again. ({state.text})</Notice>}
        {state.kind === "ok" && <Shared s={state.share} />}
      </main>
    </div>
  );
}

function Shared({ s }: { s: OpenedShare }) {
  const { company: co, profile: p, florida, crew, kind } = s.snapshot;
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const pdf = async () => {
    setBusy(true); setMsg(null);
    try {
      const { buildProfilePdf, profilePdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(profilePdfFileName(kind, p, co), buildProfilePdf(p, co, { kind, florida, crew, generatedAt: new Date(s.created_at) }).output("blob"));
      if (res !== "canceled") setMsg({ tone: "ok", text: "PDF ready." });
    } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  return (
    <>
      <Eyebrow>Prepared for {s.label}</Eyebrow>
      <Title>{co.name || "Company"}</Title>
      <p className="mt-2 text-sm text-muted">{[co.address, co.phone, co.email].filter(Boolean).join(" · ")}</p>
      <p className="mt-2 text-sm tabular-nums">
        <b>{kind === "monthly" ? "Monthly program summary" : "Safety program summary"}</b>, {fmtDay(p.from)} to {fmtDay(p.to)} · {crew} team member{crew === 1 ? "" : "s"} on the roster
      </p>
      <p className="mt-1 text-xs text-muted tabular-nums">Copy made {fmt(s.created_at)} from the company&apos;s signed records. This link works until {fmt(s.expires_at)}; the company can switch it off sooner, and sees when it&apos;s opened.</p>
      <div className="mt-4"><Button disabled={busy} onClick={pdf}>Download PDF</Button></div>
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      <ProfileSummary p={p} florida={florida} shared />
      <p className="mt-6 text-xs text-muted">Counts and rates only. Worker names, signatures, phone numbers and injury details aren&apos;t shared. This app documents safety meetings; it doesn&apos;t certify compliance. Individual signed records are available from the company on request.</p>
    </>
  );
}
