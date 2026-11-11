import Image from "next/image";
import { destinations } from "@/config/site";
import { indexLabel, revealDelay } from "@/lib/css";
import { ArrowRightIcon } from "./icons";
import { SectionLink } from "./SectionLink";
import { SetupNote } from "./SetupNote";

// Asymmetric mosaic on larger screens; the pattern repeats if more destinations are added.
const tileLayout = [
  "md:col-span-6 md:row-span-2 lg:col-span-5",
  "md:col-span-6 lg:col-span-7",
  "md:col-span-6 lg:col-span-3",
  "md:col-span-6 lg:col-span-4",
  "md:col-span-6 lg:col-span-7",
];

const slide = "relative w-[82%] shrink-0 snap-start aspect-[4/5] md:aspect-auto md:w-auto";

export function Destinations() {
  return (
    <section
      id="destinations"
      tabIndex={-1}
      aria-labelledby="destinations-title"
      className="theme-dark bg-night-900 py-20 text-sand-50 sm:py-28 lg:py-36"
    >
      <div className="container-wide">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-lagoon-300">Destinations &amp; experiences</p>
            <h2 id="destinations-title" className="display mt-5 text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.03]">
              Places worth <em className="text-sunset-300">the drive.</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-sand-100/80">
              A few ideas to start the conversation. These are examples rather than a fixed list — tell us where
              you&apos;d like to go and we&apos;ll let you know what we can arrange.
            </p>
            <SetupNote tone="dark" className="mt-4">
              Sample destinations — replace them with places in your own service area.
            </SetupNote>
          </div>
        </header>

        <p className="eyebrow mt-10 flex items-center gap-3 text-sand-100/60 md:hidden">
          Swipe to explore
          <ArrowRightIcon width={14} height={14} />
        </p>

        {/* Phones: swipeable row. Tablets and up: mosaic grid. */}
        <ul className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:auto-rows-[15rem] md:grid-flow-dense md:grid-cols-12 md:overflow-visible md:px-0 md:pb-0 lg:auto-rows-[17rem] [&::-webkit-scrollbar]:hidden">
          {destinations.map((destination, index) => (
            <li
              key={destination.name}
              data-reveal
              style={revealDelay((index % 3) * 90)}
              className={`group isolate overflow-hidden rounded-sm bg-night-800 ${slide} ${
                tileLayout[index % tileLayout.length]
              }`}
            >
              <Image
                src={destination.image}
                alt={destination.imageAlt}
                fill
                sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 82vw"
                className="image-zoom -z-20 object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-night-950/92 via-night-950/25 to-night-950/50"
              />
              <div className="flex h-full flex-col justify-between p-5 sm:p-6">
                <p className="eyebrow flex items-center justify-between gap-3 text-sand-50/90">
                  <span className="tabular-nums">{indexLabel(index)}</span>
                  <span className="text-right">{destination.tag}</span>
                </p>
                <div>
                  <h3 className="display text-3xl leading-tight lg:text-4xl">{destination.name}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-sand-100/90">{destination.description}</p>
                  <SectionLink
                    href="/#booking"
                    prefill={{ destination: destination.name }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sunset-300 after:absolute after:inset-0"
                  >
                    Plan a trip<span className="sr-only"> to {destination.name}</span>
                    <ArrowRightIcon
                      width={16}
                      height={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </SectionLink>
                </div>
              </div>
            </li>
          ))}

          <li
            data-reveal
            className={`flex flex-col justify-between rounded-sm border border-white/20 p-6 sm:p-8 md:col-span-12 lg:col-span-5 ${slide}`}
          >
            <svg aria-hidden="true" focusable="false" viewBox="0 0 120 40" fill="none" className="w-28 text-sand-50">
              <path
                d="M6 32C30 32 30 10 58 10s30 18 56 14"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
              <circle cx="6" cy="32" r="4" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="114" cy="24" r="4" fill="var(--color-sunset-400)" />
            </svg>
            <div>
              <h3 className="display text-3xl leading-tight lg:text-4xl">Somewhere else in mind?</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-sand-100/80">
                Tell us where you&apos;d like to go and we&apos;ll plan the journey around it.
              </p>
              <SectionLink href="/#booking" prefill={{ service: "tour" }} className="btn btn-primary mt-6">
                Plan a Custom Trip
                <ArrowRightIcon className="btn-arrow" />
              </SectionLink>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
