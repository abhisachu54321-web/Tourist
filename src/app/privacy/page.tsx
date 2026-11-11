import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SetupNote } from "@/components/SetupNote";
import { contact, display, hasSiteUrl } from "@/config/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${display.name} handles the details you share through the booking enquiry form.`,
  ...(hasSiteUrl ? { alternates: { canonical: "/privacy" } } : {}),
};

/*
 * OWNER: this is a plain-language starting point that describes how this website works.
 * Review it, adjust it to your actual practices (for example how long you keep enquiries),
 * and take legal advice if your region has specific privacy requirements.
 */
const sections: Array<{ title: string; paragraphs: string[] }> = [
  {
    title: "What we collect",
    paragraphs: [
      "When you send a booking enquiry we receive the details you enter in the form: your name, phone number, email address (if you give one), the service you need, pickup location, destination, travel dates and times, number of passengers, any vehicle preference and any additional requirements you describe.",
      "We only receive what you choose to send. Please avoid including sensitive personal information that isn't needed to plan your journey.",
    ],
  },
  {
    title: "How we use it",
    paragraphs: [
      "We use your details to review your enquiry, check availability, prepare a quotation and contact you about your journey. If you go ahead with a booking, we use them to arrange and provide the service.",
      "We do not sell your details, and we do not use them for unrelated marketing.",
    ],
  },
  {
    title: "How your enquiry reaches us",
    paragraphs: [
      "The enquiry form sends your details to our business inbox by email, using a third-party email delivery service that processes the message on our behalf. The website itself does not keep a database of enquiries.",
      "If you contact us by phone or WhatsApp instead, those conversations are handled by your phone provider or WhatsApp under their own terms and privacy policies.",
    ],
  },
  {
    title: "Cookies and tracking",
    paragraphs: [
      "This website does not use advertising cookies or third-party analytics trackers. If that changes, this page will be updated to say so.",
    ],
  },
  {
    title: "Keeping and removing your details",
    paragraphs: [
      "We keep enquiry details for as long as we need them to respond to you and to manage any journey you book with us, and for any period required by law.",
      "You can ask us what details we hold about you, or ask us to correct or delete them, by contacting us using the details below.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main" tabIndex={-1} className="bg-sand-50 pb-24 pt-[4.5rem]">
        <div className="container-wide pt-16 sm:pt-24">
          <div className="max-w-3xl">
            <p className="eyebrow text-lagoon-700">Privacy</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02]">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              This page explains what happens to the details you share with {display.name} through this website.
            </p>
            <SetupNote className="mt-6">
              Template wording — review this page against your real practices before launch.
            </SetupNote>
          </div>

          <div className="mt-14 max-w-3xl border-t border-night-900/12">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-night-900/12 py-9">
                <h2 className="display text-2xl sm:text-3xl">{section.title}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="py-9">
              <h2 className="display text-2xl sm:text-3xl">Contact us</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-600">
                <p>
                  For any question about this policy or your details, contact {display.name}, {display.location}.
                </p>
                {(contact.emailHref || contact.phoneHref) && (
                  <ul className="space-y-2 font-medium text-night-900">
                    {contact.emailHref && (
                      <li>
                        Email:{" "}
                        <a href={contact.emailHref} className="text-lagoon-700 underline underline-offset-4">
                          {contact.email}
                        </a>
                      </li>
                    )}
                    {contact.phoneHref && (
                      <li>
                        Phone:{" "}
                        <a href={contact.phoneHref} className="text-lagoon-700 underline underline-offset-4">
                          {contact.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                )}
                <SetupNote>Your email address and phone number appear here once added.</SetupNote>
              </div>
            </section>
          </div>

          <Link href="/" className="btn btn-outline-dark mt-6">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
