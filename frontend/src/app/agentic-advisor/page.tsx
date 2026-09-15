"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, ListFilter, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

type Status = "Pending" | "Actioned" | "Notified";

const statusStyles: Record<Status, string> = {
  Pending: "bg-amber-50 border-amber-200 text-amber-800",
  Actioned: "bg-teal-50 border-teal-200 text-brand",
  Notified: "bg-slate-50 border-slate-200 text-slate-600",
};

const statusLabelKeys: Record<Status, TranslationKey> = {
  Pending: "advisor.status.pending",
  Actioned: "advisor.status.actioned",
  Notified: "advisor.status.notified",
};

type ActivityItem = {
  id: number;
  title: TranslationKey;
  status: Status;
  timestamp: string;
  body: TranslationKey;
  stats?: { label: TranslationKey; value: string; highlight?: boolean }[];
  actions?: [TranslationKey, TranslationKey];
  faded?: boolean;
};

const initialActivity: ActivityItem[] = [
  {
    id: 1,
    title: "advisor.item1.title",
    status: "Pending",
    timestamp: "Today, 10:42 AM · Field Sector B-12",
    body: "advisor.item1.body",
    actions: ["advisor.reviewDetails", "advisor.dismiss"],
  },
  {
    id: 2,
    title: "advisor.item2.title",
    status: "Actioned",
    timestamp: "Today, 06:15 AM · North Field Complex",
    body: "advisor.item2.body",
    stats: [
      { label: "advisor.item2.stat.waterSaved", value: "14,200 Liters", highlight: true },
      { label: "advisor.item2.stat.soilMoisture", value: "68% Target Met" },
      { label: "advisor.item2.stat.efficiency", value: "98.4%" },
    ],
  },
  {
    id: 3,
    title: "advisor.item3.title",
    status: "Notified",
    timestamp: "Yesterday, 04:30 PM · Corn Plot C",
    body: "advisor.item3.body",
    faded: true,
  },
  {
    id: 4,
    title: "advisor.item4.title",
    status: "Actioned",
    timestamp: "Yesterday, 09:12 AM · West Vineyard",
    body: "advisor.item4.body",
  },
];

export default function AgenticAdvisorPage() {
  const { t } = useLanguage();
  const [activity, setActivity] = useState(initialActivity);
  const [filterOpen, setFilterOpen] = useState(false);

  const dismiss = (id: number) => setActivity((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("advisor.title")}</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm"
            >
              <ListFilter className="size-3.5" />
              {t("advisor.filterFeed")}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {(["Pending", "Actioned", "Notified"] as Status[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-surface-muted"
                  >
                    {t(statusLabelKeys[s])}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/notifications"
            aria-label={t("common.notifications")}
            className="relative flex size-10 items-center justify-center rounded-full bg-surface-muted"
          >
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        {activity.map((item, i) => (
          <div key={item.id} className="flex gap-6 pb-10">
            <div className="relative flex flex-col items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Bot className="size-4 text-accent" />
              </div>
              {i < activity.length - 1 && (
                <span className="absolute top-10 h-full w-0.5 bg-slate-200" />
              )}
            </div>
            <div
              className={cn(
                "flex flex-1 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
                item.faded && "opacity-80"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-lg font-bold text-slate-900">{t(item.title)}</h3>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-bold",
                    statusStyles[item.status]
                  )}
                >
                  {t(statusLabelKeys[item.status])}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-text-faint">
                <Clock className="size-3" />
                {item.timestamp}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{t(item.body)}</p>

              {item.stats && (
                <div className="grid grid-cols-3 gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  {item.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-text-faint">{t(s.label)}</p>
                      <p className={cn("text-sm font-bold", s.highlight ? "text-brand" : "text-slate-700")}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {item.actions && (
                <div className="flex gap-3 pt-1">
                  {item.actions[0] === "advisor.reviewDetails" ? (
                    <Link href="/agentic-advisor/reasoning-trace" className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white">
                      {t(item.actions[0])}
                    </Link>
                  ) : (
                    <button type="button" className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white">
                      {t(item.actions[0])}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600"
                  >
                    {t(item.actions[1])}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {activity.length === 0 && (
          <p className="py-10 text-center text-sm text-text-muted">{t("advisor.noActivity")}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button type="button" className="text-sm font-bold text-accent">
          {t("advisor.loadOlder")}
        </button>
      </div>
    </div>
  );
}
