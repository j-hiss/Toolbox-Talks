// State meeting-frequency rules that a chosen cadence could fall short of. Pure module. Each rule here was read
// against the state's own text (docs/claims-and-evidence.md, "Federal and state rules"). Every state plan that covers
// private employers was checked (2026-10-11): only these set a crew-meeting frequency. Washington general industry
// (monthly, when meetings replace a committee) and Oregon general industry (monthly, quarterly for office work) are
// met by every cadence the app offers (4 weeks at most), so they never warn. Committee-only rules (North Carolina,
// Tennessee, the California and Oregon committee options) are about safety committees, not crew talks, and aren't
// cadence warnings. Some states were only partly checked; see the evidence file.
import { industryTags, type IndustryId } from "./industries";
import type { Cadence } from "./plan";

type Rule = { state: string; construction: boolean; maxWeeks: Cadence; text: string };

const RULES: Rule[] = [
  { state: "WA", construction: true, maxWeeks: 1,
    text: "Washington's construction rule calls for a safety meeting every week (WAC 296-155-110)." },
  { state: "CA", construction: true, maxWeeks: 2,
    text: "California's construction rule calls for a toolbox meeting at least every 10 working days (8 CCR 1509)." },
  { state: "OR", construction: true, maxWeeks: 4,
    text: "Oregon's construction rule calls for a safety meeting at least monthly (OAR 437-001-0765)." },
];

/** The state rule this cadence would fall short of, or null when none we've checked applies. */
export function cadenceWarning(state: string | undefined, industry: IndustryId, weeks: Cadence): string | null {
  const construction = industryTags(industry).includes("con");
  const rule = RULES.find((r) => r.state === state && (!r.construction || construction) && weeks > r.maxWeeks);
  return rule ? `${rule.text} This cadence is less often than that.` : null;
}
