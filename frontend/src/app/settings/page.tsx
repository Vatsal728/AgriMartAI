"use client";

import { useState } from "react";
import { Languages, AlertTriangle, Droplets, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative h-6 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "absolute top-1 size-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-[28px]" : "translate-x-1"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [diseaseAlerts, setDiseaseAlerts] = useState(true);
  const [irrigationReminders, setIrrigationReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-base text-text-muted">Manage your account preferences and alert configurations</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Language</h2>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <Languages className="size-5 text-slate-700" />
              </div>
              <p className="font-bold text-slate-900">Language</p>
            </div>
            <span className="text-sm font-medium text-text-muted">English</span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Notifications</h2>
        <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <AlertTriangle className="size-5 text-slate-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Disease alerts</p>
                <p className="text-xs text-text-muted">Instant notification for detected leaf anomalies</p>
              </div>
            </div>
            <Toggle checked={diseaseAlerts} onChange={() => setDiseaseAlerts((v) => !v)} />
          </div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <Droplets className="size-5 text-slate-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Irrigation reminders</p>
                <p className="text-xs text-text-muted">Alerts for scheduled sector watering cycles</p>
              </div>
            </div>
            <Toggle checked={irrigationReminders} onChange={() => setIrrigationReminders((v) => !v)} />
          </div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <CloudLightning className="size-5 text-slate-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Weather alerts</p>
                <p className="text-xs text-text-muted">Critical weather changes impacting farm sectors</p>
              </div>
            </div>
            <Toggle checked={weatherAlerts} onChange={() => setWeatherAlerts((v) => !v)} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button type="button" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600">
          Cancel
        </button>
        <button type="button" className="rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
}
