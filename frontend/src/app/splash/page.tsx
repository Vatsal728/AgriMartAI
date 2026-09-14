"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-brand text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex size-32 items-center justify-center rounded-full bg-white/10">
          <Leaf className="size-12 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-heading text-4xl font-bold">AgriSmart AI</h1>
          <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-100/70">
            The future of intelligent farming
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 animate-pulse rounded-full bg-white"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-emerald-50/70">Initializing Neural Soil Maps</p>
      </div>
    </div>
  );
}
