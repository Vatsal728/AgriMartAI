import Image from "next/image";
import Link from "next/link";
import { Bell, Crosshair, MessageCircle, ListChecks, FlaskConical, ShieldCheck, Info } from "lucide-react";

const recentThumbs = ["/images/result-thumb-1.png", "/images/result-thumb-2.png", "/images/result-thumb-3.png"];

const actions = [
  "Remove and destroy all infected leaves immediately. Do not compost them, as the spores can survive.",
  "Increase air circulation between plants by thinning foliage and ensuring proper spacing (minimum 24 inches).",
  "Apply a 2-3 inch layer of organic mulch around the base of the plants to prevent soil-borne spores from splashing onto leaves.",
];

const treatments = [
  { name: "Copper-Based Fungicides", note: "Best for organic control and early-stage intervention." },
  { name: "Chlorothalonil", note: "Effective broad-spectrum protective treatment." },
  { name: "Bacillus subtilis", note: "Microbial biological fungicide for sustainable farming." },
  { name: "Mancozeb", note: "Provides a protective barrier against reinfection." },
];

const prevention = [
  "Water plants at the base early in the morning; avoid wetting the foliage to reduce humidity.",
  "Practice crop rotation—avoid planting tomatoes, potatoes, or peppers in the same spot for at least 2 years.",
  "Select disease-resistant tomato varieties for future plantings.",
  "Ensure soil is well-draining and rich in organic matter to promote strong immune systems.",
];

export default function TreatmentAdvicePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Treatment Advice</h1>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        {/* Left: leaf + diagnosis summary */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image src="/images/result-leaf-large.png" alt="Analyzed leaf" fill sizes="420px" className="object-cover" />
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                <Crosshair className="size-2.5" />
                Analyzed Target
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">Tomato Early Blight</h2>
            <span className="mt-3 inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm font-bold text-white">
              Infection Identified
            </span>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-900">Recent Diagnoses</p>
            <div className="flex gap-4">
              {recentThumbs.map((src) => (
                <div key={src} className="relative size-16 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                  <Image src={src} alt="Recent diagnosis" fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: advice content */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <Link
              href="/chat-assistant"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm"
            >
              <MessageCircle className="size-4" />
              Ask a follow-up
            </Link>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50">
                <ListChecks className="size-4 text-red-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Recommended action</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {actions.map((a) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                <FlaskConical className="size-4 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Fungicide/treatment options</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {treatments.map((t) => (
                <div key={t.name} className="rounded-2xl border border-slate-200 p-5">
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="pt-2 text-sm text-text-muted">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
                <Info className="size-4 text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Prevention tips</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {prevention.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-sm text-text-muted">
            Source: agricultural knowledge base · Updated May 2024
          </p>
        </div>
      </div>
    </div>
  );
}
