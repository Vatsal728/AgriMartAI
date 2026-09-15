"use client";

import { useEffect, useState } from "react";
import { Droplet } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";
import type { SoilTelemetryResponse } from "@/types/api";

export function SoilMoistureCard() {
  const { t } = useLanguage();
  const [moisturePct, setMoisturePct] = useState(42);
  const [status, setStatus] = useState<SoilTelemetryResponse["soil_moisture_status"]>("Optimal");

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getSoilTelemetry()
      .then((res) => {
        if (cancelled) return;
        setMoisturePct(Math.round(res.soil_moisture_pct));
        setStatus(res.soil_moisture_status);
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo values.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-text-muted">{t("dashboard.soilMoisture.title")}</p>
          <h3 className="font-heading text-xl font-bold text-slate-900">Sector A-12</h3>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
          {status === "Optimal" ? t("dashboard.soilMoisture.optimal") : status}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-heading text-6xl font-bold text-brand">{moisturePct}%</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-brand" style={{ width: `${moisturePct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Droplet className="size-4 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">{t("dashboard.soilMoisture.nextCycle")}</p>
          <p className="text-xs text-text-muted">{t("dashboard.soilMoisture.scheduledIn4Hours")}</p>
        </div>
      </div>
    </div>
  );
}
