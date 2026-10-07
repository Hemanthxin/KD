"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
];

export function LeadsFilterBar({
  workers,
}: {
  workers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Search business name…"
          className="h-10 w-64 rounded-lg border border-border-subtle bg-surface pl-9 pr-3 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
        />
      </div>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="h-10 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("worker") ?? ""}
        onChange={(e) => updateParam("worker", e.target.value)}
        className="h-10 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
      >
        <option value="">All workers</option>
        <option value="unassigned">Unassigned</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
