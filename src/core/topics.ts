// Topic of a talk, for its small icon: one look tells a crew lead "electrical" or "falls" before reading a word.
// Pure module. Worked out from the talk's id and English title, first matching rule wins, so a new library talk
// gets a topic without anyone tagging it (talks.test.ts keeps "general" rare). Company talks are "general" unless
// their title says otherwise.
import type { Talk } from "./talks";

export type TopicId = "weather" | "falls" | "electrical" | "fire" | "air" | "vehicles" | "tools" | "body" | "health" | "people" | "spaces" | "general";

export const TOPICS: Record<TopicId, string> = {
  weather: "Weather", falls: "Falls and heights", electrical: "Electrical", fire: "Fire and hot work", air: "Chemicals and air",
  vehicles: "Vehicles and equipment", tools: "Machines and tools", body: "Body and PPE", health: "Health and infection",
  people: "People and emergencies", spaces: "Digging and tight spaces", general: "General",
};

// Order matters: the specific rules come before the broad ones (a "roof delivery" is a crane job, not a fall).
const RULES: [TopicId, RegExp][] = [
  ["weather", /\b(heat|cold|storm|hurricane|lightning|sun)\b/],
  ["vehicles", /roof-deliveries|telehandler|crane|rigging|hoist|boom truck|bucket truck|aerial-lifts-gi/],
  ["electrical", /electric|test-before-touch|power-lines|power lines|gfci|temp-power|arc-flash|grounding|min-approach|energized/],
  ["spaces", /trench|excavat|underground|buried|confined|manhole|vault|grain-bins|engulf|walk-in/],
  ["fire", /hot-work|weld|braz|extinguish|fire|gas-cylinders|lpg|propane|flammable|combustible|grain-dust|kettle|burns|fueling/],
  ["falls", /fall|debris|demolition|roof|ladder|scaffold|harness|skylight|stair|dock-edges|rope-descent|aerial|pole|tower|tree-climbing|climbing|slips/],
  ["air", /tank-gauging|hazcom|chemical|nh3|ammonia|silica|asbestos|lead|respirator|pesticide|h2s|sulfide|carbon monoxide|co-exhaust|dust|mold|formaldehyde|ethylene|anesthetic|refrigerant|spray|drugs|legionella|radiation|smoke|latex|rf-exposure|fertilizer/],
  ["vehicles", /grain-elevators|fork|vehicle|work-zones|traffic|driving|truck|trailer|tractor|atv|equipment-rops|load|pallet|route|lease-roads|rig-move|cargo|hazmat|highway|customer-yards|loading-docks/],
  ["tools", /guard|loto|lockout|nail|tool|grinder|chainsaw|chipper|mower|pto|auger|conveyor|caught|cutter|knives|compressed-air|stump|jack|tire|pipe|high-pressure|racking|felling|limb|site-clearing|material-storage|equipment/],
  ["health", /sharps|needle|blood|infection|exposure|animal|bites|ticks|sanitation|toilets|camps/],
  ["body", /livestock|lift|ergonomic|repetitive|kneeling|patient|fatigue|hearing|eye|ppe|housekeeping|room cleaning/],
  ["people", /home-health|emerg|first-aid|injur|near-miss|violence|crowd|robbery|new-workers|youth|young|jsa|aisles|exits/],
];

export function talkTopic(t: Pick<Talk, "id" | "content">): TopicId {
  const text = `${t.id} ${t.content.en.title}`.toLowerCase();
  for (const [topic, re] of RULES) if (re.test(text)) return topic;
  return "general";
}
