"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Sparkles, Bookmark, Share2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";
import type { SavedAnswer } from "@/types/api";

const fallbackAnswers: { question: TranslationKey; answer: TranslationKey; date: string }[] = [
  {
    question: "savedAnswers.q1",
    answer: "savedAnswers.a1",
    date: "Oct 24, 2023 · 10:45 AM",
  },
  {
    question: "savedAnswers.q2",
    answer: "savedAnswers.a2",
    date: "Oct 22, 2023 · 02:15 PM",
  },
  {
    question: "savedAnswers.q3",
    answer: "savedAnswers.a3",
    date: "Oct 21, 2023 · 09:30 AM",
  },
  {
    question: "savedAnswers.q4",
    answer: "savedAnswers.a4",
    date: "Oct 19, 2023 · 11:20 AM",
  },
  {
    question: "savedAnswers.q5",
    answer: "savedAnswers.a5",
    date: "Oct 18, 2023 · 04:55 PM",
  },
  {
    question: "savedAnswers.q6",
    answer: "savedAnswers.a6",
    date: "Oct 15, 2023 · 01:10 PM",
  },
];

export default function SavedAnswersPage() {
  const { t } = useLanguage();
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getSavedAnswers()
      .then((res) => {
        if (!cancelled) setSavedAnswers(res);
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo list.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const removeAnswer = (id: string) => {
    setSavedAnswers((prev) => prev?.filter((a) => a.id !== id) ?? prev);
    AgriSmartAPI.deleteSavedAnswer(id).catch(() => {
      // Best-effort — the item stays removed locally even if the request fails.
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("savedAnswers.searchPlaceholder")}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <Link
          href="/scan-leaf"
          className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm"
        >
          {t("savedAnswers.newAnalysis")}
        </Link>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("savedAnswers.title")}</h1>
        <p className="pt-1 text-base text-text-muted">{t("savedAnswers.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedAnswers
          ? savedAnswers.map((item) => (
              <div key={item.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-3 font-heading text-base font-bold text-slate-900">{item.title}</h3>
                    <Sparkles className="mt-1 size-3.5 shrink-0 text-brand" />
                  </div>
                  <p className="line-clamp-4 text-sm text-text-muted">{item.summary_text}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-text-faint">{new Date(item.created_at).toLocaleString()}</p>
                  <div className="flex gap-3 text-slate-400">
                    <button type="button" aria-label={t("savedAnswers.bookmarked")} onClick={() => removeAnswer(item.id)}>
                      <Bookmark className="size-3.5 fill-brand text-brand" />
                    </button>
                    <button type="button" aria-label={t("savedAnswers.share")}>
                      <Share2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : fallbackAnswers.map((item) => (
              <div key={item.question} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-3 font-heading text-base font-bold text-slate-900">{t(item.question)}</h3>
                    <Sparkles className="mt-1 size-3.5 shrink-0 text-brand" />
                  </div>
                  <p className="line-clamp-4 text-sm text-text-muted">{t(item.answer)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-text-faint">{item.date}</p>
                  <div className="flex gap-3 text-slate-400">
                    <button type="button" aria-label={t("savedAnswers.bookmarked")}>
                      <Bookmark className="size-3.5 fill-brand text-brand" />
                    </button>
                    <button type="button" aria-label={t("savedAnswers.share")}>
                      <Share2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-surface-muted">
          <MessageCircle className="size-6 text-brand" />
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900">{t("savedAnswers.needMore")}</h2>
        <p className="max-w-sm text-sm text-text-muted">{t("savedAnswers.needMoreBody")}</p>
        <Link href="/chat-assistant" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
          {t("savedAnswers.startNewChat")}
        </Link>
      </div>
    </div>
  );
}
