"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const MONTH_KEYS: Record<string, TranslationKey> = {
  May: "month.may",
  Jun: "month.jun",
  Jul: "month.jul",
  Aug: "month.aug",
  Sep: "month.sep",
  Oct: "month.oct",
};

const data12 = [
  { month: "May", actual: 450, projected: 445 },
  { month: "Jun", actual: 470, projected: 480 },
  { month: "Jul", actual: 520, projected: 510 },
  { month: "Aug", actual: 510, projected: 525 },
  { month: "Sep", actual: 560, projected: 555 },
  { month: "Oct", actual: 600, projected: 590 },
];

const data6 = data12.slice(-3);

export function YieldChart() {
  const { t } = useLanguage();
  const [range, setRange] = useState<"6" | "12">("12");
  const data = range === "12" ? data12 : data6;

  return (
    <section className="flex flex-col gap-8 rounded-[32px] border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">{t("dashboard.yieldAnalytics")}</h2>
          <p className="text-sm text-text-muted">{t("dashboard.yieldAnalytics.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRange("6")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold",
              range === "6" ? "bg-brand/10 text-brand" : "bg-surface-muted text-slate-600"
            )}
          >
            {t("dashboard.last6Months")}
          </button>
          <button
            type="button"
            onClick={() => setRange("12")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold",
              range === "12" ? "bg-brand/10 text-brand" : "bg-surface-muted text-slate-600"
            )}
          >
            {t("dashboard.last12Months")}
          </button>
        </div>
      </div>

      <div className="h-[320px] w-full sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={(month: string) => (MONTH_KEYS[month] ? t(MONTH_KEYS[month]) : month)}
              tick={{ fontSize: 12, fill: "#444" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12, fill: "#444" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend
              verticalAlign="top"
              align="left"
              height={36}
              formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name={t("dashboard.actualYield")}
              stroke="#0f6e56"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0f6e56" }}
            />
            <Line
              type="monotone"
              dataKey="projected"
              name={t("dashboard.projected")}
              stroke="#185fa5"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
