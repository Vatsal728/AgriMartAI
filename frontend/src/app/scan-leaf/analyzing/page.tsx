"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Sun, Crosshair, ScanEye } from "lucide-react";

const SCANNED_IMAGE_STORAGE_KEY = "scan-leaf-image";
const FALLBACK_IMAGE_SRC = "/images/result-leaf-large.png";

const tips = [
  { icon: Sun, title: "Good Lighting", body: "Analysis performs best with natural daylight." },
  { icon: Crosshair, title: "Stay Focused", body: "Keep the leaf centered for faster identification." },
  { icon: ScanEye, title: "Precise Detail", body: "Macro shots help spot early signs of disease." },
];

export default function ImageAnalysisPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [imageSrc] = useState(() => {
    if (typeof window === "undefined") {
      return FALLBACK_IMAGE_SRC;
    }
    return sessionStorage.getItem(SCANNED_IMAGE_STORAGE_KEY) ?? FALLBACK_IMAGE_SRC;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Scan result</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">AI Model Online</span>
          </div>
          <Link href="/notifications"
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
          >
            <Bell className="size-4 text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt="Leaf being analyzed"
            fill
            sizes="900px"
            unoptimized={imageSrc !== FALLBACK_IMAGE_SRC}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-bold text-slate-900">
              {progress < 100 ? "Analyzing image..." : "Analysis complete"}
            </p>
            <p className="text-sm text-text-muted">This may take a few seconds</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/scan-leaf")}
            className="rounded-xl border border-slate-200 px-8 py-4 text-sm font-bold text-slate-700"
          >
            Upload another
          </button>
          <button
            type="button"
            onClick={() => router.push("/scan-leaf/result")}
            disabled={progress < 100}
            className="rounded-xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-surface-muted p-6">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="size-4 text-brand" />
              </div>
              <p className="font-bold text-slate-900">{tip.title}</p>
              <p className="text-sm text-text-muted">{tip.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
