// Where a company's crews do their work, so weather notes fit the job: a roofer is on the roof when thunder starts,
// a warehouse crew is inside but works the dock and yard. Each jobsite can be set (Admin → Jobsites); otherwise the
// company's choice (Admin → Company); otherwise its industry decides. Content + config: a new industry only needs a
// line in DEFAULT_BY_INDUSTRY.
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
export function companyWorkSetting(co: { industry: IndustryId; work_setting?: WorkSetting | null }): WorkSetting {
  return co.work_setting ?? DEFAULT_BY_INDUSTRY[co.industry] ?? "outdoor";
}

/** Where the crew works at this jobsite: the jobsite's own setting, else the company's, else the industry's. */
export function workSettingFor(
  co: { industry: IndustryId; work_setting?: WorkSetting | null },
  site?: { work_setting?: WorkSetting | null } | null,
): WorkSetting {
  return site?.work_setting ?? companyWorkSetting(co);
}
