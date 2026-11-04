"use client";

import { useEffect } from "react";

/**
 * Adds `is-in` to every [data-reveal] element once it scrolls into view. Elements are
 * only hidden once `html.js` is set here, so the page stays readable without JS.
 */
export default function RevealObserver() {
  useEffect(() => {
    // What is already on the first screen shows at once; only what lies below waits for the scroll.
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((el) => {
      if (el.getBoundingClientRect().top >= window.innerHeight) return true;
      el.classList.add("is-in");
      return false;
    });
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
