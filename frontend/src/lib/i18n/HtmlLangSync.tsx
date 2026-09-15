"use client";

import { useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export function HtmlLangSync(): null {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
