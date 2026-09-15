"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ScanCta() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-[32px] bg-brand p-6 text-center shadow-[0_20px_25px_-5px_rgba(19,78,74,0.2),0_8px_10px_-6px_rgba(19,78,74,0.2)] sm:p-8">
      <div className="flex size-20 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/5">
        <Camera className="size-8 text-white" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-2xl font-bold text-white">{t("dashboard.scanCta.title")}</h3>
        <p className="max-w-[260px] text-sm text-emerald-50/70">{t("dashboard.scanCta.description")}</p>
      </div>
      <Link
        href="/scan-leaf"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-base font-bold text-brand transition-opacity hover:opacity-90"
      >
        {t("dashboard.scanCta.button")}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
