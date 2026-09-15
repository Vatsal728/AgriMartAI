"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Droplets, CloudRain, Wind, CloudSun, Sun, Cloud, CloudDrizzle, Lightbulb } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

type Day = { dayKey: TranslationKey; icon: LucideIcon; high: number; low: number };

const forecast: Day[] = [
  { dayKey: "schedule.day.mon", icon: Sun, high: 31, low: 19 },
  { dayKey: "schedule.day.tue", icon: CloudSun, high: 29, low: 18 },
  { dayKey: "schedule.day.wed", icon: CloudSun, high: 26, low: 16 },
  { dayKey: "schedule.day.thu", icon: CloudRain, high: 22, low: 15 },
  { dayKey: "schedule.day.fri", icon: CloudDrizzle, high: 20, low: 14 },
  { dayKey: "schedule.day.sat", icon: CloudSun, high: 25, low: 15 },
  { dayKey: "schedule.day.sun", icon: Sun, high: 30, low: 17 },
];

type CurrentConditions = {
  location: string;
  temperatureC: number;
  humidityPct: number;
  rainProbabilityPct: number;
  windSpeedKmh: number;
};

const FALLBACK_CONDITIONS: CurrentConditions = {
  location: "Sacramento Valley, CA",
  temperatureC: 28,
  humidityPct: 42,
  rainProbabilityPct: 12,
  windSpeedKmh: 8,
};

export default function WeatherPage() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState<CurrentConditions>(FALLBACK_CONDITIONS);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getLiveWeather()
      .then((res) => {
        if (cancelled) return;
        setCurrent({
          location: res.location,
          temperatureC: Math.round(res.temperature_c),
          humidityPct: Math.round(res.humidity_pct),
          rainProbabilityPct: Math.round(res.rain_probability_pct),
          windSpeedKmh: Math.round(res.wind_speed_kmh),
        });
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo values.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-base font-medium text-text-muted">{t("weather.regionalData")}</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t("nav.item.weather")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-sm font-semibold text-slate-600">{t("weather.stationActive")}</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="relative flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500" />
          </Link>
        </div>
      </div>

      {/* Current conditions */}
      <div className="flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[32px] border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-lg font-bold text-accent">{t("weather.currentConditions")}</p>
            <p className="text-base font-medium text-slate-600">{current.location}</p>
          </div>
          <div className="flex items-center gap-8">
            <p className="font-heading text-6xl font-extrabold tracking-tight text-slate-900">{current.temperatureC}°C</p>
            <div className="flex flex-col gap-1 border-l border-blue-200 pl-8">
              <p className="text-2xl font-bold text-accent">{t("dashboard.weather.partlyCloudy")}</p>
              <p className="text-base text-text-muted">{t("weather.feelsLike30")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-10">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Droplets className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("dashboard.weather.humidity")}</p>
                <p className="text-base font-bold text-slate-900">{current.humidityPct}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <CloudRain className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("weather.rainChance")}</p>
                <p className="text-base font-bold text-slate-900">{current.rainProbabilityPct}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Wind className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("dashboard.weather.wind")}</p>
                <p className="text-base font-bold text-slate-900">{current.windSpeedKmh} km/h</p>
              </div>
            </div>
          </div>
        </div>
        <Cloud className="size-32 shrink-0 text-accent/60 sm:size-40" strokeWidth={1} />
      </div>

      {/* 7-day forecast */}
      <div className="flex flex-col gap-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900">{t("weather.sevenDayForecast")}</h2>
          <Link href="/weather/recommended-actions" className="rounded-xl border border-slate-200 bg-surface-muted px-4 py-2 text-sm font-bold text-slate-900">
            {t("common.details")}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-7">
          {forecast.map((d, i) => {
            const Icon = d.icon;
            return (
              <div
                key={d.dayKey}
                className={i === 0 ? "flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-surface-muted p-5" : "flex flex-col items-center gap-4 rounded-2xl p-5"}
              >
                <p className="text-sm font-bold text-text-muted">{t(d.dayKey)}</p>
                <Icon className="size-7 text-accent" />
                <div className="flex flex-col items-center">
                  <p className="text-lg font-extrabold text-slate-900">{d.high}°</p>
                  <p className="text-sm font-medium text-slate-400">{d.low}°</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agriculture insight */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-surface-muted p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Lightbulb className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{t("weather.agricultureInsight")}</p>
            <p className="text-sm text-text-muted">{t("weather.agricultureInsightBody")}</p>
          </div>
        </div>
        <button type="button" className="shrink-0 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm">
          {t("weather.downloadHistory")}
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6 text-[11px] text-text-faint">
        <p>{t("weather.dataProvidedBy")}</p>
        <div className="flex gap-4 font-bold uppercase tracking-wide">
          <span>{t("weather.support")}</span>
          <span>{t("weather.apiAccess")}</span>
        </div>
      </div>
    </div>
  );
}
