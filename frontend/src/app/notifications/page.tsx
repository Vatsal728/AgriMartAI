"use client";

import { useState } from "react";
import { AlertTriangle, Droplet, Leaf, CheckCircle2, Wind, X, Bell } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

type Notification = {
  id: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: TranslationKey;
  unread?: boolean;
  time: TranslationKey;
  body: TranslationKey;
};

const initial: Notification[] = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    title: "notifications.item1.title",
    unread: true,
    time: "notifications.item1.time",
    body: "notifications.item1.body",
  },
  {
    id: 2,
    icon: Droplet,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "notifications.item2.title",
    unread: true,
    time: "notifications.item2.time",
    body: "notifications.item2.body",
  },
  {
    id: 3,
    icon: Leaf,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    title: "notifications.item3.title",
    time: "notifications.item3.time",
    body: "notifications.item3.body",
  },
  {
    id: 4,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    title: "notifications.item4.title",
    time: "notifications.item4.time",
    body: "notifications.item4.body",
  },
  {
    id: 5,
    icon: Wind,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "notifications.item5.title",
    time: "notifications.item5.time",
    body: "notifications.item5.body",
  },
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(initial);

  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-muted">{t("notifications.systemUpdates")}</p>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("common.notifications")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">{t("dashboard.systemLive")}</span>
          </div>
          <button
            type="button"
            aria-label={t("common.notifications")}
            className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="flex items-start gap-6 p-6">
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", n.iconBg)}>
                <Icon className={cn("size-5", n.iconColor)} />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{t(n.title)}</h3>
                    {n.unread && <span className="size-2 rounded-full bg-accent" />}
                  </div>
                  <span className="shrink-0 text-xs text-text-faint">{t(n.time)}</span>
                </div>
                <p className="text-sm leading-relaxed text-text-muted">{t(n.body)}</p>
              </div>
              <button
                type="button"
                aria-label={t("notifications.dismiss")}
                onClick={() => dismiss(n.id)}
                className="shrink-0 text-slate-300 hover:text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <p className="p-10 text-center text-sm text-text-muted">{t("notifications.allCaughtUp")}</p>
        )}
      </div>

      <p className="text-center text-sm text-text-muted">{t("notifications.seenAllUpdates")}</p>
    </div>
  );
}
