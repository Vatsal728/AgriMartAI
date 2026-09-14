import Link from "next/link";
import { MapPin, Bell, Droplets, Zap, Sprout, Download } from "lucide-react";

const score = 82;
const radius = 130;
const circumference = 2 * Math.PI * radius;
const offset = circumference * (1 - score / 100);

const metrics = [
  {
    label: "Water Efficiency",
    value: "94.2%",
    delta: "+12%",
    positive: true,
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    barColor: "bg-blue-500",
    barWidth: "94%",
  },
  {
    label: "Resource Use",
    value: "78.5%",
    delta: "-2.4%",
    positive: false,
    icon: Zap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    barColor: "bg-amber-500",
    barWidth: "78%",
  },
  {
    label: "Crop Health Index",
    value: "89.1%",
    delta: "+0.8%",
    positive: true,
    icon: Sprout,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    barColor: "bg-emerald-500",
    barWidth: "89%",
  },
];

export default function SustainabilityScorePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            Sustainability score
          </h1>
          <p className="text-base text-text-muted">
            Real-time environmental impact and resource efficiency analysis.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <MapPin className="size-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Central Valley · Sector 7</span>
          </div>
          <Link href="/notifications"
            aria-label="Notifications"
            className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Link>
        </div>
      </div>

      {/* Score gauge */}
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm sm:p-16">
        <div className="relative flex size-[280px] items-center justify-center sm:size-[300px]">
          <svg viewBox="0 0 300 300" className="size-full -rotate-90">
            <circle cx="150" cy="150" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={20} />
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth={20}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className="font-heading text-6xl font-bold text-slate-900">{score}</p>
            <p className="pt-2 text-lg font-semibold uppercase tracking-[1.8px] text-text-muted">
              Global Score
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            +4% from last month
          </span>
          <p className="max-w-[480px] text-center text-sm text-text-muted">
            Your farm is performing better than 88% of similar sectors in the region. Primary
            improvements seen in water recycling rates.
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`flex size-12 items-center justify-center rounded-xl ${m.iconBg}`}>
                  <Icon className={`size-5 ${m.iconColor}`} />
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${
                    m.positive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {m.delta}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-text-muted">{m.label}</p>
                <p className="font-heading text-3xl font-bold text-slate-800">{m.value}</p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${m.barColor}`} style={{ width: m.barWidth }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
        >
          Download Full Report
          <Download className="size-4" />
        </button>
      </div>
    </div>
  );
}
