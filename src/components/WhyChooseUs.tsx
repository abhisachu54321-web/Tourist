import { benefits, display } from "@/config/site";
import { indexLabel, revealDelay } from "@/lib/css";
import { Contours } from "./Contours";

export function WhyChooseUs() {
  return (
    <section
      id="why-us"
      tabIndex={-1}
      aria-labelledby="why-title"
      className="theme-dark relative overflow-hidden bg-night-800 py-20 text-sand-50 sm:py-28 lg:py-36"
    >
      <Contours className="pointer-events-none absolute -right-48 -top-40 w-[46rem] text-white/[0.06]" />

      <div className="container-wide relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <header data-reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow text-lagoon-300">Why choose us</p>
          <h2 id="why-title" className="display mt-5 text-[clamp(2.25rem,4.8vw,3.75rem)] leading-[1.04]">
            Travel planned around <em className="text-sunset-300">people.</em>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-sand-100/80">
            What you can expect when you plan a journey with {display.name}.
          </p>
        </header>

        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {benefits.map((benefit, index) => (
            <li
              key={benefit.title}
              data-reveal
              style={revealDelay((index % 2) * 110)}
              className="border-t border-white/15 py-7"
            >
              <span aria-hidden="true" className="font-display text-2xl italic text-sunset-300">
                {indexLabel(index)}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{benefit.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-sand-100/75">{benefit.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
