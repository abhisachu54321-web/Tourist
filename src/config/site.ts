/* ════════════════════════════════════════════════════════════════════════════
 * SITE CONFIGURATION
 *
 * This is the one file to edit when business details or website content change.
 *   1. BUSINESS DETAILS   — name, location, phone, WhatsApp, email
 *   2. SERVICES           — the three services and their descriptions
 *   3. DESTINATIONS       — sample destinations (replace with your own)
 *   4. ABOUT / BENEFITS   — about text, verified facts, reasons to choose you
 *   5. BOOKING FORM       — vehicle options offered in the enquiry form
 *
 * Brand colours and fonts live in `src/app/globals.css` (the `@theme` block) and
 * `src/app/layout.tsx`. Private email settings live in environment variables
 * (see `.env.example`) — never put API keys in this file.
 * ════════════════════════════════════════════════════════════════════════════ */

import type { ImageProps } from "next/image";

type ImageSource = ImageProps["src"];

const travelImages = {
  aboutDrive: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=85",
  aboutFamily: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=85",
  busRoad: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85",
  destAlappuzha: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
  destKochi: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
  destMunnar: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  destThekkady: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
  destWayanad: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
  heroRoad: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=90",
  roadRidge: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
  taxiDriver: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85",
  taxiMirror: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85",
  toursSunset: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85",
} satisfies Record<string, ImageSource>;

/* ── 1. BUSINESS DETAILS ───────────────────────────────────────────────────────
 * Fill these in. While `name` or `location` is empty the site runs in "setup mode":
 * it shows clearly marked placeholders, small dashed "Setup" notes where a detail is
 * missing, and asks search engines not to index the site. Phone, WhatsApp and email
 * are optional — once setup mode is off, any that are left empty are simply hidden.
 */
export const business = {
  /** Trading name — shown in the logo, page titles, footer and enquiry emails. */
  name: "",

  /** Where you are based and the area you serve, e.g. "Town, Region". */
  location: "",

  /** Public contact email shown on the website. (Enquiries are delivered to BOOKING_TO_EMAIL.) */
  email: "",

  /** Phone number exactly as customers should see it, including the country code. */
  phone: "",

  /** WhatsApp number in international format: country code first, digits only (no "+", spaces or leading 0). */
  whatsapp: "",

  /** IANA time zone used for the "submitted at" time in enquiry emails, e.g. "Asia/Kolkata". */
  timeZone: "UTC",
};

/* ── Derived values (no need to edit) ───────────────────────────────────────── */

const trimmedName = business.name.trim();
const trimmedLocation = business.location.trim();
const trimmedPhone = business.phone.trim();
const trimmedEmail = business.email.trim();
const phoneDial = trimmedPhone.replace(/[^\d+]/g, "");
const whatsappDigits = business.whatsapp.replace(/\D/g, "").replace(/^0+/, "");

/** True until the business name and location have been filled in. */
export const isSetupMode = !trimmedName || !trimmedLocation;

/** Text that is safe to show even before the real details are entered. */
export const display = {
  name: trimmedName || "Your Business Name",
  location: trimmedLocation || "Your City / Region",
};

/** Contact links. A value of `null` means "not configured" — the UI never invents one. */
export const contact = {
  phone: trimmedPhone,
  phoneHref: phoneDial.replace(/\D/g, "").length >= 7 ? `tel:${phoneDial}` : null,
  email: trimmedEmail,
  emailHref: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail) ? `mailto:${trimmedEmail}` : null,
  whatsappNumber: whatsappDigits.length >= 8 ? whatsappDigits : null,
};

/** Builds a real WhatsApp chat link for the configured number, optionally with a prefilled message. */
export function whatsappLink(message?: string): string | null {
  if (!contact.whatsappNumber) return null;
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Details that still need to be supplied — listed in the setup notice in the footer. */
export const missingDetails: string[] = [
  ...(trimmedName ? [] : ["business name"]),
  ...(trimmedLocation ? [] : ["location / service area"]),
  ...(contact.phoneHref ? [] : ["phone number"]),
  ...(contact.whatsappNumber ? [] : ["WhatsApp number"]),
  ...(contact.emailHref ? [] : ["public email address"]),
];

/** True when the public address is known (set NEXT_PUBLIC_SITE_URL, or deploy on Vercel). */
export const hasSiteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL);

