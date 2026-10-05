"use client";

// "Where are we?" Pick today's jobsite, or let the phone's GPS pick the nearest one.
// The choice is remembered on this device per company; the talk flow will read it.
import { useEffect, useState } from "react";
import Link from "next/link";
import { listJobsites } from "@/lib/data/company";
import type { Jobsite } from "@/lib/data/types";
import { getLocation, LocationError } from "@/lib/location";
import { formatDistance, nearestJobsite } from "@/core/geo";
import { Button, GroupHeading, Notice, inputClass } from "./ui";

const key = (companyId: string) => `tt-jobsite-${companyId}`;
export function readChosenJobsite(companyId: string): string | null {
  try { return localStorage.getItem(key(companyId)); } catch { return null; }
}
function writeChosenJobsite(companyId: string, id: string) {
  try { localStorage.setItem(key(companyId), id); } catch { /* not remembered; fine */ }
}

export function JobsitePicker({ companyId, isAdmin, onChange }: { companyId: string; isAdmin: boolean; onChange?: (site: Jobsite | null) => void }) {
  const [sites, setSites] = useState<Jobsite[] | null>(null);
  const [chosen, setChosen] = useState<string>("");
  const [status, setStatus] = useState<{ tone: "info" | "error" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    listJobsites(companyId)
      .then((s) => {
        if (!live) return;
        setSites(s);
        const saved = readChosenJobsite(companyId);
        setChosen(s.some((x) => x.id === saved) ? saved! : "");
        onChange?.(s.find((x) => x.id === saved) ?? null);
      })
      .catch((e) => live && setStatus({ tone: "error", text: e instanceof Error ? e.message : String(e) }));
    return () => { live = false; };
    // onChange is reported once per load; a new callback identity shouldn't reload the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const choose = (id: string) => { setChosen(id); writeChosenJobsite(companyId, id); onChange?.(sites?.find((x) => x.id === id) ?? null); };

  const findNearest = async () => {
    if (!sites) return;
    setBusy(true);
    setStatus({ tone: "info", text: "Finding your location…" });
    try {
      const here = await getLocation();
      const r = nearestJobsite(sites, here);
      if (!r) setStatus({ tone: "error", text: "None of your jobsites has a GPS point yet. Pin them in Admin → Jobsites while on site." });
      else if (r.atSite) { choose(r.site.id); setStatus({ tone: "ok", text: `You're at ${r.site.name}.` }); }
      else setStatus({ tone: "info", text: `Closest is ${r.site.name}, ${formatDistance(r.meters)} away. Pick it below if that's right.` });
    } catch (e) {
      setStatus({ tone: "error", text: e instanceof LocationError ? e.message : String(e) });
    }
    setBusy(false);
  };

  return (
    <section>
      <GroupHeading>Jobsite</GroupHeading>
      {sites && sites.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          No jobsites yet.{" "}
          {isAdmin ? <Link className="font-bold underline" href="/admin/#jobsites">Add one in Admin</Link> : "Ask your admin to add them."}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <select aria-label="Jobsite" className={`${inputClass} flex-1 basis-48`} value={chosen} onChange={(e) => choose(e.target.value)} disabled={!sites}>
            <option value="">{sites ? "Pick a jobsite" : "Loading…"}</option>
            {sites?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button size="sm" variant="ghost" onClick={findNearest} disabled={!sites || busy}>{busy ? "Locating…" : "Find nearest"}</Button>
        </div>
      )}
      {status && <div className="mt-3"><Notice tone={status.tone}>{status.text}</Notice></div>}
    </section>
  );
}
