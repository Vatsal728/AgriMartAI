"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, MapPin, ChevronRight, Wheat, Layers, Waves, Droplets, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const crops = ["Wheat", "Rice", "Corn", "Cotton", "Soybeans"];

const soilTypes = [
  { name: "Clay", icon: Layers, description: "Dense soil with high water retention and nutrients." },
  { name: "Silty", icon: Waves, description: "Smooth texture that holds moisture very well." },
  { name: "Sandy", icon: Droplets, description: "Light and airy soil with fast drainage capabilities." },
  { name: "Loamy", icon: Sprout, description: "Perfect mix of sand, silt, and clay for optimal growth." },
];

export default function ProfilePage() {
  const [unit, setUnit] = useState<"Acres" | "Hectares">("Acres");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat", "Cotton"]);
  const [soilType, setSoilType] = useState("Loamy");

  const toggleCrop = (crop: string) =>
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-1 border-b border-slate-200 bg-white px-4 py-6 sm:px-10">
        <p className="flex items-center gap-2 text-sm text-text-muted">
          Settings <ChevronRight className="size-3" /> <span className="font-medium text-brand">Profile</span>
        </p>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Profile</h1>
      </header>

      <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-12 px-4 py-10 sm:px-16">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image src="/images/profile-avatar.png" alt="Marcus Thorne" fill sizes="128px" className="object-cover" />
            </div>
            <button
              type="button"
              aria-label="Change photo"
              className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md"
            >
              <Camera className="size-3" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">Marcus Thorne</h2>
            <p className="text-base text-text-muted">+1 (555) 0123-4567 · marcus.thorne@agrismart.ai</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Farm Location</p>
              <div className="relative h-80 w-full overflow-hidden rounded-[32px] border-4 border-white shadow-sm">
                <Image src="/images/profile-farm-map.png" alt="Farm location map" fill sizes="512px" className="object-cover" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/50 bg-white/90 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
                      <MapPin className="size-3.5 text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Central Valley, CA, USA</span>
                  </div>
                  <button type="button" className="text-xs font-bold uppercase tracking-wide text-brand">
                    Change
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Total Farm Area</p>
              <div className="flex h-16 items-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-white">
                <input
                  type="text"
                  defaultValue="120"
                  className="flex-1 bg-white px-5 text-lg font-bold text-slate-800 focus:outline-none"
                />
                <div className="flex h-full items-center bg-slate-50 px-2">
                  <div className="flex gap-1 rounded-xl border border-slate-100 bg-white p-1">
                    {(["Acres", "Hectares"] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={cn(
                          "rounded-lg px-5 py-2 text-xs font-bold",
                          unit === u ? "bg-brand text-white" : "text-slate-400"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Crop Types Selection</p>
              <div className="flex flex-wrap gap-3">
                {crops.map((crop) => {
                  const active = selectedCrops.includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-base font-semibold",
                        active ? "border-brand bg-brand/10 text-brand" : "border-slate-100 bg-white text-slate-600"
                      )}
                    >
                      <Wheat className="size-3.5" />
                      {crop}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-text-faint">Select all crops currently in rotation for personalized insights.</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Primary Soil Type</p>
              <div className="grid grid-cols-2 gap-4">
                {soilTypes.map((soil) => {
                  const Icon = soil.icon;
                  const active = soilType === soil.name;
                  return (
                    <button
                      key={soil.name}
                      type="button"
                      onClick={() => setSoilType(soil.name)}
                      className={cn(
                        "relative flex flex-col items-start gap-1 overflow-hidden rounded-3xl border-2 p-5 text-left",
                        active ? "border-brand bg-brand/10" : "border-slate-100 bg-white"
                      )}
                    >
                      <div className={cn("flex size-12 items-center justify-center rounded-xl", active ? "bg-white shadow-sm" : "bg-surface-muted")}>
                        <Icon className={cn("size-4", active ? "text-brand" : "text-slate-600")} />
                      </div>
                      <p className={cn("pt-2 font-bold", active ? "text-brand" : "text-slate-800")}>{soil.name}</p>
                      <p className={cn("text-xs", active ? "text-brand/70" : "text-text-faint")}>{soil.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
          <button type="button" className="px-8 py-4 text-sm font-bold text-slate-400">
            Discard Changes
          </button>
          <button type="button" className="rounded-xl bg-brand px-10 py-4 text-base font-bold text-white shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
