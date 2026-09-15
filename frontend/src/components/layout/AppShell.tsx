"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const NO_SHELL_PREFIXES = ["/login", "/onboarding", "/splash", "/offline"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const noShell = pathname === "/" || NO_SHELL_PREFIXES.some((p) => pathname.startsWith(p));

  if (noShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-surface-muted lg:h-screen lg:overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand">
            <Leaf className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-bold text-brand">{t("common.appName")}</span>
        </div>
        <button
          type="button"
          aria-label={t("nav.openNavigation")}
          onClick={() => setMobileNavOpen(true)}
          className="flex size-10 items-center justify-center rounded-full border border-border text-slate-700"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t("nav.closeNavigation")}
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-surface shadow-xl">
            <button
              type="button"
              aria-label={t("nav.closeNavigation")}
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-border text-slate-600"
            >
              <X className="size-4" />
            </button>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col pt-16 lg:h-full lg:overflow-y-auto lg:pt-0">
        {children}
      </main>
    </div>
  );
}
