// Industries a company can pick. Content + config: a new industry is a line here (plus its talks in
// src/content/talks.ts and a work setting in src/core/worksetting.ts), never new app code.
// `uses`: other industries whose talks also apply. The construction trades draw on every construction talk, so a
// roofing company gets the construction library plus the roofing talks.
export type IndustryId =
  | "con" | "roof" | "elec" | "plumb" | "solar" | "site"
  | "mfg" | "wh" | "truck" | "ag" | "land"
  | "oil" | "util" | "health" | "retail" | "food" | "facil" | "auto";

/**
 * `naics`: common 6-digit NAICS codes for the industry, offered as a starting point on the OSHA summary (the company
 * checks its own, for example on its tax return). The OSHA rules themselves key off the code, not this list.
 */
export type Industry = { id: IndustryId; name: string; sub: string; uses?: IndustryId[]; naics: { code: string; name: string }[] };

export const INDUSTRIES: Industry[] = [
  { id: "con", name: "Construction", sub: "General contracting, remodeling, jobsites", naics: [{ code: "236118", name: "Residential remodelers" }, { code: "236115", name: "New single-family housing construction" }, { code: "236220", name: "Commercial and institutional building construction" }, { code: "238990", name: "All other specialty trade contractors" }] },
  { id: "roof", name: "Roofing", sub: "Residential and commercial roofing", uses: ["con"], naics: [{ code: "238160", name: "Roofing contractors" }] },
  { id: "elec", name: "Electrical contracting", sub: "Electricians, low voltage, service work", uses: ["con"], naics: [{ code: "238210", name: "Electrical contractors and other wiring installation contractors" }] },
  { id: "plumb", name: "Plumbing & HVAC", sub: "Plumbing, heating, cooling, service calls", uses: ["con"], naics: [{ code: "238220", name: "Plumbing, heating, and air-conditioning contractors" }] },
  { id: "solar", name: "Solar installation", sub: "Rooftop and ground-mount solar", uses: ["con"], naics: [{ code: "238210", name: "Electrical contractors and other wiring installation contractors" }, { code: "238220", name: "Plumbing, heating, and air-conditioning contractors" }] },
  { id: "site", name: "Demolition & site work", sub: "Demolition, excavation, grading, utilities", uses: ["con"], naics: [{ code: "238910", name: "Site preparation contractors" }, { code: "237110", name: "Water and sewer line and related structures construction" }] },
  { id: "mfg", name: "Manufacturing", sub: "Plants, shops, production lines", naics: [{ code: "332710", name: "Machine shops" }, { code: "332312", name: "Fabricated structural metal manufacturing" }, { code: "326199", name: "All other plastics product manufacturing" }, { code: "311999", name: "All other miscellaneous food manufacturing" }] },
  { id: "wh", name: "Warehouse & Logistics", sub: "Distribution, shipping, material handling", naics: [{ code: "493110", name: "General warehousing and storage" }, { code: "493120", name: "Refrigerated warehousing and storage" }, { code: "423990", name: "Other miscellaneous durable goods merchant wholesalers" }] },
  { id: "truck", name: "Transportation & Trucking", sub: "Drivers, freight, delivery", naics: [{ code: "484110", name: "General freight trucking, local" }, { code: "484121", name: "General freight trucking, long-distance, truckload" }, { code: "484220", name: "Specialized freight (except used goods) trucking, local" }] },
  { id: "ag", name: "Agriculture & Fertilizer", sub: "Farms, ag retail, chemical application", naics: [{ code: "111998", name: "All other miscellaneous crop farming" }, { code: "115112", name: "Soil preparation, planting, and cultivating" }, { code: "424910", name: "Farm supplies merchant wholesalers" }, { code: "325311", name: "Nitrogenous fertilizer manufacturing" }] },
  { id: "land", name: "Landscaping & Tree Care", sub: "Lawn care, landscaping, tree work", naics: [{ code: "561730", name: "Landscaping services" }, { code: "115310", name: "Support activities for forestry" }] },
  { id: "oil", name: "Oil & Gas", sub: "Well sites, drilling, servicing", naics: [{ code: "213111", name: "Drilling oil and gas wells" }, { code: "213112", name: "Support activities for oil and gas operations" }, { code: "211120", name: "Crude petroleum extraction" }] },
  { id: "util", name: "Utilities & Telecom", sub: "Power lines, telecom, towers", naics: [{ code: "221122", name: "Electric power distribution" }, { code: "237130", name: "Power and communication line and related structures construction" }, { code: "221310", name: "Water supply and irrigation systems" }] },
  { id: "health", name: "Healthcare", sub: "Hospitals, clinics, home health, long-term care", naics: [{ code: "622110", name: "General medical and surgical hospitals" }, { code: "623110", name: "Nursing care facilities (skilled nursing facilities)" }, { code: "621610", name: "Home health care services" }, { code: "621111", name: "Offices of physicians (except mental health specialists)" }] },
  { id: "retail", name: "Retail & Grocery", sub: "Stores, stockrooms, grocery", naics: [{ code: "445110", name: "Supermarkets and other grocery retailers (except convenience retailers)" }, { code: "444110", name: "Home centers" }, { code: "455211", name: "Warehouse clubs and supercenters" }] },
  { id: "food", name: "Restaurants & Food Service", sub: "Kitchens, restaurants, catering", naics: [{ code: "722511", name: "Full-service restaurants" }, { code: "722513", name: "Limited-service restaurants" }, { code: "722320", name: "Caterers" }] },
  { id: "facil", name: "Hotels, Janitorial & Facilities", sub: "Housekeeping, cleaning, building maintenance", naics: [{ code: "721110", name: "Hotels (except casino hotels) and motels" }, { code: "561720", name: "Janitorial services" }, { code: "561790", name: "Other services to buildings and dwellings" }] },
  { id: "auto", name: "Auto Repair & Fleet", sub: "Repair shops, fleet maintenance, body shops", naics: [{ code: "811111", name: "General automotive repair" }, { code: "811121", name: "Automotive body, paint, and interior repair and maintenance" }, { code: "811198", name: "All other automotive repair and maintenance" }] },
];

/** The industries whose talks a company in `industry` gets: its own plus any it `uses`. */
export function industryTags(industry: IndustryId): IndustryId[] {
  const i = INDUSTRIES.find((x) => x.id === industry);
  return [industry, ...(i?.uses ?? [])];
}
