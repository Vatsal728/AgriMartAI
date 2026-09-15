"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, type Language } from "./languages";
import en from "./translations/en";
import hi from "./translations/hi";
import { AgriSmartAPI } from "@/lib/api";

export type TranslationKey = keyof typeof en;

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, hi };

const LANGUAGE_CHANGE_EVENT = "agrismart-language-change";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function parseLanguage(value: string | null): Language {
  return value === "en" || value === "hi" ? value : DEFAULT_LANGUAGE;
}

function getSnapshot(): Language {
  return parseLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((next: Language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
    AgriSmartAPI.updateLanguage(next).catch(() => {
      // Backend unreachable — the choice still persists locally.
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[language][key] ?? dictionaries[DEFAULT_LANGUAGE][key],
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
