"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Sun, Crosshair, ScanEye } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import type { FullDiagnosisResponse } from "@/types/api";

const SCANNED_IMAGE_STORAGE_KEY = "scan-leaf-image";
const SCANNED_DIAGNOSIS_STORAGE_KEY = "scan-leaf-diagnosis";
const SCANNED_DIAGNOSIS_SETTLED_KEY = "scan-leaf-diagnosis-settled";
const FALLBACK_IMAGE_SRC = "/images/result-leaf-large.png";
const LOW_CONFIDENCE_THRESHOLD = 0.6;

const tips: { icon: typeof Sun; title: TranslationKey; body: TranslationKey }[] = [
  { icon: Sun, title: "scanLeaf.analyzing.tip.lighting.title", body: "scanLeaf.analyzing.tip.lighting.body" },
  { icon: Crosshair, title: "scanLeaf.analyzing.tip.focus.title", body: "scanLeaf.analyzing.tip.focus.body" },
  { icon: ScanEye, title: "scanLeaf.analyzing.tip.detail.title", body: "scanLeaf.analyzing.tip.detail.body" },
];

export default function ImageAnalysisPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [progress, setProgress] = useState(15);
  const [settled, setSettled] = useState(false);
  const [imageSrc] = useState(() => {
    if (typeof window === "undefined") {
      return FALLBACK_IMAGE_SRC;
    }
    return sessionStorage.getItem(SCANNED_IMAGE_STORAGE_KEY) ?? FALLBACK_IMAGE_SRC;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const poll = setInterval(() => {
      if (sessionStorage.getItem(SCANNED_DIAGNOSIS_SETTLED_KEY) === "1") {
        setSettled(true);
        clearInterval(poll);
      }
    }, 250);
    // Don't block the demo forever if a request never settles.
    const timeout = setTimeout(() => setSettled(true), 8000);
    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, []);

  const canContinue = progress >= 100 && settled;

  function handleContinue(): void {
    const raw = sessionStorage.getItem(SCANNED_DIAGNOSIS_STORAGE_KEY);
    if (raw) {
      try {
        const diagnosis = JSON.parse(raw) as FullDiagnosisResponse;
        if (diagnosis.prediction.confidence < LOW_CONFIDENCE_THRESHOLD) {
          router.push("/scan-leaf/low-confidence");
          return;
        }
      } catch {
        // Malformed cache — fall through to the default result view.
      }
    }
    router.push("/scan-leaf/result");
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("scanLeaf.analyzing.title")}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
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

      <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={t("scanLeaf.analyzing.imageAlt")}
            fill
            sizes="900px"
            unoptimized={imageSrc !== FALLBACK_IMAGE_SRC}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-bold text-slate-900">
              {canContinue ? t("scanLeaf.analyzing.complete") : t("scanLeaf.analyzing.inProgress")}
            </p>
            <p className="text-sm text-text-muted">{t("scanLeaf.analyzing.mayTakeSeconds")}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/scan-leaf")}
            className="rounded-xl border border-slate-200 px-8 py-4 text-sm font-bold text-slate-700"
          >
            {t("scanLeaf.analyzing.uploadAnother")}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="rounded-xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            {t("common.continue")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-surface-muted p-6">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="size-4 text-brand" />
              </div>
              <p className="font-bold text-slate-900">{t(tip.title)}</p>
              <p className="text-sm text-text-muted">{t(tip.body)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
