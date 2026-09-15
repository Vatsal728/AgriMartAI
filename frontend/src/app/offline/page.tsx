"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, WifiOff, RefreshCcw, History, ScanLine, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function OfflinePage() {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <nav className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-12">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand">
            <Leaf className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-bold text-brand">{t("common.appName")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
            <WifiOff className="size-3.5" />
            {t("offline.localMode")}
          </span>
          <div className="size-10 rounded-full bg-surface-muted" />
        </div>
      </nav>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <div className="relative flex size-56 items-center justify-center">
          <div className="flex size-40 items-center justify-center rounded-full bg-surface-muted">
            <WifiOff className="size-16 text-slate-300" strokeWidth={1.25} />
          </div>
          <span className="absolute -right-1 top-2 size-10 rounded-full bg-amber-100" />
          <span className="absolute -bottom-2 -left-6 size-14 rounded-full border-8 border-slate-50" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl font-bold text-slate-900">{t("offline.title")}</h1>
          <p className="max-w-md text-base text-text-muted">{t("offline.description")}</p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-bold text-white shadow-lg"
        >
          <RefreshCcw className="size-4" />
          {t("offline.retryConnection")}
        </button>

        <div className="flex gap-8">
          <Link href="/history" className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <History className="size-4" />
            {t("offline.viewCachedHistory")}
          </Link>
          <Link href="/scan-leaf" className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <ScanLine className="size-4" />
            {t("offline.recentScans")}
          </Link>
        </div>

        <p className="border-t border-slate-100 pt-8 text-sm text-text-muted">{t("offline.helpText")}</p>
      </div>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-2xl bg-slate-900 px-6 py-4 text-white shadow-xl">
          <span className="size-2 rounded-full bg-amber-400" />
          <p className="text-sm">{t("offline.syncPaused")}</p>
          <button type="button" aria-label={t("notifications.dismiss")} onClick={() => setShowToast(false)} className="text-slate-400">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
