// Industries a company can pick. Content + config: a new industry is a line here (plus its talks in
// src/content/talks.ts and a work setting in src/core/worksetting.ts), never new app code.
// `uses`: other industries whose talks also apply. The construction trades draw on every construction talk, so a
// roofing company gets the construction library plus the roofing talks.
export type IndustryId =
  | "con" | "roof" | "elec" | "plumb" | "solar" | "site"
  | "mfg" | "wh" | "truck" | "ag" | "land"
  | "oil" | "util" | "health" | "retail" | "food" | "facil" | "auto";

export type Industry = { id: IndustryId; name: string; sub: string; uses?: IndustryId[] };

export const INDUSTRIES: Industry[] = [
  { id: "con", name: "Construction", sub: "General contracting, remodeling, jobsites" },
  { id: "roof", name: "Roofing", sub: "Residential and commercial roofing", uses: ["con"] },
  { id: "elec", name: "Electrical contracting", sub: "Electricians, low voltage, service work", uses: ["con"] },
  { id: "plumb", name: "Plumbing & HVAC", sub: "Plumbing, heating, cooling, service calls", uses: ["con"] },
  { id: "solar", name: "Solar installation", sub: "Rooftop and ground-mount solar", uses: ["con"] },
  { id: "site", name: "Demolition & site work", sub: "Demolition, excavation, grading, utilities", uses: ["con"] },
  { id: "mfg", name: "Manufacturing", sub: "Plants, shops, production lines" },
  { id: "wh", name: "Warehouse & Logistics", sub: "Distribution, shipping, material handling" },
  { id: "truck", name: "Transportation & Trucking", sub: "Drivers, freight, delivery" },
  { id: "ag", name: "Agriculture & Fertilizer", sub: "Farms, ag retail, chemical application" },
  { id: "land", name: "Landscaping & Tree Care", sub: "Lawn care, landscaping, tree work" },
  { id: "oil", name: "Oil & Gas", sub: "Well sites, drilling, servicing" },
  { id: "util", name: "Utilities & Telecom", sub: "Power lines, telecom, towers" },
  { id: "health", name: "Healthcare", sub: "Hospitals, clinics, home health, long-term care" },
  { id: "retail", name: "Retail & Grocery", sub: "Stores, stockrooms, grocery" },
  { id: "food", name: "Restaurants & Food Service", sub: "Kitchens, restaurants, catering" },
  { id: "facil", name: "Hotels, Janitorial & Facilities", sub: "Housekeeping, cleaning, building maintenance" },
  { id: "auto", name: "Auto Repair & Fleet", sub: "Repair shops, fleet maintenance, body shops" },
];

/** The industries whose talks a company in `industry` gets: its own plus any it `uses`. */
export function industryTags(industry: IndustryId): IndustryId[] {
  const i = INDUSTRIES.find((x) => x.id === industry);
  return [industry, ...(i?.uses ?? [])];
}
