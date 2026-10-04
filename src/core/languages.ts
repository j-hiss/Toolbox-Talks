// Origin: prototype/index.html LANGS.
export type LanguageId = "en" | "es" | "pt" | "ht" | "vi" | "zh";

export const LANGUAGES: { id: LanguageId; label: string; voice: string; ready: boolean }[] = [
  { id: "en", label: "English", voice: "en-US", ready: true },
  { id: "es", label: "Español", voice: "es-US", ready: true },
  { id: "pt", label: "Português", voice: "pt-BR", ready: false },
  { id: "ht", label: "Kreyòl", voice: "ht-HT", ready: false },
  { id: "vi", label: "Tiếng Việt", voice: "vi-VN", ready: false },
  { id: "zh", label: "中文", voice: "zh-CN", ready: false },
];
