// What the weather card tells the crew, worded for where they work (src/core/worksetting.ts). Content, not code.
// Every note says only what OSHA material says, and carries the reference so a crew lead can read the source.
// Changing wording: bump WEATHER_NOTES_VERSION. English only for now; a translation is draft until reviewed.
// Checked against the source (2026-10-07): the lightning fact sheet. The standard paragraphs below still need a read
// against osha.gov before this ships to crews.
import type { WorkSetting } from "@/core/worksetting";
import type { WeatherNoteKey } from "@/core/conditions";

export const WEATHER_NOTES_VERSION = 1;

export type Ref = { label: string; url: string };
export type WeatherNote = { text: string; refs: Ref[] };

const std = (part: "1910" | "1926", section: string, para = ""): Ref => ({
  label: `OSHA ${section}${para}`,
  url: `https://www.osha.gov/laws-regs/regulations/standardnumber/${part}/${section}`,
});

/** OSHA/NOAA fact sheet FS-3863, "Lightning Safety When Working Outdoors". */
const LIGHTNING: Ref = { label: "OSHA lightning fact sheet", url: "https://www.osha.gov/Publications/OSHA3863.pdf" };
export const HEAT_REF: Ref = { label: "OSHA heat", url: "https://www.osha.gov/heat-exposure" };

const SCAFFOLD_WIND = std("1926", "1926.451", "(f)(12)");   // no scaffold work in storms or high winds unless a competent person decides
const SCAFFOLD_SLIP = std("1926", "1926.451", "(f)(8)");    // no work on scaffolds covered with slippery material, except to remove it
const CRANE_MFR = std("1926", "1926.1417", "(a)");          // follow the manufacturer's procedures (including wind limits)
const STACKED = std("1926", "1926.250", "(a)(1)");          // stacked materials secured against sliding, falling or collapse
const GFCI = std("1926", "1926.404", "(b)(1)");             // ground-fault protection for cords and tools on construction sites
const STORAGE = std("1910", "1910.176", "(b)");             // stored material stacked and secured against sliding or collapse
const DRY_FLOORS = std("1910", "1910.22", "(a)(2)");        // floors kept clean and, as far as feasible, dry
const FORKLIFT_SPEED = std("1910", "1910.178", "(n)(8)");   // speed that lets the truck stop safely, under all travel conditions

const NOTES: Record<WorkSetting, Record<WeatherNoteKey, WeatherNote>> = {
  outdoor: {
    thunder: { text: "Thunderstorms in the forecast. When thunder roars, go indoors: off the roof, scaffolds and lifts, into a fully enclosed building or a hard-topped vehicle. Wait 30 minutes after the last thunder.", refs: [LIGHTNING] },
    high: { text: "High wind. No scaffold work unless a competent person decides it's safe. Cranes and lifts stay within the manufacturer's wind limits.", refs: [SCAFFOLD_WIND, CRANE_MFR] },
    windy: { text: "Windy. Secure stacked materials, sheets and debris so nothing slides, falls or blows off the roof.", refs: [STACKED] },
    rain: { text: "Rain likely. Stay off scaffolds covered in slippery material except to clear it. Ground-fault protection on cords and tools.", refs: [SCAFFOLD_SLIP, GFCI] },
  },
  mixed: {
    thunder: { text: "Thunderstorms in the forecast. When thunder roars, stop outside work and go into a fully enclosed building or a hard-topped vehicle. Wait 30 minutes after the last thunder.", refs: [LIGHTNING] },
    high: { text: "High wind. No scaffold work unless a competent person decides it's safe. Cranes and lifts stay within the manufacturer's wind limits.", refs: [SCAFFOLD_WIND, CRANE_MFR] },
    windy: { text: "Windy. Secure stacked materials and sheets outside so nothing slides, falls or blows away.", refs: [STACKED] },
    rain: { text: "Rain likely. Stay off scaffolds covered in slippery material except to clear it. Ground-fault protection on cords and tools.", refs: [SCAFFOLD_SLIP, GFCI] },
  },
  indoor: {
    thunder: { text: "Thunderstorms in the forecast. When thunder roars, stop yard, dock and outside work and come inside. Wait 30 minutes after the last thunder.", refs: [LIGHTNING] },
    high: { text: "High wind. Secure stored materials in the yard so nothing slides, falls or blows over.", refs: [STORAGE] },
    windy: { text: "Windy. Secure stored materials in the yard so nothing slides, falls or blows over.", refs: [STORAGE] },
    rain: { text: "Rain likely. Keep floors at doors and docks as dry as you can. Forklifts at a speed that lets them stop safely on wet surfaces.", refs: [DRY_FLOORS, FORKLIFT_SPEED] },
  },
};

export const weatherNote = (setting: WorkSetting, key: WeatherNoteKey): WeatherNote => NOTES[setting][key];
