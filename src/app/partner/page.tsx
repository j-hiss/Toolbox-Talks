"use client";

// Insurance partner portal (/partner/, pilot): for an agent, broker or carrier a company invited. Lists the companies
// that sent summaries and opens one (each open is logged for the company). Counts and rates only: the same view and PDF
// as the company's own Safety profile (ProfileSummary, buildProfilePdf). Data: src/lib/data/partners.ts.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inboxByCompany, type InboxRow, type OpenedReport } from "@/core/partners";
import { openPartnerReport, partnerInbox } from "@/lib/data/partners";
import { saveFile } from "@/lib/download";
import { useSession } from "@/lib/session";
import { NotConfigured } from "@/components/Guard";
import { ProfileSummary } from "@/components/ProfileSummary";
import { Button, ErrorNotice, Eyebrow, GroupHeading, Loading, Notice, Shell, Title } from "@/components/ui";

const fmt = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default function PartnerPage() {
  const s = useSession();
  const router = useRouter();
  useEffect(() => { if (s.status === "signed-out") router.replace("/sign-in/"); }, [s.status, router]);
  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status !== "signed-in") return <Shell tabs={false}><Loading /></Shell>;
  return <Portal email={s.user?.email ?? ""} member={s.memberships.length > 0} trainer={s.trainer} signOut={s.signOut} />;
}

function Portal({ email, member, trainer, signOut }: { email: string; member: boolean; trainer: boolean; signOut: () => Promise<void> }) {
  const [rows, setRows] = useState<InboxRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<OpenedReport | null | "gone">(null);
  const load = useCallback(() => {
    partnerInbox().then((r) => { setRows(r); setError(null); }).catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(load, [load]);
  const view = async (id: string) => {
    try { setOpen((await openPartnerReport(id)) ?? "gone"); window.scrollTo(0, 0); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };

  if (error) return <Shell tabs={false}><ErrorNotice what="Couldn't load the partner portal." detail={error} onRetry={load} /></Shell>;
  if (!rows) return <Shell tabs={false}><Loading /></Shell>;
  if (open && open !== "gone") return <Shell tabs={false}><Report r={open} back={() => { setOpen(null); load(); }} /></Shell>;
  const companies = inboxByCompany(rows);

  return (
    <Shell tabs={false}>
      <Eyebrow>Insurance partner · {email}</Eyebrow>
      <Title>Partner portal</Title>
      <p className="mt-1 text-sm text-muted">Safety program summaries your clients chose to send you. Counts and rates from their signed records; no names, signatures or injury details.</p>
      <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
        {member && <Link href="/" className="underline">← Back to your company</Link>}
        {trainer && <Link href="/trainer/" className="underline">Trainer portal</Link>}
      </div>
      {open === "gone" && <div className="mt-3"><Notice tone="caution">That summary was withdrawn by the company.</Notice></div>}
      {companies.length === 0 && <div className="mt-4"><Notice>Nothing has been sent to {email || "this email"} yet. Summaries appear here when a company sends one.</Notice></div>}
      {companies.map((c) => (
        <section key={c.companyId} aria-label={c.companyName}>
          <GroupHeading aside={`${c.reports.length}`}>{c.companyName}</GroupHeading>
          <ul className="mt-3 flex flex-col gap-1.5">
            {c.reports.map((r, i) => (
              <li key={r.report_id}>
                <button className="flex w-full items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2.5 text-left text-sm shadow-card" onClick={() => view(r.report_id)} aria-label={`Open summary ${fmt(r.period_from)} to ${fmt(r.period_to)} from ${c.companyName}`}>
                  <span className="min-w-0"><b className="block">{fmt(r.period_from)} to {fmt(r.period_to)}</b><small className="text-muted">Sent {fmt(r.sent_at)}{i === 0 ? " · latest" : ""}</small></span>
                  <small className="shrink-0 font-semibold text-brand-text">Open ›</small>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="mt-8"><Button variant="ghost" onClick={() => signOut()}>Sign out</Button></div>
      <p className="mt-4 text-xs text-muted">The company sees when you open a summary and can withdraw it or end your access. This app documents safety meetings; it doesn&apos;t certify compliance.</p>
    </Shell>
  );
}

function Report({ r, back }: { r: OpenedReport; back: () => void }) {
  const { company: co, profile: p, florida, crew, kind } = r.snapshot;
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const pdf = async () => {
    setMsg(null);
    try {
      const { buildProfilePdf, profilePdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(profilePdfFileName(kind, p, co), buildProfilePdf(p, co, { kind, florida, crew, generatedAt: new Date(r.sent_at) }).output("blob"));
      if (res !== "canceled") setMsg({ tone: "ok", text: "PDF ready." });
    } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
  };
  return (
    <>
      <p><button className="text-sm font-semibold underline" onClick={back}>← All summaries</button></p>
      <Eyebrow>Sent {fmt(r.sent_at)}</Eyebrow>
      <Title>{co.name || "Company"}</Title>
      <p className="mt-2 text-sm text-muted">{[co.address, co.phone, co.email].filter(Boolean).join(" · ")}</p>
      <p className="mt-2 text-sm tabular-nums"><b>{kind === "monthly" ? "Monthly program summary" : "Safety program summary"}</b>, {fmt(p.from)} to {fmt(p.to)} · {crew} team member{crew === 1 ? "" : "s"} on the roster</p>
      <div className="mt-4"><Button onClick={pdf}>Download PDF</Button></div>
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      <ProfileSummary p={p} florida={florida} shared />
      <p className="mt-6 text-xs text-muted">Counts and rates only. This app documents safety meetings; it doesn&apos;t certify compliance. Individual signed records are available from the company on request.</p>
    </>
  );
}
