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

import { getUserProfile, setUserProfile, subscribeUserProfile } from "@/lib/user";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<"Acres" | "Hectares">("Acres");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat", "Cotton"]);
  const [soilType, setSoilType] = useState("Loamy");
  const [fullName, setFullName] = useState("Desai Vatshal");
  const [contactLine, setContactLine] = useState("desaivatshal72839@gmail.com");
  const [locationName, setLocationName] = useState("Ahmedabad, Gujarat, India");
  const [areaValue, setAreaValue] = useState("120");
  const [avatarSrc, setAvatarSrc] = useState("/images/profile-avatar.png");

  useEffect(() => {
    let cancelled = false;

    const syncUser = () => {
      const profile = getUserProfile();
      setFullName(profile.name);
      setContactLine(profile.email);
      setAvatarSrc(profile.avatar);
    };

    syncUser();
    const unsubscribe = subscribeUserProfile(syncUser);

    AgriSmartAPI.getCurrentUser()
      .then((user) => {
        if (cancelled || !user) return;
      })
      .catch(() => {});

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
      .catch(() => {});

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatarSrc(base64);
        setUserProfile({ avatar: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

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
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image 
                src={avatarSrc} 
                alt={fullName} 
                fill 
                sizes="128px" 
                unoptimized={avatarSrc.startsWith("blob:") || avatarSrc.startsWith("data:")}
                className="object-cover" 
              />
            </div>
            <label
              htmlFor="avatar-upload"
              aria-label={t("profile.changePhoto")}
              className="absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md hover:scale-105 transition"
            >
              <Camera className="size-3.5" />
            </label>
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
                  <button 
                    type="button" 
                    onClick={() => {
                      if (typeof window !== "undefined" && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                              const data = await res.json();
                              const city = data.address?.city || data.address?.town || data.address?.state_district || "Gujarat Region";
                              const state = data.address?.state || "Gujarat";
                              setLocationName(`${city}, ${state}`);
                            } catch {
                              setLocationName(`${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`);
                            }
                          },
                          () => {}
                        );
                      }
                    }}
                    className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
                  >
                    {t("farmProfile.change")}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{t("farmProfile.totalFarmArea")}</p>
              <div className="flex min-h-16 items-center justify-between rounded-2xl border-2 border-slate-100 bg-white p-2">
                <input
                  type="text"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-3 text-lg font-bold text-slate-800 focus:outline-none"
                />
                <div className="flex shrink-0 items-center rounded-xl bg-slate-100 p-1">
                  {(["Acres", "Hectares"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                        unit === u ? "bg-brand text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {u === "Acres" ? t("farmProfile.acres") : t("farmProfile.hectares")}
                    </button>
                  ))}
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
          <button 
            type="button" 
            onClick={() => {
              setLocationName("Ahmedabad, Gujarat, India");
              setAreaValue("120");
              setUnit("Acres");
              setSelectedCrops(["Wheat", "Cotton"]);
              setSoilType("Loamy");
            }}
            className="rounded-xl px-8 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
          >
            {t("profile.discardChanges")}
          </button>
          <button 
            type="button" 
            onClick={() => {
              alert("Farm Profile and Preferences Saved Successfully!");
            }}
            className="rounded-xl bg-brand px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-brand/90 transition"
          >
            {t("profile.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
