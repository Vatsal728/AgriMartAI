"use client";

import { useState } from "react";
import { AlertTriangle, Droplet, Leaf, CheckCircle2, Wind, X, Bell } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  unread?: boolean;
  time: string;
  body: string;
};

const initial: Notification[] = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    title: "High Disease Risk Detected",
    unread: true,
    time: "2 hours ago",
    body: "Our AI model identified early signs of Blight in Sector A-12. Humidity levels are currently 85%, which accelerates spread. Immediate inspection recommended.",
  },
  {
    id: 2,
    icon: Droplet,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "Irrigation Cycle Reminder",
    unread: true,
    time: "4 hours ago",
    body: "Sector B-04 moisture levels have dropped below 30%. The scheduled irrigation cycle will begin automatically in 1 hour.",
  },
  {
    id: 3,
    icon: Leaf,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    title: "Weekly Sustainability Report",
    time: "Yesterday",
    body: "Your Eco-Score for the past week has improved by 12 points. View the detailed breakdown in the Sustainability Score tab.",
  },
  {
    id: 4,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-brand",
    title: "Irrigation Complete",
    time: "Oct 25, 2023",
    body: "Irrigation cycle for Sector A-12 has successfully finished. Average soil moisture is now at 42% (Optimal).",
  },
  {
    id: 5,
    icon: Wind,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Weather Warning: High Winds",
    time: "Oct 24, 2023",
    body: "Wind gusts up to 45km/h expected tomorrow morning. Ensure any temporary crop covers or sensors are securely fastened.",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initial);

  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-muted">System Updates</p>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Notifications</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 sm:flex">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-slate-600">System Live</span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Bell className="size-4 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="flex items-start gap-6 p-6">
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", n.iconBg)}>
                <Icon className={cn("size-5", n.iconColor)} />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{n.title}</h3>
                    {n.unread && <span className="size-2 rounded-full bg-accent" />}
                  </div>
                  <span className="shrink-0 text-xs text-text-faint">{n.time}</span>
                </div>
                <p className="text-sm leading-relaxed text-text-muted">{n.body}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(n.id)}
                className="shrink-0 text-slate-300 hover:text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <p className="p-10 text-center text-sm text-text-muted">You&rsquo;re all caught up.</p>
        )}
      </div>

      <p className="text-center text-sm text-text-muted">
        You&rsquo;ve seen all recent updates from the last 7 days.
      </p>
    </div>
  );
}
