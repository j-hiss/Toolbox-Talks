// Recorded read-aloud audio: which lines can be recorded ahead of time, and the file each one lives in. Pure module.
//
// Files are named by a fingerprint of the exact words, the language and the voice, so rewording a talk simply makes
// new files: old records never point at audio, and a changed line can't play stale audio. Lines that change every day
// (site notes, today's heat index, "Since last talk" items) are never recorded; the phone's voice reads them.
// Only reviewed translations get recorded Spanish (safety wording is not guessed; drafts keep the device voice).
import type { TalkText } from "./talks";

/** 64-bit FNV-1a of the text, as 16 hex characters. Same answer in the browser, Node and any language. */
export function fnv64(text: string): string {
  let h = 0xcbf29ce484222325n;
  const bytes = new TextEncoder().encode(text);
  for (const b of bytes) { h ^= BigInt(b); h = (h * 0x100000001b3n) & 0xffffffffffffffffn; }
  return h.toString(16).padStart(16, "0");
}

/** Words are compared after trimming and collapsing spaces, so a stray space doesn't need a new recording. */
export const normalizeLine = (text: string) => text.replace(/\s+/g, " ").trim();

/** The file key for one line in one voice. */
export function audioKey(text: string, lang: string, voice: string): string {
  return fnv64(`${lang}|${voice}|${normalizeLine(text)}`);
}

/** Where a key's file lives in the talk-audio bucket. */
export const audioPath = (voice: string, key: string) => `${voice}/${key}.mp3`;

/**
 * The lines of a talk that can be recorded ahead of time, in reading order: title, opening line, section headings and
 * points, the "ask the team" heading and the question. `askHeading` is the crew-language heading (src/content/ui.ts).
 */
export function recordableLines(t: TalkText, askHeading: string): string[] {
  return [t.title, t.hook, ...t.sections.flatMap((s) => [s.heading, ...s.items]), askHeading, t.ask].map(normalizeLine).filter(Boolean);
}
