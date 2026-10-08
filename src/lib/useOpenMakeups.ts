"use client";

// Who still owes each past week (talk period) that can still be made up: week key -> people. Built from the report query layer and
// the compliance math, so the makeup picker, Home and Reports always agree. Null while loading or offline.
import { useEffect, useState } from "react";
import { buildCompliance } from "@/core/compliance";
import { periodKeys } from "@/core/makeup";
import type { PlanInput } from "@/core/plan";
import { addDays, isoDay, mondayOf, parseDay } from "@/core/weeks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import type { Company } from "@/lib/data/types";

export type OpenMakeups = Map<string, { id: string; name: string }[]>;

/** `input` is the plan (usePlan), so talk periods match the company's cadence. */
export function useOpenMakeups(co: Company, input: Omit<PlanInput, "today">): OpenMakeups | null {
  const [open, setOpen] = useState<OpenMakeups | null>(null);
  useEffect(() => {
    let live = true;
    const today = new Date();
    const limit = co.makeup_weeks ?? 4;
    const start = isoDay(mondayOf(parseDay(co.program_start)));
    const keys = start > isoDay(mondayOf(today)) ? [] : periodKeys(input, [isoDay(addDays(mondayOf(today), -7 * limit)), start].sort().at(-1)!, today);
    const fromKey = keys.at(-1)?.key ?? isoDay(mondayOf(today));
    Promise.all([reportPeople(co.id), reportRecords(co.id, fromKey)])
      .then(([people, records]) => {
        if (!live) return;
        const c = buildCompliance({ people, records, weeks: keys, makeupWeeks: limit, today });
        const names = new Map(people.map((p) => [p.id, p.name]));
        setOpen(new Map(c.weeks.map((w) => [w.key, w.people.filter((p) => p.state === "open").map((p) => ({ id: p.personId, name: names.get(p.personId) ?? "" }))])));
      })
      .catch(() => { /* offline: the picker still works, just without names */ });
    return () => { live = false; };
  }, [co.id, co.makeup_weeks, co.program_start, input]);
  return open;
}
