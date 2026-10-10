// Inspection checklists. Content is data: a new checklist, industry or wording is an entry here, never new app code.
// Changing a checklist's items means a new `version`; saved inspections keep the exact items that were checked.
//
// Every checklist is tied to a rule that asks for the check (an OSHA standard, an FMCSA or EPA rule) and every item
// cites the paragraph behind it, drawn from the same verified sources as the talk library (src/content/talks.ts).
// Every industry in src/core/industries.ts gets the "Every job" set plus checklists of its own (checklists.test.ts
// fails if one doesn't). A checklist documents that someone looked. It never says a site passed OSHA or complies.
import type { Checklist } from "@/core/inspections";

const osha = (part: string, section: string) => `https://www.osha.gov/laws-regs/regulations/standardnumber/${part}/${section}`;
const std = (label: string, part: string, section: string) => ({ label, url: osha(part, section), kind: "standard" as const });
const ecfr49 = (label: string, path: string) => ({ label, url: `https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/${path}`, kind: "standard" as const });

export const CHECKLISTS: Checklist[] = [
  // Every job ------------------------------------------------------------------------------------------------------
  {
    id: "extinguishers", version: 1, title: "Fire extinguishers", industries: ["all"], when: "monthly", talkId: "extinguishers",
    rule: "OSHA 1910.157(e)(2); construction 1926.150(c)(1)",
    sources: [std("OSHA 1910.157(c)-(e): placement, travel distance, monthly inspection, annual maintenance", "1910", "1910.157")],
    items: [
      { id: "in-place", text: "Every extinguisher is in its marked place, mounted, and easy to reach (nothing blocking it)", rule: "1910.157(c)(1)" },
      { id: "charged", text: "Gauge in the green, pin and seal in place, no damage, dents or corrosion", rule: "1910.157(c)(4), (e)(2)" },
      { id: "distance", text: "No spot is more than 75 feet from an extinguisher (100 feet on a construction site)", rule: "1910.157(d)(2); 1926.150(c)(1)(i)" },
      { id: "tag", text: "Annual maintenance tag is current; initial and date the monthly check", rule: "1910.157(e)(3)" },
    ],
  },
  {
    id: "walkways-exits", version: 1, title: "Walkways and exits", industries: ["all"], when: "daily", talkId: "aisles-exits",
    rule: "OSHA 1910.22(a), 1910.37(a); construction 1926.25(a)",
    sources: [std("OSHA 1910.22(a): clean, orderly, dry walking-working surfaces", "1910", "1910.22"), std("OSHA 1910.37(a)-(b): exit routes clear, lit and marked", "1910", "1910.37")],
    items: [
      { id: "clear", text: "Walkways, stairs and work areas clear of debris, cords, scrap and spills", rule: "1910.22(a)(1)-(3); 1926.25(a)" },
      { id: "hazards", text: "Holes, loose boards and damaged floors fixed, covered or guarded", rule: "1910.22(d)(2)" },
      { id: "exits", text: "Exit routes and doors unblocked and unlocked from the inside", rule: "1910.37(a)(3); 1910.36(d)(1)" },
      { id: "signs", text: "Exit signs lit and readable", rule: "1910.37(b)(2)" },
    ],
  },
  {
    id: "first-aid", version: 1, title: "First aid and emergency info", industries: ["all"], when: "monthly", talkId: "emerg",
    rule: "OSHA 1910.151(b); construction 1926.50(d), (f)",
    sources: [std("OSHA 1910.151: medical services and first aid", "1910", "1910.151")],
    items: [
      { id: "kit", text: "First aid kit stocked, clean and where people know to find it", rule: "1910.151(b); 1926.50(d)(2)" },
      { id: "person", text: "A trained first-aid person is on the job, or medical help is close enough to respond in time", rule: "1910.151(b)" },
      { id: "numbers", text: "Emergency numbers and the site address are posted", rule: "1926.50(f)" },
      { id: "flush", text: "Where corrosives are used: eyewash or drench station works and is unblocked", rule: "1910.151(c)" },
    ],
  },
  {
    id: "ladders", version: 1, title: "Ladders", industries: ["all"], when: "each_shift", talkId: "ladder",
    rule: "OSHA 1910.23(b)(9): before first use each shift; construction 1926.1053(b)(15)",
    sources: [std("OSHA 1910.23(b)(8)-(13): use and inspection of ladders", "1910", "1910.23"), std("OSHA 1926.1053(b)(15)-(16): inspection; defective ladders tagged out", "1926", "1926.1053")],
    items: [
      { id: "rails", text: "Rails and rungs or steps straight, not cracked, bent or broken", rule: "1910.23(b)(9); 1926.1053(b)(15)" },
      { id: "feet", text: "Feet, locks and spreaders work; no oil, grease or mud on the steps", rule: "1910.23(b)(9), (c)(2)" },
      { id: "tagged", text: "Any defective ladder tagged \"Do Not Use\" and taken out of service", rule: "1910.23(b)(10); 1926.1053(b)(16)" },
      { id: "setup", text: "Set on firm, level footing; extension ladders at 4-to-1 and 3 feet above the landing", rule: "1926.1053(b)(1), (b)(5)(i), (b)(6)" },
      { id: "metal", text: "No metal ladders near energized lines or equipment", rule: "1926.1053(b)(12); 1910.333(c)(7)" },
    ],
  },
  {
    id: "cords-tools", version: 1, title: "Cords and portable electric tools", industries: ["all"], when: "each_shift", talkId: "electrical-gfci",
    rule: "OSHA 1910.334(a)(2); construction 1926.404(b)(1), 1926.416(e)",
    sources: [std("OSHA 1910.334(a): handling and inspecting portable equipment and cords", "1910", "1910.334"), std("OSHA 1926.404(b)(1): GFCIs or an assured grounding program", "1926", "1926.404")],
    items: [
      { id: "visual", text: "Cords and plugs looked over before use: no cuts, crushed spots, missing ground pins or taped splices", rule: "1910.334(a)(2)(i); 1926.405(g)(2)(iii)" },
      { id: "removed", text: "Damaged cords and tools removed from service until repaired", rule: "1910.334(a)(2)(ii); 1926.416(e)" },
      { id: "gfci", text: "Outdoor and temporary power runs through a GFCI that trips when tested", rule: "1926.404(b)(1)(ii); 1910.304(b)(3)" },
      { id: "routing", text: "Cords out of walkways and doorways, not hung on nails or pinched", rule: "1926.416(b)(2); 1926.405(a)(2)(ii)(I)" },
    ],
  },
  {
    id: "chemicals", version: 1, title: "Chemical labels and safety data sheets", industries: ["all"], when: "monthly", talkId: "hazcom",
    rule: "OSHA 1910.1200(f), (g)(8); construction 1926.59",
    sources: [std("OSHA 1910.1200(f)-(g): labels and safety data sheets", "1910", "1910.1200")],
    items: [
      { id: "labels", text: "Every container labeled with what's in it and its hazards, labels readable", rule: "1910.1200(f)(1), (f)(6), (f)(8)" },
      { id: "sds", text: "A safety data sheet for each chemical, reachable by the crew during the shift", rule: "1910.1200(g)(8)" },
      { id: "new", text: "Anyone using a new chemical has been told its hazards", rule: "1910.1200(h)(1)" },
    ],
  },

  // Construction (every trade that uses construction gets these) ----------------------------------------------------
  {
    id: "scaffold", version: 1, title: "Scaffold", industries: ["con"], when: "each_shift", talkId: "scaffold",
    rule: "OSHA 1926.451(f)(3): a competent person inspects before each work shift",
    sources: [std("OSHA 1926.451: scaffold requirements, incl. (f)(3) inspection before each shift", "1926", "1926.451")],
    items: [
      { id: "footing", text: "Base plates and mud sills on firm footing; no blocks, bricks or buckets under legs", rule: "1926.451(c)(2)" },
      { id: "planking", text: "Platforms fully planked, planks not split or overloaded", rule: "1926.451(b)(1), (f)(1)" },
      { id: "guardrails", text: "Guardrails or fall protection above 10 feet", rule: "1926.451(g)(1)" },
      { id: "access", text: "Proper access (ladder or stair), not climbing crossbraces", rule: "1926.451(e)(1)" },
      { id: "damage", text: "No damaged parts; anything damaged is replaced or the scaffold is tagged out", rule: "1926.451(f)(4)" },
      { id: "weather", text: "Cleared of snow, ice and debris; no work in high winds or storms", rule: "1926.451(f)(8), (f)(12), (f)(13)" },
    ],
  },
  {
    id: "excavation", version: 1, title: "Trench or excavation", industries: ["con"], when: "daily", talkId: "trenching",
    rule: "OSHA 1926.651(k): a competent person inspects daily, before work and as needed",
    sources: [std("OSHA 1926.651: excavation requirements, incl. (k) inspections", "1926", "1926.651")],
    items: [
      { id: "protection", text: "Sloping, shoring or a shield in place for any trench 5 feet or deeper", rule: "1926.652(a)(1)" },
      { id: "spoil", text: "Spoil and materials at least 2 feet back from the edge", rule: "1926.651(j)(2)" },
      { id: "egress", text: "Ladder or ramp within 25 feet of workers in a trench 4 feet or deeper", rule: "1926.651(c)(2)" },
      { id: "water", text: "No standing water, or it's controlled", rule: "1926.651(h)(1)" },
      { id: "atmosphere", text: "Air tested where a bad atmosphere could exist, deeper than 4 feet", rule: "1926.651(g)(1)" },
      { id: "utilities", text: "Underground utilities located and marked before digging", rule: "1926.651(b)(1)-(3)" },
    ],
  },
  {
    id: "fall-arrest", version: 1, title: "Harness, lanyard and anchor", industries: ["con", "util"], when: "each_use", talkId: "harness",
    rule: "OSHA 1926.502(d)(21): inspected before each use",
    sources: [std("OSHA 1926.502(d): personal fall arrest systems", "1926", "1926.502")],
    items: [
      { id: "webbing", text: "Harness webbing and stitching: no cuts, burns, fraying or chemical damage", rule: "1926.502(d)(21)" },
      { id: "hardware", text: "D-rings, buckles and snaphooks not bent or cracked; snaphooks lock", rule: "1926.502(d)(5)-(6)" },
      { id: "lanyard", text: "Lanyard or lifeline undamaged; deceleration device not deployed", rule: "1926.502(d)(19)" },
      { id: "anchor", text: "Anchor rated for the job (5,000 pounds or designed by a qualified person)", rule: "1926.502(d)(15)" },
      { id: "removed", text: "Anything that caught a fall or is damaged is out of service", rule: "1926.502(d)(19), (d)(21)" },
      { id: "rescue", text: "A rescue plan is in place for someone hanging in a harness", rule: "1926.502(d)(20)" },
    ],
  },
  {
    id: "edges-holes", version: 1, title: "Edges, holes and covers", industries: ["con"], when: "daily", talkId: "skylights",
    rule: "OSHA 1926.501(b)(1), (b)(4); 1926.502(b), (i)",
    sources: [std("OSHA 1926.502(b), (i): guardrails and covers", "1926", "1926.502")],
    items: [
      { id: "edges", text: "Open sides 6 feet or more above a lower level have guardrails, nets or personal fall arrest", rule: "1926.501(b)(1)" },
      { id: "rails", text: "Guardrails 39-45 inches high with midrails, no banding used as a rail", rule: "1926.502(b)(1)-(2), (b)(9)" },
      { id: "covers", text: "Holes and skylights covered, secured and marked \"HOLE\" or \"COVER\"", rule: "1926.502(i)(2)-(4)" },
      { id: "objects", text: "Toeboards or screens where tools or material could fall on people below", rule: "1926.501(c); 1926.502(j)" },
    ],
  },
  {
    id: "vehicles-equipment", version: 1, title: "Vehicles and heavy equipment", industries: ["con"], when: "each_shift", talkId: "struck-vehicle",
    rule: "OSHA 1926.601(b)(14): checked at the beginning of each shift",
    sources: [std("OSHA 1926.601: motor vehicles", "1926", "1926.601"), std("OSHA 1926.602: material handling equipment", "1926", "1926.602")],
    items: [
      { id: "brakes", text: "Service, emergency and parking brakes work", rule: "1926.601(b)(14)" },
      { id: "steering", text: "Steering, tires, horn and lights work", rule: "1926.601(b)(14)" },
      { id: "alarm", text: "Reverse alarm works, or a spotter is used when the rear view is blocked", rule: "1926.601(b)(4); 1926.602(a)(9)(ii)" },
      { id: "seatbelts", text: "Seat belts present and used on equipment with rollover protection", rule: "1926.602(a)(2)" },
      { id: "parked", text: "Parked equipment: blades and buckets down, brake set, chocked on slopes", rule: "1926.600(a)(3)" },
    ],
  },
  {
    id: "rigging", version: 1, title: "Slings and rigging", industries: ["con"], when: "daily", talkId: "rigging",
    rule: "OSHA 1926.251(a)(6): slings inspected by a competent person each day before use",
    sources: [std("OSHA 1926.251: rigging equipment for material handling", "1926", "1926.251")],
    items: [
      { id: "tags", text: "Every sling has a readable rated-load tag", rule: "1926.251(a)(2)(ii)" },
      { id: "wire", text: "Wire rope: no kinks, crushing, bird-caging or broken wires past the limits", rule: "1926.251(c)(4)(iv)" },
      { id: "web", text: "Synthetic slings: no cuts, burns, melted spots or broken stitching", rule: "1926.251(e)(8)" },
      { id: "removed", text: "Damaged rigging removed from service", rule: "1926.251(a)(6)" },
    ],
  },
  {
    id: "aerial-lift", version: 1, title: "Aerial lift (boom or scissor)", industries: ["con"], when: "each_use", talkId: "aerial-lift",
    rule: "OSHA 1926.453(b)(2)(i): lift controls tested each day before use",
    sources: [std("OSHA 1926.453(b)(2): aerial lift operation", "1926", "1926.453")],
    items: [
      { id: "controls", text: "Upper and lower controls tested and working", rule: "1926.453(b)(2)(i)" },
      { id: "operator", text: "Only trained, authorized people operate it", rule: "1926.453(b)(2)(ii)" },
      { id: "tieoff", text: "Boom lifts: body harness and lanyard tied off to the basket", rule: "1926.453(b)(2)(v)" },
      { id: "floor", text: "Standing on the platform floor, not the rails or a ladder", rule: "1926.453(b)(2)(iv)" },
      { id: "brakes", text: "Brakes set and outriggers on pads or a firm surface", rule: "1926.453(b)(2)(vii)" },
    ],
  },
  {
    id: "hot-work-con", version: 1, title: "Hot work and torches", industries: ["con"], when: "each_use", talkId: "hot-work",
    rule: "OSHA 1926.352: fire prevention for welding, cutting and heating",
    sources: [std("OSHA 1926.352: fire prevention", "1926", "1926.352"), std("OSHA 1926.350: gas welding and cutting", "1926", "1926.350")],
    items: [
      { id: "combustibles", text: "Combustibles moved away or covered; sparks can't fall through cracks or openings", rule: "1926.352(a)-(b)" },
      { id: "extinguisher", text: "Fire extinguisher right there and ready", rule: "1926.352(d)" },
      { id: "watch", text: "Fire watch posted where needed, including the other side of walls and floors", rule: "1926.352(e)-(f)" },
      { id: "hoses", text: "Hoses and fittings inspected; no leaks, burns or worn spots", rule: "1926.350(f)(3)-(4)" },
      { id: "cylinders", text: "Cylinders upright, secured, capped when not in use, oxygen away from fuel gas", rule: "1926.350(a)(1), (a)(9)-(10)" },
    ],
  },
  {
    id: "silica-con", version: 1, title: "Silica dust controls", industries: ["con"], when: "each_use", talkId: "silica",
    rule: "OSHA 1926.1153(c)(1) Table 1",
    sources: [std("OSHA 1926.1153: respirable crystalline silica in construction", "1926", "1926.1153")],
    items: [
      { id: "water", text: "Saws and grinders on concrete, stone or tile use water or a vacuum shroud as Table 1 lists", rule: "1926.1153(c)(1)" },
      { id: "flow", text: "Water flow enough to keep dust down", rule: "1926.1153(c)(2)(ii)" },
      { id: "sweep", text: "No dry sweeping or compressed air to clean up dust", rule: "1926.1153(f)" },
      { id: "plan", text: "Written exposure control plan on hand", rule: "1926.1153(g)" },
    ],
  },

  // Roofing ---------------------------------------------------------------------------------------------------------
  {
    id: "roof-setup", version: 1, title: "Roof fall protection setup", industries: ["roof", "solar"], when: "daily", talkId: "roof-lowslope",
    rule: "OSHA 1926.501(b)(10)-(11), 1926.502(f), (h)",
    sources: [std("OSHA 1926.502(f), (h): warning lines and safety monitoring", "1926", "1926.502"), std("OSHA 1926.501(b)(10)-(11): low-slope and steep roofs", "1926", "1926.501")],
    items: [
      { id: "system", text: "Fall protection chosen for the roof: guardrails, nets or harnesses on steep roofs; warning line with monitoring on low-slope roofs", rule: "1926.501(b)(10)-(11)" },
      { id: "warning-line", text: "Warning line at least 6 feet from the edge, flagged every 6 feet, 34-39 inches high", rule: "1926.502(f)(1)-(2)" },
      { id: "monitor", text: "Safety monitor on the same roof, within sight and talking distance", rule: "1926.502(h)(1)" },
      { id: "decking", text: "Decking checked for rot or weak spots before walking it", rule: "1926.501(a)(2)" },
      { id: "material", text: "Material stored at least 6 feet from the edge, or secured", rule: "1926.502(j)(7)" },
    ],
  },
  {
    id: "roof-brackets", version: 1, title: "Roof brackets and jacks", industries: ["roof"], when: "each_shift", talkId: "roof-brackets",
    rule: "OSHA 1926.452(h); 1926.451(f)(3)",
    sources: [std("OSHA 1926.452(h): roof bracket scaffolds", "1926", "1926.452"), std("OSHA 1926.451(f)(3): inspection before each shift", "1926", "1926.451")],
    items: [
      { id: "fit", text: "Brackets fit the roof pitch and give a level platform", rule: "1926.452(h)(1)" },
      { id: "secured", text: "Brackets nailed or secured as the maker specifies, not just resting", rule: "1926.452(h)(2)" },
      { id: "planks", text: "Planks sound, fully across the brackets, not overloaded", rule: "1926.451(b)(1), (f)(1)" },
    ],
  },
  {
    id: "kettle-torch", version: 1, title: "Kettles, torches and propane", industries: ["roof"], when: "each_use", talkId: "hot-kettle",
    rule: "OSHA 1926.150(c)(1)(vi); 1926.153",
    sources: [std("OSHA 1926.153: liquefied petroleum gas", "1926", "1926.153"), std("OSHA 1926.150: fire protection", "1926", "1926.150")],
    items: [
      { id: "extinguisher", text: "10-B extinguisher within 50 feet of the kettle or torch; 20-B:C at propane storage", rule: "1926.150(c)(1)(vi); 1926.153(l)" },
      { id: "tanks", text: "Propane tanks upright, secured, outside buildings", rule: "1926.153(g), (j)" },
      { id: "smoking", text: "No smoking or open flame signs posted; no smoking near the kettle", rule: "1926.151(a)(3)" },
    ],
  },
  {
    id: "material-hoist", version: 1, title: "Material hoist or ladder lift", industries: ["roof"], when: "each_shift", talkId: "material-hoist",
    rule: "OSHA 1926.552(a)",
    sources: [std("OSHA 1926.552: material hoists", "1926", "1926.552")],
    items: [
      { id: "maker", text: "Set up and used as the maker specifies", rule: "1926.552(a)(1)" },
      { id: "load", text: "Rated load posted and not exceeded", rule: "1926.552(a)(2)" },
      { id: "rope", text: "Wire rope not worn or damaged", rule: "1926.552(a)(3)" },
      { id: "riders", text: "\"No Riders Allowed\" posted; nobody rides it", rule: "1926.552(b)(1)(ii)" },
    ],
  },

  // Electrical, plumbing and HVAC, solar --------------------------------------------------------------------------
  {
    id: "temp-power", version: 1, title: "Temporary power", industries: ["elec"], when: "daily", talkId: "temp-power",
    rule: "OSHA 1926.405(a)(2); 1926.404(b)(1)",
    sources: [std("OSHA 1926.405(a)(2): temporary wiring", "1926", "1926.405"), std("OSHA 1926.404(b)(1): ground-fault protection", "1926", "1926.404")],
    items: [
      { id: "gfci", text: "Every 120-volt temporary receptacle has GFCI protection, or the assured grounding program is followed", rule: "1926.404(b)(1)(i)-(iii)" },
      { id: "covers", text: "Boxes and panels have covers; no open knockouts", rule: "1926.405(b)(1)-(2)" },
      { id: "lamps", text: "Temporary lights guarded and not hung by their cords", rule: "1926.405(a)(2)(ii)(E), (F)" },
      { id: "removed", text: "Temporary wiring no longer needed is removed", rule: "1926.405(a)(2)(i)" },
    ],
  },
  {
    id: "lockout-elec", version: 1, title: "Lockout and test before touch", industries: ["elec", "solar", "util"], when: "each_use", talkId: "test-before-touch",
    rule: "OSHA 1910.333(b)(2); construction 1926.417",
    sources: [std("OSHA 1926.417: lockout and tagging of circuits", "1926", "1926.417"), std("OSHA 1910.334(c): test instruments", "1910", "1910.334")],
    items: [
      { id: "sources", text: "Every source of power identified and disconnected, including backfeed and solar", rule: "1910.333(b)(2)(ii)(B); 1926.417(b)" },
      { id: "locks", text: "Locks and tags on each disconnect, naming who and why", rule: "1926.417(a)-(c)" },
      { id: "tester", text: "Tester checked on a known live source before and after", rule: "1910.333(b)(2)(iv)(B); 1910.334(c)(2)" },
      { id: "verified", text: "Absence of voltage verified by a qualified person before touching", rule: "1910.333(b)(2)(iv)(B)" },
      { id: "meter", text: "Meter and leads rated for the voltage and not damaged", rule: "1910.334(c)(2)-(3)" },
    ],
  },
  {
    id: "torch-brazing", version: 1, title: "Torch, brazing and soldering", industries: ["plumb"], when: "each_use", talkId: "brazing",
    rule: "OSHA 1926.350; 1926.352",
    sources: [std("OSHA 1926.350: gas welding and cutting", "1926", "1926.350"), std("OSHA 1926.352: fire prevention", "1926", "1926.352")],
    items: [
      { id: "hoses", text: "Hoses and regulators inspected; no leaks or damage", rule: "1926.350(f)(3)-(4)" },
      { id: "cylinders", text: "Cylinders upright, secured and away from the flame", rule: "1926.350(a)(9), (b)(1)" },
      { id: "combustibles", text: "Wood, insulation and other combustibles shielded or moved; extinguisher at hand", rule: "1926.352(a)-(b), (d)" },
      { id: "lighter", text: "Friction lighter used, not a match or lighter", rule: "1926.350(g)(3)" },
      { id: "ventilation", text: "Ventilation in tight spaces", rule: "1926.353(b)(1)" },
    ],
  },
  {
    id: "confined-con", version: 1, title: "Confined space before entry", industries: ["plumb", "site"], when: "each_use", talkId: "confined-con",
    rule: "OSHA 1926.1203",
    sources: [std("OSHA 1926 Subpart AA: confined spaces in construction", "1926", "1926.1203")],
    items: [
      { id: "identified", text: "Space evaluated; permit spaces marked or people told", rule: "1926.1203(a)-(b)" },
      { id: "attendant", text: "Attendant outside for the whole entry", rule: "1926.1209(c)-(d)" },
      { id: "rescue", text: "Retrieval system or rescue ready before entry", rule: "1926.1211(c)" },
      { id: "exit", text: "Entrants know when to get out", rule: "1926.1208(e)" },
    ],
  },
  {
    id: "refrigerant", version: 1, title: "Refrigerant work", industries: ["plumb"], when: "each_use", talkId: "refrigerants",
    rule: "EPA 40 CFR 82.154, 82.161",
    sources: [{ label: "EPA 40 CFR 82 Subpart F: recycling and emissions reduction", url: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82/subpart-F", kind: "standard" }],
    items: [
      { id: "certified", text: "The technician holds the right Section 608 certification and has a copy", rule: "40 CFR 82.161(a)" },
      { id: "recovery", text: "Recovery equipment ready; no venting", rule: "40 CFR 82.154(a)" },
      { id: "cylinders", text: "Recovery cylinders in safe condition", rule: "OSHA 1910.101(a)" },
      { id: "sds", text: "Safety data sheet for the refrigerant on hand", rule: "OSHA 1910.1200(g)(8)" },
    ],
  },
  {
    id: "solar-roof", version: 1, title: "Solar roof work", industries: ["solar"], when: "daily", talkId: "solar-falls",
    rule: "OSHA 1926.501(b)(11); 1926.502(d)(15); 1926.250(a)(1)",
    sources: [std("OSHA 1926.502: fall protection systems", "1926", "1926.502"), std("OSHA 1926.250: storage", "1926", "1926.250")],
    items: [
      { id: "anchors", text: "Roof anchors installed per the maker and rated for fall arrest", rule: "1926.502(d)(15)" },
      { id: "panels", text: "Panels and racking stored on the roof secured against sliding or blowing off", rule: "1926.250(a)(1)" },
      { id: "openings", text: "Skylights and roof openings covered", rule: "1926.501(b)(4)" },
      { id: "strength", text: "Roof checked to hold the crew and panel loads", rule: "1926.501(a)(2)" },
    ],
  },

  // Demolition and site work -----------------------------------------------------------------------------------------
  {
    id: "demolition", version: 1, title: "Before demolition", industries: ["site"], when: "each_use", talkId: "demolition-survey",
    rule: "OSHA 1926.850",
    sources: [std("OSHA 1926.850: preparatory operations", "1926", "1926.850")],
    items: [
      { id: "survey", text: "Engineering survey done by a competent person, in writing", rule: "1926.850(a)" },
      { id: "utilities", text: "Electric, gas, water and sewer shut off, capped or controlled; utilities notified", rule: "1926.850(c)-(d)" },
      { id: "hazmat", text: "Hazardous materials (asbestos, lead, chemicals) tested and handled", rule: "1926.850(e)" },
      { id: "openings", text: "Floor and wall openings protected", rule: "1926.850(g), (i)" },
    ],
  },
  {
    id: "earthmoving", version: 1, title: "Earthmoving equipment", industries: ["site"], when: "each_shift", talkId: "equipment-rops",
    rule: "OSHA 1926.602(a); 1926.1000",
    sources: [std("OSHA 1926.602(a): earthmoving equipment", "1926", "1926.602"), std("OSHA 1926.1000: rollover protective structures", "1926", "1926.1000")],
    items: [
      { id: "rops", text: "Rollover protection in place and not altered", rule: "1926.1000(a)-(e)" },
      { id: "seatbelt", text: "Seat belt present and worn", rule: "1926.602(a)(2)(i)" },
      { id: "alarm", text: "Reverse alarm works, or a signal person is used", rule: "1926.602(a)(9)(ii)" },
      { id: "swing", text: "Swing radius barricaded on cranes and excavators where people could be struck", rule: "1926.1424(a)(2)" },
    ],
  },

  // Manufacturing, warehouse, retail ----------------------------------------------------------------------------------
  {
    id: "forklift", version: 1, title: "Forklift or pallet jack pre-shift", industries: ["mfg", "wh", "retail", "truck", "oil", "food"], when: "each_shift", talkId: "fork",
    rule: "OSHA 1910.178(q)(7): examined before being placed in service, at least daily",
    sources: [std("OSHA 1910.178: powered industrial trucks", "1910", "1910.178")],
    items: [
      { id: "brakes", text: "Brakes, steering and controls work", rule: "1910.178(q)(7)" },
      { id: "horn", text: "Horn and lights work", rule: "1910.178(q)(7)" },
      { id: "forks", text: "Forks, chains and mast not cracked, bent or worn", rule: "1910.178(q)(7)" },
      { id: "leaks", text: "No fluid leaks; tires in good shape", rule: "1910.178(q)(7)" },
      { id: "out", text: "A truck that fails is tagged out until repaired", rule: "1910.178(p)(1)" },
      { id: "operator", text: "Operator trained and evaluated in the last 3 years", rule: "1910.178(l)(4)(iii)" },
    ],
  },
  {
    id: "machine-guards", version: 1, title: "Machine guards", industries: ["mfg", "food"], when: "daily", talkId: "guard",
    rule: "OSHA 1910.212(a)",
    sources: [std("OSHA 1910.212: machine guarding, general requirements", "1910", "1910.212")],
    items: [
      { id: "in-place", text: "Guards on every point of operation, belt, pulley and rotating part", rule: "1910.212(a)(1), (a)(3)(ii)" },
      { id: "secure", text: "Guards attached and not bypassed or removed", rule: "1910.212(a)(2)" },
      { id: "jams", text: "Jams cleared only with the machine locked out", rule: "1910.147(a)(2)(ii)" },
    ],
  },
  {
    id: "crane-hoist", version: 1, title: "Overhead crane or hoist", industries: ["mfg"], when: "daily", talkId: "cranes-hoists",
    rule: "OSHA 1910.179(j)(2): daily inspection",
    sources: [std("OSHA 1910.179: overhead and gantry cranes", "1910", "1910.179"), std("OSHA 1910.184(d): daily sling inspection", "1910", "1910.184")],
    items: [
      { id: "mechanisms", text: "Controls and brakes work; limit switch stops the hook", rule: "1910.179(j)(2)(i); (n)(4)(i)" },
      { id: "hooks", text: "Hooks not cracked, bent or opened up; latches work", rule: "1910.179(j)(2)(iii)" },
      { id: "chain", text: "Hoist chains and ropes not worn, twisted or damaged", rule: "1910.179(j)(2)(iv)" },
      { id: "rated", text: "Rated load marked on each side", rule: "1910.179(b)(5)" },
      { id: "slings", text: "Slings checked today by a competent person", rule: "1910.184(d)" },
    ],
  },
  {
    id: "grinders", version: 1, title: "Bench grinders", industries: ["mfg", "auto"], when: "daily", talkId: "grinders",
    rule: "OSHA 1910.215",
    sources: [std("OSHA 1910.215: abrasive wheel machinery", "1910", "1910.215")],
    items: [
      { id: "guard", text: "Wheel guard in place", rule: "1910.215(a)(1)" },
      { id: "rest", text: "Work rest within 1/8 inch of the wheel", rule: "1910.215(a)(4)" },
      { id: "tongue", text: "Tongue guard within 1/4 inch of the wheel", rule: "1910.215(b)(9)" },
      { id: "wheel", text: "New wheels ring-tested and rated for the grinder's speed", rule: "1910.215(d)(1)-(2)" },
    ],
  },
  {
    id: "gas-cylinders", version: 1, title: "Compressed gas cylinders", industries: ["mfg", "wh", "auto"], when: "monthly", talkId: "gas-cylinders",
    rule: "OSHA 1910.101(a); 1910.253(b)",
    sources: [std("OSHA 1910.101: compressed gases", "1910", "1910.101")],
    items: [
      { id: "condition", text: "Cylinders looked over: no dents, corrosion or leaks", rule: "1910.101(a)" },
      { id: "stored", text: "Stored upright, secured, valves closed and caps on", rule: "1910.253(b)(2)" },
      { id: "separation", text: "Oxygen 20 feet from fuel gas, or a 5-foot fire wall between", rule: "1910.253(b)(4)(iii)" },
    ],
  },
  {
    id: "dock-trailer", version: 1, title: "Dock and trailer before loading", industries: ["wh", "truck", "retail", "food"], when: "each_use", talkId: "trailer-checks",
    rule: "OSHA 1910.178(m)(7); 1910.26",
    sources: [std("OSHA 1910.178(k), (m)(7): trucks and trailers", "1910", "1910.178"), std("OSHA 1910.26: dockboards", "1910", "1910.26")],
    items: [
      { id: "secured", text: "Trailer won't move: restraint engaged, or brakes set and wheels chocked", rule: "1910.178(m)(7); 1910.26(d)" },
      { id: "jacks", text: "Fixed jacks under an uncoupled trailer", rule: "1910.178(k)(3)" },
      { id: "floor", text: "Trailer floor checked for holes or weak boards", rule: "1910.178(m)(7)" },
      { id: "dockboard", text: "Dockboard secured and rated for the load", rule: "1910.26(a), (c)" },
    ],
  },
  {
    id: "storage", version: 1, title: "Racks and storage", industries: ["wh", "retail", "mfg"], when: "monthly", talkId: "racking",
    rule: "OSHA 1910.176",
    sources: [std("OSHA 1910.176: handling materials, general", "1910", "1910.176")],
    items: [
      { id: "stacked", text: "Material stacked, blocked and limited in height so it can't slide or fall", rule: "1910.176(b)" },
      { id: "aisles", text: "Aisles clear and wide enough where forklifts run, and marked", rule: "1910.176(a)" },
      { id: "housekeeping", text: "Storage areas free of trip and fire hazards", rule: "1910.176(c)" },
    ],
  },
  {
    id: "battery-charging", version: 1, title: "Battery charging area", industries: ["wh", "mfg"], when: "monthly", talkId: "battery-charging",
    rule: "OSHA 1910.178(g)",
    sources: [std("OSHA 1910.178(g): changing and charging storage batteries", "1910", "1910.178")],
    items: [
      { id: "flush", text: "Eyewash or flushing for spilled electrolyte", rule: "1910.178(g)(2)" },
      { id: "ventilation", text: "Ventilation working", rule: "1910.178(g)(2)" },
      { id: "smoking", text: "No smoking in the area", rule: "1910.178(g)(10)" },
    ],
  },

  // Trucking ----------------------------------------------------------------------------------------------------------
  {
    id: "pre-trip", version: 1, title: "Driver vehicle inspection", industries: ["truck"], when: "daily", talkId: "highway-driving",
    rule: "FMCSA 49 CFR 396.13 (before driving) and 396.11 (report)",
    sources: [ecfr49("FMCSA 49 CFR 396.11: driver vehicle inspection reports", "part-396/section-396.11"), ecfr49("FMCSA 49 CFR 396.13: driver inspection", "part-396/section-396.13")],
    items: [
      { id: "last-report", text: "Last inspection report reviewed and any repairs signed off", rule: "49 CFR 396.13(b)-(c)" },
      { id: "brakes", text: "Service brakes, trailer brake connections and parking brake", rule: "49 CFR 396.11(a)" },
      { id: "steering", text: "Steering mechanism", rule: "49 CFR 396.11(a)" },
      { id: "lights", text: "Lights and reflectors", rule: "49 CFR 396.11(a)" },
      { id: "tires", text: "Tires, wheels and rims", rule: "49 CFR 396.11(a)" },
      { id: "horn", text: "Horn, wipers and mirrors", rule: "49 CFR 396.11(a)" },
      { id: "coupling", text: "Coupling devices", rule: "49 CFR 396.11(a)" },
      { id: "emergency", text: "Emergency equipment", rule: "49 CFR 396.11(a)" },
    ],
  },
  {
    id: "cargo", version: 1, title: "Cargo securement", industries: ["truck", "land", "ag"], when: "each_use", talkId: "load-securement",
    rule: "FMCSA 49 CFR 392.9; 393.104",
    sources: [ecfr49("FMCSA 49 CFR 392.9: inspection of cargo", "part-392/subpart-A/section-392.9"), ecfr49("FMCSA 49 CFR 393.104: securement devices", "part-393/subpart-I/section-393.104")],
    items: [
      { id: "secured", text: "Cargo secured so it can't shift or fall", rule: "49 CFR 392.9(a); 393.100(b)" },
      { id: "devices", text: "Straps, chains and anchor points in good shape, no knots", rule: "49 CFR 393.104(b)-(c), (f)" },
      { id: "count", text: "Enough tiedowns for the load's length and weight", rule: "49 CFR 393.106(d); 393.110" },
      { id: "recheck", text: "Rechecked in the first 50 miles and at each stop as the rule requires", rule: "49 CFR 392.9(b)" },
    ],
  },
  {
    id: "fueling", version: 1, title: "Fueling area", industries: ["truck", "auto", "ag"], when: "monthly", talkId: "fueling",
    rule: "OSHA 1910.106(g)",
    sources: [std("OSHA 1910.106(g): service stations", "1910", "1910.106")],
    items: [
      { id: "shutoff", text: "Emergency shutoff marked and reachable", rule: "1910.106(g)(3)(iii)" },
      { id: "signs", text: "No smoking signs posted; engines off while fueling", rule: "1910.106(g)(8)" },
      { id: "extinguisher", text: "Extinguisher within 75 feet of the pumps", rule: "1910.106(g)(9)" },
      { id: "spills", text: "Spill supplies on hand", rule: "1910.106(g)(7)" },
    ],
  },

  // Agriculture ----------------------------------------------------------------------------------------------------
  {
    id: "tractor", version: 1, title: "Tractor", industries: ["ag"], when: "daily", talkId: "tractor-rops",
    rule: "OSHA 1928.51",
    sources: [std("OSHA 1928.51: rollover protective structures for tractors", "1928", "1928.51")],
    items: [
      { id: "rops", text: "Rollover protection in place on tractors built after Oct. 25, 1976", rule: "1928.51(b)(1)" },
      { id: "seatbelt", text: "Seat belt present and worn with rollover protection", rule: "1928.51(b)(2)" },
      { id: "instructions", text: "Operator has had the operating instructions this year", rule: "1928.51(d)" },
    ],
  },
  {
    id: "pto-guards", version: 1, title: "PTO and field equipment guards", industries: ["ag"], when: "daily", talkId: "pto",
    rule: "OSHA 1928.57",
    sources: [std("OSHA 1928.57: guarding of farm field equipment, farmstead equipment and cotton gins", "1928", "1928.57")],
    items: [
      { id: "pto", text: "PTO shaft and tractor master shield in place", rule: "1928.57(b)(1)" },
      { id: "parts", text: "Belts, chains, gears and augers guarded", rule: "1928.57(b)(2), (c)(3)" },
      { id: "shutdown", text: "Crew knows: engine off and moving parts stopped before unclogging", rule: "1928.57(a)(6)(iii)" },
    ],
  },
  {
    id: "grain-bin", version: 1, title: "Grain bin entry", industries: ["ag"], when: "each_use", talkId: "grain-bins",
    rule: "OSHA 1910.272(g)",
    sources: [std("OSHA 1910.272: grain handling facilities", "1910", "1910.272")],
    items: [
      { id: "lockout", text: "Augers and equipment locked out", rule: "1910.272(g)(1)(ii)" },
      { id: "air", text: "Air tested for oxygen and toxic gases", rule: "1910.272(g)(1)(iii)" },
      { id: "harness", text: "Harness and lifeline on the entrant", rule: "1910.272(g)(2)" },
      { id: "observer", text: "Observer outside with rescue equipment", rule: "1910.272(g)(3)-(4)" },
      { id: "walking", text: "No walking down grain", rule: "1910.272(g)(1)(iv)" },
    ],
  },
  {
    id: "field-sanitation", version: 1, title: "Field water, toilets and handwashing", industries: ["ag"], when: "daily", talkId: "field-sanitation",
    rule: "OSHA 1928.110(c)",
    sources: [std("OSHA 1928.110: field sanitation", "1928", "1928.110")],
    items: [
      { id: "water", text: "Cool drinking water and single-use cups", rule: "1928.110(c)(1)" },
      { id: "toilets", text: "Toilets and handwashing within a quarter-mile walk", rule: "1928.110(c)(2)(iii)" },
      { id: "clean", text: "Facilities clean and supplied", rule: "1928.110(c)(3)" },
    ],
  },
  {
    id: "pesticide-decon", version: 1, title: "Pesticide decontamination supplies", industries: ["ag", "land"], when: "daily", talkId: "pesticides",
    rule: "EPA 40 CFR 170.411",
    sources: [{ label: "EPA 40 CFR 170: Worker Protection Standard", url: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170", kind: "standard" }],
    items: [
      { id: "water", text: "Water, soap and single-use towels for workers", rule: "40 CFR 170.411(a)-(b)" },
      { id: "location", text: "Supplies within a quarter mile of where workers are", rule: "40 CFR 170.411" },
      { id: "signs", text: "Treated areas posted and entry restrictions followed", rule: "40 CFR 170.407(a); 170.409" },
    ],
  },

  // Landscaping and tree care ----------------------------------------------------------------------------------------
  {
    id: "mowers-trimmers", version: 1, title: "Mowers and trimmers", industries: ["land"], when: "daily", talkId: "mowers",
    rule: "OSHA 1910.243(e); 1910.242(a)",
    sources: [std("OSHA 1910.243: guarding of portable powered tools", "1910", "1910.243"), std("OSHA 1910.242: hand and portable powered tools", "1910", "1910.242")],
    items: [
      { id: "shutoff", text: "Mower blade shutoff works and needs a deliberate restart", rule: "1910.243(e)(1)(iii)" },
      { id: "guards", text: "Discharge chutes and guards in place", rule: "1910.242(a)" },
      { id: "eyes", text: "Eye protection with side shields for operators", rule: "1910.133(a)(2)" },
    ],
  },
  {
    id: "bucket-truck", version: 1, title: "Bucket truck", industries: ["land", "util", "facil"], when: "each_use", talkId: "aerial-lifts-gi",
    rule: "OSHA 1910.67(c)(2)(i): lift controls tested each day before use",
    sources: [std("OSHA 1910.67: vehicle-mounted elevating and rotating work platforms", "1910", "1910.67")],
    items: [
      { id: "controls", text: "Upper and lower controls tested", rule: "1910.67(c)(2)(i)" },
      { id: "operator", text: "Only trained people operate it", rule: "1910.67(c)(2)(ii)" },
      { id: "tieoff", text: "Harness and lanyard tied off to the boom or basket", rule: "1910.67(c)(2)(v)" },
      { id: "outriggers", text: "Brakes set, outriggers on pads, wheels chocked on slopes", rule: "1910.67(c)(2)(vii)-(viii)" },
      { id: "lines", text: "Clearance from overhead lines kept", rule: "1910.67(b)(4); 1910.333(c)(3)" },
    ],
  },
  {
    id: "chipper", version: 1, title: "Wood chipper", industries: ["land"], when: "daily", talkId: "chipper",
    rule: "OSHA 1910.147; 1910.212",
    sources: [std("OSHA 1910.147: control of hazardous energy", "1910", "1910.147"), std("OSHA 1910.212: machine guarding", "1910", "1910.212")],
    items: [
      { id: "guards", text: "Infeed hood, guards and stop bar in place and working", rule: "1910.212(a)(1)" },
      { id: "lockout", text: "Engine off, key out and moving parts stopped before clearing jams or servicing", rule: "1910.147(d)(2)-(6)" },
      { id: "ppe", text: "Eye, ear and face protection; no loose clothing", rule: "1910.132(a)" },
    ],
  },

  // Oil and gas -------------------------------------------------------------------------------------------------------
  {
    id: "well-site-lifting", version: 1, title: "Cranes and slings on the well site", industries: ["oil"], when: "daily", talkId: "oil-cranes",
    rule: "OSHA 1910.180; 1910.184(d)",
    sources: [std("OSHA 1910.180: crawler, locomotive and truck cranes", "1910", "1910.180"), std("OSHA 1910.184: slings", "1910", "1910.184")],
    items: [
      { id: "chart", text: "Load chart in the cab; loads within it", rule: "1910.180(c)(2); (h)(1)(i)" },
      { id: "operator", text: "Only designated operators", rule: "1910.180(b)(3)" },
      { id: "slings", text: "Slings inspected today by a competent person", rule: "1910.184(d)" },
      { id: "lines", text: "Power lines checked and clearance kept", rule: "1910.180(j)" },
    ],
  },
  {
    id: "transfer-bonding", version: 1, title: "Flammable transfer and bonding", industries: ["oil"], when: "each_use", talkId: "tank-truck-loading",
    rule: "OSHA 1910.106(e)(6), (f)(3)",
    sources: [std("OSHA 1910.106: flammable liquids", "1910", "1910.106")],
    items: [
      { id: "bonding", text: "Bonding and grounding connected before transfer", rule: "1910.106(e)(6)(ii); (f)(3)(iv)" },
      { id: "ignition", text: "No ignition sources nearby", rule: "1910.106(b)(6); (e)(6)(i)" },
      { id: "valves", text: "Self-closing valves held open only by hand", rule: "1910.106(f)(3)(iii)" },
      { id: "spills", text: "Spill cleanup on hand", rule: "1910.106(e)(9)(i)" },
    ],
  },
  {
    id: "rig-floor", version: 1, title: "Rig floor and derrick", industries: ["oil"], when: "each_shift", talkId: "rig-floor-falls",
    rule: "OSHA 1910.28(b)(1), (c)",
    sources: [std("OSHA 1910.28: duty to have fall protection and falling object protection", "1910", "1910.28")],
    items: [
      { id: "edges", text: "Fall protection at 4 feet or more", rule: "1910.28(b)(1)(i)" },
      { id: "objects", text: "Tools tethered or toeboards where things could fall on people below", rule: "1910.28(c)" },
      { id: "hardhats", text: "Hard hats on everyone below overhead work", rule: "1910.28(c)" },
    ],
  },

  // Utilities and telecom ----------------------------------------------------------------------------------------------
  {
    id: "climbing-gear", version: 1, title: "Climbing and work-positioning gear", industries: ["util"], when: "each_use", talkId: "pole-climbing",
    rule: "OSHA 1910.269(g)(2)(iv)(A); construction 1926.954(b)(3)(i)",
    sources: [std("OSHA 1910.269(g): personal protective equipment, incl. fall protection", "1910", "1910.269")],
    items: [
      { id: "inspected", text: "Work-positioning and fall arrest gear inspected before use; defects removed from service", rule: "1910.269(g)(2)(iv)(A)" },
      { id: "pole", text: "Pole or structure checked to hold the climber before climbing", rule: "1910.269(q)(1)(i)" },
      { id: "snaphooks", text: "Snaphooks locking type, attached properly", rule: "1910.269(g)(2)(iv)(F)" },
    ],
  },
  {
    id: "rubber-goods", version: 1, title: "Rubber gloves and insulating equipment", industries: ["util", "elec"], when: "daily", talkId: "min-approach",
    rule: "OSHA 1910.137(c)(2)(ii): inspected before each day's use",
    sources: [std("OSHA 1910.137: electrical protective equipment", "1910", "1910.137")],
    items: [
      { id: "inspected", text: "Gloves, sleeves and blankets inspected for damage before today's use (gloves air-tested)", rule: "1910.137(c)(2)(ii)" },
      { id: "defects", text: "Nothing with a hole, tear, cut, ozone cutting or embedded object is used", rule: "1910.137(c)(2)(iii)" },
      { id: "tested", text: "Electrical test date current", rule: "1910.137(c)(2)(viii)" },
    ],
  },
  {
    id: "enclosed-space-util", version: 1, title: "Manhole or vault entry", industries: ["util"], when: "each_use", talkId: "manholes",
    rule: "OSHA 1910.269(e); telecom 1910.268(o)",
    sources: [std("OSHA 1910.269(e): enclosed spaces", "1910", "1910.269")],
    items: [
      { id: "guard", text: "Opening guarded before the cover comes off", rule: "1910.269(e); 1910.268(o)(1)" },
      { id: "air", text: "Air tested with a calibrated meter before entry", rule: "1910.269(e); 1910.268(o)(2)" },
      { id: "vent", text: "Ventilation running where needed", rule: "1910.269(e); 1910.268(o)(2)" },
      { id: "attendant", text: "Attendant at the opening; rescue equipment ready", rule: "1910.269(e)" },
    ],
  },

  // Healthcare ----------------------------------------------------------------------------------------------------
  {
    id: "sharps", version: 1, title: "Sharps containers", industries: ["health", "facil"], when: "daily", talkId: "sharps",
    rule: "OSHA 1910.1030(d)(4)(iii)(A)",
    sources: [std("OSHA 1910.1030: bloodborne pathogens", "1910", "1910.1030")],
    items: [
      { id: "close", text: "Containers close to where sharps are used, upright", rule: "1910.1030(d)(4)(iii)(A)(2)" },
      { id: "not-full", text: "Replaced before overfilling", rule: "1910.1030(d)(4)(iii)(A)(2)(iii)" },
      { id: "closable", text: "Puncture-resistant, leakproof, labeled, closable", rule: "1910.1030(d)(4)(iii)(A)(1)" },
    ],
  },
  {
    id: "bbp-ppe", version: 1, title: "Infection-control PPE stock", industries: ["health"], when: "daily", talkId: "ppe-donning",
    rule: "OSHA 1910.1030(d)(3)",
    sources: [std("OSHA 1910.1030(d)(3): personal protective equipment", "1910", "1910.1030")],
    items: [
      { id: "stocked", text: "Gloves, gowns, masks and eye protection stocked in the right sizes", rule: "1910.1030(d)(3)(iii)" },
      { id: "allergy", text: "Hypoallergenic or powderless gloves available for anyone allergic", rule: "1910.1030(d)(3)(iii)" },
      { id: "handwash", text: "Handwashing or hand sanitizer available", rule: "1910.1030(d)(2)(iii)-(iv)" },
    ],
  },

  // Restaurants and food service -----------------------------------------------------------------------------------------
  {
    id: "kitchen", version: 1, title: "Kitchen safety walk", industries: ["food"], when: "daily", talkId: "kitchen-burns",
    rule: "OSHA 1910.22(a); 1910.212(a); 1910.138(a)",
    sources: [std("OSHA 1910.22: walking-working surfaces", "1910", "1910.22"), std("OSHA 1910.212: machine guarding", "1910", "1910.212")],
    items: [
      { id: "floors", text: "Floors dry or mats down; spills cleaned right away", rule: "1910.22(a)(2)-(3)" },
      { id: "slicer", text: "Slicer and mixer guards in place", rule: "1910.212(a)(1), (a)(3)(ii)" },
      { id: "gloves", text: "Cut-resistant and heat-resistant gloves available", rule: "1910.138(a)" },
      { id: "walk-in", text: "Walk-in floor free of ice and spills", rule: "1910.22(a)(3)" },
    ],
  },

  // Hotels, janitorial and facilities ----------------------------------------------------------------------------------
  {
    id: "rope-descent", version: 1, title: "Rope descent before use", industries: ["facil"], when: "each_use", talkId: "rope-descent",
    rule: "OSHA 1910.27(b)",
    sources: [std("OSHA 1910.27(b): rope descent systems", "1910", "1910.27")],
    items: [
      { id: "anchors", text: "Building owner's written word that anchorages were tested, certified and maintained", rule: "1910.27(b)(1)(i)-(ii)" },
      { id: "inspected", text: "Rope descent system inspected at the start of the shift", rule: "1910.27(b)(2)" },
      { id: "lifeline", text: "Separate, independently anchored fall arrest lifeline", rule: "1910.27(b)(2)" },
      { id: "weather", text: "No use in storms or gusty, strong winds", rule: "1910.27(b)(2)" },
    ],
  },
  {
    id: "pool-chem", version: 1, title: "Pool and spa chemical room", industries: ["facil"], when: "monthly", talkId: "pool-chemicals",
    rule: "OSHA 1910.1200(g)(8); 1910.151(c)",
    sources: [std("OSHA 1910.1200: hazard communication", "1910", "1910.1200"), std("OSHA 1910.151(c): quick drenching or flushing", "1910", "1910.151")],
    items: [
      { id: "sds", text: "Safety data sheets for every pool chemical", rule: "1910.1200(g)(8)" },
      { id: "eyewash", text: "Eyewash or drench station works", rule: "1910.151(c)" },
      { id: "ppe", text: "Goggles, gloves and aprons stocked", rule: "1910.132(a)" },
    ],
  },
  {
    id: "roof-edge-gi", version: 1, title: "Roof access for maintenance", industries: ["facil", "mfg", "wh"], when: "each_use", talkId: "roof-edges-gi",
    rule: "OSHA 1910.28(b)(13)",
    sources: [std("OSHA 1910.28(b)(13): work on low-slope roofs", "1910", "1910.28")],
    items: [
      { id: "distance", text: "Within 6 feet of the edge: guardrails, nets or personal fall arrest. From 6 to 15 feet: those, or a designated area for infrequent, temporary work", rule: "1910.28(b)(13)(i)-(ii)" },
      { id: "skylights", text: "Skylights and holes covered or guarded", rule: "1910.28(b)(3)(i)" },
      { id: "rails", text: "Guardrails, where used, 39-45 inches high and strong", rule: "1910.29(b)(1), (b)(3)" },
    ],
  },

  // Auto repair and fleet -----------------------------------------------------------------------------------------------
  {
    id: "jacks", version: 1, title: "Jacks and stands", industries: ["auto", "truck"], when: "monthly", talkId: "jacks-stands",
    rule: "OSHA 1910.244(a)",
    sources: [std("OSHA 1910.244(a): jacks", "1910", "1910.244")],
    items: [
      { id: "rating", text: "Rated capacity marked and not exceeded", rule: "1910.244(a)(1)" },
      { id: "inspected", text: "Jacks inspected on schedule; any out of order tagged and taken out of service", rule: "1910.244(a)(2)(vi), (viii)" },
      { id: "blocked", text: "Raised loads supported on stands, not just the jack", rule: "1910.244(a)(2)(iii)" },
    ],
  },
  {
    id: "tire-cage", version: 1, title: "Tire and rim servicing", industries: ["auto", "truck"], when: "daily", talkId: "tire-rims",
    rule: "OSHA 1910.177(d)",
    sources: [std("OSHA 1910.177: servicing multi-piece and single piece rim wheels", "1910", "1910.177")],
    items: [
      { id: "cage", text: "Restraining device (cage) in good shape, no cracks or bent parts", rule: "1910.177(d)(3)" },
      { id: "chuck", text: "Air line has a clip-on chuck, an in-line valve and gauge, and enough hose to stand clear", rule: "1910.177(d)(4)" },
      { id: "charts", text: "Rim manual or charts posted", rule: "1910.177(d)(5)" },
    ],
  },
  {
    id: "spray-booth", version: 1, title: "Spray booth", industries: ["auto"], when: "daily", talkId: "spray-booths",
    rule: "OSHA 1910.107",
    sources: [std("OSHA 1910.107: spray finishing using flammable and combustible materials", "1910", "1910.107")],
    items: [
      { id: "ignition", text: "No open flames, sparks or hot surfaces in the spraying area", rule: "1910.107(c)(2)-(3)" },
      { id: "fans", text: "Ventilation running while spraying and after", rule: "1910.107(d)(2)" },
      { id: "supply", text: "No more than a day's supply of paint in the booth area", rule: "1910.107(e)(2)" },
      { id: "waste", text: "Rags in metal waste cans; No Smoking signs posted", rule: "1910.107(g)(3), (g)(7)" },
    ],
  },
  {
    id: "compressed-air", version: 1, title: "Compressed air for cleaning", industries: ["auto", "mfg"], when: "monthly", talkId: "compressed-air",
    rule: "OSHA 1910.242(b)",
    sources: [std("OSHA 1910.242(b): compressed air used for cleaning", "1910", "1910.242")],
    items: [
      { id: "pressure", text: "Air guns used for cleaning limited to under 30 psi (or have a safety tip)", rule: "1910.242(b)" },
      { id: "eyes", text: "Eye protection worn when blowing off", rule: "1910.242(b); 1910.133(a)(1)" },
      { id: "people", text: "Never pointed at a person or used on clothing", rule: "1910.242(b)" },
    ],
  },
];
