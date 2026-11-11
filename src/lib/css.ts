import type { CSSProperties } from "react";

/** Staggers a scroll-reveal (`data-reveal`) by the given delay. */
export function revealDelay(milliseconds: number): CSSProperties {
  return { "--reveal-delay": `${milliseconds}ms` } as CSSProperties;
}

/** Staggers a hero entrance animation (`.hero-rise`). */
export function riseDelay(milliseconds: number): CSSProperties {
  return { "--delay": `${milliseconds}ms` } as CSSProperties;
}

/** Two-digit index label: 0 → "01". */
export function indexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}
