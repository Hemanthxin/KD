"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "", label: "All" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
];

export function StatusFilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "";

  return (
    <div className="mb-5 max-w-full overflow-x-auto">
      <div className="inline-flex rounded-lg border border-border-subtle bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (tab.value) params.set("status", tab.value);
              else params.delete("status");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={cn(
              "shrink-0 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
              current === tab.value
                ? "bg-brand-teal-900 text-white"
                : "text-text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
