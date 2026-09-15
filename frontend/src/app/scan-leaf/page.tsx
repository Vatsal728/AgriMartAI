"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, UploadCloud, Shield, Zap, Video, Sun, Crosshair, ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

const SCANNED_IMAGE_STORAGE_KEY = "scan-leaf-image";
const SCANNED_DIAGNOSIS_STORAGE_KEY = "scan-leaf-diagnosis";
const SCANNED_DIAGNOSIS_SETTLED_KEY = "scan-leaf-diagnosis-settled";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif"];

const recentThumbs = [
  "/images/result-thumb-1.png",
  "/images/result-thumb-2.png",
  "/images/result-thumb-3.png",
];

const tips: { icon: typeof Sun; title: TranslationKey; body: TranslationKey }[] = [
  { icon: Sun, title: "scanLeaf.tip.lighting.title", body: "scanLeaf.tip.lighting.body" },
  { icon: Crosshair, title: "scanLeaf.tip.focus.title", body: "scanLeaf.tip.focus.body" },
  { icon: ScanEye, title: "scanLeaf.tip.angles.title", body: "scanLeaf.tip.angles.body" },
];

export default function ScanLeafUploadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);

  function handleSelectedFile(file: File | undefined): void {
    if (!file) {
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(t("scanLeaf.error.unsupportedType"));
      return;
    }
    setUploadError(undefined);
    const objectUrl = URL.createObjectURL(file);
    sessionStorage.setItem(SCANNED_IMAGE_STORAGE_KEY, objectUrl);
    sessionStorage.removeItem(SCANNED_DIAGNOSIS_STORAGE_KEY);
    sessionStorage.removeItem(SCANNED_DIAGNOSIS_SETTLED_KEY);

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("model_type", "efficientnet");

    // Fire the diagnosis request now; the analyzing page picks up the
    // result from sessionStorage once it lands, independent of navigation.
    AgriSmartAPI.diagnoseLeaf(formData)
      .then((result) => {
        sessionStorage.setItem(SCANNED_DIAGNOSIS_STORAGE_KEY, JSON.stringify(result));
      })
      .catch(() => {
        // Backend unreachable — the analyzing/result pages fall back to demo content.
      })
      .finally(() => {
        sessionStorage.setItem(SCANNED_DIAGNOSIS_SETTLED_KEY, "1");
      });

    router.push("/scan-leaf/analyzing");
  }

  function handleDrop(e: DragEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setIsDragActive(false);
    handleSelectedFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        className="hidden"
        onChange={(e) => handleSelectedFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleSelectedFile(e.target.files?.[0])}
      />
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t("scanLeaf.title")}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">{t("common.aiModelOnline")}</span>
          </div>
          <Link href="/notifications"
            aria-label={t("common.notifications")}
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed bg-white p-16 text-center shadow-sm transition-colors",
          isDragActive ? "border-brand bg-brand/5" : "border-slate-200"
        )}
      >
        <div className="flex size-24 items-center justify-center rounded-full bg-surface-muted">
          <UploadCloud className="size-10 text-brand" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            {t("scanLeaf.dropzone.title")}
          </h2>
          <p className="text-sm text-text-muted">{t("scanLeaf.dropzone.formats")}</p>
        </div>
        <span className="rounded-2xl bg-brand px-8 py-4 text-base font-bold text-white shadow-lg">
          {t("scanLeaf.chooseImage")}
        </span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <Shield className="size-3" />
            {t("scanLeaf.secureScan")}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <Zap className="size-3" />
            {t("scanLeaf.instantAnalysis")}
          </span>
        </div>
      </button>

      {uploadError && (
        <p role="alert" className="-mt-6 text-center text-sm font-semibold text-red-500">
          {uploadError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold text-text-faint">{t("common.or")}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row">
        <div className="flex items-center gap-6">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-surface-muted">
            <Video className="size-6 text-brand" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">{t("scanLeaf.useCamera")}</h3>
            <p className="text-sm text-text-muted">{t("scanLeaf.useCamera.description")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm"
        >
          {t("scanLeaf.useCamera")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-surface-muted p-6">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="size-4 text-brand" />
              </div>
              <p className="font-bold text-slate-900">{t(tip.title)}</p>
              <p className="text-sm text-text-muted">{t(tip.body)}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-bold uppercase tracking-[1.4px] text-slate-400">{t("scanLeaf.recentDiagnoses")}</p>
        <div className="flex gap-4">
          {recentThumbs.map((src) => (
            <div key={src} className="relative size-20 overflow-hidden rounded-xl border-2 border-white shadow-sm">
              <Image src={src} alt={t("scanLeaf.recentDiagnosis")} fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
