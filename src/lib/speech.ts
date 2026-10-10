"use client";

// Read-aloud with the phone's built-in voice. This is the offline fallback; the real voices will be pre-recorded
// audio files (see docs/SPEC.md: Voice). Origin: prototype readAloud / pickVoice / voiceScore.

const NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley/i;

function score(v: SpeechSynthesisVoice, code: string): number {
  let n = 0;
  if (/premium/i.test(v.name)) n += 6;
  if (/enhanced|natural|neural|online/i.test(v.name)) n += 5;
  if (/google|siri|microsoft/i.test(v.name)) n += 3;
  if (v.lang.toLowerCase().replace("_", "-") === code.toLowerCase()) n += 2;
  if (!v.localService) n += 1;
  return n;
}

export const speechAvailable = () => typeof window !== "undefined" && "speechSynthesis" in window;

/** The most natural-sounding installed voice for a language (e.g. "es-US"), or null to let the phone choose. */
export function bestVoice(code: string): SpeechSynthesisVoice | null {
  if (!speechAvailable()) return null;
  const prefix = code.slice(0, 2).toLowerCase();
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(prefix) && !NOVELTY.test(v.name));
  return voices.sort((a, b) => score(b, code) - score(a, code))[0] ?? null;
}

export function stopSpeaking() {
  if (speechAvailable()) window.speechSynthesis.cancel();
}

/**
 * Reads lines one at a time with short pauses (longer after headings), calling onLine(i) as each starts and
 * onDone() at the end. Returns a stop function.
 */
export function speakLines(
  lines: { text: string; heading?: boolean }[],
  code: string,
  { rate = 0.95, onLine, onDone, onError }: { rate?: number; onLine?: (i: number) => void; onDone?: () => void; onError?: () => void } = {},
): () => void {
  if (!speechAvailable()) { onError?.(); return () => {}; }
  let stopped = false;
  let i = 0;
  const voice = bestVoice(code);
  const next = () => {
    if (stopped) return;
    if (i >= lines.length) { onDone?.(); return; }
    const line = lines[i];
    onLine?.(i);
    const u = new SpeechSynthesisUtterance(line.text);
    u.lang = code;
    u.rate = rate;
    if (voice) u.voice = voice;
    u.onend = () => { i++; setTimeout(next, line.heading ? 650 : 380); };
    u.onerror = () => { if (!stopped) onError?.(); };
    window.speechSynthesis.speak(u);
  };
  window.speechSynthesis.cancel();
  next();
  return () => { stopped = true; window.speechSynthesis.cancel(); };
}

/** Say one line with the phone's voice. Resolves when it finishes (or fails, so reading never gets stuck). */
export function speakOne(text: string, code: string, rate = 0.95): { done: Promise<void>; stop: () => void } {
  if (!speechAvailable()) return { done: Promise.resolve(), stop: () => {} };
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code; u.rate = rate;
  const voice = bestVoice(code);
  if (voice) u.voice = voice;
  const done = new Promise<void>((res) => { u.onend = () => res(); u.onerror = () => res(); });
  window.speechSynthesis.speak(u);
  return { done, stop: () => window.speechSynthesis.cancel() };
}
