// Origin: prototype/index.html INDUSTRIES.
export type IndustryId = "con" | "mfg" | "ag" | "wh";

export const INDUSTRIES: { id: IndustryId; name: string; sub: string }[] = [
  { id: "con", name: "Construction", sub: "Jobsites, trades, roofing, general contracting" },
  { id: "mfg", name: "Manufacturing", sub: "Plants, shops, production lines" },
  { id: "ag", name: "Agriculture & Fertilizer", sub: "Farms, ag retail, chemical application" },
  { id: "wh", name: "Warehouse & Logistics", sub: "Distribution, shipping, material handling" },
];
