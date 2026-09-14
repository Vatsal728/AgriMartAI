"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Bell, TrendingUp, FileDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const data = [
  { date: "Oct 20", moisture: 40 },
  { date: "Oct 21", moisture: 45 },
  { date: "Oct 22", moisture: 43 },
  { date: "Oct 23", moisture: 41 },
  { date: "Oct 24", moisture: 46 },
  { date: "Oct 25", moisture: 48 },
  { date: "Oct 26", moisture: 42.8 },
];

const ranges = ["7d", "30d", "90d"] as const;

export default function SoilMoistureTrendPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("7d");

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-muted">Irrigation & Soil Analysis</p>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Soil moisture trend</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">System Live</span>
          </div>
          <Link href="/notifications"
            aria-label="Notifications"
            className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-1 rounded-xl bg-surface-muted p-1">
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-bold",
                  range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-brand" /> Soil Moisture %
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-emerald-200" /> Optimal Range
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-text-muted">Current Avg.</p>
            <p className="font-heading text-3xl font-bold text-slate-900">42.8%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-text-muted">Peak Moisture</p>
            <p className="font-heading text-3xl font-bold text-slate-900">48.2%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-text-muted">Min. Threshold</p>
            <p className="font-heading text-3xl font-bold text-slate-900">38.0%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="flex items-center gap-1.5 text-sm text-text-muted">
              <CheckCircle2 className="size-3.5 text-brand" />
              Status
            </p>
            <p className="font-heading text-3xl font-bold text-brand">Healthy</p>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <ReferenceArea y1={40} y2={50} fill="#0f6e56" fillOpacity={0.08} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#444" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#444" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="moisture" stroke="#0f6e56" strokeWidth={3} dot={{ r: 4, fill: "#0f6e56" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
              <TrendingUp className="size-5 text-brand" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Trend Insight</p>
              <p className="text-sm text-text-muted">
                Moisture levels have remained within the optimal 40-50% range for the last 48 hours.
              </p>
            </div>
          </div>
          <button type="button" className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-800">
            <FileDown className="size-3.5" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
