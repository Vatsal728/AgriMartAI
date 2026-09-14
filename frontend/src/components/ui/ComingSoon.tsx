import { type LucideIcon, Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-8">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-muted">
        <Icon className="size-7 text-brand" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold text-slate-900">{title}</h1>
        <p className="max-w-md text-sm text-text-muted">{description}</p>
      </div>
    </div>
  );
}
