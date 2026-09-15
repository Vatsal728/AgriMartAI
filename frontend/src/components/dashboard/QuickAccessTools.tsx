"use client";

import Link from "next/link";
import { Sprout, Droplet, CloudSun, Leaf, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const tools: { label: TranslationKey; description: TranslationKey; href: string; icon: LucideIcon }[] = [
  { label: "dashboard.tool.cropAnalysis", description: "dashboard.tool.cropAnalysis.desc", href: "/crop-recommendation", icon: Sprout },
  { label: "nav.item.irrigation", description: "dashboard.tool.irrigation.desc", href: "/irrigation", icon: Droplet },
  { label: "dashboard.tool.weatherPro", description: "dashboard.tool.weatherPro.desc", href: "/weather", icon: CloudSun },
  { label: "dashboard.tool.ecoScore", description: "dashboard.tool.ecoScore.desc", href: "/sustainability-score", icon: Leaf },
];

export function QuickAccessTools() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-slate-900">{t("dashboard.quickAccessTools")}</h2>
        <button type="button" className="text-sm font-bold text-brand">
          {t("dashboard.customizeDashboard")}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-5 rounded-3xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface-muted">
                <Icon className="size-5 text-brand" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{t(tool.label)}</p>
                <p className="text-xs text-text-muted">{t(tool.description)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
