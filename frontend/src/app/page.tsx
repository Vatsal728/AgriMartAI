import Link from "next/link";
import {
  Leaf,
  ScanLine,
  Sprout,
  Droplet,
  CloudSun,
  BarChart3,
  Bot,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const stats = [
  { value: "94.2%", label: "Diagnosis accuracy" },
  { value: "45+", label: "Plant species covered" },
  { value: "12+", label: "Languages supported" },
];

const features = [
  {
    icon: ScanLine,
    title: "Instant Disease Detection",
    description: "Upload a leaf photo and get a diagnosis with confidence score and treatment advice in seconds.",
  },
  {
    icon: MessageCircle,
    title: "Grounded AI Assistant",
    description: "Ask follow-up questions in plain language, with every answer cited from an agricultural knowledge base.",
  },
  {
    icon: Sprout,
    title: "Crop Recommendation",
    description: "Get AI-powered crop suggestions based on soil type, pH, weather, and season.",
  },
  {
    icon: Droplet,
    title: "Smart Irrigation",
    description: "Real-time soil moisture, automated valve control, and irrigation schedules per sector.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description: "7-day hyper-local forecasts combined with farm data to flag disease and irrigation risk.",
  },
  {
    icon: BarChart3,
    title: "Sustainability Score",
    description: "Track water efficiency, resource use, and crop health with a transparent scoring methodology.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand">
            <Leaf className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-bold text-brand">AgriSmart AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-700 sm:block">
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-muted px-6 py-20 sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand">
            Intelligent Agriculture Platform
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Farming, guided by <span className="text-brand">grounded AI</span>
          </h1>
          <p className="max-w-xl text-lg text-text-muted">
            Detect crop disease instantly, get science-backed treatment advice, and manage
            irrigation, weather, and sustainability — all from one dashboard.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-800"
            >
              Log in
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <p className="font-heading text-3xl font-bold text-brand sm:text-4xl">{s.value}</p>
                <p className="text-sm text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything a modern farm needs
            </h2>
            <p className="text-text-muted">
              Core disease detection, plus a full advisory suite — crop, irrigation, weather, and
              sustainability — powered by an agentic layer that watches your farm continuously.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-text-muted">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agentic advisor callout */}
      <section className="px-6 pb-20 sm:px-12 sm:pb-28">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-[40px] bg-brand px-8 py-16 text-center text-white sm:px-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <Bot className="size-6" />
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            An advisor that never sleeps
          </h2>
          <p className="max-w-xl text-emerald-50/80">
            Our agentic layer continuously reasons over weather, soil, and disease-risk data — and
            proactively notifies you before problems become losses.
          </p>
          <Link
            href="/login"
            className="mt-2 flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand shadow-lg"
          >
            Start free today
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 border-t border-slate-100 px-6 py-10 text-sm text-text-muted sm:flex-row sm:justify-between sm:px-12">
        <div className="flex items-center gap-2">
          <Leaf className="size-4 text-brand" />
          <span className="font-semibold text-slate-700">AgriSmart AI</span>
        </div>
        <p>© 2024 AgriSmart AI Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
