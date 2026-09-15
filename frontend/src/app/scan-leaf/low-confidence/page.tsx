"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Camera, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const tips: TranslationKey[] = [
  "scanLeaf.lowConfidence.tip.lighting",
  "scanLeaf.lowConfidence.tip.centered",
  "scanLeaf.lowConfidence.tip.shadows",
  "scanLeaf.lowConfidence.tip.steady",
];

export default function LowConfidenceDetectionPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-8 px-4 py-8 text-center sm:px-8 sm:py-10">
      <span className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-bold text-amber-800">
        <AlertTriangle className="size-3.5" />
        {t("scanLeaf.lowConfidence.badge")}
      </span>

      <h1 className="font-heading text-3xl font-bold text-slate-900">{t("scanLeaf.lowConfidence.title")}</h1>

      <div className="relative w-full max-w-[448px] overflow-hidden rounded-3xl border-4 border-white shadow-lg">
        <div className="relative aspect-[7/5] w-full">
          <Image
            src="/images/chat-leaf-thumb.png"
            alt={t("scanLeaf.lowConfidence.imageAlt")}
            fill
            sizes="448px"
            className="object-cover blur-sm"
          />
        </div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/60 px-4 py-2 text-sm font-bold text-white">
          {t("scanLeaf.lowConfidence.unclear")}
        </span>
      </div>

      <p className="max-w-lg text-base text-text-muted">{t("scanLeaf.lowConfidence.description")}</p>

      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900">
          <CheckCircle2 className="size-4 text-brand" />
          {t("scanLeaf.lowConfidence.tipsHeading")}
        </h2>
        <ul className="flex flex-col gap-4 pt-6">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
              {t(tip)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/scan-leaf"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-bold text-white shadow-lg"
        >
          <Camera className="size-4" />
          {t("scanLeaf.lowConfidence.retakePhoto")}
        </Link>
        <Link
          href="/chat-assistant"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-800 shadow-sm"
        >
          <MessageCircle className="size-4" />
          {t("scanLeaf.lowConfidence.askAssistantInstead")}
        </Link>
      </div>

      <p className="text-xs text-text-faint">{t("scanLeaf.lowConfidence.refId")}</p>
    </div>
  );
}
