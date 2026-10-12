"use client";

// The heat and weather check for a talk or daily plan in progress: today's forecast for the chosen place (or the
// phone's GPS), saved into the draft once. The heat goes into the heat note; for outdoor and mixed work, a snapshot of
// the conditions goes on the record too (src/core/weatherRecord.ts, migration 0057). Quiet when offline or when the
// weather service can't be reached: then the last check from this morning is used if it's recent enough, else none.
import { useEffect, useState } from "react";
import { cachedConditions, checkConditions, checkHeat } from "@/lib/weather";
import { readDraft, writeDraft, type TalkDraft } from "@/lib/draft";
import type { Company, Jobsite } from "@/lib/data/types";
import { workSettingFor } from "@/core/worksetting";
import { weatherPlaceKey, weatherRecordFrom, type WeatherRecord } from "@/core/weatherRecord";

/** Where this talk is: the jobsite's pin, else the phone's GPS. */
function placeOf(draft: TalkDraft, jobsites: Jobsite[]) {
  const site = jobsites.find((j) => j.id === draft.jobsiteId);
  const point = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : draft.gps;
  return { site, point };
}

/**
 * The weather to save with the record, for the place the record is saved at. If the jobsite changed after the check
 * (or this is a makeup somewhere else), it's checked again for the new place; with no signal, the last check for that
 * place is used if it's recent enough, else none. Never another place's weather. Waits at most 4 seconds.
 */
export async function weatherForSave(draft: TalkDraft, jobsites: Jobsite[], company: Pick<Company, "industry" | "work_setting">): Promise<WeatherRecord | null> {
  const { site, point } = placeOf(draft, jobsites);
  const setting = workSettingFor(company, site);
  if (!point || setting === "indoor") return null;
  if (draft.weather && draft.weatherAt === weatherPlaceKey(point)) return draft.weather;
  const fresh = await Promise.race([checkConditions(point).catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), 4000))]);
  return weatherRecordFrom(fresh ?? cachedConditions(point), setting);
}

export function useHeatCheck(draft: TalkDraft, jobsites: Jobsite[], company: Pick<Company, "industry" | "work_setting">): string | null {
  const { site, point } = placeOf(draft, jobsites);
  const setting = workSettingFor(company, site);
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
  useEffect(() => {
    if (!point || setting === "indoor" || (draft.weather && draft.weatherAt === weatherPlaceKey(point))) return;
    let live = true;
    checkConditions(point)
      .catch(() => cachedConditions(point))
      .then((c) => {
        const cur = readDraft(draft.companyId);
        const w = weatherRecordFrom(c, setting);
        if (!live || !w || !cur) return;
        writeDraft({ ...cur, weather: w, weatherAt: weatherPlaceKey(point) });
      });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.latitude, point?.longitude, setting]);
  return msg;
}
