"use client";

import Link from "next/link";
import { ChevronRight, Droplets, FileDown, PlayCircle, Radio, CloudRain, Scale, Bell, Bot, ArrowRight, FileSearch } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

type Step = {
  id: string;
  icon: typeof Radio;
  stepKey: TranslationKey;
  statusKey: TranslationKey;
  isRunning?: boolean;
  title: TranslationKey;
  body: TranslationKey;
  tags?: string[];
  callout?: { title: TranslationKey; body: TranslationKey };
  stats?: { label: TranslationKey; value: string }[];
  progress?: number;
};

const steps: Step[] = [
  {
    id: "step1",
    icon: Radio,
    stepKey: "reasoningTrace.step1",
    statusKey: "reasoningTrace.step1.status",
    title: "reasoningTrace.step1.title",
    body: "reasoningTrace.step1.body",
    tags: ["ID: S-992", "Value: 0.42%"],
  },
  {
    id: "step2",
    icon: CloudRain,
    stepKey: "reasoningTrace.step2",
    statusKey: "reasoningTrace.step2.status",
    title: "reasoningTrace.step2.title",
    body: "reasoningTrace.step2.body",
    callout: { title: "reasoningTrace.step2.calloutTitle", body: "reasoningTrace.step2.calloutBody" },
  },
  {
    id: "step3",
    icon: Scale,
    stepKey: "reasoningTrace.step3",
    statusKey: "reasoningTrace.step3.status",
    title: "reasoningTrace.step3.title",
    body: "reasoningTrace.step3.body",
    stats: [
      { label: "reasoningTrace.step3.stat.risk", value: "Medium-Low" },
      { label: "reasoningTrace.step3.stat.waterEfficiency", value: "88% (Projected)" },
    ],
  },
  {
    id: "step4",
    icon: Bell,
    stepKey: "reasoningTrace.step4",
    statusKey: "reasoningTrace.step4.status",
    isRunning: true,
    title: "reasoningTrace.step4.title",
    body: "reasoningTrace.step4.body",
    progress: 65,
  },
];

export default function ReasoningTraceDetailPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/agentic-advisor" className="font-medium">{t("reasoningTrace.aiAdvisor")}</Link>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-slate-900">{t("reasoningTrace.breadcrumb")}</span>
          </p>
          <h1 className="pt-2 font-heading text-3xl font-bold text-slate-900">{t("reasoningTrace.title")}</h1>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm">
            <FileDown className="size-3.5" />
            {t("reasoningTrace.exportLog")}
          </button>
          <button type="button" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg">
            <PlayCircle className="size-3.5" />
            {t("reasoningTrace.executeAdvice")}
          </button>
        </div>
      </div>

      <div className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
          <Droplets className="size-8 text-blue-500" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">{t("reasoningTrace.heading")}</h2>
          <p className="pt-2 text-sm leading-relaxed text-text-muted">{t("reasoningTrace.headingBody")}</p>
        </div>
      </div>

      <div className="flex flex-col">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.id} className="flex gap-6 pb-10">
              <div className="relative flex flex-col items-center">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <Icon className="size-6 text-brand" />
                </div>
                {!isLast && <span className="absolute top-14 h-full w-0.5 bg-slate-200" />}
              </div>
              <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-text-faint">
                  <span>{t(s.stepKey)}</span>
                  <span className={s.isRunning ? "text-amber-600" : ""}>{t(s.statusKey)}</span>
                </div>
                <h3 className="pt-3 font-heading text-lg font-bold text-slate-900">{t(s.title)}</h3>
                <p className="pt-3 text-sm leading-relaxed text-slate-600">{t(s.body)}</p>

                {s.tags && (
                  <div className="flex gap-2 pt-4">
                    {s.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-slate-200 bg-surface-muted px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {s.callout && (
                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <CloudRain className="size-6 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900">{t(s.callout.title)}</p>
                      <p className="text-xs text-text-muted">{t(s.callout.body)}</p>
                    </div>
                  </div>
                )}

                {s.stats && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {s.stats.map((st) => (
                      <div key={st.label} className="rounded-2xl bg-surface-muted p-4">
                        <p className="text-xs text-text-muted">{t(st.label)}</p>
                        <p className="font-bold text-slate-900">{st.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {typeof s.progress === "number" && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{s.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 rounded-3xl bg-brand-dark p-10 text-center text-white">
        <Bot className="size-16 text-white/30" strokeWidth={1} />
        <span className="rounded-full border border-white/30 px-4 py-1 text-xs font-bold uppercase tracking-wide">
          {t("reasoningTrace.finalConclusion")}
        </span>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">{t("reasoningTrace.conclusionTitle")}</h2>
        <p className="max-w-xl text-sm text-emerald-50/80">{t("reasoningTrace.conclusionBody")}</p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-brand-dark shadow-lg">
            {t("reasoningTrace.approveExecute")}
            <ArrowRight className="size-4" />
          </button>
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-sm font-bold text-white">
            <FileSearch className="size-4" />
            {t("reasoningTrace.reviewRawLogs")}
          </button>
        </div>
      </div>
    </div>
  );
}
