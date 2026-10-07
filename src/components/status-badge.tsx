import { cn } from "@/lib/utils";
import type { LeadStatus } from "@prisma/client";

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  NEW: {
    label: "New",
    className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-brand-emerald-100 text-brand-emerald-600 ring-1 ring-inset ring-emerald-200",
  },
  NOT_INTERESTED: {
    label: "Not Interested",
    className: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
