import Image from "next/image";
import { services, type Service } from "@/config/site";
import { indexLabel, revealDelay } from "@/lib/css";
import { ArrowRightIcon } from "./icons";
import { SectionLink } from "./SectionLink";

/** Editorial row: large photo with an offset detail image, text alongside. Alternates sides. */
function ServiceRow({ service, index }: { service: Service; index: number }) {
  const flipped = index % 2 === 1;
  const titleId = `${service.anchor}-title`;

  return (
    <article
      id={service.anchor}
      tabIndex={-1}
      aria-labelledby={titleId}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8"
    >
      <div
        data-reveal
        className={`group relative sm:mb-8 lg:col-span-7 lg:mb-0 ${flipped ? "lg:order-2 lg:col-start-6" : ""}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand-200 sm:aspect-[3/2]">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="image-zoom object-cover"
          />
        </div>
        {service.detailImage && (
          <div
            className={`absolute -bottom-8 hidden aspect-[4/5] w-[34%] overflow-hidden rounded-sm border-[6px] border-sand-50 bg-sand-200 sm:block ${
              flipped ? "-left-5 lg:-left-10" : "-right-5 lg:-right-10"
            }`}
          >
            <Image
              src={service.detailImage}
              alt={service.detailImageAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 20vw, 34vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div
        data-reveal
        style={revealDelay(120)}
        className={`lg:col-span-4 ${flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}
      >
        <p className="eyebrow flex items-center gap-4 text-lagoon-700">
          <span className="tabular-nums text-ink-600">{indexLabel(index)}</span>
          <span aria-hidden="true" className="h-px w-10 bg-night-900/20" />
          {service.eyebrow}
        </p>
        <h3 id={titleId} className="display mt-6 text-[2.5rem] leading-[1.04] sm:text-5xl">
          {service.name}
        </h3>
        <p className="mt-3 font-display text-xl italic text-ink-600">{service.headline}</p>
        <p className="mt-5 leading-relaxed text-ink-600">{service.description}</p>

        <ul className="mt-7 border-t border-night-900/12">
          {service.includes.map((item) => (
            <li key={item} className="flex items-center gap-3.5 border-b border-night-900/12 py-3.5 text-[0.95rem] font-medium">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-sunset-500" />
              {item}
            </li>
          ))}
        </ul>

        <SectionLink href="/#booking" prefill={{ service: service.id }} className="btn btn-dark mt-8">
          {service.cta}
          <ArrowRightIcon className="btn-arrow" />
        </SectionLink>
      </div>
    </article>
  );
}

/** Immersive photo panel — used for tour packages so the three services don't look alike. */
function ServiceFeature({ service, index }: { service: Service; index: number }) {
  const titleId = `${service.anchor}-title`;

  return (
    <article
      id={service.anchor}
      tabIndex={-1}
      aria-labelledby={titleId}
      className="theme-dark group relative isolate overflow-hidden rounded-sm bg-night-900 text-sand-50"
    >
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        sizes="(min-width: 1344px) 1250px, 100vw"
        className="image-zoom -z-20 object-cover object-[50%_42%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night-950/70 lg:hidden" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-linear-to-r from-night-950/95 via-night-950/65 to-night-950/25 lg:block"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-night-950/75 via-transparent to-transparent" />

      <div className="grid gap-12 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-28">
        <div data-reveal className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-4 text-sunset-300">
            <span className="tabular-nums text-sand-100/70">{indexLabel(index)}</span>
            <span aria-hidden="true" className="h-px w-10 bg-white/30" />
            {service.eyebrow}
          </p>
          <h3 id={titleId} className="display mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl">
            {service.name}
          </h3>
          <p className="mt-4 font-display text-xl italic text-sand-100/90 sm:text-2xl">{service.headline}</p>
          <p className="mt-5 max-w-lg leading-relaxed text-sand-100/85">{service.description}</p>
          <SectionLink href="/#booking" prefill={{ service: service.id }} className="btn btn-primary mt-9">
            {service.cta}
            <ArrowRightIcon className="btn-arrow" />
          </SectionLink>
        </div>

        <ul
          data-reveal
          style={revealDelay(150)}
          className="grid self-end border-l border-t border-white/20 sm:grid-cols-2 lg:col-span-5 lg:col-start-8"
        >
          {service.includes.map((item, itemIndex) => (
            <li key={item} className="border-b border-r border-white/20 bg-night-950/45 p-5 sm:p-6">
              <span className="text-xs font-semibold tabular-nums text-sunset-300">{indexLabel(itemIndex)}</span>
              <p className="mt-3 font-display text-xl leading-snug">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Services() {
  const rows = services.filter((service) => service.id !== "tour");
  const feature = services.find((service) => service.id === "tour");

  return (
    <section id="services" tabIndex={-1} aria-labelledby="services-title" className="bg-sand-50 py-20 sm:py-28 lg:py-36">
      <div className="container-wide">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-lagoon-700">Our services</p>
            <h2 id="services-title" className="display mt-5 text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.03]">
              Three ways to travel <em className="text-lagoon-700">with us.</em>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-600 lg:col-span-4 lg:col-start-9">
            Whether it&apos;s a single ride or a full itinerary, start by telling us what you need — we&apos;ll take it
            from there.
          </p>
        </header>

        <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28 lg:space-y-36">
          {rows.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>

        {feature && (
          <div className="mt-20 sm:mt-28 lg:mt-36">
            <ServiceFeature service={feature} index={rows.length} />
          </div>
        )}
      </div>
    </section>
  );
}
