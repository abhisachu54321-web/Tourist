"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { contact, display, navigation, whatsappLink } from "@/config/site";
import { indexLabel } from "@/lib/css";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
function isScrolled() {
  return window.scrollY > 24;
}
function isScrolledOnServer() {
  return false;
}

/**
 * Site header. Sits transparently over the hero, then turns solid once the page scrolls.
 * Below the `xl` breakpoint the links move into a full-screen menu.
 */
export function Header({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, isScrolledOnServer);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const solid = variant === "solid" || scrolled || open;
  const chatLink = whatsappLink(`Hello ${display.name}, I'd like to ask about your travel services.`);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusable = () =>
      [headerRef.current, panelRef.current]
        .flatMap((container) =>
          container ? Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")) : [],
        )
        .filter((element) => element.getClientRects().length > 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep keyboard focus inside the header + menu while the menu is open.
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 80rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={`theme-dark fixed inset-x-0 top-0 z-50 border-b text-sand-50 transition-[background-color,border-color] duration-300 ${
          solid ? "border-white/10 bg-night-900/92 backdrop-blur-md" : "border-transparent bg-transparent"
        } ${open ? "!bg-night-950" : ""}`}
      >
        {!solid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-linear-to-b from-night-950/70 to-transparent"
          />
        )}

        <div className="container-wide flex h-[4.5rem] items-center justify-between gap-4">
          <SectionLink
            href="/#top"
            onClick={close}
            aria-label={`${display.name} — home`}
            className="min-w-0 max-w-[62vw] rounded-sm sm:max-w-none"
          >
            <Logo />
          </SectionLink>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.href}>
                  <SectionLink
                    href={item.href}
                    className="link-draw py-2 text-[0.9rem] font-medium text-sand-50/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <SectionLink href="/#booking" onClick={close} className="btn btn-primary hidden sm:inline-flex">
              Plan Your Trip
            </SectionLink>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 transition-colors hover:border-white xl:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-2.5 w-5">
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-300 ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-300 ${
                    open ? "top-1/2 -rotate-45" : "top-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu for phones, tablets and small laptops */}
      <div
        id={menuId}
        ref={panelRef}
        inert={!open}
        className={`theme-dark fixed inset-0 z-40 bg-night-950 text-sand-50 transition-[opacity,visibility] duration-300 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menu" className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-[6.5rem] sm:px-8">
          <ul>
            {navigation.map((item, index) => (
              <li
                key={item.href}
                className={`border-b border-white/10 transition duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + index * 45}ms` : "0ms" }}
              >
                <SectionLink href={item.href} onClick={close} className="flex items-baseline gap-5 py-4">
                  <span className="w-6 text-xs font-semibold tabular-nums text-sunset-300">{indexLabel(index)}</span>
                  <span className="display text-[1.9rem] leading-tight">{item.label}</span>
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-10">
            <SectionLink href="/#booking" onClick={close} className="btn btn-primary w-full">
              Plan Your Trip
              <ArrowRightIcon className="btn-arrow" />
            </SectionLink>
            {(contact.phoneHref || chatLink) && (
              <div className="grid grid-cols-2 gap-3">
                {contact.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className={`btn btn-outline-light ${chatLink ? "" : "col-span-2"}`}
                    aria-label={`Call us on ${contact.phone}`}
                  >
                    <PhoneIcon />
                    Call
                  </a>
                )}
                {chatLink && (
                  <a
                    href={chatLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-outline-light ${contact.phoneHref ? "" : "col-span-2"}`}
                    aria-label="Chat with us on WhatsApp (opens in a new tab)"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
            <p className="pt-3 text-center text-xs uppercase tracking-[0.2em] text-sand-100/60">{display.location}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
