"use client";

// The heat check for a talk or daily plan in progress: today's forecast for the chosen place (or the phone's GPS),
// saved into the draft once. Quiet when offline or when the weather service can't be reached.
import { useEffect, useState } from "react";
import { checkHeat } from "@/lib/weather";
import { readDraft, writeDraft, type TalkDraft } from "@/lib/draft";
import type { Jobsite } from "@/lib/data/types";

export function useHeatCheck(draft: TalkDraft, jobsites: Jobsite[]): string | null {
  const site = jobsites.find((j) => j.id === draft.jobsiteId);
  const point = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : draft.gps;
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!point || draft.heat) return;
    let live = true;
    checkHeat(point)
      .then((h) => {
        const cur = readDraft(draft.companyId); // latest draft, so anything typed meanwhile isn't lost
        if (!live || !h || !cur) return;
        writeDraft({ ...cur, heat: { max_heat_index_f: h.maxHeatIndexF, level: h.level, reminder_read: false, checked_at: h.checkedAt, source: h.source, place: h.place } });
      })
      .catch((e) => live && setMsg(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.latitude, point?.longitude]);
  return msg;
}
