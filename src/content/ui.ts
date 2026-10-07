// Crew-facing UI text per language. Talk content lives in src/content/talks.ts; these are the few lines around it.
// Spanish here is draft until reviewed, like the talks.
import type { LanguageId } from "@/core/languages";

type Strings = {
  ask: string;
  play: string;
  stop: string;
  reading: string;
  noVoice: string;
  signNote: string;
  signHere: string;     // under the pad
  signedBy: string;     // "By signing, I confirm I attended this talk."
  tapFirst: string;     // over the pad until the statement is tapped
};

const en: Strings = {
  ask: "Ask the crew",
  play: "Read it out loud",
  stop: "Stop reading",
  reading: "Reading out loud…",
  noVoice: "Read-out-loud isn't available on this device.",
  signNote: "Each person signs with a finger. By signing, they confirm they attended this talk.",
  signHere: "Sign here with your finger",
  signedBy: "By signing, I confirm I attended this talk.",
  tapFirst: "Tap the box above first",
};

const es: Strings = {
  ask: "Pregunta al equipo",
  play: "Leerlo en voz alta",
  stop: "Dejar de leer",
  reading: "Leyendo en voz alta…",
  noVoice: "La lectura en voz alta no está disponible en este dispositivo.",
  signNote: "Cada persona firma con el dedo. Al firmar, confirma que asistió a esta charla.",
  signHere: "Firme aquí con el dedo",
  signedBy: "Al firmar, confirmo que asistí a esta charla.",
  tapFirst: "Primero toque la casilla de arriba",
};

export function crewText(lang: LanguageId): Strings {
  return lang === "es" ? es : en;
}

/** Bump when the signing statement's wording changes; records keep the exact text and version each crew agreed to. */
export const SIGNING_STATEMENT_VERSION = 1;

/** What each crew member taps before signing, in the language read and in English, saved with the record. */
export function signingStatement(lang: LanguageId) {
  return { text: crewText(lang).signedBy, en: en.signedBy, language: lang, version: SIGNING_STATEMENT_VERSION };
}
