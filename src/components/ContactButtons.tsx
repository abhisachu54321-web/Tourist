import { contact, display, whatsappLink } from "@/config/site";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { SetupNote } from "./SetupNote";

/**
 * Tap-to-call and WhatsApp buttons built from the configured numbers.
 * If a number has not been configured, no link is rendered — during setup a
 * marked placeholder appears in its place instead of an invented number.
 */
export function ContactButtons({ tone = "dark", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const outline = tone === "dark" ? "btn-outline-light" : "btn-outline-dark";
  const chatLink = whatsappLink(`Hello ${display.name}, I'd like to ask about your travel services.`);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {contact.phoneHref ? (
        <a href={contact.phoneHref} className={`btn ${outline}`}>
          <PhoneIcon />
          <span>
            <span className="sr-only">Call us on </span>
            {contact.phone}
          </span>
        </a>
      ) : (
        <SetupNote tone={tone}>Tap-to-call button — add your phone number</SetupNote>
      )}

      {chatLink ? (
        <a href={chatLink} target="_blank" rel="noopener noreferrer" className={`btn ${outline}`}>
          <WhatsAppIcon />
          <span>
            WhatsApp us<span className="sr-only"> (opens WhatsApp in a new tab)</span>
          </span>
        </a>
      ) : (
        <SetupNote tone={tone}>WhatsApp button — add your WhatsApp number</SetupNote>
      )}
    </div>
  );
}
