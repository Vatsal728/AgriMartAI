"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

type Status = "healthy" | "diseased";
type Severity = "Optimal" | "Mild" | "Severe";

type Scan = {
  id: string;
  name: TranslationKey | string;
  rawName?: string;
  date: string;
  status: Status;
  severity: Severity;
  image: string;
  aiAnalyzed?: boolean;
};

const scans: Scan[] = [
  { id: "tomato-early-blight", name: "history.scan.tomatoEarlyBlight", date: "May 15, 2024 · 10:45 AM", status: "diseased", severity: "Severe", image: "/images/history-tomato-blight.png", aiAnalyzed: true },
  { id: "healthy-tomato", name: "history.scan.healthyTomato", date: "May 14, 2024 · 02:20 PM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-tomato.png" },
  { id: "spider-mites", name: "history.scan.spiderMites", date: "May 12, 2024 · 09:15 AM", status: "diseased", severity: "Mild", image: "/images/history-spider-mites.png" },
  { id: "leaf-spot", name: "history.scan.leafSpot", date: "May 10, 2024 · 04:55 PM", status: "diseased", severity: "Mild", image: "/images/history-leaf-spot.png" },
  { id: "healthy-cucumber", name: "history.scan.healthyCucumber", date: "May 08, 2024 · 11:30 AM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-cucumber.png" },
  { id: "powdery-mildew", name: "history.scan.powderyMildew", date: "May 05, 2024 · 03:10 PM", status: "diseased", severity: "Severe", image: "/images/history-powdery-mildew.png" },
  { id: "healthy-pepper", name: "history.scan.healthyPepper", date: "May 02, 2024 · 08:40 AM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-pepper.png" },
  { id: "late-blight", name: "history.scan.lateBlight", date: "April 28, 2024 · 05:25 PM", status: "diseased", severity: "Severe", image: "/images/history-late-blight.png" },
];

const severityStyles: Record<Severity, { dot: string; badgeBg: string; badgeText: string; labelKey: TranslationKey }> = {
  Optimal: { dot: "bg-green-500", badgeBg: "bg-emerald-50", badgeText: "text-brand", labelKey: "history.severity.optimal" },
  Mild: { dot: "bg-amber-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700", labelKey: "history.severity.mild" },
  Severe: { dot: "bg-red-500", badgeBg: "bg-red-50", badgeText: "text-red-600", labelKey: "history.severity.severe" },
};

const filters: { label: TranslationKey; value: "all" | "healthy" | "diseased" | "week" }[] = [
  { label: "history.filter.all", value: "all" },
  { label: "history.filter.healthy", value: "healthy" },
  { label: "history.filter.diseased", value: "diseased" },
  { label: "history.filter.thisWeek", value: "week" },
];

export default function HistoryPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [dbScans, setDbScans] = useState<any[]>([]);
  const [dbSessions, setDbSessions] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getRecentDiagnoses()
      .then((res: any) => {
        if (!cancelled && Array.isArray(res)) setDbScans(res);
      })
      .catch(() => {});

    AgriSmartAPI.getSessions()
      .then((res: any) => {
        if (!cancelled && Array.isArray(res)) setDbSessions(res);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const displayScans = useMemo(() => {
    const dbItems = dbScans.map((d) => ({
      id: d.id,
      name: d.disease_name,
      rawName: d.disease_name,
      date: new Date(d.created_at || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: (d.disease_name || "").toLowerCase().includes("healthy") ? ("healthy" as Status) : ("diseased" as Status),
      severity: (d.severity as Severity) || "Mild",
      image: d.image_url?.startsWith("/") ? d.image_url : "/images/result-leaf-large.png",
      aiAnalyzed: true,
    }));
    return [...dbItems, ...scans];
  }, [dbScans]);

  const filtered = useMemo(() => {
    if (filter === "all" || filter === "week") return displayScans;
    return displayScans.filter((s) => s.status === filter);
  }, [filter, displayScans]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("nav.item.history")}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">{t("common.aiModelOnline")}</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? "rounded-full bg-brand px-5 py-2 text-sm font-bold text-white"
                : "rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600"
            }
          >
            {t(f.label)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-sm font-medium text-text-muted">
          {t("history.sortByDate")}
          <ChevronDown className="size-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((scan) => {
          const s = severityStyles[scan.severity] || severityStyles.Mild;
          return (
            <Link
              key={scan.id}
              href={`/history/diagnosis?id=${scan.id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
            >
              <div className="relative h-44 w-full">
                <Image 
                  src={scan.image} 
                  alt={typeof scan.name === "string" ? scan.name : t(scan.name)} 
                  fill 
                  sizes="(min-width: 1024px) 25vw, 50vw" 
                  unoptimized={scan.image.startsWith("blob:") || scan.image.startsWith("data:")}
                  className="object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                {scan.aiAnalyzed && (
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t("history.aiAnalyzed")}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 p-5">
                <div className="flex items-start justify-between">
                  <p className="font-extrabold text-slate-900 group-hover:text-brand">
                    {scan.rawName || (typeof scan.name === "string" ? scan.name : t(scan.name))}
                  </p>
                  <span className={`mt-1 size-3 shrink-0 rounded-full ${s.dot}`} />
                </div>
                <p className="text-xs text-text-muted">{scan.date}</p>
                <div className="pt-4">
                  <span className={`inline-block rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${s.badgeBg} ${s.badgeText}`}>
                    {t(s.labelKey)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {dbSessions.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-8">
          <h2 className="font-heading text-xl font-bold text-slate-900">Recent Chat Consultations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dbSessions.map((ses) => (
              <Link
                key={ses.id}
                href="/chat-assistant"
                onClick={() => sessionStorage.setItem("chat-session-id", ses.id)}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-brand">{ses.crop || "General"}</span>
                  <span className="text-xs text-slate-400">{new Date(ses.updated_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <p className="font-bold text-slate-800">{ses.title}</p>
                <p className="text-xs text-slate-500">{ses.location || "Ahmedabad, Gujarat"}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-8">
        <p className="text-[13px] font-medium text-text-muted">{t("scanLeaf.treatment.source")}</p>
        <button type="button" className="flex items-center gap-2 text-sm font-bold text-accent">
          <MessageCircleQuestion className="size-4" />
          {t("scanLeaf.treatment.askFollowUp")}
        </button>
      </div>
    </div>
  );
}
