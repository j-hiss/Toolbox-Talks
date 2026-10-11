// Written safety program templates. Content is data: a new program or a wording change is an entry here (a wording
// change bumps `version`; programs already saved keep the edition they were written on, and the screen offers the
// new one). Every section is one element the rule lists, with its paragraph. The `ask` lines restate the rule in
// plain words without adding to it; the rule text was read 2026-10-11 (docs/claims-and-evidence.md, "Written
// programs"). The app never writes a company's answers and never says a program meets a rule.
import type { ProgramTemplate } from "@/core/programs";

const osha = (part: string, section: string) => `https://www.osha.gov/laws-regs/regulations/standardnumber/${part}/${section}`;
const std = (label: string, part: string, section: string) => ({ label, url: osha(part, section), kind: "standard" as const });

const GENERAL: ProgramTemplate["industries"] = ["mfg", "wh", "truck", "ag", "land", "oil", "util", "health", "retail", "food", "facil", "auto"];

export const PROGRAMS: ProgramTemplate[] = [
  {
    id: "hazcom", version: 1, title: "Hazard communication program", industries: ["all"],
    rule: "OSHA 1910.1200(e); construction 1926.59 (identical)",
    appliesIf: "Any workplace where employees may be exposed to hazardous chemicals under normal use or in a foreseeable emergency (1910.1200(b)(2)).",
    keep: "Available on request to employees, their representatives and OSHA (1910.1200(e)(4)). Crews that move between jobsites may keep it at the main office (e)(5).",
    review: null,
    sources: [std("OSHA 1910.1200(e): written hazard communication program", "1910", "1910.1200"), std("OSHA 1926.59: construction (same as 1910.1200)", "1926", "1926.59")],
    sections: [
      { id: "labels", heading: "Labels and other warnings", rule: "1910.1200(e)(1), (f)", ask: "How you make sure every container is labeled, and how labels are kept readable and replaced.", example: "Example: the shop lead checks labels when product arrives; secondary containers get a printed label from the safety data sheet." },
      { id: "sds", heading: "Safety data sheets", rule: "1910.1200(e)(1), (g)", ask: "How you get a safety data sheet for every chemical and how employees reach them during their shift.", example: "Example: a binder in each truck and the office; new products aren't used until the sheet is in." },
      { id: "training", heading: "Employee information and training", rule: "1910.1200(e)(1), (h)", ask: "How and when employees are trained on the chemicals in their work area, including when a new hazard comes in." },
      { id: "chemicals", heading: "List of hazardous chemicals", rule: "1910.1200(e)(1)(i)", ask: "The hazardous chemicals known to be present, by the product name on each safety data sheet. One list for the company or one per work area." },
      { id: "nonroutine", heading: "Non-routine tasks and unlabeled pipes", rule: "1910.1200(e)(1)(ii)", ask: "How you tell employees the hazards of non-routine tasks, and of chemicals in unlabeled pipes in their work areas." },
      { id: "others-sds", heading: "Other employers on site: safety data sheets", rule: "1910.1200(e)(2)(i)", optional: true, ask: "If other employers' workers could be exposed to your chemicals (for example, subcontractors on your site): how they get access to your safety data sheets." },
      { id: "others-precautions", heading: "Other employers on site: precautions", rule: "1910.1200(e)(2)(ii)", optional: true, ask: "How you tell other employers on site the precautions their workers need, in normal work and in a foreseeable emergency." },
      { id: "others-labels", heading: "Other employers on site: labeling system", rule: "1910.1200(e)(2)(iii)", optional: true, ask: "How you tell other employers on site about the labeling system you use." },
    ],
  },
  {
    id: "eap", version: 1, title: "Emergency action plan", industries: ["all"],
    rule: "OSHA 1910.38; construction 1926.35",
    appliesIf: "Required when an OSHA standard calls for one. It must be in writing, except a company with 10 or fewer employees may tell employees the plan out loud (1910.38(b); 1926.35(e)(3)).",
    keep: "Kept in the workplace and available to employees for review (1910.38(b); 1926.35(e)(3)). Reviewed with each employee when it's made or they start, when their duties under it change, and when the plan changes (1910.38(f); 1926.35(e)(2)).",
    review: null,
    sources: [std("OSHA 1910.38: emergency action plans", "1910", "1910.38"), std("OSHA 1926.35: construction emergency action plans", "1926", "1926.35")],
    sections: [
      { id: "report", heading: "Reporting a fire or other emergency", rule: "1910.38(c)(1); 1926.35(b)(5)", ask: "How employees report a fire or other emergency.", example: "Example: call 911 first, then the site lead; give the jobsite address posted in the truck." },
      { id: "evacuate", heading: "Evacuation: type and exit routes", rule: "1910.38(c)(2); 1926.35(b)(1), (d)", ask: "The types of evacuation to be used, the escape procedures, and who is assigned which exit route." },
      { id: "critical", heading: "People who stay to run critical operations", rule: "1910.38(c)(3); 1926.35(b)(2)", optional: true, ask: "If anyone stays to shut down or run critical operations before they leave: who, and what they do." },
      { id: "account", heading: "Accounting for everyone", rule: "1910.38(c)(4); 1926.35(b)(3)", ask: "How you account for every employee after an evacuation.", example: "Example: meet at the front gate; the crew lead checks names against today's sign-in." },
      { id: "rescue", heading: "Rescue and medical duties", rule: "1910.38(c)(5); 1926.35(b)(4)", optional: true, ask: "If employees have rescue or medical duties: who, and what they do." },
      { id: "contacts", heading: "Who to ask about the plan", rule: "1910.38(c)(6); 1926.35(b)(6)", ask: "The name or job title of each person employees can contact for more about the plan or their duties under it." },
      { id: "alarm", heading: "Alarm system", rule: "1910.38(d); 1926.35(c)", ask: "The employee alarm system and its signal for each purpose." },
      { id: "helpers", heading: "Evacuation helpers", rule: "1910.38(e); 1926.35(e)(1)", ask: "Who is designated and trained to help others evacuate safely." },
    ],
  },
  {
    id: "fire-prevention", version: 1, title: "Fire prevention plan", industries: GENERAL,
    rule: "OSHA 1910.39",
    appliesIf: "Required when an OSHA standard in part 1910 calls for one. In writing, except a company with 10 or fewer employees may tell employees the plan out loud (1910.39(a)-(b)).",
    keep: "Kept in the workplace and available to employees for review (1910.39(b)). Employees are told the fire hazards of their job when they start, and the parts of the plan they need to protect themselves are reviewed with them (1910.39(d)).",
    review: null,
    sources: [std("OSHA 1910.39: fire prevention plans", "1910", "1910.39")],
    sections: [
      { id: "hazards", heading: "Major fire hazards and how they're controlled", rule: "1910.39(c)(1)", ask: "Each major fire hazard, how hazardous materials are handled and stored, possible ignition sources and how they're controlled, and the fire protection equipment for each major hazard." },
      { id: "waste", heading: "Flammable and combustible waste", rule: "1910.39(c)(2)", ask: "How you keep flammable and combustible waste from building up." },
      { id: "heat-equipment", heading: "Heat-producing equipment", rule: "1910.39(c)(3)", ask: "How the safeguards on heat-producing equipment are maintained so they don't ignite combustible materials." },
      { id: "ignition-owner", heading: "Who maintains ignition and fire control equipment", rule: "1910.39(c)(4)", ask: "The name or job title of the people who maintain equipment that prevents or controls ignition sources or fires." },
      { id: "fuel-owner", heading: "Who controls fuel source hazards", rule: "1910.39(c)(5)", ask: "The name or job title of the people responsible for controlling fuel source hazards." },
    ],
  },
  {
    id: "bbp", version: 1, title: "Bloodborne pathogens exposure control plan", industries: ["health", "facil"],
    rule: "OSHA 1910.1030(c)",
    appliesIf: "Any employer with an employee who has occupational exposure to blood or other potentially infectious materials (1910.1030(c)(1)(i)).",
    keep: "A copy accessible to employees, and available to OSHA on request (1910.1030(c)(1)(iii), (vi)).",
    review: { months: 12, cite: "1910.1030(c)(1)(iv)", what: "Reviewed and updated at least once a year, and when tasks or positions with exposure change. Each review reflects new technology that reduces exposure and documents the safer medical devices considered and used." },
    sources: [std("OSHA 1910.1030: bloodborne pathogens", "1910", "1910.1030")],
    sections: [
      { id: "jobs-all", heading: "Job titles where everyone has exposure", rule: "1910.1030(c)(2)(i)(A)", ask: "Every job title in which all employees have occupational exposure. Decide this without counting personal protective equipment ((c)(2)(ii))." },
      { id: "jobs-some", heading: "Job titles where some have exposure", rule: "1910.1030(c)(2)(i)(B)", ask: "Job titles in which some employees have occupational exposure." },
      { id: "tasks", heading: "Tasks with exposure", rule: "1910.1030(c)(2)(i)(C)", ask: "The tasks and procedures where exposure happens, done by people in the job titles above where only some are exposed." },
      { id: "schedule", heading: "How and when each part is put in place", rule: "1910.1030(c)(1)(ii)(B)", ask: "The schedule and method for: controls and work practices (d), research labs if any (e), hepatitis B vaccination and post-exposure follow-up (f), hazard communication to employees (g), and recordkeeping (h)." },
      { id: "incidents", heading: "Evaluating exposure incidents", rule: "1910.1030(c)(1)(ii)(C)", ask: "How you evaluate the circumstances of an exposure incident." },
      { id: "devices", heading: "Safer medical devices considered this year", rule: "1910.1030(c)(1)(iv)(B)", ask: "The commercially available safer medical devices you considered and the ones you put in use, this year." },
      { id: "input", heading: "Input from frontline employees", rule: "1910.1030(c)(1)(v)", optional: true, ask: "If you have non-managerial employees in direct patient care who could be hurt by contaminated sharps: how you asked for their input on choosing controls, and what they said." },
    ],
  },
  {
    id: "silica-con", version: 1, title: "Silica exposure control plan (construction)", industries: ["con"],
    rule: "OSHA 1926.1153(g)",
    appliesIf: "Construction work with exposure to respirable crystalline silica, unless exposure will stay below 25 µg/m³ as an 8-hour average under any foreseeable conditions (1926.1153(a)).",
    keep: "Readily available on request to each covered employee, their representatives and OSHA (1926.1153(g)(3)).",
    review: { months: 12, cite: "1926.1153(g)(2)", what: "The plan's effectiveness is reviewed and evaluated at least once a year and updated as needed." },
    sources: [std("OSHA 1926.1153: respirable crystalline silica in construction", "1926", "1926.1153")],
    sections: [
      { id: "tasks", heading: "Tasks with silica exposure", rule: "1926.1153(g)(1)(i)", ask: "The tasks in your work that involve exposure to respirable crystalline silica.", example: "Example: cutting concrete tile with a handheld saw; drilling into masonry for anchors." },
      { id: "controls", heading: "Controls for each task", rule: "1926.1153(g)(1)(ii)", ask: "For each task: the engineering controls, work practices and respiratory protection used to limit exposure." },
      { id: "housekeeping", heading: "Housekeeping", rule: "1926.1153(g)(1)(iii)", ask: "The housekeeping measures used to limit exposure." },
      { id: "access", heading: "Restricting access", rule: "1926.1153(g)(1)(iv)", ask: "How you restrict access to work areas when needed, to keep down how many people are exposed and how much, including exposure from other employers or sole proprietors." },
      { id: "competent", heading: "Competent person", rule: "1926.1153(g)(4)", ask: "Who is designated to make frequent and regular inspections of job sites, materials and equipment to carry out this plan. They must be able to spot silica hazards and be authorized to fix them promptly." },
    ],
  },
  {
    id: "silica-gi", version: 1, title: "Silica exposure control plan (general industry)", industries: ["mfg", "oil"],
    rule: "OSHA 1910.1053(f)(2)",
    appliesIf: "General industry exposure to respirable crystalline silica, unless objective data show it will stay below 25 µg/m³ as an 8-hour average under any foreseeable conditions (1910.1053(a)).",
    keep: "Readily available on request to each covered employee, their representatives and OSHA (1910.1053(f)(2)(iii)).",
    review: { months: 12, cite: "1910.1053(f)(2)(ii)", what: "The plan's effectiveness is reviewed and evaluated at least once a year and updated as needed." },
    sources: [std("OSHA 1910.1053: respirable crystalline silica", "1910", "1910.1053")],
    sections: [
      { id: "tasks", heading: "Tasks with silica exposure", rule: "1910.1053(f)(2)(i)(A)", ask: "The tasks in your workplace that involve exposure to respirable crystalline silica." },
      { id: "controls", heading: "Controls for each task", rule: "1910.1053(f)(2)(i)(B)", ask: "For each task: the engineering controls, work practices and respiratory protection used to limit exposure." },
      { id: "housekeeping", heading: "Housekeeping", rule: "1910.1053(f)(2)(i)(C)", ask: "The housekeeping measures used to limit exposure." },
    ],
  },
  {
    id: "loto", version: 1, title: "Lockout/tagout energy control program", industries: ["mfg", "wh", "food", "auto", "facil", "retail"],
    rule: "OSHA 1910.147(c)",
    appliesIf: "Servicing and maintenance of machines where unexpected start-up or stored energy could hurt someone. Not construction or agriculture, and not some utility, electrical and well-servicing work (1910.147(a)).",
    keep: "Procedures are developed, documented and used (1910.147(c)(4)(i)). Each procedure is inspected at least once a year by an authorized employee who doesn't use it, and the inspection is certified (1910.147(c)(6)).",
    review: { months: 12, cite: "1910.147(c)(6)(i)", what: "At least once a year, each energy control procedure is inspected to make sure it and the standard are being followed. The certification names the machine, the date, the employees included and the inspector ((c)(6)(ii))." },
    sources: [std("OSHA 1910.147: control of hazardous energy (lockout/tagout)", "1910", "1910.147")],
    sections: [
      { id: "scope", heading: "Scope, purpose and authorization", rule: "1910.147(c)(1), (c)(4)(ii)", ask: "What the program covers, its purpose, who is authorized to lock out, the rules and techniques used, and how the rules are enforced." },
      { id: "use", heading: "Intended use of each procedure", rule: "1910.147(c)(4)(ii)(A)", ask: "For each machine or group of machines: a specific statement of what the procedure is for. List machines here or attach the procedure sheets." },
      { id: "shutdown", heading: "Shutting down, isolating, blocking and securing", rule: "1910.147(c)(4)(ii)(B)", ask: "The specific steps for shutting down, isolating, blocking and securing each machine to control hazardous energy." },
      { id: "devices", heading: "Placing, removing and transferring locks and tags", rule: "1910.147(c)(4)(ii)(C)", ask: "The specific steps for putting on, taking off and handing over lockout or tagout devices, and who is responsible for them." },
      { id: "verify", heading: "Testing that energy is controlled", rule: "1910.147(c)(4)(ii)(D)", ask: "The specific requirements for testing a machine to verify that the locks, tags and other energy controls work." },
      { id: "exempt", heading: "Machines without a written procedure", rule: "1910.147(c)(4)(i) Note", optional: true, ask: "Any machine you don't write a procedure for, and how it meets all eight conditions in the note to 1910.147(c)(4)(i) (single energy source, no stored energy, one lock under the worker's exclusive control, no hazards to others, and no accidents from unexpected start-up during servicing)." },
      { id: "periodic", heading: "Yearly periodic inspection", rule: "1910.147(c)(6)", ask: "Who does the yearly inspection of each procedure (an authorized employee other than the ones using it), how deviations are corrected, and where the certifications are kept." },
    ],
  },
  {
    id: "respirator", version: 1, title: "Respiratory protection program", industries: ["con", "mfg", "ag", "oil", "health", "auto"],
    rule: "OSHA 1910.134(c); construction 1926.103 (identical)",
    appliesIf: "Any workplace where respirators are needed to protect employees, or where the employer requires them (1910.134(c)(1)). Voluntary dust-mask-only use doesn't need to be in the written program ((c)(2)(ii)).",
    keep: "A written copy of the current program is kept, and available on request to affected employees and OSHA (1910.134(m)(3)-(4)). Updated as needed when workplace conditions change respirator use ((c)(1)).",
    review: null,
    sources: [std("OSHA 1910.134: respiratory protection", "1910", "1910.134"), std("OSHA 1926.103: construction (same as 1910.134)", "1926", "1926.103")],
    sections: [
      { id: "admin", heading: "Program administrator", rule: "1910.134(c)(3)", ask: "Who runs the program and does the effectiveness evaluations, and the training or experience that qualifies them." },
      { id: "select", heading: "Choosing respirators", rule: "1910.134(c)(1)(i)", ask: "How respirators are selected for the work." },
      { id: "medical", heading: "Medical evaluations", rule: "1910.134(c)(1)(ii)", ask: "How employees who must wear respirators get medical evaluations." },
      { id: "fit", heading: "Fit testing", rule: "1910.134(c)(1)(iii)", ask: "Fit testing procedures for tight-fitting respirators." },
      { id: "use", heading: "Using respirators", rule: "1910.134(c)(1)(iv)", ask: "How respirators are used in routine work and in reasonably foreseeable emergencies." },
      { id: "care", heading: "Cleaning, storage, inspection and repair", rule: "1910.134(c)(1)(v)", ask: "Procedures and schedules for cleaning, disinfecting, storing, inspecting, repairing, discarding and otherwise maintaining respirators." },
      { id: "air", heading: "Breathing air", rule: "1910.134(c)(1)(vi)", optional: true, ask: "If you use supplied-air respirators: how you make sure the breathing air is good enough in quality, quantity and flow." },
      { id: "train-hazards", heading: "Training on respiratory hazards", rule: "1910.134(c)(1)(vii)", ask: "How employees are trained on the respiratory hazards they may face in routine work and emergencies." },
      { id: "train-use", heading: "Training on respirator use", rule: "1910.134(c)(1)(viii)", ask: "How employees are trained to put on and take off respirators, their limits, and their care." },
      { id: "evaluate", heading: "Checking the program works", rule: "1910.134(c)(1)(ix), (l)", ask: "How you regularly check the program is working, including asking respirator users about fit, the right respirator for the hazard, use and maintenance." },
      { id: "voluntary", heading: "Voluntary use", rule: "1910.134(c)(2)", optional: true, ask: "If you allow voluntary respirator use: how you give users the Appendix D information and, beyond dust masks, make sure they're medically able and the respirators are kept clean." },
    ],
  },
];
