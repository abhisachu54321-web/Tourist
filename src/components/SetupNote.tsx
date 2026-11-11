import type { ReactNode } from "react";
import { isSetupMode } from "@/config/site";

/**
 * A clearly marked placeholder shown only while the site is in setup mode
 * (business name or location still missing in `src/config/site.ts`).
 * It never renders on a configured site, and it is never a link or button.
 */
export function SetupNote({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!isSetupMode) return null;

  return (
    <span className={`setup-note ${tone === "dark" ? "setup-note-dark" : ""} ${className}`}>
      <span className="shrink-0 rounded-sm bg-sunset-400 px-1.5 py-0.5 text-[0.620rem] font-bold uppercase tracking-[0.120em] text-night-950">
        Setup
      </span>
      <span>{children}</span>
    </span>
  );
}
