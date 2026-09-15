"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, MapPin, ChevronRight, Wheat, Layers, Waves, Droplets, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

const crops: { id: string; nameKey: TranslationKey }[] = [
  { id: "Wheat", nameKey: "farmProfile.crop.wheat" },
  { id: "Rice", nameKey: "farmProfile.crop.rice" },
  { id: "Corn", nameKey: "farmProfile.crop.corn" },
  { id: "Cotton", nameKey: "farmProfile.crop.cotton" },
  { id: "Soybeans", nameKey: "farmProfile.crop.soybeans" },
];

const soilTypes: { id: string; icon: typeof Sprout; nameKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { id: "Clay", icon: Layers, nameKey: "farmProfile.soil.clay", descriptionKey: "farmProfile.soil.clay.desc" },
  { id: "Silty", icon: Waves, nameKey: "farmProfile.soil.silty", descriptionKey: "farmProfile.soil.silty.desc" },
  { id: "Sandy", icon: Droplets, nameKey: "farmProfile.soil.sandy", descriptionKey: "farmProfile.soil.sandy.desc" },
  { id: "Loamy", icon: Sprout, nameKey: "farmProfile.soil.loamy", descriptionKey: "farmProfile.soil.loamy.desc" },
];

export default function ProfilePage() {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<"Acres" | "Hectares">("Acres");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat", "Cotton"]);
  const [soilType, setSoilType] = useState("Loamy");
  const [fullName, setFullName] = useState("Marcus Thorne");
  const [contactLine, setContactLine] = useState("+1 (555) 0123-4567 · marcus.thorne@agrismart.ai");
  const [locationName, setLocationName] = useState("Central Valley, CA, USA");
  const [areaValue, setAreaValue] = useState("120");

  useEffect(() => {
    let cancelled = false;
    AgriSmartAPI.getCurrentUser()
      .then((user) => {
        if (cancelled) return;
        setFullName(user.full_name);
        setContactLine([user.phone_number, user.email].filter(Boolean).join(" · "));
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo profile.
      });
    AgriSmartAPI.getFarms()
      .then(async (farms) => {
        const farm = farms[0];
        if (!farm || cancelled) return;
        setLocationName(farm.location_name);
        setAreaValue(String(farm.total_area));
        setUnit(farm.area_unit);
        const fields = await AgriSmartAPI.getFarmFields(farm.id).catch(() => []);
        const field = fields[0];
        if (field && !cancelled) {
          setSoilType(field.soil_type);
          setSelectedCrops((prev) => (prev.includes(field.crop_name) ? prev : [...prev, field.crop_name]));
        }
      })
      .catch(() => {
        // Backend unreachable — keep the fallback demo farm.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCrop = (crop: string) =>
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-1 border-b border-slate-200 bg-white px-4 py-6 sm:px-10">
        <p className="flex items-center gap-2 text-sm text-text-muted">
          {t("nav.item.settings")} <ChevronRight className="size-3" /> <span className="font-medium text-brand">{t("nav.item.profile")}</span>
        </p>
        <h1 className="font-heading text-3xl font-bold text-slate-900">{t("nav.item.profile")}</h1>
      </header>

      <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-12 px-4 py-10 sm:px-16">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image src="/images/profile-avatar.png" alt="Marcus Thorne" fill sizes="128px" className="object-cover" />
            </div>
            <button
              type="button"
              aria-label={t("profile.changePhoto")}
              className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md"
            >
              <Camera className="size-3" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">{fullName}</h2>
            <p className="text-base text-text-muted">{contactLine}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.farmLocation")}</p>
              <div className="relative h-80 w-full overflow-hidden rounded-[32px] border-4 border-white shadow-sm">
                <Image src="/images/profile-farm-map.png" alt={t("profile.farmLocationMapAlt")} fill sizes="512px" className="object-cover" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/50 bg-white/90 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
                      <MapPin className="size-3.5 text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{locationName}</span>
                  </div>
                  <button type="button" className="text-xs font-bold uppercase tracking-wide text-brand">
                    {t("farmProfile.change")}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.totalFarmArea")}</p>
              <div className="flex h-16 items-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-white">
                <input
                  type="text"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
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

          <div className="flex flex-col gap-8">
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
                        "flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-base font-semibold",
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

        <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
          <button type="button" className="px-8 py-4 text-sm font-bold text-slate-400">
            {t("profile.discardChanges")}
          </button>
          <button type="button" className="rounded-xl bg-brand px-10 py-4 text-base font-bold text-white shadow-lg">
            {t("profile.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
