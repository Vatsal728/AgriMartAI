"use client";

import { useState } from "react";
import { Sprout, Wheat, Leaf, SlidersHorizontal, Calendar, ChevronDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

type Crop = {
  id: string;
  name: TranslationKey;
  match: number;
  icon: LucideIcon;
  reason: TranslationKey;
  yield_: TranslationKey;
  maturity: TranslationKey;
  waterNeed: TranslationKey;
  soilFit: TranslationKey;
  featured?: boolean;
};

const crops: Crop[] = [
  {
    id: "sweet-corn",
    name: "cropResults.crop.sweetCorn",
    match: 92,
    icon: Wheat,
    reason: "cropResults.crop.sweetCorn.reason",
    yield_: "cropResults.crop.sweetCorn.yield",
    maturity: "cropResults.crop.sweetCorn.maturity",
    waterNeed: "cropResults.crop.sweetCorn.waterNeed",
    soilFit: "cropResults.crop.sweetCorn.soilFit",
    featured: true,
  },
  {
    id: "soybeans",
    name: "cropResults.crop.soybeans",
    match: 89,
    icon: Sprout,
    reason: "cropResults.crop.soybeans.reason",
    yield_: "cropResults.crop.soybeans.yield",
    maturity: "cropResults.crop.soybeans.maturity",
    waterNeed: "cropResults.crop.soybeans.waterNeed",
    soilFit: "cropResults.crop.soybeans.soilFit",
  },
  {
    id: "alfalfa",
    name: "cropResults.crop.alfalfa",
    match: 85,
    icon: Leaf,
    reason: "cropResults.crop.alfalfa.reason",
    yield_: "cropResults.crop.alfalfa.yield",
    maturity: "cropResults.crop.alfalfa.maturity",
    waterNeed: "cropResults.crop.alfalfa.waterNeed",
    soilFit: "cropResults.crop.alfalfa.soilFit",
  },
];

export default function CropRecommendationResultsPage() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("cropResults.title")}</h1>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
            <Calendar className="size-3.5" />
            {t("cropResults.springSeason2024")}
          </span>
          <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
            <SlidersHorizontal className="size-3.5" />
            {t("cropResults.filters")}
          </button>
        </div>
      </div>

      <p className="max-w-2xl text-base text-text-muted">{t("cropResults.description")}</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {crops.map((crop) => {
          const Icon = crop.icon;
          const isOpen = expanded === crop.id;
          return (
            <div
              key={crop.id}
              className={cn(
                "flex flex-col gap-6 rounded-3xl bg-white p-8",
                crop.featured ? "border-2 border-brand shadow-lg" : "border border-slate-200 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-muted">
                  <Icon className="size-7 text-brand" />
                </div>
                <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
                  {crop.match}% {t("cropResults.match")}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">{t(crop.name)}</h3>
                <p className="pt-2 text-sm text-text-muted">{t(crop.reason)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-medium text-text-faint">{t("cropResults.estYield")}</p>
                  <p className="font-bold text-slate-900">{t(crop.yield_)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-faint">{t("cropResults.maturity")}</p>
                  <p className="font-bold text-slate-900">{t(crop.maturity)}</p>
                </div>
              </div>

              {isOpen && (
                <div className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-text-faint">{t("cropResults.waterRequirement")}</p>
                    <p className="font-semibold text-slate-800">{t(crop.waterNeed)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-faint">{t("cropResults.soilCompatibility")}</p>
                    <p className="font-semibold text-slate-800">{t(crop.soilFit)}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : crop.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold",
                  crop.featured ? "bg-brand text-white shadow-lg" : "border border-slate-200 text-slate-800"
                )}
              >
                {isOpen ? t("cropResults.hideDetails") : t("cropResults.viewDetails")}
                <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
