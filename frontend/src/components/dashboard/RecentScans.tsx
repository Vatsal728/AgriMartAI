"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

type ScanItem = {
  id?: string;
  nameKey?: TranslationKey;
  rawName?: string;
  sectorNumber: number;
  date: string;
  status: "HEALTHY" | "ACTION_NEEDED";
  image: string;
};

const defaultScans: ScanItem[] = [
  { nameKey: "dashboard.scan.corn", sectorNumber: 4, date: "Recent · 09:45 AM", status: "HEALTHY", image: "/images/scan-corn.png" },
  { nameKey: "dashboard.scan.tomato", sectorNumber: 1, date: "Recent · 02:12 PM", status: "ACTION_NEEDED", image: "/images/scan-tomato.png" },
  { nameKey: "dashboard.scan.soybean", sectorNumber: 7, date: "Recent · 11:30 AM", status: "HEALTHY", image: "/images/scan-soybean.png" },
  { nameKey: "dashboard.scan.wheat", sectorNumber: 3, date: "Recent · 04:50 PM", status: "HEALTHY", image: "/images/scan-wheat.png" },
];

export function RecentScans() {
  const { t } = useLanguage();
  const [displayScans, setDisplayScans] = useState<ScanItem[]>(defaultScans);

  useEffect(() => {
    let cancelled = false;

    AgriSmartAPI.getRecentDiagnoses(undefined, 8)
      .then((dbScans: any[]) => {
        if (cancelled || !Array.isArray(dbScans) || dbScans.length === 0) return;

        const dynamicItems: ScanItem[] = dbScans.map((d, index) => {
          const isHealthy = (d.disease_name || "").toLowerCase().includes("healthy");
          return {
            id: d.id,
            rawName: d.disease_name || `${d.crop} Leaf`,
            sectorNumber: (index % 8) + 1,
            date: new Date(d.created_at || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: isHealthy ? "HEALTHY" : "ACTION_NEEDED",
            image: d.image_url?.startsWith("/") ? d.image_url : "/images/scan-tomato.png",
          };
        });

        // Combine recent dynamic scans with default items to ensure 4 cards are always displayed
        const combined = [...dynamicItems, ...defaultScans].slice(0, 4);
        setDisplayScans(combined);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-slate-900">{t("dashboard.recentPlantScans")}</h2>
        <Link href="/history" className="text-sm font-bold text-brand">
          {t("dashboard.viewHistory")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayScans.map((scan, idx) => {
          const title = scan.rawName || (scan.nameKey ? t(scan.nameKey) : "Plant Scan");
          const href = scan.id ? `/history/diagnosis?id=${scan.id}` : "/history/diagnosis";

          return (
            <div
              key={scan.id || `${scan.rawName || scan.nameKey}-${idx}`}
              className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src={scan.image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  unoptimized={scan.image.startsWith("/uploads/") || scan.image.startsWith("blob:") || scan.image.startsWith("data:")}
                  className="object-cover"
                />
                <span
                  className={cn(
                    "absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm shadow-sm",
                    scan.status === "HEALTHY" ? "bg-green-500/90" : "bg-orange-500/90"
                  )}
                >
                  {scan.status === "HEALTHY" ? t("dashboard.status.healthy") : t("dashboard.status.actionNeeded")}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900 truncate">{title}</p>
                  <p className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-text-faint">
                    {t("dashboard.sector")} {scan.sectorNumber}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pb-2 text-xs text-text-muted">
                  <Calendar className="size-3" />
                  {scan.date}
                </div>
                <Link
                  href={href}
                  className="w-full rounded-xl border border-border py-2.5 text-center text-xs font-bold tracking-wide text-slate-600 hover:bg-slate-50 transition"
                >
                  {t("common.details")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
