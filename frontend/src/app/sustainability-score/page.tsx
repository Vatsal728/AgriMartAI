"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Bell, Droplets, Zap, Sprout, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

const radius = 130;
const circumference = 2 * Math.PI * radius;

type MetricDef = {
  labelKey: TranslationKey;
  delta: string;
  positive: boolean;
  icon: typeof Droplets;
  iconBg: string;
  iconColor: string;
  barColor: string;
};

const metricDefs: MetricDef[] = [
  {
    labelKey: "sustainability.waterEfficiency",
    delta: "+12%",
    positive: true,
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    barColor: "bg-blue-500",
  },
  {
    labelKey: "sustainability.resourceUse",
    delta: "-2.4%",
    positive: false,
    icon: Zap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    barColor: "bg-amber-500",
  },
  {
    labelKey: "sustainability.cropHealthIndex",
    delta: "+0.8%",
    positive: true,
    icon: Sprout,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    barColor: "bg-emerald-500",
  },
];

const FALLBACK_SCORES = { current: 82, water: 94, resource: 78, health: 89 };

export default function SustainabilityScorePage() {
  const { t } = useLanguage();
  const [scores, setScores] = useState(FALLBACK_SCORES);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getSustainability()
      .then((res) => {
        if (cancelled) return;
        setScores({
          current: Math.round(res.score.current_score),
          water: Math.round(res.score.water_efficiency_score),
          resource: Math.round(res.score.chemical_reduction_score),
          health: Math.round(res.score.carbon_reduction_score),
        });
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo values.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const score = scores.current;
  const offset = circumference * (1 - score / 100);
  const metricValues = [scores.water, scores.resource, scores.health];
  const metrics = metricDefs.map((m, i) => ({
    ...m,
    value: `${metricValues[i]}%`,
    barWidth: `${metricValues[i]}%`,
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            {t("nav.item.sustainabilityScore")}
          </h1>
          <p className="text-base text-text-muted">{t("sustainability.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <MapPin className="size-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Central Valley · Sector 7</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Link>
        </div>
      </div>

      {/* Score gauge */}
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm sm:p-16">
        <div className="relative flex size-[280px] items-center justify-center sm:size-[300px]">
          <svg viewBox="0 0 300 300" className="size-full -rotate-90">
            <circle cx="150" cy="150" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={20} />
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth={20}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className="font-heading text-6xl font-bold text-slate-900">{score}</p>
            <p className="pt-2 text-lg font-semibold uppercase tracking-[1.8px] text-text-muted">
              {t("sustainability.globalScore")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            {t("sustainability.deltaFromLastMonth")}
          </span>
          <p className="max-w-[480px] text-center text-sm text-text-muted">{t("sustainability.description")}</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.labelKey} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`flex size-12 items-center justify-center rounded-xl ${m.iconBg}`}>
                  <Icon className={`size-5 ${m.iconColor}`} />
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${
                    m.positive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {m.delta}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-text-muted">{t(m.labelKey)}</p>
                <p className="font-heading text-3xl font-bold text-slate-800">{m.value}</p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${m.barColor}`} style={{ width: m.barWidth }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
        >
          {t("sustainability.downloadReport")}
          <Download className="size-4" />
        </button>
      </div>
    </div>
  );
}
