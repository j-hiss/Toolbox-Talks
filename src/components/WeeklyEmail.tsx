"use client";

// Weekly email to the office (migration 0056): turn my own copy on or off, preview this week's email (built by the same
// code the server sends with, src/lib/digest.ts), and, for admins, when it last went out.
import { useEffect, useState } from "react";
import type { Digest, DigestTone } from "@/core/digest";
import { DIGEST_FOOTER } from "@/core/digest";
import { loadDigest, type DigestCompany } from "@/lib/digest";
import { supabase } from "@/lib/supabase";
import { digestLog, setWeeklyEmail, weeklyEmailOn, type DigestLogRow } from "@/lib/data/digest";
import { appWebAddress } from "@/lib/webAddress";
import { Button, GroupHeading, Loading, Notice, Sheet } from "./ui";
import { toast } from "./toast";

const TONE: Record<DigestTone, string> = { attention: "text-warn-text", ok: "text-ok-text", info: "text-muted" };
const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function WeeklyEmail({ company, admin }: { company: DigestCompany; admin: boolean }) {
  const [on, setOn] = useState<boolean | null>(null);
  const [log, setLog] = useState<DigestLogRow[]>([]);
  const [preview, setPreview] = useState<Digest | "loading" | null>(null);
  useEffect(() => {
    weeklyEmailOn(company.id).then(setOn).catch(() => setOn(null));
    if (admin) digestLog(company.id).then(setLog).catch(() => setLog([]));
  }, [company.id, admin]);
  const toggle = async (v: boolean) => {
    setOn(v);
    try { await setWeeklyEmail(company.id, v); toast(v ? "You'll get the weekly email." : "You won't get the weekly email."); }
    catch (e) { setOn(!v); toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  const open = async () => {
    setPreview("loading");
    try { setPreview(await loadDigest(supabase(), company, appWebAddress() ?? null)); }
    catch (e) { setPreview(null); toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  return (
    <section aria-label="Weekly email" className="mt-6">
      <GroupHeading>Weekly email</GroupHeading>
      <p className="mt-1 text-sm text-muted">Monday morning, owners, admins and office get last week&apos;s summary: teams that didn&apos;t sign, makeups running out, training cards, open issues and crew reports. No need to open the app to know.</p>
      <label className="mt-2 flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" className="h-5 w-5" checked={!!on} disabled={on === null} onChange={(e) => toggle(e.target.checked)} /> Send it to me
      </label>
      <div className="mt-1 flex flex-wrap gap-2"><Button size="sm" variant="soft" onClick={open}>Preview this week&apos;s email</Button></div>
      {admin && log.length > 0 && (
        <p className="mt-2 text-xs text-muted">Last sent: {log.slice(0, 3).map((l) => `${day(l.week_key)} ${l.status === "sent" ? `to ${l.recipients}` : l.status}`).join(" · ")}</p>
      )}
      {preview && (
        <Sheet title="Weekly email preview" open onClose={() => setPreview(null)}>
          {preview === "loading" ? <Loading /> : (
            <div aria-label="Email preview" className="flex flex-col gap-3 text-sm">
              <p className="font-semibold">{preview.subject}</p>
              {preview.sections.map((s) => (
                <div key={s.title} className="border-t border-line pt-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${TONE[s.tone]}`}>{s.title}</p>
                  <ul className="mt-1 list-disc pl-5">{s.lines.map((l) => <li key={l}>{l}</li>)}</ul>
                </div>
              ))}
              <p className="border-t border-line pt-2 text-xs text-muted">{DIGEST_FOOTER}</p>
              <Notice>This is what the email says today. It goes out Monday morning once the email service is set up.</Notice>
            </div>
          )}
        </Sheet>
      )}
    </section>
  );
}
