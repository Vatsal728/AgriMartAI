"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  Bell,
  Droplets,
  Sun,
  Sprout,
  Target,
  Radio,
  Bird,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";
import type { ImprovementAction } from "@/types/api";

type Suggestion = {
  id: string;
  icon: LucideIcon;
  title: TranslationKey;
  description: TranslationKey;
  points: number;
};

const fallbackSuggestions: Suggestion[] = [
  { id: "drip", icon: Droplets, title: "sustainabilityImprove.drip.title", description: "sustainabilityImprove.drip.description", points: 8 },
  { id: "solar", icon: Sun, title: "sustainabilityImprove.solar.title", description: "sustainabilityImprove.solar.description", points: 12 },
  { id: "coverCrop", icon: Sprout, title: "sustainabilityImprove.coverCrop.title", description: "sustainabilityImprove.coverCrop.description", points: 5 },
  { id: "fertilizer", icon: Target, title: "sustainabilityImprove.fertilizer.title", description: "sustainabilityImprove.fertilizer.description", points: 7 },
  { id: "sensorMesh", icon: Radio, title: "sustainabilityImprove.sensorMesh.title", description: "sustainabilityImprove.sensorMesh.description", points: 9 },
  { id: "biodiversity", icon: Bird, title: "sustainabilityImprove.biodiversity.title", description: "sustainabilityImprove.biodiversity.description", points: 4 },
];

const icons = [Droplets, Sun, Sprout, Target, Radio, Bird];

export default function SustainabilityImprovePage() {
  const { t } = useLanguage();
  const [actions, setActions] = useState<ImprovementAction[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getSustainability()
      .then((res) => {
        if (!cancelled) setActions(res.actions);
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo suggestions.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleComplete = (action: ImprovementAction) => {
    const nextStatus = action.status === "completed" ? "pending" : "completed";
    setActions((prev) => prev?.map((a) => (a.id === action.id ? { ...a, status: nextStatus } : a)) ?? prev);
    AgriSmartAPI.updateActionStatus(action.id, nextStatus).catch(() => {
      // Revert optimistic update if the backend rejects it.
      setActions((prev) => prev?.map((a) => (a.id === action.id ? { ...a, status: action.status } : a)) ?? prev);
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("sustainabilityImprove.title")}</h1>
          <p className="text-base text-text-muted">{t("sustainabilityImprove.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <MapPin className="size-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Central Valley - Sector 7</span>
          </div>
          <Link href="/notifications" aria-label={t("common.notifications")} className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-surface-muted p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-text-muted">{t("sustainabilityImprove.activeGoal")}</p>
          <p className="font-heading text-2xl font-bold text-slate-900">{t("sustainabilityImprove.targetScore")}</p>
        </div>
        <div className="flex w-full max-w-xs flex-col items-end gap-2">
          <p className="text-sm font-semibold text-slate-700">
            {t("sustainabilityImprove.currentProgress")} <span className="font-bold text-brand">{t("sustainabilityImprove.82percentComplete")}</span>
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[82%] rounded-full bg-brand" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {actions
          ? actions.map((action, i) => {
              const Icon = icons[i % icons.length];
              const completed = action.status === "completed";
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => toggleComplete(action)}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-2xl border p-6 text-left shadow-sm transition-colors",
                    completed ? "border-brand bg-brand/5" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl border",
                        completed ? "border-brand bg-brand text-white" : "border-slate-200"
                      )}
                    >
                      {completed ? <Check className="size-5" /> : <Icon className="size-5 text-brand" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{action.action_title}</h3>
                      <p className="text-sm text-text-muted">{action.description}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
                    +{action.points_reward} {t("sustainabilityImprove.points")}
                  </span>
                </button>
              );
            })
          : fallbackSuggestions.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200">
                      <Icon className="size-5 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t(s.title)}</h3>
                      <p className="text-sm text-text-muted">{t(s.description)}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
                    +{s.points} {t("sustainabilityImprove.points")}
                  </span>
                </div>
              );
            })}
      </div>

      <div className="flex justify-end">
        <button type="button" className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
          {t("sustainabilityImprove.generateRoadmap")}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
