import { Code2, Droplets, Recycle, Sprout } from "lucide-react";

const weights = [
  { label: "Water Efficiency (45%)", color: "bg-blue-500", width: "45%" },
  { label: "Resource Use (30%)", color: "bg-amber-500", width: "30%" },
  { label: "Crop Health (25%)", color: "bg-brand", width: "25%" },
];

const metrics = [
  {
    icon: Droplets,
    title: "Water Efficiency Metrics",
    body: "We utilize soil moisture sensors and weather station data to calculate the exact water requirement for your crop type. Scores decrease when irrigation exceeds the predicted plant need by more than 15%.",
  },
  {
    icon: Recycle,
    title: "Resource Use Optimization",
    body: "This tracks the precision of fertilizer application. By comparing the nutrients provided to the nutrient uptake measured through spectral analysis, we identify waste levels that impact your sustainability rating.",
  },
  {
    icon: Sprout,
    title: "Crop Health Vitality",
    body: "Satellite-derived NDVI (Normalized Difference Vegetation Index) provides a snapshot of plant vigor. High scores indicate uniform growth and high photosynthetic activity across the entire plot.",
  },
];

export default function MethodologyTransparencyPage() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold text-slate-900">How your score is calculated</h1>
        <p className="text-base leading-relaxed text-text-muted">
          The AgriSmart AI Sustainability Score is a composite index designed to provide a
          comprehensive view of your farm&rsquo;s environmental performance. We combine real-time
          sensor data, satellite imagery, and historical resource mapping to calculate a daily
          rating between 0 and 100.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">Score Composition Weights</h2>
        <div className="flex h-8 w-full overflow-hidden rounded-full">
          {weights.map((w) => (
            <div key={w.label} className={w.color} style={{ width: w.width }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6">
          {weights.map((w) => (
            <span key={w.label} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className={`size-3 rounded-full ${w.color}`} />
              {w.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-heading text-2xl font-bold text-slate-900">The Calculation Formula</h2>
        <p className="text-base text-text-muted">
          The core algorithm operates on a normalized scale. Each component is first assessed
          against regional benchmarks and then aggregated using the weighted averages shown above.
        </p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
            <span className="flex items-center gap-2 rounded bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <Code2 className="size-3" />
              Logic Definition
            </span>
          </div>
          <div className="flex flex-col gap-4 p-6 font-mono text-sm text-emerald-300">
            <p className="text-white">Sustainability_Score = (WE * 0.45) + (RU * 0.30) + (CH * 0.25)</p>
            <div className="flex flex-col gap-1.5 text-slate-400">
              <p>// WE: Water Efficiency (Gallons used vs Target evapotranspiration)</p>
              <p>// RU: Resource Use (Nitrogen/Phosphorus optimization vs Canopy need)</p>
              <p>// CH: Crop Health (NDVI Variance + Chlorophyll stress indexing)</p>
              <p>// Result is bounded between 0 and 100.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="flex gap-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface-muted">
                <Icon className="size-5 text-brand" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{m.title}</h3>
                <p className="pt-2 text-sm leading-relaxed text-text-muted">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="border-t border-slate-100 pt-6 text-center text-xs text-text-faint">
        AgriSmart AI v4.2.0 · Methodology updated December 2023 · All data processed in compliance
        with Sustainable Agriculture Standards.
      </p>
    </div>
  );
}
