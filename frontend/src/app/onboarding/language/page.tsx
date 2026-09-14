"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", native: "Default System Language" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export default function LanguageSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("en");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-muted px-4 py-16">
      <div className="flex w-full max-w-[540px] flex-col gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-brand/10">
            <Leaf className="size-8 text-brand" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-bold text-slate-900">Choose your language</h1>
            <p className="text-base text-text-muted">
              Select your preferred language to customize your farming experience with AgriSmart AI.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {languages.map((lang) => {
            const active = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 bg-white p-5 shadow-sm transition-colors",
                  active ? "border-brand bg-brand/5" : "border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-lg font-bold",
                      active ? "bg-brand text-white" : "bg-surface-muted text-slate-600"
                    )}
                  >
                    {lang.label.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900">{lang.label}</p>
                    <p className="text-sm text-text-muted">{lang.native}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border-2",
                    active ? "border-brand bg-brand" : "border-slate-300"
                  )}
                >
                  {active && <span className="size-2.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => router.push("/onboarding/farm-profile")}
            className="flex items-center justify-center gap-3 rounded-2xl bg-brand py-5 text-base font-bold text-white shadow-lg"
          >
            Continue to Dashboard
            <ArrowRight className="size-4" />
          </button>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <span className="size-1.5 rounded-full bg-slate-400" />
            You can change your language anytime in the application settings.
          </p>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-text-faint">
            <span>© 2024 AgriSmart AI</span>
            <div className="flex gap-4">
              <Link href="/help-center">Help Center</Link>
              <Link href="/">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
