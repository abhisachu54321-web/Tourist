"use client";

import { useEffect, useState } from "react";
import { contact, display, whatsappLink } from "@/config/site";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { SectionLink } from "./SectionLink";

// The bar steps aside while any of these sections is in the middle of the screen.
const HIDE_WHILE_VISIBLE = ["top", "booking", "contact"];

/**
 * Bottom bar for phones and small tablets: keeps "Plan Your Trip" plus the configured
 * call and WhatsApp shortcuts within thumb reach while browsing the page.
 */
export function MobileActionBar() {
  const [visible, setVisible] = useState(false);
  const chatLink = whatsappLink(`Hello ${display.name}, I'd like to ask about your travel services.`);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const targets = HIDE_WHILE_VISIBLE.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const onScreen = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setVisible(onScreen.size === 0);
      },
      { rootMargin: "-30% 0px -30% 0px" },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const iconButton =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white";

  return (
    <div
      inert={!visible}
      className={`theme-dark fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-night-900/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2.5">
        {contact.phoneHref && (
          <a href={contact.phoneHref} className={iconButton} aria-label={`Call us on ${contact.phone}`}>
            <PhoneIcon />
          </a>
        )}
        {chatLink && (
          <a
            href={chatLink}
            target="_blank"
            rel="noopener noreferrer"
            className={iconButton}
            aria-label="Chat with us on WhatsApp (opens in a new tab)"
          >
            <WhatsAppIcon />
          </a>
        )}
        <SectionLink href="/#booking" className="btn btn-primary flex-1">
          Plan Your Trip
          <ArrowRightIcon className="btn-arrow" />
        </SectionLink>
      </div>
    </div>
  );
}
