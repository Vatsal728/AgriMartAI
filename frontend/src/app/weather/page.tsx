import Link from "next/link";
import { Bell, Droplets, CloudRain, Wind, CloudSun, Sun, Cloud, CloudDrizzle, Lightbulb } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type Day = { day: string; icon: LucideIcon; high: number; low: number };

const forecast: Day[] = [
  { day: "Mon", icon: Sun, high: 31, low: 19 },
  { day: "Tue", icon: CloudSun, high: 29, low: 18 },
  { day: "Wed", icon: CloudSun, high: 26, low: 16 },
  { day: "Thu", icon: CloudRain, high: 22, low: 15 },
  { day: "Fri", icon: CloudDrizzle, high: 20, low: 14 },
  { day: "Sat", icon: CloudSun, high: 25, low: 15 },
  { day: "Sun", icon: Sun, high: 30, low: 17 },
];

export default function WeatherPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-base font-medium text-text-muted">Regional Environmental Data</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Weather
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-sm font-semibold text-slate-600">Station Active</span>
          </div>
          <Link href="/notifications"
            aria-label="Notifications"
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
            <p className="text-lg font-bold text-accent">Current Conditions</p>
            <p className="text-base font-medium text-slate-600">Sacramento Valley, CA</p>
          </div>
          <div className="flex items-center gap-8">
            <p className="font-heading text-6xl font-extrabold tracking-tight text-slate-900">28°C</p>
            <div className="flex flex-col gap-1 border-l border-blue-200 pl-8">
              <p className="text-2xl font-bold text-accent">Partly Cloudy</p>
              <p className="text-base text-text-muted">Feels like 30°C</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-10">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Droplets className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Humidity</p>
                <p className="text-base font-bold text-slate-900">42%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <CloudRain className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Rain Chance</p>
                <p className="text-base font-bold text-slate-900">12%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Wind className="size-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Wind</p>
                <p className="text-base font-bold text-slate-900">8 km/h</p>
              </div>
            </div>
          </div>
        </div>
        <Cloud className="size-32 shrink-0 text-accent/60 sm:size-40" strokeWidth={1} />
      </div>

      {/* 7-day forecast */}
      <div className="flex flex-col gap-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900">7-Day Forecast</h2>
          <Link href="/weather/recommended-actions" className="rounded-xl border border-slate-200 bg-surface-muted px-4 py-2 text-sm font-bold text-slate-900">
            Details
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-7">
          {forecast.map((d, i) => {
            const Icon = d.icon;
            return (
              <div
                key={d.day}
                className={i === 0 ? "flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-surface-muted p-5" : "flex flex-col items-center gap-4 rounded-2xl p-5"}
              >
                <p className="text-sm font-bold text-text-muted">{d.day}</p>
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
            <p className="font-bold text-slate-900">Agriculture Insight</p>
            <p className="text-sm text-text-muted">
              Moderate rain expected Thursday. Optimal time for fertilizer application is before
              Wednesday evening.
            </p>
          </div>
        </div>
        <button type="button" className="shrink-0 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm">
          Download History
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6 text-[11px] text-text-faint">
        <p>Data provided by Regional Meteorological Center &amp; AgriSmart AI Sensors. Updated 2 minutes ago.</p>
        <div className="flex gap-4 font-bold uppercase tracking-wide">
          <span>Support</span>
          <span>API Access</span>
        </div>
      </div>
    </div>
  );
}
