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
};

const en: Strings = {
  ask: "Ask the crew",
  play: "Read it out loud",
  stop: "Stop reading",
  reading: "Reading out loud…",
  noVoice: "Read-out-loud isn't available on this device.",
  signNote: "Each person signs with a finger. By signing, they confirm they attended this talk.",
};

const es: Strings = {
  ask: "Pregunta al equipo",
  play: "Leerlo en voz alta",
  stop: "Dejar de leer",
  reading: "Leyendo en voz alta…",
  noVoice: "La lectura en voz alta no está disponible en este dispositivo.",
  signNote: "Cada persona firma con el dedo. Al firmar, confirma que asistió a esta charla.",
};

export function crewText(lang: LanguageId): Strings {
  return lang === "es" ? es : en;
}
