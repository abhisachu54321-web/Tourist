import { bookingSteps } from "@/config/site";
import { ArrowRightIcon } from "./icons";
import { SectionLink } from "./SectionLink";

export function HowItWorks() {
  const lastIndex = bookingSteps.length - 1;
  // Connector between one stop and the next: vertical on phones, horizontal on desktop.
  const connector =
    "absolute left-6 top-12 -bottom-10 w-px lg:-right-12 lg:bottom-auto lg:left-12 lg:top-6 lg:h-px lg:w-auto";

  return (
    <section
      id="how-it-works"
      tabIndex={-1}
      aria-labelledby="how-title"
      className="bg-sand-100 py-20 sm:py-28 lg:py-32"
    >
      <div className="container-wide">
        <header data-reveal className="max-w-3xl">
          <p className="eyebrow text-lagoon-700">How booking works</p>
          <h2 id="how-title" className="display mt-5 text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.03]">
            Three simple steps to <em className="text-lagoon-700">your journey.</em>
          </h2>
        </header>

        <ol data-reveal className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-12">
          {bookingSteps.map((step, index) => (
            <li key={step.title} className="relative pl-20 lg:pl-0 lg:pt-20">
              {index < lastIndex && (
                <>
                  <span aria-hidden="true" className={`${connector} bg-night-900/15`} />
                  <span
                    aria-hidden="true"
                    className={`line-grow ${connector} bg-lagoon-600`}
                    style={{ transitionDelay: `${350 + index * 700}ms` }}
                  />
                </>
              )}
              <span
                aria-hidden="true"
                className={`display absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border text-lg ${
                  index === lastIndex
                    ? "border-sunset-400 bg-sunset-400 text-night-950"
                    : "border-night-900/25 bg-sand-100 text-night-900"
                }`}
              >
                {index + 1}
              </span>
              <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-sm leading-relaxed text-ink-600">{step.text}</p>
            </li>
          ))}
        </ol>

        <div
          data-reveal
          className="mt-14 flex flex-col gap-6 border-t border-night-900/15 pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        >
          <p className="max-w-2xl leading-relaxed text-night-900">
            <strong className="font-semibold">Please note:</strong> sending an enquiry does not confirm a booking. Your
            journey is confirmed only once our team has checked availability and confirmed the arrangements with you.
          </p>
          <SectionLink href="/#booking" className="btn btn-dark shrink-0 self-start lg:self-auto">
            Start Your Enquiry
            <ArrowRightIcon className="btn-arrow" />
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
