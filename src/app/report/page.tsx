"use client";

// The page a jobsite sticker's "see something unsafe?" code opens (/report/?site=<jobsite id>). No app, no account:
// anyone at the site reports a hazard or near miss, with a photo and an optional name. The jobsite decides the company
// (migration 0055). With no signal the report waits on this page and sends when signal returns.
import { useCallback, useEffect, useState } from "react";
import { siteFromSearch } from "@/core/sitelink";
import { hazardSiteInfo, reportHazardAtSite } from "@/lib/data/hazards";
import { hazardQueue } from "@/lib/hazardOutbox";
import { HazardForm } from "@/components/Hazards";
import { Eyebrow, Loading, Mark, Notice, Title } from "@/components/ui";
import { BRAND } from "@/content/brand";

const STICKER_USER = "sticker";

export default function ReportPage() {
  const [site, setSite] = useState<string | null>(null);
  const [info, setInfo] = useState<{ company: string; jobsite: string } | null | "loading" | "error">("loading");
  const [sent, setSent] = useState<"sent" | "waiting" | null>(null);
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    const id = siteFromSearch(window.location.search) ?? siteFromSearch(window.location.hash.replace(/^#/, "?"));
    const t = setTimeout(() => {
      setSite(id);
      if (!id) { setInfo(null); return; }
      hazardSiteInfo(id).then(setInfo).catch(() => setInfo("error"));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const flush = useCallback(async () => {
    const r = await hazardQueue.flush(STICKER_USER, (h) => reportHazardAtSite(h.site!, h));
    setWaiting(hazardQueue.waiting(STICKER_USER).length);
    return r;
  }, []);
  useEffect(() => {
    const online = () => { void flush().then((r) => { if (r.sent) setSent("sent"); }); };
    window.addEventListener("online", online);
    const first = setTimeout(online, 0);
    return () => { window.removeEventListener("online", online); clearTimeout(first); };
  }, [flush]);

  return (
    <div className="mx-auto max-w-xl px-4 pb-12">
      <header className="-mx-4 flex items-center gap-2.5 border-b border-line/60 px-5 py-3">
        <Mark size={28} /><span className="text-[15px] font-semibold">{BRAND.name}</span>
        <span className="ml-auto text-xs text-muted">Report a hazard</span>
      </header>
      <main className="page-in pt-6">
        {info === "loading" ? <Loading /> : info === "error" ? (
          <Notice tone="caution">No signal right now, or the page couldn&apos;t reach the company. Try again in a moment, or tell your supervisor in person.</Notice>
        ) : !info || !site ? (
          <Notice tone="caution">This sticker isn&apos;t active. Tell your supervisor in person.</Notice>
        ) : (
          <>
            <Eyebrow>{info.company}</Eyebrow>
            <Title>See something unsafe?</Title>
            <p className="mt-2 text-sm text-muted">Report it for <b className="text-fg">{info.jobsite}</b>. It goes to the company&apos;s office. Your name is optional; if you leave it off, nothing about who sent it is kept. If someone is hurt or in danger now, call 911 first.</p>
            {sent === "sent" && <div className="mt-4"><Notice tone="ok">Sent. Thank you for speaking up.</Notice></div>}
            {(sent === "waiting" || waiting > 0) && <div className="mt-4"><Notice tone="caution">No signal. Keep this page open: your report sends as soon as there&apos;s signal.</Notice></div>}
            <div className="mt-4">
              <HazardForm askName onSend={async (r) => {
                const item = { ...r, clientId: crypto.randomUUID(), jobsiteId: site, companyId: null, site };
                hazardQueue.add(item.clientId, STICKER_USER, item);
                const res = await flush();
                setSent(res.sent ? "sent" : "waiting");
              }} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
