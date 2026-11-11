import { display } from "@/config/site";

/** Simple route-line brand mark. Replace with the real logo when one is available. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false" className={className}>
      <circle cx="20" cy="20" r="19.250" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <path
        d="M12 28.500c0-7.500 16-5.500 16-12.500S17.500 13 17.500 10"
        stroke="var(--color-lagoon-400)"
        strokeWidth="1.800"
        strokeLinecap="round"
      />
      <circle cx="12" cy="28.500" r="2.500" fill="currentColor" />
      <circle cx="17.500" cy="10" r="2.500" fill="var(--color-sunset-400)" />
    </svg>
  );
}

/** Text-based logo: mark + business name from the site configuration. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="display truncate text-[1.150rem] leading-none sm:text-[1.250rem]">{display.name}</span>
    </span>
  );
}
