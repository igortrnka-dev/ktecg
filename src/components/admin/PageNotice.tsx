"use client";

import { useEffect, useRef } from "react";

/**
 * A one-off message after a redirect. On mount it scrolls to the top and takes focus, so it is in view even
 * when the redirect kept the old scroll position, and drops `param` from the URL, so later saves on the
 * page and reloads do not show it again.
 */
export default function PageNotice({ param, children }: { param: string; children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    ref.current?.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      // A null state lets the Next router take over the new URL (it keeps its own history state).
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, [param]);
  return (
    <p ref={ref} tabIndex={-1} className="notice notice--info page-notice" role="status">
      {children}
    </p>
  );
}
