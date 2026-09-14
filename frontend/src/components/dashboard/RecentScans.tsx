import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Scan = {
  name: string;
  sector: string;
  date: string;
  status: "HEALTHY" | "ACTION NEEDED";
  image: string;
};

const scans: Scan[] = [
  { name: "Corn (Maize)", sector: "Sector 4", date: "Oct 24, 2023 · 09:45 AM", status: "HEALTHY", image: "/images/scan-corn.png" },
  { name: "Tomato Plant", sector: "Sector 1", date: "Oct 22, 2023 · 02:12 PM", status: "ACTION NEEDED", image: "/images/scan-tomato.png" },
  { name: "Soybean", sector: "Sector 7", date: "Oct 21, 2023 · 11:30 AM", status: "HEALTHY", image: "/images/scan-soybean.png" },
  { name: "Wheat (Winter)", sector: "Sector 3", date: "Oct 20, 2023 · 04:50 PM", status: "HEALTHY", image: "/images/scan-wheat.png" },
];

export function RecentScans() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-slate-900">Recent Plant Scans</h2>
        <Link href="/history" className="text-sm font-bold text-brand">
          View History
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {scans.map((scan) => (
          <div
            key={scan.name}
            className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
          >
            <div className="relative h-44 w-full">
              <Image src={scan.image} alt={scan.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              <span
                className={cn(
                  "absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm",
                  scan.status === "HEALTHY" ? "bg-green-500/90" : "bg-orange-500/90"
                )}
              >
                {scan.status}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-5">
              <div className="flex items-start justify-between">
                <p className="font-bold text-slate-900">{scan.name}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-faint">{scan.sector}</p>
              </div>
              <div className="flex items-center gap-1.5 pb-2 text-xs text-text-muted">
                <Calendar className="size-3" />
                {scan.date}
              </div>
              <Link
                href="/history/diagnosis"
                className="w-full rounded-xl border border-border py-2.5 text-center text-xs font-bold tracking-wide text-slate-600"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
