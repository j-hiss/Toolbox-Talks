// The short heat reminder added to any talk on a hot day (heat index 91°F and up). Content, not code.
// Spanish is draft until a native speaker reviews it, like the talks.
import type { LanguageId } from "@/core/languages";

export const HEAT_REMINDER_VERSION = 1;

const TEXT: Partial<Record<LanguageId, { title: string; items: string[] }>> = {
  en: {
    title: "Heat today",
    items: [
      "Drink a cup of water every 15 to 20 minutes, even if you're not thirsty.",
      "Take breaks in the shade. Longer and more often as the day heats up.",
      "Watch your partner: confusion, stumbling or hot dry skin means call 911 and cool them down now.",
      "New or returning to the heat? Ease in. Most heat deaths happen in the first few days.",
    ],
  },
  es: {
    title: "Calor hoy",
    items: [
      "Tome un vaso de agua cada 15 a 20 minutos, aunque no tenga sed.",
      "Descanse en la sombra. Descansos más largos y frecuentes cuando sube el calor.",
      "Cuide a su compañero: confusión, tropiezos o piel caliente y seca significa llamar al 911 y enfriarlo ya.",
      "¿Nuevo o regresando al calor? Empiece poco a poco. La mayoría de las muertes por calor ocurren en los primeros días.",
    ],
  },
};

export const heatReminder = (lang: LanguageId) => TEXT[lang] ?? TEXT.en!;
export const heatReminderReviewed: Partial<Record<LanguageId, boolean>> = { en: true, es: false };
