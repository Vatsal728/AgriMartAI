"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bell, Crosshair, MessageCircle, ListChecks, FlaskConical, ShieldCheck, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import type { FullDiagnosisResponse } from "@/types/api";

const recentThumbs = ["/images/result-thumb-1.png", "/images/result-thumb-2.png", "/images/result-thumb-3.png"];
const SCANNED_DIAGNOSIS_STORAGE_KEY = "scan-leaf-diagnosis";

const actionKeys: TranslationKey[] = [
  "scanLeaf.treatment.action.remove",
  "scanLeaf.treatment.action.airflow",
  "scanLeaf.treatment.action.mulch",
];

const treatments: { name: TranslationKey; note: TranslationKey }[] = [
  { name: "scanLeaf.treatment.option.copper", note: "scanLeaf.treatment.option.copper.note" },
  { name: "scanLeaf.treatment.option.chlorothalonil", note: "scanLeaf.treatment.option.chlorothalonil.note" },
  { name: "scanLeaf.treatment.option.bacillus", note: "scanLeaf.treatment.option.bacillus.note" },
  { name: "scanLeaf.treatment.option.mancozeb", note: "scanLeaf.treatment.option.mancozeb.note" },
];

const preventionKeys: TranslationKey[] = [
  "scanLeaf.treatment.prevention.waterBase",
  "scanLeaf.treatment.prevention.rotation",
  "scanLeaf.treatment.prevention.resistantVarieties",
  "scanLeaf.treatment.prevention.soil",
];

export default function TreatmentAdvicePage() {
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
  const products = diagnosis?.recommended_products ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("scanLeaf.treatment.title")}</h1>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        {/* Left: leaf + diagnosis summary */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image 
                src={imageSrc} 
                alt={t("scanLeaf.treatment.imageAlt")} 
                fill 
                sizes="420px" 
                unoptimized={imageSrc.startsWith("blob:") || imageSrc.startsWith("data:")}
                className="object-cover" 
              />
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                <Crosshair className="size-2.5" />
                {t("scanLeaf.treatment.analyzedTarget")}
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">{record?.disease_name ?? t("scanLeaf.result.diseaseName")}</h2>
            <span className="mt-3 inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm font-bold text-white">
              {t("scanLeaf.treatment.infectionIdentified")}
            </span>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-900">{t("scanLeaf.recentDiagnoses")}</p>
            <div className="flex gap-4">
              {recentThumbs.map((src) => (
                <div key={src} className="relative size-16 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                  <Image src={src} alt={t("scanLeaf.recentDiagnosis")} fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: advice content */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <Link
              href="/chat-assistant"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm"
            >
              <MessageCircle className="size-4" />
              {t("scanLeaf.treatment.askFollowUp")}
            </Link>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50">
                <ListChecks className="size-4 text-red-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">{t("scanLeaf.treatment.recommendedAction")}</h3>
            </div>
            {record ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{record.precautions_immediate}</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {actionKeys.map((a) => (
                  <li key={a} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                    {t(a)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                <FlaskConical className="size-4 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">{t("scanLeaf.treatment.fungicideOptions")}</h3>
            </div>
            {record && <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{record.recommended_treatment}</p>}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {products.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 p-5">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="pt-2 text-sm text-text-muted">
                      {p.active_ingredient ? `${p.active_ingredient} · ` : ""}
                      {p.package_size} · ₹{p.price_inr}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !record && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {treatments.map((tr) => (
                    <div key={tr.name} className="rounded-2xl border border-slate-200 p-5">
                      <p className="font-bold text-slate-900">{t(tr.name)}</p>
                      <p className="pt-2 text-sm text-text-muted">{t(tr.note)}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
                <Info className="size-4 text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">{t("scanLeaf.treatment.preventionTips")}</h3>
            </div>
            {record ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{record.long_term_prevention}</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {preventionKeys.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                    {t(p)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-center text-sm text-text-muted">{t("scanLeaf.treatment.source")}</p>
        </div>
      </div>
    </div>
  );
}
