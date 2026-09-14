import { Droplet } from "lucide-react";

export function SoilMoistureCard() {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-text-muted">Soil Moisture</p>
          <h3 className="font-heading text-xl font-bold text-slate-900">Sector A-12</h3>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
          Optimal
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-heading text-6xl font-bold text-brand">42%</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-brand" style={{ width: "42%" }} />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Droplet className="size-4 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Next Irrigation Cycle</p>
          <p className="text-xs text-text-muted">Scheduled in 4 hours</p>
        </div>
      </div>
    </div>
  );
}
