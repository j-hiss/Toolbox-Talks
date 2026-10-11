"use client";

// Home's inspections card: how many of this company's checklists are due now, and the way in. The same due rule as
// the Inspections screen (dueFor in src/core/inspections.ts).
import { useEffect, useState } from "react";
import Link from "next/link";
import { CHECKLISTS } from "@/content/checklists";
import { dueState, trackedChecks, type TrackedCheck } from "@/core/inspections";
import type { IndustryId } from "@/core/industries";
import { listInspections } from "@/lib/data/inspections";

const cacheKey = (companyId: string) => `tt-tracked-checks:${companyId}`;

/**
 * This company's scheduled checklists and when each was last done, or null while loading. Offline, the last list this
 * phone loaded (kept on the device), so reminders aren't dropped just because there's no signal.
 */
export function useTrackedChecks(companyId: string, industry: IndustryId): TrackedCheck[] | null {
  const [tracked, setTracked] = useState<TrackedCheck[] | null>(null);
  useEffect(() => {
    let live = true;
    listInspections(companyId, 300).then((h) => {
      const t = trackedChecks(CHECKLISTS, industry, h);
      try { localStorage.setItem(cacheKey(companyId), JSON.stringify(t)); } catch { /* fine */ }
      if (live) setTracked(t);
    }).catch(() => {
      let saved: TrackedCheck[] | null = null;
      try { saved = JSON.parse(localStorage.getItem(cacheKey(companyId)) ?? "null"); } catch { /* none */ }
      if (live) setTracked(Array.isArray(saved) ? saved : []); // never loaded on this phone: nothing to remind about yet
    });
    return () => { live = false; };
  }, [companyId, industry]);
  return tracked;
}

export function InspectionsCard({ tracked }: { tracked: TrackedCheck[] | null }) {
  const due = tracked === null ? null : tracked.filter((c) => dueState(c.when, c.last).due).length;
  return (
    <Link href="/inspect/" className="mt-4 flex items-center gap-3 rounded-xl bg-surface p-4 shadow-card">
      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 11l2 2 4-4M9 17h6" /></svg>
      </span>
      <span className="min-w-0 flex-1">
        <b className="block">Inspections</b>
        <small className="text-muted">{due === null ? "Daily checks, ladders, extinguishers and more" : due ? `${due} check${due > 1 ? "s" : ""} due now` : "Nothing due right now"}</small>
      </span>
      <span aria-hidden className="text-muted">›</span>
    </Link>
  );
}
