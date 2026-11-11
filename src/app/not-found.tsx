import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header variant="solid" />
      <main
        id="main"
        tabIndex={-1}
        className="theme-dark relative flex min-h-[80svh] items-center overflow-hidden bg-night-900 pb-20 pt-[8.5rem] text-sand-50"
      >
        <div className="container-wide relative">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 320 90" fill="none" className="w-56 text-sand-50 sm:w-72">
            <path
              d="M8 74C70 74 60 22 128 22s58 40 112 40"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1.3"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            <circle cx="8" cy="74" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="m252 52 20 20m0-20-20 20" stroke="var(--color-sunset-400)" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <p className="eyebrow mt-10 text-lagoon-300">Error 404</p>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[1]">
            This road doesn&apos;t <em className="text-sunset-300">lead anywhere.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100/80">
            The page you were looking for has moved or never existed. Let&apos;s get you back on route.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Back to Home
              <ArrowRightIcon className="btn-arrow" />
            </Link>
            <Link href="/#booking" className="btn btn-outline-light">
              Plan Your Trip
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
