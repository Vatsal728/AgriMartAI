"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Bell,
  RefreshCcw,
  CloudRain,
  Thermometer,
  Wind,
  Snowflake,
  Wheat,
  SprayCan,
  Droplets,
  Bug,
  type LucideIcon,
} from "lucide-react";

type Action = {
  id: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  primary: string;
};

const initialActions: Action[] = [
  { id: 1, icon: CloudRain, iconBg: "bg-blue-50", iconColor: "text-blue-500", title: "Delay irrigation - rain likely", body: "85% probability of significant rainfall within the next 6 hours across Sector 7.", primary: "Apply Recommendation" },
  { id: 2, icon: Snowflake, iconBg: "bg-cyan-50", iconColor: "text-cyan-600", title: "High frost risk tonight", body: "Temperatures projected to drop to -2°C between 03:00 and 06:00. Activate thermal covers.", primary: "View Mitigation Plan" },
  { id: 3, icon: Wheat, iconBg: "bg-amber-50", iconColor: "text-amber-600", title: "Optimal harvest window", body: "Consistent sunlight and low humidity forecast for the next 72 hours. Perfect for corn harvest.", primary: "Schedule Crew" },
  { id: 4, icon: SprayCan, iconBg: "bg-red-50", iconColor: "text-red-500", title: "Postpone pesticide spraying", body: "Wind gusts up to 25km/h detected. High risk of chemical drift to neighboring fields.", primary: "Reschedule Spraying" },
  { id: 5, icon: Droplets, iconBg: "bg-orange-50", iconColor: "text-orange-500", title: "Humidity drop alert", body: "Relative humidity falling below 30%. Monitor soil moisture levels in greenhouse Alpha.", primary: "Check Sensors" },
  { id: 6, icon: Bug, iconBg: "bg-rose-50", iconColor: "text-rose-500", title: "Pest outbreak risk", body: "Recent warm and humid conditions are ideal for aphid proliferation. Inspect Sector 4.", primary: "Order Inspection" },
];

export default function RecommendedActionsPage() {
  const [actions, setActions] = useState(initialActions);

  const dismiss = (id: number) => setActions((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Recommended actions</h1>
          <p className="text-base text-text-muted">AI-driven interventions based on live weather data and soil sensors.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <MapPin className="size-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Central Valley - Sector 7</span>
          </div>
          <Link href="/notifications" aria-label="Notifications" className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <CloudRain className="size-8 text-accent" />
            <div>
              <p className="text-xs font-semibold text-text-muted">Current Forecast</p>
              <p className="font-bold text-slate-900">Rain Expected in 4h</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Thermometer className="size-3" />
              Temperature
            </p>
            <p className="font-bold text-slate-900">24°C / 75°F</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Wind className="size-3" />
              Wind Speed
            </p>
            <p className="font-bold text-slate-900">12 km/h NW</p>
          </div>
        </div>
        <button type="button" className="flex shrink-0 items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-lg">
          <RefreshCcw className="size-3.5" />
          Refresh Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${a.iconBg}`}>
                <Icon className={`size-5 ${a.iconColor}`} />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-lg font-bold text-slate-900">{a.title}</h3>
                <p className="text-sm text-text-muted">{a.body}</p>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <button type="button" className="text-brand">{a.primary}</button>
                  <span className="text-slate-300">•</span>
                  <button type="button" onClick={() => dismiss(a.id)} className="text-slate-500">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {actions.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-text-muted">All recommendations handled.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900">Efficiency</p>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">+12%</span>
          </div>
          <div className="flex items-baseline gap-2 pt-4">
            <p className="font-heading text-3xl font-bold text-slate-900">94%</p>
            <p className="text-sm text-text-muted">Water saved</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900">Risk Level</p>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">Moderate</span>
          </div>
          <div className="flex items-baseline gap-2 pt-4">
            <p className="font-heading text-3xl font-bold text-slate-900">Medium</p>
            <p className="text-sm text-text-muted">Next 24h</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900">Automation</p>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
          </div>
          <div className="flex items-baseline gap-2 pt-4">
            <p className="font-heading text-3xl font-bold text-slate-900">8/12</p>
            <p className="text-sm text-text-muted">Tasks scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
