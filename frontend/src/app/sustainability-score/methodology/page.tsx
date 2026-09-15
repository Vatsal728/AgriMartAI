"use client";

import { Code2, Droplets, Recycle, Sprout } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const weights: { labelKey: TranslationKey; color: string; width: string }[] = [
  { labelKey: "methodology.weight.water", color: "bg-blue-500", width: "45%" },
  { labelKey: "methodology.weight.resource", color: "bg-amber-500", width: "30%" },
  { labelKey: "methodology.weight.cropHealth", color: "bg-brand", width: "25%" },
];

const metrics: { id: string; icon: typeof Droplets; title: TranslationKey; body: TranslationKey }[] = [
  {
    id: "water",
    icon: Droplets,
    title: "methodology.metric.water.title",
    body: "methodology.metric.water.body",
  },
  {
    id: "resource",
    icon: Recycle,
    title: "methodology.metric.resource.title",
    body: "methodology.metric.resource.body",
  },
  {
    id: "cropHealth",
    icon: Sprout,
    title: "methodology.metric.cropHealth.title",
    body: "methodology.metric.cropHealth.body",
  },
];

export default function MethodologyTransparencyPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("methodology.title")}</h1>
        <p className="text-base leading-relaxed text-text-muted">{t("methodology.intro")}</p>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">{t("methodology.compositionWeights")}</h2>
        <div className="flex h-8 w-full overflow-hidden rounded-full">
          {weights.map((w) => (
            <div key={w.labelKey} className={w.color} style={{ width: w.width }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6">
          {weights.map((w) => (
            <span key={w.labelKey} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className={`size-3 rounded-full ${w.color}`} />
              {t(w.labelKey)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-heading text-2xl font-bold text-slate-900">{t("methodology.formulaHeading")}</h2>
        <p className="text-base text-text-muted">{t("methodology.formulaIntro")}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
            <span className="flex items-center gap-2 rounded bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <Code2 className="size-3" />
              {t("methodology.logicDefinition")}
            </span>
          </div>
          <div className="flex flex-col gap-4 p-6 font-mono text-sm text-emerald-300">
            <p className="text-white">Sustainability_Score = (WE * 0.45) + (RU * 0.30) + (CH * 0.25)</p>
            <div className="flex flex-col gap-1.5 text-slate-400">
              <p>{"// "}{t("methodology.comment.we")}</p>
              <p>{"// "}{t("methodology.comment.ru")}</p>
              <p>{"// "}{t("methodology.comment.ch")}</p>
              <p>{"// "}{t("methodology.comment.bounded")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="flex gap-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface-muted">
                <Icon className="size-5 text-brand" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{t(m.title)}</h3>
                <p className="pt-2 text-sm leading-relaxed text-text-muted">{t(m.body)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="border-t border-slate-100 pt-6 text-center text-xs text-text-faint">{t("methodology.footer")}</p>
    </div>
  );
}
