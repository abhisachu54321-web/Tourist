import { BookingForm } from "./BookingForm";
import { ContactButtons } from "./ContactButtons";
import { Contours } from "./Contours";
import { CheckIcon } from "./icons";

const reassurances = [
  "No payment is taken on this website",
  "An enquiry is not a confirmed booking",
  "We reply using the contact details you give us",
];

export function BookingSection() {
  return (
    <section
      id="booking"
      tabIndex={-1}
      aria-labelledby="booking-title"
      className="theme-dark relative overflow-hidden bg-night-900 py-20 text-sand-50 sm:py-28 lg:py-32"
    >
      <Contours className="pointer-events-none absolute -left-56 top-24 w-[48rem] text-white/[0.05]" />

      <div className="container-wide relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow text-lagoon-300">Booking enquiry</p>
          <h2 id="booking-title" className="display mt-5 text-[clamp(2.25rem,4.8vw,3.75rem)] leading-[1.04]">
            Tell us about <em className="text-sunset-300">your journey.</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-sand-100/80">
            Share a few details and our team will contact you about availability and pricing. It only takes a couple of
            minutes.
          </p>

          <ul className="mt-8 space-y-3.5">
            {reassurances.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.95rem] text-sand-100/90">
                <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-lagoon-300" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-white/15 pt-8">
            <p className="eyebrow text-sand-100/60">Prefer to talk?</p>
            <ContactButtons tone="dark" className="mt-5" />
          </div>
        </div>

        {/* The form is never hidden by scroll effects — it is the most important part of the page. */}
        <div className="lg:col-span-8">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
