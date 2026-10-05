"use client";

// The company's plan with the admin's week swaps applied. Swaps are kept on the phone too, so the right talk shows
// with no signal. Plan logic itself lives in src/core/plan.ts and src/core/makeup.ts; this only loads the swaps.
import { useCallback, useEffect, useMemo, useState } from "react";
import { TALKS } from "@/content/talks";
import { climateFor } from "@/core/climate";
import { buildPlan, thisWeek, type PlanInput } from "@/core/plan";
import { listOverrides } from "@/lib/data/plan";
import type { Company } from "@/lib/data/types";

const key = (companyId: string) => `tt-overrides-${companyId}`;

function readCached(companyId: string): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(key(companyId)) ?? "{}"); } catch { return {}; }
}

export function usePlan(co: Company, today: Date = new Date()) {
  const [overrides, setOverrides] = useState<Record<string, string>>(() => (typeof window === "undefined" ? {} : readCached(co.id)));
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let live = true;
    listOverrides(co.id)
      .then((rows) => {
        if (!live) return;
        const next = Object.fromEntries(rows.map((r) => [r.week_start, r.talk_id]));
        try { localStorage.setItem(key(co.id), JSON.stringify(next)); } catch { /* fine */ }
        setOverrides(next);
      })
      .catch(() => { /* offline: keep the copy on this phone */ });
    return () => { live = false; };
  }, [co.id, version]);

  const day = today.toDateString();
  const input: Omit<PlanInput, "today"> = useMemo(
    () => ({ talks: TALKS, industry: co.industry, climate: climateFor(co.zip), programStart: co.program_start, overrides }),
    [co.industry, co.zip, co.program_start, overrides],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plan = useMemo(() => buildPlan({ ...input, today }), [input, day]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const week = useMemo(() => thisWeek(plan, today), [plan, day]);
  return { input, plan, week, overrides, reload };
}
