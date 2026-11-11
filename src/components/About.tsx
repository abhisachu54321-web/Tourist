import Image from "next/image";
import { about, display } from "@/config/site";
import { revealDelay } from "@/lib/css";
import { ArrowRightIcon } from "./icons";
import { SectionLink } from "./SectionLink";
import { SetupNote } from "./SetupNote";

export function About() {
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="bg-sand-50 py-20 sm:py-28 lg:py-36">
      <div className="container-wide grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Overlapping photo pair */}
        <div data-reveal className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-[84%] overflow-hidden rounded-sm bg-sand-200 sm:aspect-[5/6]">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 84vw"
              className="object-cover object-[60%_50%]"
            />
          </div>
          <div className="absolute bottom-16 right-0 aspect-[4/3] w-[46%] overflow-hidden rounded-sm border-[6px] border-sand-50 bg-sand-200">
            <Image
              src={about.detailImage}
              alt={about.detailImageAlt}
              fill
              sizes="(min-width: 1024px) 22vw, 46vw"
              className="object-cover"
            />
          </div>
          <p className="eyebrow mt-6 flex items-center gap-3 !leading-[1.7] text-ink-600">
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-sunset-500" />
            Family-owned · {display.location}
          </p>
        </div>

        <div data-reveal style={revealDelay(120)} className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow text-lagoon-700">About us</p>
          <h2 id="about-title" className="display mt-5 text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.06]">
            {about.heading}
          </h2>

          <div className="mt-7 space-y-5 leading-relaxed text-ink-600">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "text-lg text-night-900" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {about.facts.length > 0 ? (
            <dl className="mt-9 grid grid-cols-2 gap-x-8 border-t border-night-900/12">
              {about.facts.map((fact) => (
                <div key={fact.label} className="border-b border-night-900/12 py-5">
                  <dt className="eyebrow !leading-[1.6] text-ink-600">{fact.label}</dt>
                  <dd className="display mt-2 text-4xl text-night-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <SetupNote className="mt-8">
              Add verified facts (years in business, fleet size…) under <code>about.facts</code> when you have them.
            </SetupNote>
          )}

          <div className="mt-9">
            <SectionLink
              href="/#contact"
              className="link-draw inline-flex items-center gap-2.5 pb-1 text-[0.95rem] font-semibold text-night-900"
            >
              Get in touch with us
              <ArrowRightIcon width={18} height={18} />
            </SectionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
