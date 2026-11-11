import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { display, isSetupMode, seo, siteUrl } from "@/config/site";
import "./globals.css";

// Editorial serif for headlines, clean geometric sans for everything else.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

function resolveBaseUrl(): URL {
  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveBaseUrl(),
  title: {
    default: seo.title,
    template: `%s — ${display.name}`,
  },
  description: seo.description,
  applicationName: display.name,
  openGraph: {
    type: "website",
    siteName: display.name,
    title: seo.title,
    description: seo.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  // While placeholder business details are still in place, keep the site out of search results.
  robots: isSetupMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1628",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-sand-50 font-sans text-night-900 antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
