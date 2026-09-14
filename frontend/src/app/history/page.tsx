"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, MessageCircleQuestion } from "lucide-react";

type Status = "healthy" | "diseased";
type Severity = "Optimal" | "Mild" | "Severe";

type Scan = {
  name: string;
  date: string;
  status: Status;
  severity: Severity;
  image: string;
  aiAnalyzed?: boolean;
};

const scans: Scan[] = [
  { name: "Tomato Early Blight", date: "May 15, 2024 · 10:45 AM", status: "diseased", severity: "Severe", image: "/images/history-tomato-blight.png", aiAnalyzed: true },
  { name: "Healthy Tomato", date: "May 14, 2024 · 02:20 PM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-tomato.png" },
  { name: "Spider Mites", date: "May 12, 2024 · 09:15 AM", status: "diseased", severity: "Mild", image: "/images/history-spider-mites.png" },
  { name: "Leaf Spot", date: "May 10, 2024 · 04:55 PM", status: "diseased", severity: "Mild", image: "/images/history-leaf-spot.png" },
  { name: "Healthy Cucumber", date: "May 08, 2024 · 11:30 AM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-cucumber.png" },
  { name: "Powdery Mildew", date: "May 05, 2024 · 03:10 PM", status: "diseased", severity: "Severe", image: "/images/history-powdery-mildew.png" },
  { name: "Healthy Pepper", date: "May 02, 2024 · 08:40 AM", status: "healthy", severity: "Optimal", image: "/images/history-healthy-pepper.png" },
  { name: "Late Blight", date: "April 28, 2024 · 05:25 PM", status: "diseased", severity: "Severe", image: "/images/history-late-blight.png" },
];

const severityStyles: Record<Severity, { dot: string; badgeBg: string; badgeText: string }> = {
  Optimal: { dot: "bg-green-500", badgeBg: "bg-emerald-50", badgeText: "text-brand" },
  Mild: { dot: "bg-amber-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  Severe: { dot: "bg-red-500", badgeBg: "bg-red-50", badgeText: "text-red-600" },
};

const filters = [
  { label: "All", value: "all" as const },
  { label: "Healthy", value: "healthy" as const },
  { label: "Diseased", value: "diseased" as const },
  { label: "This week", value: "week" as const },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all" || filter === "week") return scans;
    return scans.filter((s) => s.status === filter);
  }, [filter]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">History</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">AI Model Online</span>
          </div>
          <Link href="/notifications"
            aria-label="Notifications"
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
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-sm font-medium text-text-muted">
          Sort by: Date
          <ChevronDown className="size-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((scan) => {
          const s = severityStyles[scan.severity];
          return (
            <div
              key={scan.name}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-44 w-full">
                <Image src={scan.image} alt={scan.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                {scan.aiAnalyzed && (
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    AI Analyzed
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 p-5">
                <div className="flex items-start justify-between">
                  <p className="font-extrabold text-slate-900">{scan.name}</p>
                  <span className={`mt-1 size-3 shrink-0 rounded-full ${s.dot}`} />
                </div>
                <p className="text-xs text-text-muted">{scan.date}</p>
                <div className="pt-4">
                  <span className={`inline-block rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${s.badgeBg} ${s.badgeText}`}>
                    {scan.severity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-8">
        <p className="text-[13px] font-medium text-text-muted">
          Source: agricultural knowledge base · Updated May 2024
        </p>
        <button type="button" className="flex items-center gap-2 text-sm font-bold text-accent">
          <MessageCircleQuestion className="size-4" />
          Ask a follow-up
        </button>
      </div>
    </div>
  );
}
