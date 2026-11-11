"use client";

import { useEffect } from "react";

/**
 * Reveals elements marked with `data-reveal` as they scroll into view.
 *
 * One shared IntersectionObserver handles the whole page, so it stays lightweight.
 * Content is only ever hidden after this script is running, and never when the
 * visitor prefers reduced motion — so nothing can get stuck invisible.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    // Anything already on screen is shown straight away to avoid a flash.
    const viewportHeight = window.innerHeight;
    for (const element of elements) {
      if (element.getBoundingClientRect().top < viewportHeight) element.setAttribute("data-revealed", "");
    }
    root.setAttribute("data-reveal-ready", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    for (const element of elements) {
      if (!element.hasAttribute("data-revealed")) observer.observe(element);
    }

    return () => {
      observer.disconnect();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
