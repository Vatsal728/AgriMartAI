"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ScanLine,
  Maximize2,
  Calendar,
  MapPin,
  Sprout,
  ShieldAlert,
  FlaskConical,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  CloudRain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const accordions = [
  {
    id: "precautions",
    title: "Precautions & Immediate Steps",
    icon: ShieldAlert,
    items: [
      "Remove and destroy infected lower leaves to prevent spore splash to higher foliage.",
      "Avoid overhead watering; use drip irrigation to keep the foliage dry.",
      "Improve air circulation by pruning and increasing space between plants.",
    ],
  },
  {
    id: "treatment",
    title: "Recommended Treatment",
    icon: FlaskConical,
    items: [
      "Apply a copper-based fungicide every 7-10 days until symptoms subside.",
      "Rotate with a broad-spectrum protectant such as chlorothalonil to prevent resistance.",
    ],
  },
  {
    id: "prevention",
    title: "Long-term Prevention Strategy",
    icon: ShieldCheck,
    items: [
      "Rotate tomato/potato/pepper crops out of this plot for at least 2 seasons.",
      "Choose early-blight-resistant tomato varieties for the next planting cycle.",
    ],
  },
];

export default function DiagnosisDetailPage() {
  const [open, setOpen] = useState("precautions");

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/history" className="font-medium">Diagnosis History</Link>
        <ChevronRight className="size-3" />
        <span className="font-semibold text-slate-900">Scan Details #4920</span>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Diagnosis Details</h1>
          <p className="text-base text-text-muted">Detailed analysis of the scan performed on Oct 24, 2023.</p>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm">
          <ScanLine className="size-4" />
          Re-scan this plant
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[428px_1fr]">
        {/* Leaf image */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image src="/images/chat-leaf-thumb.png" alt="Infected leaf" fill sizes="428px" className="object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-black/50 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              Infected Area
            </span>
            <button
              type="button"
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 backdrop-blur-sm"
            >
              <Maximize2 className="size-3" />
              View Original Resolution
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Summary card */}
          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900">Early Blight</h2>
                <p className="pt-1 text-lg italic text-text-muted">Alternaria solani</p>
              </div>
              <div className="rounded-2xl bg-surface-muted px-6 py-3 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Confidence</p>
                <p className="font-heading text-2xl font-bold text-brand">98.4%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-surface-muted">
                  <Calendar className="size-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-faint">Date</p>
                  <p className="text-sm font-bold text-slate-800">Oct 24, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-surface-muted">
                  <MapPin className="size-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-faint">Location</p>
                  <p className="text-sm font-bold text-slate-800">Plot B-12 (North)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-surface-muted">
                  <Sprout className="size-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-faint">Crop Type</p>
                  <p className="text-sm font-bold text-slate-800">Tomato (Hybrid)</p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              Early blight is a common fungal disease that affects the foliage, stems, and fruits
              of tomatoes. Based on the leaf spots with concentric rings (target-like pattern), our
              AI has identified this as a late stage-1 infection.
            </p>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-3">
            {accordions.map((section) => {
              const Icon = section.icon;
              const isOpen = open === section.id;
              return (
                <div key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? "" : section.id)}
                    className="flex w-full items-center justify-between p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-surface-muted">
                        <Icon className="size-4 text-brand" />
                      </div>
                      <span className="font-bold text-slate-900">{section.title}</span>
                    </div>
                    <ChevronDown className={cn("size-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col gap-3 px-5 pb-5 pl-16">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-slate-600">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-3xl bg-surface-muted p-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Need Expert Help?</h3>
                <p className="pt-1 text-sm text-text-muted">
                  Chat with a licensed agronomist for a more personalized treatment plan.
                </p>
              </div>
              <Link
                href="/chat-assistant"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-lg"
              >
                <MessageCircle className="size-4" />
                Start Consultation
              </Link>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Weather Risk</h3>
                <p className="pt-1 text-sm text-text-muted">
                  High humidity forecast for next 3 days may accelerate fungal spread.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <CloudRain className="size-3.5 text-accent" />
                  88% Humidity
                </span>
                <Link href="/weather" className="text-sm font-bold text-accent">
                  View Forecast
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
