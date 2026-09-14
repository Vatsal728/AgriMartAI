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
} from "recharts";
import { Droplets, Sun, Sprout, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const moistureHistory = [
  { time: "00:00", moisture: 48 },
  { time: "04:00", moisture: 44 },
  { time: "08:00", moisture: 40 },
  { time: "12:00", moisture: 36 },
  { time: "16:00", moisture: 33 },
  { time: "20:00", moisture: 32 },
];

const zones = [
  { label: "Zone A: 42%", tone: "bg-brand/20 border-white/40 text-brand" },
  { label: "Zone B: 32%", tone: "bg-amber-500/20 border-white/40 text-amber-700" },
  { label: "Zone C: 48%", tone: "bg-brand/30 border-white/40 text-brand" },
  { label: "Zone D: 28%", tone: "bg-amber-600/30 border-white/40 text-amber-800" },
];

type SectorStatus = "standby" | "active";
type Sector = { name: string; status: SectorStatus };

export default function IrrigationPage() {
  const [sectors, setSectors] = useState<Sector[]>([
    { name: "Sector 01", status: "standby" },
    { name: "Sector 02", status: "active" },
    { name: "Sector 03", status: "standby" },
    { name: "Sector 04", status: "standby" },
  ]);

  const toggleSector = (i: number) =>
    setSectors((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, status: s.status === "active" ? "standby" : "active" } : s))
    );

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Irrigation Status</h1>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-blue-50 sm:size-32">
            <Droplets className="size-10 text-blue-500 sm:size-12" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
                Irrigation needed
              </h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                Action Required
              </span>
            </div>
            <div className="flex items-center gap-2 text-lg text-text-muted">
              <Sun className="size-4" />
              Next recommended irrigation:{" "}
              <span className="font-bold text-slate-900">Today, 4:30 PM</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-surface-muted p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Droplets className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Soil Moisture</p>
              <p className="font-heading text-2xl font-bold text-slate-900">32%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-surface-muted p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Sun className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Weather</p>
              <p className="font-heading text-2xl font-bold text-slate-900">Sunny, 28°C</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-surface-muted p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Sprout className="size-5 text-brand" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Growth Stage</p>
              <p className="font-heading text-2xl font-bold text-slate-900">Vegetative</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Moisture history */}
        <div className="flex flex-col gap-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-slate-900">Moisture History</h3>
            <span className="rounded-lg bg-surface-muted px-4 py-2 text-sm font-semibold text-slate-600">
              Last 24 Hours
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moistureHistory} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#444" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#444" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="moisture" stroke="#0f6e56" strokeWidth={3} dot={{ r: 4, fill: "#0f6e56" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Field moisture map */}
        <div className="flex flex-col gap-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-slate-900">Field Moisture Map</h3>
            <button type="button" className="flex items-center gap-1.5 text-sm font-bold text-brand">
              Expand Map
              <Maximize2 className="size-3.5" />
            </button>
          </div>
          <div className="grid h-[260px] grid-cols-2 grid-rows-2 overflow-hidden rounded-2xl bg-slate-200">
            {zones.map((z) => (
              <div key={z.label} className={cn("flex items-center justify-center border", z.tone)}>
                <span className="text-xs font-bold">{z.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-brand" /> Optimal
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-amber-500" /> Needs Attention
            </span>
          </div>
        </div>
      </div>

      {/* Irrigation control */}
      <div className="flex flex-col gap-8 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-900">Irrigation Control</h3>
            <p className="text-sm text-text-muted">Remote control for automated valve clusters</p>
          </div>
          <div className="flex gap-4">
            <button type="button" className="rounded-xl bg-surface-muted px-6 py-3 text-sm font-bold text-slate-700">
              Pause All
            </button>
            <button type="button" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
              Run Full Cycle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((sector, i) => {
            const active = sector.status === "active";
            return (
              <div
                key={sector.name}
                className={cn(
                  "flex flex-col gap-4 rounded-2xl p-6",
                  active ? "border-2 border-brand/20 bg-brand/5" : "border border-slate-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-heading text-lg font-bold text-slate-900">{sector.name}</p>
                  <button
                    type="button"
                    onClick={() => toggleSector(i)}
                    aria-label={`Toggle ${sector.name}`}
                    className={cn(
                      "relative h-6 w-10 rounded-full transition-colors",
                      active ? "bg-brand" : "bg-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 size-4 rounded-full bg-white transition-transform",
                        active ? "translate-x-[20px]" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <div>
                  <p className={cn("text-xs font-bold uppercase tracking-wide", active ? "text-brand/60" : "text-slate-400")}>
                    Status
                  </p>
                  {active ? (
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-brand" />
                      <p className="text-sm font-bold text-brand">Active (Scheduled)</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-400">Standby</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
