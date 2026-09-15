"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Droplets, ChevronDown, Clock, TrendingUp, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

type Slot = { time: string; detail: TranslationKey };

const week: { day: TranslationKey; date: number; slots: Slot[] }[] = [
  { day: "schedule.day.mon", date: 20, slots: [{ time: "06:00 AM", detail: "schedule.slot.zone1Morning" }] },
  { day: "schedule.day.tue", date: 21, slots: [
    { time: "06:00 AM", detail: "schedule.slot.zone1Morning" },
    { time: "08:00 PM", detail: "schedule.slot.zone2Evening" },
  ] },
  { day: "schedule.day.wed", date: 22, slots: [] },
  { day: "schedule.day.thu", date: 23, slots: [{ time: "06:00 AM", detail: "schedule.slot.zone1Morning" }] },
  { day: "schedule.day.fri", date: 24, slots: [{ time: "09:00 AM", detail: "schedule.slot.manualOverride" }] },
  { day: "schedule.day.sat", date: 25, slots: [] },
  { day: "schedule.day.sun", date: 26, slots: [] },
];

export default function IrrigationSchedulePage() {
  const { t } = useLanguage();
  const [autoScheduling, setAutoScheduling] = useState(true);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-muted">{t("moistureTrend.breadcrumb")}</p>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("schedule.title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">{t("dashboard.systemLive")}</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <p className="font-bold text-slate-900">{t("schedule.weeklyView")}</p>
            <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Oct 20 - Oct 26
              <ChevronDown className="size-3" />
            </button>
          </div>
          <label className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">{t("schedule.automaticScheduling")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoScheduling}
              onClick={() => setAutoScheduling((v) => !v)}
              className={cn("relative h-6 w-11 rounded-full transition-colors", autoScheduling ? "bg-brand" : "bg-slate-200")}
            >
              <span className={cn("absolute top-1 size-4 rounded-full bg-white transition-transform", autoScheduling ? "translate-x-6" : "translate-x-1")} />
            </button>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl border border-slate-200 sm:grid-cols-7 sm:gap-0 sm:divide-x sm:divide-slate-200">
          {week.map((d) => (
            <div key={d.day} className="flex flex-col">
              <div className="border-b border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-600">{t(d.day)}</p>
                <p className="font-heading text-2xl font-bold text-slate-900">{d.date}</p>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                {d.slots.map((s) => (
                  <div key={s.time} className="rounded-lg border border-brand/20 bg-brand/5 p-2.5">
                    <p className="text-xs font-bold text-slate-900">{s.time}</p>
                    <p className="text-[11px] text-text-muted">{t(s.detail)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
              <Droplets className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{t("schedule.manualOverride")}</p>
              <p className="text-sm text-text-muted">{t("schedule.manualOverrideBody")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <Clock className="size-3.5" />
              {t("schedule.15Minutes")}
              <ChevronDown className="size-3" />
            </button>
            <button type="button" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
              {t("schedule.waterNow")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-text-muted">{t("schedule.nextScheduled")}</p>
          <p className="pt-2 font-heading text-xl font-bold text-slate-900">{t("schedule.tomorrow6am")}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-text-muted">{t("schedule.weeklyConsumption")}</p>
          <p className="pt-2 font-heading text-2xl font-bold text-slate-900">42.8 L/sqm</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-text-muted">{t("schedule.optimizationRate")}</p>
          <p className="flex items-center gap-1.5 pt-2 font-heading text-2xl font-bold text-brand">
            <TrendingUp className="size-4" />
            +12.4%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            <Gauge className="size-3.5" />
            {t("irrigation.status")}
          </p>
          <p className="pt-2 font-heading text-2xl font-bold text-brand">{t("schedule.balanced")}</p>
        </div>
      </div>
    </div>
  );
}
