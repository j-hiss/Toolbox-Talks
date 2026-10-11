"use client";

// Insurance partner portal (/partner/, pilot): for an agent, broker or carrier a company invited. Lists the companies
// that sent summaries and opens one (each open is logged for the company). Counts and rates only: the same view and PDF
// as the company's own Safety profile (ProfileSummary, buildProfilePdf). Data: src/lib/data/partners.ts.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inboxByCompany, type InboxRow, type OpenedReport } from "@/core/partners";
import { canRequest, partnerClientFlags, partnerTotals, sortPartnerClients, type PartnerClient } from "@/core/partnerClients";
import { openPartnerReport, partnerInbox } from "@/lib/data/partners";
import { partnerClients, requestPartnerSummary } from "@/lib/data/partnerClients";
import { InviteLinkPanel, MoveToOrg, OrgPanel, useOrgs } from "@/components/PartnerTools";
import { pct } from "@/core/compliance";
import { toast } from "@/components/toast";
import { saveFile } from "@/lib/download";
import { useSession } from "@/lib/session";
import { NotConfigured } from "@/components/Guard";
import { ProfileSummary } from "@/components/ProfileSummary";
import { Button, ErrorNotice, Eyebrow, Field, Loading, Notice, Sheet, Shell, Title, inputClass } from "@/components/ui";

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
  const [clients, setClients] = useState<PartnerClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<OpenedReport | null | "gone">(null);
  const [older, setOlder] = useState<string | null>(null);
  const [ask, setAsk] = useState<PartnerClient | null>(null);
  const [note, setNote] = useState("");
  const { orgs, reload: reloadOrgs } = useOrgs("insurance");
  const load = useCallback(() => {
    Promise.all([partnerInbox(), partnerClients()])
      .then(([r, c]) => { setRows(r); setClients(c); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(load, [load]);
  const view = async (id: string) => {
    try { setOpen((await openPartnerReport(id)) ?? "gone"); window.scrollTo(0, 0); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };
  const sendAsk = async () => {
    if (!ask) return;
    try { await requestPartnerSummary(ask.link_id, note); toast(`Asked ${ask.company_name} for a fresh summary.`); setAsk(null); setNote(""); load(); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  if (error) return <Shell tabs={false}><ErrorNotice what="Couldn't load the partner portal." detail={error} onRetry={load} /></Shell>;
  if (!rows || !clients) return <Shell tabs={false}><Loading /></Shell>;
  if (open && open !== "gone") return <Shell tabs={false}><Report r={open} back={() => { setOpen(null); load(); }} /></Shell>;
  const companies = inboxByCompany(rows);
  const t = partnerTotals(clients);
  return (
    <Shell tabs={false} wide>
      <Eyebrow>Insurance partner · {email}</Eyebrow>
      <Title>Your clients</Title>
      <p className="mt-1 text-sm text-muted">Safety program summaries your clients chose to send you. Counts and rates from their signed records; no names, signatures or injury details.</p>
      <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
        {member && <Link href="/" className="underline">← Back to your company</Link>}
        {trainer && <Link href="/trainer/" className="underline">Trainer portal</Link>}
      </div>
      {open === "gone" && <div className="mt-3"><Notice tone="caution">That summary was withdrawn by the company.</Notice></div>}
      {clients.length > 0 && (
        <div aria-label="Client totals" className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          <Tile n={String(t.clients)} label={t.clients === 1 ? "client" : "clients"} />
          <Tile n={pct(t.avgSignIn)} label="average crew sign-in" />
          <Tile n={String(t.missedWeeks)} label={t.missedWeeks === 1 ? "client with missed weeks" : "clients with missed weeks"} warn={t.missedWeeks > 0} />
          <Tile n={String(t.stale)} label={t.stale === 1 ? "summary to refresh" : "summaries to refresh"} warn={t.stale > 0} />
        </div>
      )}
      {clients.length === 0 && <div className="mt-4"><Notice>No client has added {email || "this email"} yet. Clients appear here when a company invites you; your invite link below makes that easy.</Notice></div>}
      <ul aria-label="Clients" className="mt-4 flex flex-col gap-2">
        {sortPartnerClients(clients).map((c) => {
          const reports = companies.find((x) => x.companyId === c.company_id)?.reports ?? [];
          return (
            <li key={c.link_id} className="rounded-xl bg-surface p-3 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <b className="block">{c.company_name}</b>
                  <small className="text-muted">{c.period_from && c.period_to ? `${fmt(c.period_from)} to ${fmt(c.period_to)} · sent ${fmt(c.sent_at!)}` : "No summary yet"}{c.org_name ? ` · ${c.org_name}` : ""}</small>
                </div>
                {c.sign_in != null && (
                  <div className="flex gap-4 text-right tabular-nums">
                    <span><b className="block font-display text-lg">{pct(c.sign_in)}</b><small className="text-muted">sign-in</small></span>
                    <span><b className="block font-display text-lg">{pct(c.on_time)}</b><small className="text-muted">on time</small></span>
                    <span><b className={`block font-display text-lg ${(c.periods_missed ?? 0) > 0 ? "text-warn-text" : ""}`}>{c.periods_missed ?? 0}</b><small className="text-muted">missed</small></span>
                  </div>
                )}
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {partnerClientFlags(c).map((f) => <li key={f.text} className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${f.tone === "warn" ? "border-warn text-warn-text" : f.tone === "ok" ? "border-ok text-ok" : "border-line text-muted"}`}>{f.text}</li>)}
              </ul>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {c.latest_report && <Button type="button" size="sm" onClick={() => view(c.latest_report!)} aria-label={`Open summary ${fmt(c.period_from!)} to ${fmt(c.period_to!)} from ${c.company_name} (latest)`}>Open latest</Button>}
                {reports.length > 1 && <Button type="button" size="sm" variant="ghost" onClick={() => setOlder(older === c.company_id ? null : c.company_id)}>{older === c.company_id ? "Hide older" : `Older (${reports.length - 1})`}</Button>}
                <Button type="button" size="sm" variant="soft" disabled={!canRequest(c)} onClick={() => setAsk(c)}>{canRequest(c) ? "Ask for a fresh summary" : `Asked ${fmt(c.last_requested!)}`}</Button>
                {c.mine && <MoveToOrg kind="partner" linkId={c.link_id} current={c.org_id} orgs={orgs} onMoved={load} />}
              </div>
              {older === c.company_id && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {reports.slice(1).map((r) => (
                    <li key={r.report_id}>
                      <button className="flex w-full items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-left text-sm" onClick={() => view(r.report_id)} aria-label={`Open summary ${fmt(r.period_from)} to ${fmt(r.period_to)} from ${c.company_name}`}>
                        <span>{fmt(r.period_from)} to {fmt(r.period_to)} <small className="text-muted">· sent {fmt(r.sent_at)}</small></span><small className="font-semibold text-brand-text">Open ›</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <OrgPanel kind="insurance" orgs={orgs} reload={() => { reloadOrgs(); load(); }} myEmail={email} />
      <InviteLinkPanel kind="insurance" defaultName={email} orgs={orgs} />
      <div className="mt-8"><Button variant="ghost" onClick={() => signOut()}>Sign out</Button></div>
      <p className="mt-4 text-xs text-muted">Each company sees when you open a summary and can withdraw it or end your access. This app documents safety meetings; it doesn&apos;t certify compliance.</p>
      <Sheet title={ask ? `Ask ${ask.company_name} for a fresh summary` : ""} open={!!ask} onClose={() => setAsk(null)}>
        <div className="flex flex-col gap-3">
          <p className="text-sm">They&apos;ll see your request on their Safety profile and decide whether to send one. You can ask each client once a week.</p>
          <Field label="Note (optional)" id="ask-note"><input id="ask-note" className={inputClass} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Example: renewal is next month" /></Field>
          <Button type="button" onClick={sendAsk}>Send request</Button>
        </div>
      </Sheet>
    </Shell>
  );
}

function Tile({ n, label, warn = false }: { n: string; label: string; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-surface p-3 shadow-card">
      <p className={`font-display text-2xl font-bold tabular-nums ${warn ? "text-warn-text" : ""}`}>{n}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
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
