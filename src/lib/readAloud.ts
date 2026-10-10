"use client";

// Read-aloud with recorded voices where they exist (src/core/voice.ts), the phone's voice for everything else.
// - Which lines are recorded comes from the voice's manifest in the talk-audio bucket, fetched once and kept on the
//   phone. No manifest (offline on first use, the preview, a language without a recorded voice) → the phone's voice
//   reads the whole talk, exactly as before.
// - Recorded files for a talk are saved on the phone when it's opened with signal, so they play with no signal later.
import { VOICES } from "@/content/voices";
import { audioKey, audioPath } from "@/core/voice";
import type { LanguageId } from "@/core/languages";
import { speakLines, speakOne, speechAvailable, stopSpeaking } from "@/lib/speech";

const CACHE = "tt-audio-v1";
const base = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && /^https?:\/\//.test(url) ? `${url.replace(/\/+$/, "")}/storage/v1/object/public/talk-audio/` : null;
};

const manifests = new Map<string, Promise<Set<string>>>();
/** The keys recorded for a voice. Empty when it can't be loaded. */
export function recordedKeys(voice: string): Promise<Set<string>> {
  const cached = manifests.get(voice);
  if (cached) return cached;
  const p = (async () => {
    const lsKey = `tt-audio-manifest-${voice}`;
    const fromPhone = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(lsKey) ?? "[]")); } catch { return new Set(); } };
    const root = base();
    if (!root) return fromPhone();
    try {
      const res = await fetch(`${root}${voice}/manifest.json`, { cache: "no-cache" });
      if (!res.ok) return fromPhone();
      const keys: string[] = await res.json();
      try { localStorage.setItem(lsKey, JSON.stringify(keys)); } catch { /* fine */ }
      return new Set(keys);
    } catch { return fromPhone(); }
  })();
  manifests.set(voice, p);
  return p;
}

const fileUrl = (voice: string, key: string) => `${base()}${audioPath(voice, key)}`;

/** Save a talk's recorded lines on the phone (best effort, quietly) so they play with no signal. */
export async function keepAudio(lines: string[], lang: LanguageId): Promise<void> {
  const v = VOICES[lang];
  if (!v || !base() || typeof caches === "undefined") return;
  const keys = await recordedKeys(v.voice);
  try {
    const cache = await caches.open(CACHE);
    for (const text of lines) {
      const key = audioKey(text, lang, v.voice);
      if (!keys.has(key)) continue;
      const url = fileUrl(v.voice, key);
      if (!(await cache.match(url))) await cache.add(url).catch(() => {});
    }
  } catch { /* storage full or blocked: it just streams next time */ }
}

async function playable(url: string): Promise<string> {
  try {
    if (typeof caches !== "undefined") {
      const hit = await (await caches.open(CACHE)).match(url);
      if (hit) return URL.createObjectURL(await hit.blob());
    }
  } catch { /* fall through to the network */ }
  return url;
}

/**
 * Read lines one at a time, like speakLines (same callbacks and pauses), using recordings where they exist.
 * Returns a stop function.
 */
export function readAloud(
  lines: { text: string; heading?: boolean }[], lang: LanguageId, code: string,
  opts: { rate?: number; onLine?: (i: number) => void; onDone?: () => void; onError?: () => void } = {},
): () => void {
  const v = VOICES[lang];
  let stopped = false;
  let stopCurrent: () => void = () => {};
  let fallback: (() => void) | null = null;
  void (async () => {
    const keys = v ? await recordedKeys(v.voice) : new Set<string>();
    if (stopped) return;
    const recorded = v ? lines.map((l) => keys.has(audioKey(l.text, lang, v.voice))) : lines.map(() => false);
    if (!recorded.some(Boolean)) { fallback = speakLines(lines, code, opts); return; }
    for (let i = 0; i < lines.length && !stopped; i++) {
      opts.onLine?.(i);
      if (recorded[i]) {
        const src = await playable(fileUrl(v!.voice, audioKey(lines[i].text, lang, v!.voice)));
        await new Promise<void>((res) => {
          const a = new Audio(src);
          a.playbackRate = 1;
          stopCurrent = () => { a.pause(); res(); };
          a.onended = () => res();
          a.onerror = () => { // a missing or broken file: read that line with the phone's voice instead
            if (!speechAvailable()) return res();
            const s = speakOne(lines[i].text, code, opts.rate); stopCurrent = s.stop; void s.done.then(res);
          };
          a.play().catch(() => a.onerror?.(new Event("error")));
        });
      } else if (speechAvailable()) {
        const s = speakOne(lines[i].text, code, opts.rate);
        stopCurrent = s.stop;
        await s.done;
      }
      if (!stopped) await new Promise((r) => setTimeout(r, lines[i].heading ? 650 : 380));
    }
    if (!stopped) opts.onDone?.();
  })();
  return () => { stopped = true; stopCurrent(); fallback?.(); stopSpeaking(); };
}

/** True when the language can be read at all: a recorded voice or the phone's own. */
export const canReadAloud = (lang: LanguageId) => !!VOICES[lang] || speechAvailable();
