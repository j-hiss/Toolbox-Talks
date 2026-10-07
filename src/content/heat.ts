// The short heat reminder added to any talk on a hot day (heat index 91°F and up). Content, not code.
// The 91°F trigger is this app's choice, not an OSHA threshold. OSHA notes heat deaths at a heat index as low as 86°F.
// Spanish is draft until a native speaker reviews it, like the talks.
// Sources: https://www.osha.gov/heat-exposure/water-rest-shade · https://www.osha.gov/heat-exposure/illness-first-aid
// · https://www.osha.gov/heat-exposure/protecting-new-workers
import type { LanguageId } from "@/core/languages";

export const HEAT_REMINDER_VERSION = 2;

const TEXT: Partial<Record<LanguageId, { title: string; items: string[] }>> = {
  en: {
    title: "Heat today",
    items: [
      "Drink a cup of water every 15 to 20 minutes, even if you're not thirsty.",
      "Take breaks in the shade. Longer and more often as the day heats up.",
      "Watch your partner: confusion, slurred speech or passing out means call 911 and cool them with ice or cold water now.",
      "New or returning to the heat? Ease in. Almost half of heat deaths happen on a worker's first day.",
    ],
  },
  es: {
    title: "Calor hoy",
    items: [
      "Tome un vaso de agua cada 15 a 20 minutos, aunque no tenga sed.",
      "Descanse en la sombra. Descansos más largos y frecuentes cuando sube el calor.",
      "Cuide a su compañero: confusión, habla arrastrada o desmayo significa llamar al 911 y enfriarlo ya con hielo o agua fría.",
      "¿Nuevo o regresando al calor? Empiece poco a poco. Casi la mitad de las muertes por calor ocurren el primer día de trabajo.",
    ],
  },
};

export const heatReminder = (lang: LanguageId) => TEXT[lang] ?? TEXT.en!;
// en is false until the version-2 wording is reviewed.
export const heatReminderReviewed: Partial<Record<LanguageId, boolean>> = { en: false, es: false };
