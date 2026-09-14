import { MapPin, CloudSun } from "lucide-react";

const stats = [
  { label: "Humidity", value: "65%" },
  { label: "Rain Prob", value: "20%" },
  { label: "Wind", value: "12km/h" },
];

export function WeatherCard() {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-[32px] bg-accent p-6 text-white shadow-[0_20px_25px_-5px_rgba(30,58,138,0.2),0_8px_10px_-6px_rgba(30,58,138,0.2)] sm:p-8">
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-white/10 blur-3xl" />
      <div className="flex items-center gap-2 opacity-90">
        <MapPin className="size-4" />
        <span className="text-sm font-medium">Central Farm, Iowa</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">28°C</p>
          <p className="text-lg font-medium opacity-90">Partly Cloudy</p>
        </div>
        <CloudSun className="size-16 shrink-0 opacity-95 sm:size-[72px]" strokeWidth={1.5} />
      </div>
      <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{s.label}</p>
            <p className="text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
