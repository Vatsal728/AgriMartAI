"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Leaf, MapPin, Wheat, Layers, Waves, Droplets, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

const crops: { id: string; nameKey: TranslationKey }[] = [
  { id: "Wheat", nameKey: "farmProfile.crop.wheat" },
  { id: "Rice", nameKey: "farmProfile.crop.rice" },
  { id: "Corn", nameKey: "farmProfile.crop.corn" },
  { id: "Cotton", nameKey: "farmProfile.crop.cotton" },
  { id: "Soybeans", nameKey: "farmProfile.crop.soybeans" },
];

const soilTypes: { id: string; icon: typeof Sprout; nameKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { id: "Loamy", icon: Sprout, nameKey: "farmProfile.soil.loamy", descriptionKey: "farmProfile.soil.loamy.desc" },
  { id: "Clay", icon: Layers, nameKey: "farmProfile.soil.clay", descriptionKey: "farmProfile.soil.clay.desc" },
  { id: "Silty", icon: Waves, nameKey: "farmProfile.soil.silty", descriptionKey: "farmProfile.soil.silty.desc" },
  { id: "Sandy", icon: Droplets, nameKey: "farmProfile.soil.sandy", descriptionKey: "farmProfile.soil.sandy.desc" },
];

export default function FarmProfileSetupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [unit, setUnit] = useState<"Acres" | "Hectares">("Acres");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat"]);
  const [soilType, setSoilType] = useState("Loamy");
  const [locationName, setLocationName] = useState("Ahmedabad, Gujarat, India");
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state_district || "Detected Farm Region";
          const state = data.address?.state || "Gujarat";
          setLocationName(`${city}, ${state}`);
        } catch {
          setLocationName(`${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`);
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setIsDetecting(false);
      }
    );
  };

  const toggleCrop = (crop: string) =>
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-muted px-4 py-10">
      <div className="flex w-full max-w-[1024px] flex-col overflow-hidden rounded-[32px] bg-white shadow-xl">
        <header className="flex flex-col gap-6 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand">
              <Leaf className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-muted">{t("common.appName")}</p>
              <h1 className="font-heading text-2xl font-bold text-slate-900">{t("farmProfile.title")}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <p className="text-right text-sm font-semibold text-slate-600">{t("farmProfile.stepOfThree")}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 rounded-full bg-brand" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.farmLocation")}</p>
              <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-slate-100">
                <Image
                  src="/images/profile-farm-map.png"
                  alt={t("farmProfile.mapAlt")}
                  fill
                  sizes="512px"
                  className="object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/50 bg-white/90 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
                      <MapPin className="size-3.5 text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{locationName}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={detectLocation}
                    className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
                  >
                    {isDetecting ? "Detecting..." : "Auto Detect GPS"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.totalFarmArea")}</p>
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
                        {u === "Acres" ? t("farmProfile.acres") : t("farmProfile.hectares")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.cropTypesSelection")}</p>
              <div className="flex flex-wrap gap-3">
                {crops.map((crop) => {
                  const active = selectedCrops.includes(crop.id);
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => toggleCrop(crop.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-sm font-semibold",
                        active ? "border-brand bg-brand/10 text-brand" : "border-slate-100 bg-white text-slate-600"
                      )}
                    >
                      <Wheat className="size-3.5" />
                      {t(crop.nameKey)}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-text-faint">{t("farmProfile.cropSelectionHint")}</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.primarySoilType")}</p>
              <div className="grid grid-cols-2 gap-4">
                {soilTypes.map((soil) => {
                  const Icon = soil.icon;
                  const active = soilType === soil.id;
                  return (
                    <button
                      key={soil.id}
                      type="button"
                      onClick={() => setSoilType(soil.id)}
                      className={cn(
                        "relative flex flex-col items-start gap-1 overflow-hidden rounded-3xl border-2 p-5 text-left",
                        active ? "border-brand bg-brand/10" : "border-slate-100 bg-white"
                      )}
                    >
                      <div className={cn("flex size-12 items-center justify-center rounded-xl", active ? "bg-white shadow-sm" : "bg-surface-muted")}>
                        <Icon className={cn("size-4", active ? "text-brand" : "text-slate-600")} />
                      </div>
                      <p className={cn("pt-2 font-bold", active ? "text-brand" : "text-slate-800")}>{t(soil.nameKey)}</p>
                      <p className={cn("text-xs", active ? "text-brand/70" : "text-text-faint")}>{t(soil.descriptionKey)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-col-reverse items-center gap-4 border-t border-slate-100 p-6 sm:flex-row sm:justify-between sm:p-10">
          <button type="button" onClick={() => router.push("/dashboard")} className="text-sm font-bold text-text-faint">
            {t("farmProfile.skipForNow")}
          </button>
          <div className="flex w-full gap-4 sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/onboarding/language")}
              className="flex-1 rounded-2xl px-8 py-4 text-sm font-bold text-slate-600 sm:flex-none"
            >
              {t("common.back")}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 rounded-2xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg sm:flex-none"
            >
              {t("farmProfile.continueToNextStep")}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
