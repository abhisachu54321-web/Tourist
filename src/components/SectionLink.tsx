"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { requestBookingPrefill, type BookingPrefill } from "@/lib/prefill";

type SectionLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  /** A link to a section of the home page, e.g. "/#booking". */
  href: string;
  /** Optional values to preselect in the booking form (service and/or destination). */
  prefill?: BookingPrefill;
};

/**
 * Link to a section of the home page.
 * - On the home page it scrolls to the section (smoothly, unless the visitor prefers
 *   reduced motion), updates the address bar and moves keyboard focus to the section.
 * - On any other page it behaves like a normal link back to the home page.
 * - With `prefill`, it also tells the booking form which service/destination to preselect.
 */
export function SectionLink({ href, prefill, onClick, children, ...rest }: SectionLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const path = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);
    if (window.location.pathname !== path) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (prefill) requestBookingPrefill(prefill);
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);

    // Wait a frame so any open menu has closed and released its scroll lock.
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
