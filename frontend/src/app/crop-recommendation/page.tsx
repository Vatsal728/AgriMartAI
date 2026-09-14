"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const seasons = ["Kharif", "Rabi", "Zaid"] as const;
type Season = (typeof seasons)[number];

export default function CropRecommendationPage() {
  const router = useRouter();
  const [season, setSeason] = useState<Season>("Kharif");
  const [ph, setPh] = useState(6.5);

  return (
    <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold text-[#1a3c34]">Crop recommendation</h1>
        <p className="text-base text-text-muted">
          Fill in the details below to get an AI-powered crop recommendation for your land.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/crop-recommendation/results");
        }}
        className="flex flex-col gap-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Soil type</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a3c34] focus:outline-none">
                <option>Select soil type</option>
                <option>Loamy</option>
                <option>Sandy</option>
                <option>Clay</option>
                <option>Silty</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#1a3c34]">pH Level</label>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-brand">
                {ph.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={14}
              step={0.1}
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand"
            />
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400">
              <span>Acidic (0)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (14)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Temperature</label>
            <div className="relative">
              <input
                type="number"
                defaultValue={24.5}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a3c34] focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">°C</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Humidity</label>
            <div className="relative">
              <input
                type="number"
                defaultValue={65}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a3c34] focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Rainfall</label>
            <div className="relative">
              <input
                type="number"
                defaultValue={150}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a3c34] focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">mm</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Season</label>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {seasons.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  className={cn(
                    "flex-1 rounded-md py-2.5 text-xs font-semibold",
                    season === s ? "bg-white text-[#1a3c34] shadow-sm" : "text-slate-500"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Location</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search farm location..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-[#1a3c34] placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1a3c34]">Previous crop</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a3c34] focus:outline-none">
                <option>Select previous crop</option>
                <option>Tomato</option>
                <option>Wheat</option>
                <option>Corn</option>
                <option>Soybean</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg"
          >
            Get recommendation
          </button>
        </div>
      </form>

      <div className="flex items-center gap-4 rounded-xl border border-brand/10 bg-emerald-50/50 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Search className="size-4 text-brand" />
        </div>
        <p className="text-sm text-[#1a3c34]">
          <span className="font-bold">Pro tip:</span> Our AI uses historical weather patterns and
          local soil data for higher accuracy. Providing your precise location helps refine the
          results.
        </p>
      </div>
    </div>
  );
}
