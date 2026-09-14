import Link from "next/link";
import {
  MapPin,
  Bell,
  Droplets,
  Sun,
  Sprout,
  Target,
  Radio,
  Bird,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Suggestion = {
  icon: LucideIcon;
  title: string;
  description: string;
  points: number;
};

const suggestions: Suggestion[] = [
  { icon: Droplets, title: "Optimize Drip Irrigation", description: "Reduce water waste by 15% in Sector 7", points: 8 },
  { icon: Sun, title: "Solar Pump Transition", description: "Switch Sector 4 pumps to 100% renewable energy", points: 12 },
  { icon: Sprout, title: "Cover Crop Implementation", description: "Plant rye grass in fallow fields to prevent erosion", points: 5 },
  { icon: Target, title: "Precision Fertilizer Application", description: "Targeted nutrient delivery via drone mapping", points: 7 },
  { icon: Radio, title: "Soil Moisture Sensor Mesh", description: "Real-time root-zone moisture tracking", points: 9 },
  { icon: Bird, title: "Biodiversity Corridors", description: "Maintain native vegetation between vine rows", points: 4 },
];

export default function SustainabilityImprovePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Ways to improve</h1>
          <p className="text-base text-text-muted">Personalized recommendations to increase your sustainability score and farm efficiency.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <MapPin className="size-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Central Valley - Sector 7</span>
          </div>
          <Link href="/notifications" aria-label="Notifications" className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Bell className="size-4 text-slate-700" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-surface-muted p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-text-muted">Active Goal</p>
          <p className="font-heading text-2xl font-bold text-slate-900">Target Score: 90</p>
        </div>
        <div className="flex w-full max-w-xs flex-col items-end gap-2">
          <p className="text-sm font-semibold text-slate-700">Current Progress <span className="font-bold text-brand">82% Complete</span></p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[82%] rounded-full bg-brand" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {suggestions.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200">
                  <Icon className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm text-text-muted">{s.description}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
                +{s.points} points
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button type="button" className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
          Generate Detailed Roadmap
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
