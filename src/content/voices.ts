// The recorded voice for each language. Content + config: changing a voice is a line here, never new app code.
// A voice is used only after docs/voice-licenses.md shows commercial use is allowed (the generator refuses otherwise).
// Recorded audio is made offline on a computer (scripts/voice/README.md) and stored in the talk-audio bucket; the
// phone's own voice reads anything without a recording (a site note, today's heat index).
import type { LanguageId } from "@/core/languages";

export type RecordedVoice = { engine: "kokoro"; voice: string; speed: number };

export const VOICES: Partial<Record<LanguageId, RecordedVoice>> = {
  en: { engine: "kokoro", voice: "af_heart", speed: 0.95 },
  es: { engine: "kokoro", voice: "ef_dora", speed: 0.95 },
};
