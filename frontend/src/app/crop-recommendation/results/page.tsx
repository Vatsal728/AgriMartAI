"use client";

import { useState } from "react";
import { Sprout, Wheat, Leaf, SlidersHorizontal, Calendar, ChevronDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Crop = {
  name: string;
  match: number;
  icon: LucideIcon;
  reason: string;
  yield_: string;
  maturity: string;
  waterNeed: string;
  soilFit: string;
  featured?: boolean;
};

const crops: Crop[] = [
  {
    name: "Sweet Corn",
    match: 92,
    icon: Wheat,
    reason: "Ideal temperature range expected during peak growth cycle",
    yield_: "6.8 Tons/Acre",
    maturity: "85 Days",
    waterNeed: "Moderate — 500-800mm over season",
    soilFit: "Loamy, pH 6.0-6.8",
    featured: true,
  },
  {
    name: "Soybeans",
    match: 89,
    icon: Sprout,
    reason: "Nitrogen levels in soil perfectly balance soybean needs",
    yield_: "2.5 Tons/Acre",
    maturity: "100 Days",
    waterNeed: "Low-Moderate — 450-700mm over season",
    soilFit: "Well-drained loam, pH 6.0-7.0",
  },
  {
    name: "Alfalfa",
    match: 85,
    icon: Leaf,
    reason: "Deep root system suited to the current soil moisture profile",
    yield_: "4.2 Tons/Acre",
    maturity: "60 Days",
    waterNeed: "High — deep infrequent watering",
    soilFit: "Well-drained, pH 6.5-7.5",
  },
];

export default function CropRecommendationResultsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-heading text-3xl font-bold text-slate-900">Recommended for your farm</h1>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
            <Calendar className="size-3.5" />
            Spring Season 2024
          </span>
          <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
            <SlidersHorizontal className="size-3.5" />
            Filters
          </button>
        </div>
      </div>

      <p className="max-w-2xl text-base text-text-muted">
        Based on your recent soil analysis (pH 6.5), local weather patterns, and historical yield
        data, our AI suggests the following crops for optimal growth.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {crops.map((crop) => {
          const Icon = crop.icon;
          const isOpen = expanded === crop.name;
          return (
            <div
              key={crop.name}
              className={cn(
                "flex flex-col gap-6 rounded-3xl bg-white p-8",
                crop.featured ? "border-2 border-brand shadow-lg" : "border border-slate-200 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-muted">
                  <Icon className="size-7 text-brand" />
                </div>
                <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
                  {crop.match}% Match
                </span>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">{crop.name}</h3>
                <p className="pt-2 text-sm text-text-muted">{crop.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-medium text-text-faint">Est. Yield</p>
                  <p className="font-bold text-slate-900">{crop.yield_}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-faint">Maturity</p>
                  <p className="font-bold text-slate-900">{crop.maturity}</p>
                </div>
              </div>

              {isOpen && (
                <div className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-text-faint">Water Requirement</p>
                    <p className="font-semibold text-slate-800">{crop.waterNeed}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-faint">Soil Compatibility</p>
                    <p className="font-semibold text-slate-800">{crop.soilFit}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : crop.name)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold",
                  crop.featured ? "bg-brand text-white shadow-lg" : "border border-slate-200 text-slate-800"
                )}
              >
                {isOpen ? "Hide Details" : "View Details"}
                <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
