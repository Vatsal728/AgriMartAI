"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ChevronRight } from "lucide-react";
import { navSections } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AgriSmartAPI } from "@/lib/api";

import { getUserProfile, subscribeUserProfile } from "@/lib/user";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [userName, setUserName] = useState("Desai Vatshal");
  const [userPlan, setUserPlan] = useState("Premium Plan");
  const [avatarSrc, setAvatarSrc] = useState("/images/profile-avatar.png");

  useEffect(() => {
    const syncUser = () => {
      const profile = getUserProfile();
      setUserName(profile.name);
      setAvatarSrc(profile.avatar);
    };

    syncUser();
    const unsubscribe = subscribeUserProfile(syncUser);

    let cancelled = false;
    AgriSmartAPI.getCurrentUser()
      .then((u) => {
        if (!cancelled && u) {
          if (u.subscription_plan) setUserPlan(u.subscription_plan);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-between bg-surface">
      <div className="flex items-center gap-3 px-6 pb-10 pt-8">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand">
          <Leaf className="size-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-xl font-bold tracking-tight text-brand">
          {t("common.appName")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-8 overflow-y-auto px-4 pb-4">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1.5">
            <p className="px-4 pb-1.5 text-[11px] font-bold uppercase tracking-[1.1px] text-text-faint">
              {t(section.title)}
            </p>
            {section.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-brand text-white"
                      : "text-slate-800 hover:bg-surface-muted"
                  )}
                >
                  <Icon className="size-[14px] shrink-0" strokeWidth={2.25} />
                  <span>{t(item.label)}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-6 px-4 pb-8">
        <div className="h-px w-full bg-border" />
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-2xl bg-surface-muted p-3 hover:bg-slate-200/60 transition"
        >
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
              <Image
                src={avatarSrc}
                alt={userName}
                fill
                sizes="40px"
                unoptimized={avatarSrc.startsWith("blob:") || avatarSrc.startsWith("data:")}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{userName}</p>
              <p className="text-[11px] text-text-muted">{userPlan}</p>
            </div>
          </div>
          <ChevronRight className="size-3 text-text-muted" />
        </Link>
      </div>
    </div>
  );
}
