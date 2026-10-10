"use client";

// Home's inspections card: how many of this company's checklists are due now, and the way in. The same due rule as
// the Inspections screen (dueFor in src/core/inspections.ts).
import { useEffect, useState } from "react";
import Link from "next/link";
import { CHECKLISTS } from "@/content/checklists";
import { checklistsFor, dueFor } from "@/core/inspections";
import type { IndustryId } from "@/core/industries";
import { listInspections } from "@/lib/data/inspections";

export function InspectionsCard({ companyId, industry }: { companyId: string; industry: IndustryId }) {
  const [due, setDue] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    listInspections(companyId, 300).then((h) => {
      if (!live) return;
      const last = (id: string) => h.find((x) => x.checklist_id === id)?.inspected_at ?? null;
      setDue(checklistsFor(CHECKLISTS, industry).filter((c) => dueFor(c, last(c.id)).due).length);
    }).catch(() => { /* offline: just show the way in */ });
    return () => { live = false; };
  }, [companyId, industry]);
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
