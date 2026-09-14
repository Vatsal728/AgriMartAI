import Link from "next/link";
import { ChevronRight, Droplets, FileDown, PlayCircle, Radio, CloudRain, Scale, Bell, Bot, ArrowRight, FileSearch } from "lucide-react";

const steps = [
  {
    icon: Radio,
    step: "Step 01",
    status: "Completed 2m ago",
    title: "Initial Sensor Data Aggregation",
    body: "The agent queried the IoT mesh network across Plot B-12. Soil moisture levels are currently at 42%, which is 5% below the optimal threshold for the Corn V6 growth stage.",
    tags: ["ID: S-992", "Value: 0.42%"],
  },
  {
    icon: CloudRain,
    step: "Step 02",
    status: "Completed 1m ago",
    title: "Hyper-Local Weather Correlation",
    body: "Accessed the NOAA forecast API. A localized heat dome is expected in 48 hours, with temperatures peaking at 98°F. Evapotranspiration rates are predicted to increase by 35%.",
    callout: { title: "+35% ET Forecast", body: "Critical stress period predicted for Wednesday" },
  },
  {
    icon: Scale,
    step: "Step 03",
    status: "Completed 45s ago",
    title: "Trade-off & Decision Logic",
    body: "The agent weighed 'Conservation' vs 'Yield Protection'. Given the high market value of the current crop, the advisor prioritized deep-root saturation today to mitigate heat stress before the peak.",
    stats: [
      { label: "Risk Level", value: "Medium-Low" },
      { label: "Water Efficiency", value: "88% (Projected)" },
    ],
  },
  {
    icon: Bell,
    step: "Step 04",
    status: "Running Now",
    title: "Notification & Approval Routing",
    body: "Generating the optimal irrigation schedule and routing it to the farm manager's dashboard for final validation before autonomous valve release.",
    progress: 65,
  },
];

export default function ReasoningTraceDetailPage() {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/agentic-advisor" className="font-medium">AI Advisor</Link>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-slate-900">Reasoning Trace</span>
          </p>
          <h1 className="pt-2 font-heading text-3xl font-bold text-slate-900">Why this recommendation</h1>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm">
            <FileDown className="size-3.5" />
            Export Log
          </button>
          <button type="button" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg">
            <PlayCircle className="size-3.5" />
            Execute Advice
          </button>
        </div>
      </div>

      <div className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
          <Droplets className="size-8 text-blue-500" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">Irrigation Adjustment: Plot B-12</h2>
          <p className="pt-2 text-sm leading-relaxed text-text-muted">
            The agentic advisor has analyzed current soil moisture, local weather forecasts, and
            crop growth stage to optimize water usage for the upcoming heatwave.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.step} className="flex gap-6 pb-10">
              <div className="relative flex flex-col items-center">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <Icon className="size-6 text-brand" />
                </div>
                {!isLast && <span className="absolute top-14 h-full w-0.5 bg-slate-200" />}
              </div>
              <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-text-faint">
                  <span>{s.step}</span>
                  <span className={s.status === "Running Now" ? "text-amber-600" : ""}>{s.status}</span>
                </div>
                <h3 className="pt-3 font-heading text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="pt-3 text-sm leading-relaxed text-slate-600">{s.body}</p>

                {s.tags && (
                  <div className="flex gap-2 pt-4">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-lg border border-slate-200 bg-surface-muted px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {s.callout && (
                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <CloudRain className="size-6 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900">{s.callout.title}</p>
                      <p className="text-xs text-text-muted">{s.callout.body}</p>
                    </div>
                  </div>
                )}

                {s.stats && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {s.stats.map((st) => (
                      <div key={st.label} className="rounded-2xl bg-surface-muted p-4">
                        <p className="text-xs text-text-muted">{st.label}</p>
                        <p className="font-bold text-slate-900">{st.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {typeof s.progress === "number" && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{s.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 rounded-3xl bg-brand-dark p-10 text-center text-white">
        <Bot className="size-16 text-white/30" strokeWidth={1} />
        <span className="rounded-full border border-white/30 px-4 py-1 text-xs font-bold uppercase tracking-wide">
          Final Conclusion
        </span>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          Increase irrigation by 15% in Zone B-12 for the next 12 hours.
        </h2>
        <p className="max-w-xl text-sm text-emerald-50/80">
          This proactive measure will ensure deep soil moisture reserves, allowing the crop to
          maintain stomatal conductance through the predicted 98°F heat spike without permanent
          wilting.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-brand-dark shadow-lg">
            Approve &amp; Execute Recommendation
            <ArrowRight className="size-4" />
          </button>
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-sm font-bold text-white">
            <FileSearch className="size-4" />
            Review Raw Logs
          </button>
        </div>
      </div>
    </div>
  );
}