/** Public address of the site, used for canonical links and social previews. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const seo = {
  title: `${display.name} — Taxi, Tourist Bus & Tour Packages in ${display.location}`,
  description: `Taxi services, tourist bus rentals and customised tour packages in ${display.location}. Send a booking enquiry and our team will contact you about availability and pricing.`,
};

/* ── NAVIGATION ─────────────────────────────────────────────────────────────── */

export const navigation = [
  { label: "Home", href: "/#top" },
  { label: "Our Services", href: "/#services" },
  { label: "Tour Packages", href: "/#tour-packages" },
  { label: "Destinations", href: "/#destinations" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

/* ── HERO ───────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Taxis · Tourist buses · Tour packages",
  headline: ["Your Journey.", "Your Way."],
  text: "From comfortable rides to unforgettable getaways, discover travel services designed around your journey.",
  primaryCta: "Plan Your Trip",
  secondaryCta: "Explore Our Services",
  image: travelImages.heroRoad,
  imageAlt: "Aerial view of a road curving past tea-covered hills under a soft, hazy sky",
};

/* ── 2. SERVICES ────────────────────────────────────────────────────────────────
 * The `id` values are used by the booking form and emails — keep them as they are.
 * Everything else (names, descriptions, lists, photos) is free to edit.
 */
export const serviceIds = ["taxi", "bus", "tour"] as const;
export type ServiceId = (typeof serviceIds)[number];

export type Service = {
  id: ServiceId;
  /** Section id used by links such as /#taxi */
  anchor: string;
  name: string;
  /** Label used in the booking form and in enquiry emails. */
  formLabel: string;
  eyebrow: string;
  headline: string;
  description: string;
  includes: string[];
  cta: string;
  image: ImageSource;
  imageAlt: string;
  detailImage?: ImageSource;
  detailImageAlt?: string;
};

export const services: Service[] = [
  {
    id: "taxi",
    anchor: "taxi",
    name: "Taxi Services",
    formLabel: "Taxi",
    eyebrow: "Private rides",
    headline: "Door to door, on your schedule.",
    description:
      "Private car journeys for everyday travel and longer drives — a ride across town, an airport pickup or an outstation trip. Tell us where and when, and we'll come back to you with the options.",
    includes: ["Local rides", "Airport transfers", "Outstation journeys", "Family and private trips"],
    cta: "Enquire About a Taxi",
    image: travelImages.taxiDriver,
    imageAlt: "View from the back seat of a car as the driver heads towards a sunset",
    detailImage: travelImages.taxiMirror,
    detailImageAlt: "A sunset reflected in a car's wing mirror",
  },
  {
    id: "bus",
    anchor: "bus",
    name: "Tourist Bus Rentals",
    formLabel: "Tourist Bus",
    eyebrow: "Travelling together",
    headline: "One group, one comfortable ride.",
    description:
      "Tourist buses for groups who want to travel together — school and college trips, corporate outings, weddings and special events. Share your group size and route and we'll suggest a suitable vehicle.",
    includes: ["Group transportation", "School and college trips", "Corporate travel", "Weddings and special events"],
    cta: "Enquire About a Bus",
    image: travelImages.busRoad,
    imageAlt: "Two tourist minibuses rounding a bend on a forested mountain road",
    detailImage: travelImages.roadRidge,
    detailImageAlt: "A narrow road running along a green, misty ridge",
  },
  {
    id: "tour",
    anchor: "tour-packages",
    name: "Tour Packages",
    formLabel: "Tour Package",
    eyebrow: "Made to measure",
    headline: "Holidays planned around you.",
    description:
      "Itineraries shaped around the way you like to travel — family holidays, sightseeing days, weekend getaways and multi-day tours, with the transport arranged around your plan.",
    includes: ["Customized itineraries", "Family holidays", "Sightseeing trips", "Weekend getaways and multi-day tours"],
    cta: "Plan a Tour Package",
    image: travelImages.toursSunset,
    imageAlt: "A family walking across rippled sand at sunset, casting long shadows",
  },
];

export function getService(id: ServiceId): Service {
  return services.find((service) => service.id === id) ?? services[0];
}

/* ── 3. DESTINATIONS ────────────────────────────────────────────────────────────
 * SAMPLE DATA — replace with destinations in the region you actually serve.
 * These are inspiration only: the site does not claim fixed routes, prices or
 * availability for them. Add or remove entries freely; the layout adapts.
 */
export type Destination = {
  name: string;
  tag: string;
  description: string;
  image: ImageSource;
  imageAlt: string;
};

export const destinations: Destination[] = [
  {
    name: "Munnar",
    tag: "Hill country",
    description: "Tea-covered slopes, winding roads and cool mountain air.",
    image: travelImages.destMunnar,
    imageAlt: "A path winding through tea plantations with green hills beyond",
  },
  {
    name: "Alappuzha",
    tag: "Backwaters",
    description: "Still canals, houseboats and slow days on the water.",
    image: travelImages.destAlappuzha,
    imageAlt: "Houseboats moored along a palm-lined backwater as a canoe glides past",
  },
  {
    name: "Wayanad",
    tag: "Forest & plantations",
    description: "Green hills, plantation country and quiet forest trails.",
    image: travelImages.destWayanad,
    imageAlt: "A traveller walking along a shaded trail through dense green foliage",
  },
  {
    name: "Thekkady",
    tag: "Lake & forest",
    description: "Lakeside forest scenery and spice-growing hills.",
    image: travelImages.destThekkady,
    imageAlt: "A boat crossing a calm lake bordered by forested hills",
  },
  {
    name: "Kochi",
    tag: "Harbour city",
    description: "Heritage streets, waterfront walks and the famous fishing nets.",
    image: travelImages.destKochi,
    imageAlt: "Cantilevered fishing nets standing over a turquoise shoreline",
  },
];

/* ── 4. ABOUT, BENEFITS AND BOOKING STEPS ───────────────────────────────────── */

export const about = {
  heading: "A family business, built around your journey.",
  paragraphs: [
    `${display.name} is a family-owned travel and tourism business based in ${display.location}. We arrange taxis, tourist buses and tailor-made tours for families, couples, groups of friends, students, corporate teams and fellow travel agencies.`,
    "Every trip starts with a conversation. Tell us where you're going, who's coming along and what matters most, and we'll help you plan a journey that is convenient, comfortable and memorable.",
    "As a family-run business, we aim to handle every enquiry personally — from your first message to the day you travel.",
  ],
  /**
   * Verified facts only. Leave empty until you can stand behind each one, e.g.
   *   { value: "…", label: "Years on the road" }, { value: "…", label: "Vehicles in our fleet" }
   */
  facts: [] as Array<{ value: string; label: string }>,
  image: travelImages.aboutFamily,
  imageAlt: "A family walking together along a quiet tree-lined road",
  detailImage: travelImages.aboutDrive,
  detailImageAlt: "A driver's hand resting on a steering wheel with forest passing outside",
};

/** Only include statements the business can genuinely support. */
export const benefits = [
  {
    title: "Enquire in a few minutes",
    text: "Send your travel details through one simple form. There's no account to create and nothing to pay online.",
  },
  {
    title: "For one traveller or a full group",
    text: "Taxis for individuals and families, and buses when a larger group wants to travel together.",
  },
  {
    title: "Plans that flex around you",
    text: "Share your dates, stops and timings, and we'll shape the trip around them wherever we can.",
  },
  {
    title: "A choice of taxis and buses",
    text: "Tell us how many are travelling and we'll suggest a suitable vehicle, subject to availability.",
  },
  {
    title: "Direct contact with us",
    text: "Your enquiry comes straight to our team, so you speak with the people arranging your journey.",
  },
  {
    title: "Your requirements, noted",
    text: "Extra stops, luggage or special requests are part of the enquiry, so we can plan with them in mind.",
  },
];

export const bookingSteps = [
  {
    title: "Share Your Requirements",
    text: "Fill out the travel enquiry form with your route, dates and group size.",
  },
  {
    title: "Receive a Response",
    text: "Our team reviews your requirements and contacts you.",
  },
  {
    title: "Confirm Your Journey",
    text: "Discuss the quotation, availability and final arrangements with our team.",
  },
];

/* ── 5. BOOKING FORM ────────────────────────────────────────────────────────────
 * Vehicle sizes customers can pick as a preference. List only what you really offer.
 * "Not sure — please suggest" is always added as the first option automatically.
 */
export const vehicleOptions: Record<ServiceId, string[]> = {
  taxi: ["Small car", "Sedan", "SUV / MPV", "Van"],
  bus: ["Minibus", "Mid-size bus", "Large coach"],
  tour: ["Car", "SUV / MPV", "Van / minibus", "Bus / coach"],
};
