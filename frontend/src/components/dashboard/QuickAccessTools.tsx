import Link from "next/link";
import { Sprout, Droplet, CloudSun, Leaf, type LucideIcon } from "lucide-react";

const tools: { label: string; description: string; href: string; icon: LucideIcon }[] = [
  { label: "Crop Analysis", description: "Yield predictions", href: "/crop-recommendation", icon: Sprout },
  { label: "Irrigation", description: "Control system", href: "/irrigation", icon: Droplet },
  { label: "Weather Pro", description: "7-day forecast", href: "/weather", icon: CloudSun },
  { label: "Eco-Score", description: "Sustainability", href: "/sustainability-score", icon: Leaf },
];

export function QuickAccessTools() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-slate-900">Quick Access Tools</h2>
        <button type="button" className="text-sm font-bold text-brand">
          Customize Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.label}
              href={tool.href}
              className="flex items-center gap-5 rounded-3xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface-muted">
                <Icon className="size-5 text-brand" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{tool.label}</p>
                <p className="text-xs text-text-muted">{tool.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
