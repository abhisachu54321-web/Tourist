import Image from "next/image";
import { display, hero, services } from "@/config/site";
import { indexLabel, riseDelay } from "@/lib/css";
import { ArrowDownIcon, ArrowRightIcon, MapPinIcon } from "./icons";
import { SectionLink } from "./SectionLink";

/** Decorative route line: pickup → destination. Purely visual, hidden from assistive tech. */
function HeroRoute() {
  const route = "M22 262C132 262 118 164 214 158s92-92 196-104";
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 440 300"
      fill="none"
      className="pointer-events-none absolute right-[5%] top-[19%] hidden w-[min(34vw,30rem)] text-sand-50 lg:block"
    >
      <path d={route} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" />
      <path
        className="hero-route-line"
        pathLength={1}
        d={route}
        stroke="var(--color-lagoon-300)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="22" cy="262" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="22" cy="262" r="1.8" fill="currentColor" />
      <g className="hero-route-end">
        <circle className="beacon" cx="410" cy="54" r="5" fill="var(--color-sunset-400)" />
        <circle cx="410" cy="54" r="5" fill="var(--color-sunset-400)" />
      </g>
      <text x="38" y="286" fill="currentColor" fillOpacity="0.75" fontSize="9.5" fontWeight="600" letterSpacing="2.6">
        PICKUP
      </text>
      <text x="308" y="32" fill="currentColor" fillOpacity="0.75" fontSize="9.5" fontWeight="600" letterSpacing="2.6">
        DESTINATION
      </text>
    </svg>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="theme-dark relative isolate flex h-svh max-h-[1080px] min-h-[640px] flex-col justify-end overflow-hidden bg-night-950 text-sand-50"
    >
      {/* Photo — oversized at the top so the scroll drift never exposes an edge */}
      <div className="hero-parallax absolute inset-x-0 -top-[12%] bottom-0 -z-20">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          preload
          sizes="100vw"
          className="hero-image object-cover object-[38%_50%] md:object-center"
        />
      </div>

      {/* Scrims keep the headline readable on any photo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-night-950 via-night-950/35 to-night-950/20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-night-950/75 via-night-950/25 to-transparent" />

      <HeroRoute />

      <div className="container-wide relative pb-10 pt-28 md:pb-14">
        <p className="hero-rise eyebrow flex items-start gap-3 !leading-[1.7] text-sand-100/90" style={riseDelay(100)}>
          <span aria-hidden="true" className="mt-[0.55rem] h-px w-8 shrink-0 bg-sunset-400" />
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="hero-rise display mt-5 text-[clamp(2.9rem,10.4vw,7.75rem)] leading-[0.94]"
          style={riseDelay(200)}
        >
          <span className="block">{hero.headline[0]}</span>
          <span className="block italic text-sunset-300">{hero.headline[1]}</span>
        </h1>

        <p
          className="hero-rise mt-6 max-w-xl text-[1.05rem] leading-relaxed text-sand-100/90 sm:text-lg"
          style={riseDelay(320)}
        >
          {hero.text}
        </p>

        <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={riseDelay(440)}>
          <SectionLink href="/#booking" className="btn btn-primary">
            {hero.primaryCta}
            <ArrowRightIcon className="btn-arrow" />
          </SectionLink>
          <SectionLink href="/#services" className="btn btn-outline-light">
            {hero.secondaryCta}
          </SectionLink>
        </div>

        <p className="hero-rise mt-6 flex items-center gap-2 text-sm text-sand-100/80" style={riseDelay(540)}>
          <MapPinIcon width={16} height={16} className="shrink-0 text-lagoon-300" />
          Based in {display.location}
        </p>
      </div>

      {/* Service index — a quick way into each service on larger screens */}
      <div className="hero-rise relative hidden border-t border-white/15 md:block" style={riseDelay(640)}>
        <ul className="container-wide grid grid-cols-3">
          {services.map((service, index) => (
            <li key={service.id} className="border-l border-white/15 first:border-l-0">
              <SectionLink
                href={`/#${service.anchor}`}
                className={`group flex items-center justify-between gap-4 py-5 transition-colors hover:text-sunset-300 ${
                  index === 0 ? "pr-6" : "px-6"
                }`}
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-xs font-semibold tabular-nums text-sand-100/60">{indexLabel(index)}</span>
                  <span className="display text-lg leading-tight lg:text-2xl">{service.name}</span>
                </span>
                <ArrowDownIcon
                  width={18}
                  height={18}
                  className="shrink-0 text-sand-100/60 transition-transform duration-300 group-hover:translate-y-1 group-hover:text-sunset-300"
                />
              </SectionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
