import Link from "next/link";
import type { ReactNode } from "react";
import { contact, display, isSetupMode, missingDetails, navigation, services, whatsappLink } from "@/config/site";
import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";
import { SetupNote } from "./SetupNote";

function ContactItem({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="border-t border-white/15 py-6">
      <dt className="eyebrow flex items-center gap-2.5 text-sand-100/60">
        {icon}
        {label}
      </dt>
      <dd className="display mt-4 break-words text-[1.45rem] leading-snug sm:text-2xl">{children}</dd>
    </div>
  );
}

export function Footer() {
  const chatLink = whatsappLink(`Hello ${display.name}, I'd like to ask about your travel services.`);
  const year = new Date().getFullYear();
  const footerLink = "link-draw text-[0.95rem] text-sand-100/80 transition-colors hover:text-white";

  return (
    <footer id="contact" tabIndex={-1} className="theme-dark bg-night-950 text-sand-50">
      {/* Contact */}
      <div className="container-wide grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="lg:col-span-5">
          <p className="eyebrow text-lagoon-300">Contact</p>
          <h2 className="display mt-5 text-[clamp(2.25rem,4.8vw,3.75rem)] leading-[1.04]">
            Let&apos;s plan your <em className="text-sunset-300">next journey.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-sand-100/80">
            Call, message or send an enquiry — whichever suits you best.
          </p>
          <SectionLink href="/#booking" className="btn btn-primary mt-8">
            Plan Your Trip
            <ArrowRightIcon className="btn-arrow" />
          </SectionLink>
        </div>

        <dl data-reveal className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {(contact.phoneHref || isSetupMode) && (
            <ContactItem label="Call" icon={<PhoneIcon width={15} height={15} />}>
              {contact.phoneHref ? (
                <a href={contact.phoneHref} className="link-draw">
                  {contact.phone}
                </a>
              ) : (
                <SetupNote tone="dark" className="font-sans">
                  Add your phone number
                </SetupNote>
              )}
            </ContactItem>
          )}

          {(chatLink || isSetupMode) && (
            <ContactItem label="WhatsApp" icon={<WhatsAppIcon width={15} height={15} />}>
              {chatLink ? (
                <a href={chatLink} target="_blank" rel="noopener noreferrer" className="link-draw">
                  Chat with us<span className="sr-only"> on WhatsApp (opens in a new tab)</span>
                </a>
              ) : (
                <SetupNote tone="dark" className="font-sans">
                  Add your WhatsApp number
                </SetupNote>
              )}
            </ContactItem>
          )}

          {(contact.emailHref || isSetupMode) && (
            <ContactItem label="Email" icon={<MailIcon width={15} height={15} />}>
              {contact.emailHref ? (
                <a href={contact.emailHref} className="link-draw">
                  {contact.email}
                </a>
              ) : (
                <SetupNote tone="dark" className="font-sans">
                  Add your public email address
                </SetupNote>
              )}
            </ContactItem>
          )}

          <ContactItem label="Based in" icon={<MapPinIcon width={15} height={15} />}>
            {display.location}
          </ContactItem>
        </dl>
      </div>

      {/* Site footer */}
      <div className="border-t border-white/10">
        <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-sand-100/75">
              A family-owned travel business offering taxi services, tourist bus rentals and customised tour packages in{" "}
              {display.location}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h3 className="eyebrow text-sand-100/60">Explore</h3>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <SectionLink href={item.href} className={footerLink}>
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-2">
            <h3 className="eyebrow text-sand-100/60">Services</h3>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <SectionLink href={`/#${service.anchor}`} className={footerLink}>
                    {service.name}
                  </SectionLink>
                </li>
              ))}
              <li>
                <SectionLink href="/#booking" className={footerLink}>
                  Booking Enquiry
                </SectionLink>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="eyebrow text-sand-100/60">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem] text-sand-100/80">
              {contact.phoneHref && (
                <li>
                  <a href={contact.phoneHref} className={footerLink}>
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.emailHref && (
                <li>
                  <a href={contact.emailHref} className={`${footerLink} break-all`}>
                    {contact.email}
                  </a>
                </li>
              )}
              {chatLink && (
                <li>
                  <a href={chatLink} target="_blank" rel="noopener noreferrer" className={footerLink}>
                    WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              <li>{display.location}</li>
              {isSetupMode && !contact.phoneHref && !contact.emailHref && !chatLink && (
                <li>
                  <SetupNote tone="dark">Phone, email and WhatsApp appear here once added</SetupNote>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col gap-3 py-6 text-sm text-sand-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {display.name}. All rights reserved.
          </p>
          <Link href="/privacy" className="link-draw self-start transition-colors hover:text-white sm:self-auto">
            Privacy Policy
          </Link>
        </div>
      </div>

      {isSetupMode && (
        <div className="border-t border-dashed border-white/30 bg-white/[0.04]">
          <div className="container-wide py-6 text-sm leading-relaxed text-sand-100/90">
            <p>
              <strong className="font-semibold text-sunset-300">Setup mode.</strong> Placeholders are showing for:{" "}
              {missingDetails.join(", ")}. Add your details in <code>src/config/site.ts</code>. Enquiry email delivery
              is configured separately with environment variables (see the README). This notice, the dashed “Setup”
              labels and the search-engine block all disappear once the business name and location are filled in.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
