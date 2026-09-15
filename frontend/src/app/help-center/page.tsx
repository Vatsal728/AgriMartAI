"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LifeBuoy, Database, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const faqs: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "helpCenter.faq.accuracy.q", a: "helpCenter.faq.accuracy.a" },
  { q: "helpCenter.faq.satellite.q", a: "helpCenter.faq.satellite.a" },
  { q: "helpCenter.faq.offline.q", a: "helpCenter.faq.offline.a" },
];

const modelStats: { label: TranslationKey; value: string }[] = [
  { label: "helpCenter.stat.accuracy", value: "94.2%" },
  { label: "helpCenter.stat.macroF1", value: "0.92" },
  { label: "helpCenter.stat.trainingSamples", value: "2.4M" },
];

export default function HelpCenterPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("helpCenter.title")}</h1>
        <p className="text-base text-text-muted">{t("helpCenter.subtitle")}</p>
      </div>

      {/* FAQ */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="font-bold text-slate-900">{t("helpCenter.faqHeading")}</h2>
          <p className="text-sm text-text-muted">{t("helpCenter.faqSubheading")}</p>
        </div>
        <div className="flex flex-col divide-y divide-slate-200">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900">{t(faq.q)}</p>
                    {open && <p className="pt-2 text-sm text-text-muted">{t(faq.a)}</p>}
                  </div>
                  <ChevronDown
                    className={cn("mt-1 size-3 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact support */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
            <LifeBuoy className="size-5 text-slate-700" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{t("helpCenter.needAssistance")}</p>
            <p className="text-sm text-text-muted">{t("helpCenter.needAssistanceBody")}</p>
          </div>
        </div>
        <button type="button" className="rounded-xl border-2 border-sky-400 px-6 py-3 text-sm font-bold text-sky-700">
          {t("login.footer.contactSupport")}
        </button>
      </div>

      {/* About the model */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-surface-muted/50 p-6">
          <h2 className="font-bold text-slate-900">{t("helpCenter.aboutModel")}</h2>
        </div>
        <div className="flex flex-col gap-8 p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {modelStats.map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-surface-muted p-4">
                <p className="text-xs font-bold uppercase text-text-muted">{t(s.label)}</p>
                <p className="font-heading text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Database className="mt-1 size-5 shrink-0 text-slate-500" />
            <div>
              <p className="text-sm font-bold text-slate-900">{t("helpCenter.datasetSource")}</p>
              <p className="text-sm text-text-muted">
                {t("helpCenter.datasetSourceBodyPrefix")}{" "}
                <span className="font-semibold text-slate-700">{t("helpCenter.datasetName")}</span>
                {t("helpCenter.datasetSourceBodySuffix")}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <GitBranch className="mt-1 size-5 shrink-0 text-slate-500" />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-slate-900">{t("helpCenter.modelVersioning")}</p>
              <div className="flex gap-2">
                <span className="rounded border border-slate-200 bg-surface-muted px-2 py-1 font-mono text-[10px] text-text-muted">
                  agri-vit-base-v4.2.1
                </span>
                <span className="rounded border border-slate-200 bg-surface-muted px-2 py-1 font-mono text-[10px] text-text-muted">
                  {t("helpCenter.releasedQ3")}
                </span>
              </div>
              <p className="text-[11px] text-text-faint">{t("helpCenter.modelUpdateNote")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/settings" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600">
          {t("helpCenter.backToSettings")}
        </Link>
      </div>
    </div>
  );
}
