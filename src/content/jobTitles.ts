// Starter job titles per industry: what a new company sees in Admin → Job titles, and can add with one tap. Content,
// not code: a company adds, renames or removes its own. `presents` = shows in the "Presented by" list (gives talks);
// everyone else signs only. Someone with no job title shows as "Team member".
// Every company already gets the six presenting titles from create_company() (migration 0002); they're listed
// here too so the starter set is complete in one place.
import type { IndustryId } from "@/core/industries";
export { NO_TITLE } from "@/core/presenters";

export type StarterTitle = { name: string; presents: boolean };

const LEADS: StarterTitle[] = ["Owner", "Safety Manager", "Superintendent", "Supervisor", "Foreman", "Team Lead"].map((name) => ({ name, presents: true }));
const t = (presenting: string[], others: string[]): StarterTitle[] => [
  ...LEADS,
  ...presenting.map((name) => ({ name, presents: true })),
  ...[...others, "Office"].map((name) => ({ name, presents: false })),
];

const BUILDING = ["Laborer", "Apprentice", "Helper", "Equipment Operator", "Driver", "Estimator"];

export const STARTER_TITLES: Record<IndustryId, StarterTitle[]> = {
  con: t(["Project Manager"], ["Carpenter", ...BUILDING]),
  roof: t(["Project Manager"], ["Roofer", "Shingle Installer", "Tile Roofer", "Metal Roofer", "Commercial Roofer", "Repair Technician", "Laborer", "Helper", "Driver", "Estimator"]),
  elec: t(["Master Electrician", "Project Manager"], ["Journeyman Electrician", "Apprentice Electrician", "Service Technician", "Helper", "Estimator"]),
  plumb: t(["Master Plumber", "Project Manager"], ["Journeyman Plumber", "Apprentice Plumber", "HVAC Technician", "Service Technician", "Helper", "Estimator"]),
  solar: t(["Lead Installer", "Project Manager"], ["Installer", "Electrician", "Apprentice", "Site Surveyor", "Helper"]),
  site: t(["Project Manager"], ["Equipment Operator", "Laborer", "Pipe Layer", "Grade Checker", "Truck Driver", "Demolition Technician"]),
  mfg: t(["Plant Manager", "Shift Lead"], ["Machine Operator", "Assembler", "Maintenance Technician", "Quality Inspector", "Material Handler", "Forklift Operator", "Welder"]),
  wh: t(["Warehouse Manager", "Shift Lead"], ["Warehouse Associate", "Forklift Operator", "Picker/Packer", "Shipping and Receiving", "Inventory Clerk", "Loader"]),
  truck: t(["Fleet Manager", "Dispatcher"], ["Driver", "CDL Driver", "Delivery Driver", "Mechanic", "Yard Jockey", "Loader"]),
  ag: t(["Farm Manager", "Field Lead"], ["Farmworker", "Equipment Operator", "Pesticide Applicator", "Irrigation Technician", "Mechanic", "Driver"]),
  land: t(["Account Manager", "Field Lead"], ["Landscaper", "Mower Operator", "Irrigation Technician", "Tree Climber", "Arborist", "Chemical Applicator", "Driver"]),
  oil: t(["Driller", "Toolpusher"], ["Floorhand", "Derrickhand", "Motorhand", "Equipment Operator", "Truck Driver", "Mechanic"]),
  util: t(["Project Manager"], ["Lineworker", "Apprentice Lineworker", "Groundworker", "Equipment Operator", "Meter Technician", "Tower Technician"]),
  health: t(["Charge Nurse", "Unit Manager"], ["Nurse", "Nursing Assistant", "Medical Assistant", "Environmental Services", "Lab Technician", "Home Health Aide"]),
  retail: t(["Store Manager", "Assistant Manager"], ["Sales Associate", "Stocker", "Cashier", "Receiving", "Deli and Bakery", "Department Lead"]),
  food: t(["Kitchen Manager", "Shift Lead"], ["Line Cook", "Prep Cook", "Dishwasher", "Server", "Host", "Delivery Driver"]),
  facil: t(["Facilities Manager", "Housekeeping Manager"], ["Maintenance Technician", "Custodian", "Housekeeper", "HVAC Technician", "Groundskeeper", "Laundry Attendant"]),
  auto: t(["Service Manager", "Shop Lead"], ["Technician", "Lube Technician", "Body Technician", "Painter", "Porter", "Service Advisor", "Parts Specialist"]),
};

/** Starter titles the company doesn't have yet (names compared without case). */
export function missingStarterTitles(industry: IndustryId, have: { name: string }[]): StarterTitle[] {
  const names = new Set(have.map((r) => r.name.trim().toLowerCase()));
  return (STARTER_TITLES[industry] ?? STARTER_TITLES.con).filter((s) => !names.has(s.name.toLowerCase()));
}
