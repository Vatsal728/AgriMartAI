"use client";

import Link from "next/link";
import {
  Leaf,
  ScanLine,
  Sprout,
  Droplet,
  CloudSun,
  BarChart3,
  Bot,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const stats: { value: string; label: TranslationKey }[] = [
  { value: "94.2%", label: "landing.stat.accuracy" },
  { value: "45+", label: "landing.stat.species" },
  { value: "2", label: "landing.stat.languages" },
];

const features: { icon: typeof ScanLine; title: TranslationKey; description: TranslationKey }[] = [
  {
    icon: ScanLine,
    title: "landing.feature.detection.title",
    description: "landing.feature.detection.description",
  },
  {
    icon: MessageCircle,
    title: "landing.feature.assistant.title",
    description: "landing.feature.assistant.description",
  },
  {
    icon: Sprout,
    title: "landing.feature.cropRecommendation.title",
    description: "landing.feature.cropRecommendation.description",
  },
  {
    icon: Droplet,
    title: "landing.feature.irrigation.title",
    description: "landing.feature.irrigation.description",
  },
  {
    icon: CloudSun,
    title: "landing.feature.weather.title",
    description: "landing.feature.weather.description",
  },
  {
    icon: BarChart3,
    title: "landing.feature.sustainability.title",
    description: "landing.feature.sustainability.description",
  },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand">
            <Leaf className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-bold text-brand">{t("common.appName")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-700 sm:block">
            {t("login.tab.login")}
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm"
          >
            {t("landing.getStarted")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-muted px-6 py-20 sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand">
            {t("landing.badge")}
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            {t("landing.heroTitlePrefix")} <span className="text-brand">{t("landing.heroTitleHighlight")}</span>
          </h1>
          <p className="max-w-xl text-lg text-text-muted">{t("landing.heroDescription")}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg"
            >
              {t("landing.getStarted")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-800"
            >
              {t("login.tab.login")}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <p className="font-heading text-3xl font-bold text-brand sm:text-4xl">{s.value}</p>
                <p className="text-sm text-text-muted">{t(s.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">{t("landing.featuresHeading")}</h2>
            <p className="text-text-muted">{t("landing.featuresSubheading")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">{t(f.title)}</h3>
                  <p className="text-sm text-text-muted">{t(f.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agentic advisor callout */}
      <section className="px-6 pb-20 sm:px-12 sm:pb-28">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-[40px] bg-brand px-8 py-16 text-center text-white sm:px-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <Bot className="size-6" />
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{t("landing.advisorHeading")}</h2>
          <p className="max-w-xl text-emerald-50/80">{t("landing.advisorDescription")}</p>
          <Link
            href="/login"
            className="mt-2 flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand shadow-lg"
          >
            {t("landing.startFreeToday")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 border-t border-slate-100 px-6 py-10 text-sm text-text-muted sm:flex-row sm:justify-between sm:px-12">
        <div className="flex items-center gap-2">
          <Leaf className="size-4 text-brand" />
          <span className="font-semibold text-slate-700">{t("common.appName")}</span>
        </div>
        <p>{t("login.footer.rights")}</p>
      </footer>
    </div>
  );
}
