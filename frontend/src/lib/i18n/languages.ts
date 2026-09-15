export type Language = "en" | "hi";

export interface LanguageOption {
  code: Language;
  label: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "agrismart-language";
