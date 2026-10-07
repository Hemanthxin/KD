import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "emerald" | "amber" | "red";
  hint?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-brand-teal-900 text-white",
    emerald: "bg-brand-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
