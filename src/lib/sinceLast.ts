// Loads the "Since last talk" section for a talk in progress: the company's approved crew summaries for this
// jobsite since its last talk (or the window the company picked). Rules are in src/core/safetylog.ts; this only
// fetches. Offline or unreachable: the section says so honestly instead of disappearing.
import { bulletinHeading, selectBulletins, sinceLastSettings, windowStart, type SinceLastWindow } from "@/core/safetylog";
import { crewBulletins, lastTalkAt } from "@/lib/data/safety";
import type { Company } from "@/lib/data/types";

export type SinceLastDraft = {
  status: "read" | "none" | "unavailable";
  window: SinceLastWindow;
  since: string;
  items: { event_id: string; heading: string; text: string }[];
  /** event id -> when the presenter checked "reviewed with the crew" */
  checked: Record<string, string>;
};

export async function loadSinceLast(co: Company, jobsiteId: string | null, today: Date = new Date()): Promise<SinceLastDraft> {
  const s = sinceLastSettings(co);
  try {
    const last = s.window === "since_last" ? await lastTalkAt(co.id, s.scope === "jobsite" ? jobsiteId : null) : null;
    const since = windowStart(s, last, today);
    const items = selectBulletins(await crewBulletins(co.id, since), s, { jobsiteId, since })
      .map((b) => ({ event_id: b.id, heading: bulletinHeading(b, "en-US"), text: b.crew_summary }));
    return { status: items.length ? "read" : "none", window: s.window, since: since.toISOString(), items, checked: {} };
  } catch {
    return { status: "unavailable", window: s.window, since: windowStart(s, null, today).toISOString(), items: [], checked: {} };
  }
}
