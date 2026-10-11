// Plans and prices: flat monthly prices by crew size, no per-user fees (migration 0048 holds a paid account to its
// size). Pure module. Prices are shown on screen; payment happens outside the app for now.
//
// - The same rule the database uses: a trial, pilot or complimentary account has everything; a paid one gets what its
//   size covers. Nothing a company already has is ever locked: moving down only stops starting new things the
//   smaller size doesn't include, and only adding people past the size is refused.
// - Trainers and insurance partners never pay. They are how companies hear about the app.
import type { CompanyAccount, Plan } from "./account";

export type Tier = "crew" | "company" | "larger";
export type GatedFeature = "osha_log" | "programs" | "own_talks" | "own_checklists";

export type PlanSize = {
  id: Tier;
  name: string;
  /** Dollars a month, billed monthly. Yearly is 10 months' price (2 months free). */
  monthly: number;
  people: number;
  /** One line on who it's for. */
  forWho: string;
  /** What this size adds over the one before it (the first lists everything it has). */
  adds: string[];
};

export const PLAN_SIZES: PlanSize[] = [
  {
    id: "crew", name: "Crew", monthly: 29, people: 25, forWho: "A crew or small shop running weekly talks.",
    adds: [
      "The talk library in 6 languages, read aloud",
      "Signing on one phone, or each person on their own phone by QR code",
      "Signed PDFs with a check code anyone can verify",
      "Daily pre-task plans and the app's inspection checklists",
      "Training cards with expiry reminders, and your trainer's portal",
      "Reports, the safety profile, and sending it to your agent",
      "Works with no signal",
    ],
  },
  {
    id: "company", name: "Company", monthly: 79, people: 100, forWho: "A company with several crews and an office.",
    adds: [
      "OSHA 300, 300A and 301 logs, and the files for OSHA's website",
      "Written safety programs (hazard communication, emergency action and more)",
      "Your own talks and your own checklists",
    ],
  },
  {
    id: "larger", name: "Larger", monthly: 149, people: 250, forWho: "A larger company with many crews.",
    adds: ["Everything in Company, for up to 250 people"],
  },
];

export const YEARLY_MONTHS = 10;
export const TRIAL_DAYS = 30;

/** Why the price is what it is, in plain words (shown above the plans). */
export const FAIR_PRICE = [
  "One flat price for your company's size. No charge per worker, so adding a new hand never costs more until you move up a size.",
  "Every plan includes signing, the PDFs, the check codes and working with no signal. Those are the safety basics, so they aren't held back for a higher price.",
  "Moving to a smaller plan never locks anything you already have. Your records stay yours to open, print, correct and download.",
  "Trainers and insurance agents use it free, so the people who help you can see your progress without anyone paying more.",
  "Try everything free for 30 days. No card needed to start.",
];

export const yearly = (s: PlanSize) => s.monthly * YEARLY_MONTHS;

export const sizeFor = (tier: Tier): PlanSize => PLAN_SIZES.find((s) => s.id === tier)!;

/** The smallest size that covers this many people, or null past the largest (talk to us). */
export function sizeForPeople(n: number): PlanSize | null {
  return PLAN_SIZES.find((s) => n <= s.people) ?? null;
}

/** Whether this account can start a new one of these (same rule as private.plan_allows). */
export function planAllows(account: Pick<CompanyAccount, "plan"> & { tier?: Tier } | null, feature: GatedFeature): boolean {
  void feature;
  if (!account) return true;
  return account.plan !== "paid" || (account.tier ?? "company") !== "crew";
}

/** How many people this account covers, or null when it isn't held to a size (same rule as private.people_limit). */
export function peopleLimit(account: { plan: Plan; tier?: Tier } | null): number | null {
  if (!account || account.plan !== "paid") return null;
  return sizeFor(account.tier ?? "company").people;
}

/** What a feature is called on the "on the Company plan" note. */
export const FEATURE_LABEL: Record<GatedFeature, string> = {
  osha_log: "Starting new OSHA log cases",
  programs: "Written programs",
  own_talks: "Your own talks",
  own_checklists: "Your own checklists",
};
