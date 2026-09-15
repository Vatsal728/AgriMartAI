"use client";

import { useEffect, useState } from "react";
import { MapPin, CloudSun } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

type WeatherState = {
  location: string;
  temperatureC: number;
  conditions: string;
  humidityPct: number;
  rainProbabilityPct: number;
  windSpeedKmh: number;
};

const FALLBACK: WeatherState = {
  location: "Central Farm, Iowa",
  temperatureC: 28,
  conditions: "dashboard.weather.partlyCloudy",
  humidityPct: 65,
  rainProbabilityPct: 20,
  windSpeedKmh: 12,
};

export function WeatherCard() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherState>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getLiveWeather()
      .then((res) => {
        if (cancelled) return;
        setWeather({
          location: res.location,
          temperatureC: Math.round(res.temperature_c),
          conditions: res.conditions,
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

  const stats: { label: TranslationKey; value: string }[] = [
    { label: "dashboard.weather.humidity", value: `${weather.humidityPct}%` },
    { label: "dashboard.weather.rainProb", value: `${weather.rainProbabilityPct}%` },
    { label: "dashboard.weather.wind", value: `${weather.windSpeedKmh}km/h` },
  ];

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-[32px] bg-accent p-6 text-white shadow-[0_20px_25px_-5px_rgba(30,58,138,0.2),0_8px_10px_-6px_rgba(30,58,138,0.2)] sm:p-8">
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-white/10 blur-3xl" />
      <div className="flex items-center gap-2 opacity-90">
        <MapPin className="size-4" />
        <span className="text-sm font-medium">{weather.location}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">{weather.temperatureC}°C</p>
          <p className="text-lg font-medium opacity-90">
            {weather.conditions === "dashboard.weather.partlyCloudy" ? t("dashboard.weather.partlyCloudy") : weather.conditions}
          </p>
        </div>
        <CloudSun className="size-16 shrink-0 opacity-95 sm:size-[72px]" strokeWidth={1.5} />
      </div>
      <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{t(s.label)}</p>
            <p className="text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
