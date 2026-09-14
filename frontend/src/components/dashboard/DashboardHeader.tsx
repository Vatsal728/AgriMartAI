import { Bell } from "lucide-react";

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-text-muted">{today}</p>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          Good morning, David Miller
        </h1>
      </div>
      <div className="flex items-stretch gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
          <span className="size-2 rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-slate-600">System Live</span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-12 items-center justify-center rounded-xl border border-border bg-surface shadow-sm"
        >
          <Bell className="size-4 text-slate-700" />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500" />
        </button>
      </div>
    </div>
  );
}
