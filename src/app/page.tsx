import type { Metadata } from "next";
import { About } from "@/components/About";
import { BookingSection } from "@/components/BookingSection";
import { Destinations } from "@/components/Destinations";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MobileActionBar } from "@/components/MobileActionBar";
import { RevealObserver } from "@/components/RevealObserver";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { contact, display, hasSiteUrl, isSetupMode, seo, siteUrl } from "@/config/site";

// Static page, refreshed once a day so details such as the copyright year stay current.
export const revalidate = 86400;

// A canonical link is only published once the site's public address is known.
export const metadata: Metadata = hasSiteUrl ? { alternates: { canonical: "/" } } : {};

// Structured data for search engines — only published once real business details are in place.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: display.name,
  description: seo.description,
  url: siteUrl,
  areaServed: display.location,
  ...(contact.phoneHref ? { telephone: contact.phone } : {}),
  ...(contact.emailHref ? { email: contact.email } : {}),
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <Destinations />
        <About />
        <WhyChooseUs />
        <HowItWorks />
        <BookingSection />
      </main>
      <Footer />
      <MobileActionBar />
      <RevealObserver />
      {!isSetupMode && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      )}
    </>
  );
}
