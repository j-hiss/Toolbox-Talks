"use client";

// Admin -> Company's "Plan and account" panel (src/core/account.ts, migration 0042): plan, download all data, close
// the account, and each time support looked at the account. The banner on every screen: ./AccountBanner.tsx.
import { useEffect, useState } from "react";
import { CLOSE_WAIT_DAYS, PLAN_LABEL, removableFrom } from "@/core/account";
import { useAccount } from "./AccountBanner";
import { cancelClosure, requestClosure, supportAccessLog } from "@/lib/data/account";
import { buildCompanyExport, exportFileName, type ExportProgress } from "@/lib/exportCompany";
import type { Membership } from "@/lib/data/types";
import { saveFile } from "@/lib/download";
import { Button, ConfirmButton, GroupHeading, Notice, inputClass } from "./ui";
import { toast } from "./toast";

const day = (d: Date | string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

/** Admin -> Company: plan, download everything, close the account, support access log. */
export function AccountPanel({ m }: { m: Membership }) {
  const co = m.company;
  const { account, reload } = useAccount(co.id);
  const owner = m.access === "owner";
  const [withFiles, setWithFiles] = useState(true);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [log, setLog] = useState<{ at: string; reason: string }[] | null>(null);
  useEffect(() => {
    let live = true;
    supportAccessLog(co.id).then((l) => live && setLog(l)).catch(() => live && setLog(null));
    return () => { live = false; };
  }, [co.id]);

  const download = async () => {
    setProgress({ step: "Starting", done: 0, total: 1 });
    try {
      const blob = await buildCompanyExport(co.id, co.name, withFiles, setProgress);
      const res = await saveFile(exportFileName(co.name), blob);
      if (res !== "canceled") toast("Your data is downloaded.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
    setProgress(null);
  };
  const close = async () => {
    try { await requestClosure(co.id); setConfirmName(""); reload(); toast(`Closing requested. Your data stays for ${CLOSE_WAIT_DAYS} days.`); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  const keep = async () => {
    try { await cancelClosure(co.id); reload(); toast("Closing canceled. Nothing changes."); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };

  return (
    <section aria-label="Plan and account" className="mt-8">
      <GroupHeading>Plan and account</GroupHeading>
      <div className="mt-2 rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
        <p className="font-semibold">{account ? PLAN_LABEL[account.plan] : "Plan"}{account?.plan === "trial" && account.trial_ends_at ? ` · ends ${day(`${account.trial_ends_at}T12:00:00`)}` : ""}</p>
        {account?.paused_at && <p className="mt-1 text-sm">Paused since {day(account.paused_at)}{account.pause_reason ? `: ${account.pause_reason}` : ""}. Everything can be viewed and downloaded; nothing new saves.</p>}
        {!account?.paused_at && <p className="mt-1 text-sm text-muted">Questions about your plan: contact us.</p>}
      </div>

      <GroupHeading>Download all your data</GroupHeading>
      <p className="mt-1 text-sm text-muted">Every record, roster, issue, inspection, log and setting your company has, as spreadsheets (CSV) and JSON in one ZIP. Your data is yours; this works even if the account is paused or closing.</p>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={withFiles} onChange={(e) => setWithFiles(e.target.checked)} /> Include files (signatures, crew photos, paper sheets, card photos, documents). Larger and slower.</label>
      <div className="mt-2">
        <Button type="button" disabled={!!progress} onClick={download}>{progress ? "Preparing…" : "Download all data (ZIP)"}</Button>
        {progress && <p className="mt-2 text-sm text-muted" role="status">{progress.step}{progress.total > 1 ? ` (${progress.done} of ${progress.total})` : ""}</p>}
      </div>

      <GroupHeading>Support access</GroupHeading>
      <p className="mt-1 text-sm text-muted">When you ask us for help, our support team can open your company&apos;s working records to see what you see. Each time, they give a reason, and it shows here. They never see your injury log&apos;s details (only how many cases), incident titles, signature or photo images, or phone numbers, and they can&apos;t change anything.</p>
      {log === null ? <p className="mt-2 text-sm text-muted">Couldn&apos;t load the support log right now.</p>
        : log.length === 0 ? <p className="mt-2 text-sm">Support hasn&apos;t opened your account.</p>
        : <ul aria-label="Support access log" className="mt-2 flex flex-col gap-1 text-sm">{log.map((l) => <li key={l.at}><b>{new Date(l.at).toLocaleString()}</b> · {l.reason}</li>)}</ul>}

      {owner && (
        <>
          <GroupHeading>Close the account</GroupHeading>
          {account?.closure_requested_at ? (
            <div className="mt-2 flex flex-col gap-2">
              <Notice tone="caution">Closing was requested on {day(account.closure_requested_at)}. Your data can be removed for good from {day(removableFrom(account.closure_requested_at))}. Download everything before then. Until then you can change your mind.</Notice>
              <div><Button type="button" variant="soft" onClick={keep}>Keep the account</Button></div>
            </div>
          ) : (
            <div className="mt-1 flex flex-col gap-2">
              <p className="text-sm text-muted">Download your data first. After you ask to close, your data stays for {CLOSE_WAIT_DAYS} days so you can change your mind; after that it can be removed for good, including every record and file. To confirm, type the company&apos;s name.</p>
              <label htmlFor="close-name" className="text-sm font-semibold">Company name</label>
              <input id="close-name" className={inputClass} value={confirmName} onChange={(e) => setConfirmName(e.target.value)} placeholder={co.name} autoComplete="off" />
              <div><ConfirmButton label="Ask to close the account" confirmLabel="Tap again to ask to close" disabled={confirmName.trim() !== co.name.trim()} onConfirm={() => void close()} /></div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
