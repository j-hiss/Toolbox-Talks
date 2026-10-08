// Talk model and lookups. Pure module: no React, no Supabase, no "use client".
// Origin: prototype/index.html TALKS, talksFor, talkFits.
import type { Climate } from "./climate";
import { industryTags, type IndustryId } from "./industries";
import type { LanguageId } from "./languages";

export type TalkSection = { heading: string; items: string[] };
export type TalkText = { title: string; hook: string; sections: TalkSection[]; ask: string };
export type TranslationStatus = "source" | "draft" | "reviewed";

export type Talk = {
  id: string;
  /** Industries this talk belongs to, or ["all"] for the "Every job" set. */
  industries: (IndustryId | "all")[];
  /** OSHA standard number or a short topic tag shown on the talk card. */
  code: string;
  /** Roughly how long it takes to read aloud. */
  minutes: number;
  /** Where the talk's content comes from: OSHA standards (paragraph-level) and OSHA guidance pages. Every talk has at least one. */
  sources: { label: string; url: string; kind: "standard" | "guidance" }[];
  content: Partial<Record<LanguageId, TalkText>> & { en: TalkText };
  translationStatus: Partial<Record<LanguageId, TranslationStatus>>;
};

/** Talks that only make sense in some climates. */
const WEATHER_ONLY: Record<string, (c: Climate) => boolean> = {
  storm: (c) => c.hurricane,
  cold: (c) => c.cold !== "none",
};

export function talkFitsClimate(talk: Talk, climate: Climate): boolean {
  const rule = WEATHER_ONLY[talk.id];
  return rule ? rule(climate) : true;
}

/** Every talk available to a company: its industry's talks plus the "Every job" set, filtered by local climate. */
export function talksFor(talks: Talk[], industry: IndustryId, climate: Climate): Talk[] {
  const tags = industryTags(industry);
  return talks.filter(
    (t) => (t.industries.includes("all") || tags.some((i) => t.industries.includes(i))) && talkFitsClimate(t, climate),
  );
}

/** The talk text in a language, falling back to English when that language isn't available. */
export function talkText(talk: Talk, lang: LanguageId): { text: TalkText; lang: LanguageId } {
  const text = talk.content[lang];
  return text ? { text, lang } : { text: talk.content.en, lang: "en" };
}
