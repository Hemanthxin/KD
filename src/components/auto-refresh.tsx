"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Periodically re-fetches the current server-rendered route so shared,
 * contended data (like unclaimed leads) stays in sync across everyone
 * viewing the page — e.g. a lead another employee just accepted
 * disappears without a manual refresh.
 */
export function AutoRefresh({
  intervalMs = 6000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
