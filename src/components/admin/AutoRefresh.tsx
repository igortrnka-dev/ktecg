"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refreshes server data on an interval while something is running. */
export default function AutoRefresh({ active, ms = 5000 }: { active: boolean; ms?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => router.refresh(), ms);
    return () => clearInterval(id);
  }, [active, ms, router]);
  return null;
}
