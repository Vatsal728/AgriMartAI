import Link from "next/link";
import { Download, ShieldCheck, FileText, Trash2, ChevronRight } from "lucide-react";

const rows = [
  {
    icon: Download,
    title: "Download my data",
    description: "Export a copy of your farm analysis history",
  },
  {
    icon: ShieldCheck,
    title: "Privacy policy",
    description: "Read how we secure and use your information",
  },
  {
    icon: FileText,
    title: "Terms of service",
    description: "Review our service agreement and usage rules",
  },
];

export default function DataAndPrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Data and privacy</h1>
        <p className="pt-1 text-base text-text-muted">Review and manage how your data is handled</p>
      </div>

      <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <button key={row.title} type="button" className="flex items-center justify-between gap-4 p-6 text-left">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
                  <Icon className="size-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{row.title}</p>
                  <p className="text-sm text-text-muted">{row.description}</p>
                </div>
              </div>
              <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
            </button>
          );
        })}
        <button type="button" className="flex items-center justify-between gap-4 p-6 text-left">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
              <Trash2 className="size-5 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-600">Delete account</p>
              <p className="text-sm text-text-muted">Permanently remove your account and all associated farm data</p>
            </div>
          </div>
          <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link href="/settings" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm">
          Back to main settings
        </Link>
        <button type="button" className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
