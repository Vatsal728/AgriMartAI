"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bell, Crosshair, Lightbulb, Maximize2, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { FullDiagnosisResponse } from "@/types/api";

const recentThumbs = [
  "/images/result-thumb-1.png",
  "/images/result-thumb-2.png",
  "/images/result-thumb-3.png",
];

const SCANNED_DIAGNOSIS_STORAGE_KEY = "scan-leaf-diagnosis";

export default function ScanLeafResultPage() {
  const { t } = useLanguage();
  const [diagnosis] = useState<FullDiagnosisResponse | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(SCANNED_DIAGNOSIS_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as FullDiagnosisResponse;
    } catch {
      return null;
    }
  });

  const [imageSrc] = useState<string>(() => {
    if (typeof window === "undefined") return "/images/result-leaf-large.png";
    return sessionStorage.getItem("scan-leaf-image") || "/images/result-leaf-large.png";
  });

  const record = diagnosis?.diagnosis_record;
  const confidencePct = diagnosis ? Math.round(diagnosis.prediction.confidence * 100) : null;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("scanLeaf.analyzing.title")}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">{t("common.aiModelOnline")}</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Leaf image with detection box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={imageSrc}
              alt={t("scanLeaf.result.imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized={imageSrc.startsWith("blob:") || imageSrc.startsWith("data:")}
              className="object-cover"
            />
            <div className="absolute left-[38%] top-1/4 h-1/4 w-1/5 rounded-lg border-4 border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]">
              <span className="absolute -left-3 -top-3 flex items-center gap-1.5 rounded bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                <Crosshair className="size-2.5" />
                {t("scanLeaf.result.detectedArea")}
              </span>
            </div>
          </div>
        </div>

        {/* Result details */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {record?.disease_name ?? t("scanLeaf.result.diseaseName")}
            </h2>
            <span className="inline-flex w-fit items-center rounded-lg bg-amber-800 px-4 py-2 text-sm font-bold text-white shadow-sm">
              {confidencePct !== null ? `${confidencePct}% ${t("diagnosis.confidence")}` : t("scanLeaf.result.confidence")}
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                <Lightbulb className="size-3.5 text-yellow-700" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800">{t("scanLeaf.result.precautions")}</h3>
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
              {record?.precautions_immediate ?? t("scanLeaf.result.precautionsBody")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Maximize2 className="size-3" />
                <span className="text-xs font-bold">{t("scanLeaf.result.spreadRisk")}</span>
              </div>
              <p className="font-bold text-slate-800">{record?.severity ?? t("scanLeaf.result.spreadRiskValue")}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="size-3" />
                <span className="text-xs font-bold">{t("scanLeaf.result.treatability")}</span>
              </div>
              <p className="font-bold text-slate-800">{t("scanLeaf.result.treatabilityValue")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/scan-leaf/treatment-advice"
              className="rounded-xl bg-brand py-4 text-center text-base font-bold text-white shadow-lg"
            >
              {t("scanLeaf.result.viewFullAdvice")}
            </Link>
            <Link
              href="/chat-assistant"
              className="rounded-xl border-2 border-accent py-4 text-center text-base font-bold text-accent"
            >
              {t("scanLeaf.result.askAssistant")}
            </Link>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <p className="text-center text-xs font-bold uppercase tracking-[1.4px] text-slate-400">
              {t("scanLeaf.recentDiagnoses")}
            </p>
            <div className="flex items-center justify-center gap-4">
              {recentThumbs.map((src, i) => (
                <div
                  key={src}
                  className="relative size-16 overflow-hidden rounded-xl border-2 border-white shadow-sm"
                  style={i === recentThumbs.length - 1 ? { opacity: 0.4 } : undefined}
                >
                  <Image src={src} alt={t("scanLeaf.recentDiagnosis")} fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
