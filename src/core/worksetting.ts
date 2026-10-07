// Where a company's crews do their work, so weather notes fit the job: a roofer is on the roof when thunder starts,
// a warehouse crew is inside but works the dock and yard. Each company picks one in Admin → Company; until it does,
// its industry decides. Content + config: a new industry only needs a line in DEFAULT_BY_INDUSTRY.
import type { IndustryId } from "./industries";

export type WorkSetting = "outdoor" | "mixed" | "indoor";

export const WORK_SETTINGS: { id: WorkSetting; name: string; sub: string }[] = [
  { id: "outdoor", name: "Outside", sub: "Roofing, exterior trades, site work, farms" },
  { id: "mixed", name: "Inside and outside", sub: "General construction, remodeling, service calls" },
  { id: "indoor", name: "Inside", sub: "Warehouses, plants, shops (with docks and yards)" },
];

export const DEFAULT_BY_INDUSTRY: Record<IndustryId, WorkSetting> = {
  con: "mixed",
  ag: "outdoor",
  mfg: "indoor",
  wh: "indoor",
};

/** The company's own choice, or its industry's default. */
export function workSettingFor(co: { industry: IndustryId; work_setting?: WorkSetting | null }): WorkSetting {
  return co.work_setting ?? DEFAULT_BY_INDUSTRY[co.industry] ?? "outdoor";
}
