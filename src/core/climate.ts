// ZIP code -> state -> local climate profile. Pure module.
// Origin: prototype/index.html ZIP3, HURRICANE, HOT_LONG, MILD_WINTER, climateFor.

export type ColdLevel = "none" | "light" | "full";
export type Climate = {
  label: string;
  state?: string;
  cold: ColdLevel;
  /** Heat season runs May through October instead of June through August. */
  hotLong: boolean;
  hurricane: boolean;
};

/** First three ZIP digits -> state. Ranges are inclusive. */
const ZIP3: [number, number, string][] = [
  [5, 5, "NY"], [6, 9, "PR"], [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"], [39, 49, "ME"], [50, 54, "VT"],
  [55, 55, "MA"], [56, 59, "VT"], [60, 69, "CT"], [70, 89, "NJ"], [100, 149, "NY"], [150, 196, "PA"],
  [197, 199, "DE"], [200, 205, "DC"], [206, 219, "MD"], [220, 246, "VA"], [247, 268, "WV"], [270, 289, "NC"],
  [290, 299, "SC"], [300, 319, "GA"], [398, 399, "GA"], [320, 349, "FL"], [350, 369, "AL"], [370, 385, "TN"],
  [386, 397, "MS"], [400, 427, "KY"], [430, 458, "OH"], [460, 479, "IN"], [480, 499, "MI"], [500, 528, "IA"],
  [530, 549, "WI"], [550, 567, "MN"], [570, 577, "SD"], [580, 588, "ND"], [590, 599, "MT"], [600, 629, "IL"],
  [630, 658, "MO"], [660, 679, "KS"], [680, 693, "NE"], [700, 714, "LA"], [716, 729, "AR"], [730, 749, "OK"],
  [750, 799, "TX"], [885, 885, "TX"], [800, 816, "CO"], [820, 831, "WY"], [832, 838, "ID"], [840, 847, "UT"],
  [850, 865, "AZ"], [870, 884, "NM"], [889, 898, "NV"], [900, 961, "CA"], [967, 968, "HI"], [970, 979, "OR"],
  [980, 994, "WA"], [995, 999, "AK"],
];

const HURRICANE = ["FL", "TX", "LA", "MS", "AL", "GA", "SC", "NC", "VA", "MD", "DE", "NJ", "NY", "CT", "RI", "MA", "NH", "ME", "HI", "PR"];
const HOT_LONG = ["FL", "TX", "LA", "MS", "AL", "GA", "SC", "AZ", "NV", "HI", "PR"];
const MILD_WINTER = ["FL", "TX", "LA", "MS", "AL", "GA", "SC", "AZ", "CA"];

export const NO_LOCATION: Climate = { label: "No location set", cold: "full", hotLong: false, hurricane: false };

export function stateForZip(zip: string): string | undefined {
  if (!/^\d{5}$/.test(zip)) return undefined;
  const z3 = parseInt(zip.slice(0, 3), 10);
  return ZIP3.find(([lo, hi]) => z3 >= lo && z3 <= hi)?.[2];
}

export function climateFor(zip: string | null | undefined): Climate {
  const st = zip ? stateForZip(zip) : undefined;
  if (!zip || !st) return NO_LOCATION;
  const z3 = parseInt(zip.slice(0, 3), 10);
  let cold: ColdLevel = MILD_WINTER.includes(st) ? "light" : "full";
  // South and Southwest Florida (ZIP 330-349), Hawaii and Puerto Rico get no cold-weather talks.
  if (st === "HI" || st === "PR" || (st === "FL" && z3 >= 330)) cold = "none";
  return { label: `ZIP ${zip} · ${st}`, state: st, cold, hotLong: HOT_LONG.includes(st), hurricane: HURRICANE.includes(st) };
}
