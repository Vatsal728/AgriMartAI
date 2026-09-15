"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Languages, AlertTriangle, Droplets, CloudLightning, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

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
  const router = useRouter();
  const { t, language } = useLanguage();
  const [diseaseAlerts, setDiseaseAlerts] = useState(true);
  const [irrigationReminders, setIrrigationReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  const currentLanguageLabel = SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label ?? "English";

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("settings.title")}</h1>
        <p className="text-base text-text-muted">{t("settings.subtitle")}</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">{t("settings.language")}</h2>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => router.push("/onboarding/language")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <Languages className="size-5 text-slate-700" />
              </div>
              <p className="font-bold text-slate-900">{t("settings.language")}</p>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-text-muted">
              {currentLanguageLabel}
              <ChevronRight className="size-3.5" />
            </span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">{t("settings.notifications")}</h2>
        <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <AlertTriangle className="size-5 text-slate-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{t("settings.diseaseAlerts")}</p>
                <p className="text-xs text-text-muted">{t("settings.diseaseAlertsBody")}</p>
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
                <p className="font-bold text-slate-900">{t("settings.irrigationReminders")}</p>
                <p className="text-xs text-text-muted">{t("settings.irrigationRemindersBody")}</p>
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
                <p className="font-bold text-slate-900">{t("settings.weatherAlerts")}</p>
                <p className="text-xs text-text-muted">{t("settings.weatherAlertsBody")}</p>
              </div>
            </div>
            <Toggle checked={weatherAlerts} onChange={() => setWeatherAlerts((v) => !v)} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button type="button" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600">
          {t("common.cancel")}
        </button>
        <button type="button" className="rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white">
          {t("profile.saveChanges")}
        </button>
      </div>
    </div>
  );
}
