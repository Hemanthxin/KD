"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export function SearchBox({
  placeholder = "Search…",
  param = "q",
}: {
  placeholder?: string;
  param?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        defaultValue={searchParams.get(param) ?? ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set(param, e.target.value);
          else params.delete(param);
          startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
          });
        }}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border-subtle bg-surface pl-9 pr-3 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
      />
    </div>
  );
}
