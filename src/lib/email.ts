import { business, display, getService } from "@/config/site";
import { formatDisplayDate, formatDisplayTime, type BookingEnquiry } from "@/lib/booking";

/**
 * Server-side email delivery through Resend's HTTP API (https://resend.com/docs).
 * This module is only imported by the booking API route, so credentials never reach
 * the browser. All settings come from environment variables — see `.env.example`.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TEST_SENDER = "onboarding@resend.dev";
const SEND_TIMEOUT_MS = 12_000;

export type EmailConfig = { apiKey: string; to: string[]; from: string; endpoint: string };

export type EmailConfigResult = { ok: true; config: EmailConfig } | { ok: false; missing: string[] };

export function readEmailConfig(): EmailConfigResult {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const to = (process.env.BOOKING_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (to.length === 0) missing.push("BOOKING_TO_EMAIL");
  if (missing.length > 0) return { ok: false, missing };

  const sender = process.env.BOOKING_FROM_EMAIL?.trim() || RESEND_TEST_SENDER;
  const from = sender.includes("<") ? sender : `Website Enquiries <${sender}>`;

  // RESEND_API_URL exists only so the integration can be exercised against a local
  // mock server in tests. Leave it unset in real deployments.
  const endpoint = process.env.RESEND_API_URL?.trim() || RESEND_ENDPOINT;

  return { ok: true, config: { apiKey, to, from, endpoint } };
}

export type BookingEmail = { subject: string; html: string; text: string; replyTo?: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatSubmittedAt(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  try {
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: business.timeZone || "UTC" }).format(date);
  } catch {
    // An invalid time zone name in the site config should never block an enquiry.
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date);
  }
}

export function buildBookingEmail(enquiry: BookingEnquiry, submittedAt: Date): BookingEmail {
  const service = getService(enquiry.service);
  const submitted = formatSubmittedAt(submittedAt);
  const tripTypeLabel =
    enquiry.tripType === "round-trip" ? "Round trip" : enquiry.tripType === "one-way" ? "One-way" : undefined;

  const rows: Array<[label: string, value: string]> = [
    ["Customer name", enquiry.name],
    ["Phone number", enquiry.phone],
    ["Email address", enquiry.email ?? "Not provided"],
    ["Service required", service.formLabel],
    ["Pickup location", enquiry.pickup],
    ["Destination", enquiry.destination],
    ...(tripTypeLabel ? ([["Trip type", tripTypeLabel]] as Array<[string, string]>) : []),
    ["Departure date", formatDisplayDate(enquiry.departureDate)],
    ["Return date", enquiry.returnDate ? formatDisplayDate(enquiry.returnDate) : "Not provided"],
    ["Pickup time", enquiry.pickupTime ? formatDisplayTime(enquiry.pickupTime) : "Not provided"],
    ["Passengers", String(enquiry.passengers)],
    ["Vehicle preference", enquiry.vehicle ?? "No preference given"],
    ...(enquiry.service === "tour"
      ? ([
          [
            "Trip duration",
            enquiry.travelDays ? `${enquiry.travelDays} ${enquiry.travelDays === 1 ? "day" : "days"}` : "Not provided",
          ],
        ] as Array<[string, string]>)
      : []),
    ["Additional requirements", enquiry.notes ?? "None"],
    ["Submitted", submitted],
  ];

  const subject = `New Travel Booking Enquiry — ${service.formLabel} · ${enquiry.name} · ${formatDisplayDate(
    enquiry.departureDate,
  )}`;

  const text = [
    `NEW TRAVEL BOOKING ENQUIRY — ${service.formLabel.toUpperCase()}`,
    `${enquiry.pickup} → ${enquiry.destination}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value.includes("\n") ? `\n${value}` : value}`),
    "",
    enquiry.email
      ? "Reply to this email to respond to the customer directly."
      : "The customer did not leave an email address — please contact them by phone.",
    "This is an enquiry only. The booking is not confirmed until you confirm it with the customer.",
    `Sent from the booking form on the ${display.name} website.`,
  ].join("\n");

  const telHref = `tel:${enquiry.phone.replace(/[^\d+]/g, "")}`;
  const htmlRows = rows
    .map(([label, value]) => {
      const safeValue = escapeHtml(value).replace(/\n/g, "<br />");
      return `<tr>
  <td style="padding:12px 16px 12px 0;border-bottom:1px solid #ece5d8;font:600 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b7689;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
  <td style="padding:12px 0;border-bottom:1px solid #ece5d8;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#0a1628;vertical-align:top;word-break:break-word;">${safeValue}</td>
</tr>`;
    })
    .join("\n");

  const buttonStyle =
    "display:inline-block;padding:11px 20px;border-radius:999px;font:600 14px/1 Arial,Helvetica,sans-serif;text-decoration:none;";
  const emailButton = enquiry.email
    ? `<a href="mailto:${escapeHtml(encodeURI(enquiry.email))}" style="${buttonStyle}background:#ffffff;color:#0a1628;border:1px solid #c9bfab;margin:0 0 8px 0;">Email ${escapeHtml(enquiry.name)}</a>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4eee2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;">
  <tr><td style="background:#0a1628;padding:28px 28px 26px;">
    <p style="margin:0 0 10px;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7fd8d0;">New travel booking enquiry</p>
    <p style="margin:0 0 8px;font:400 26px/1.2 Georgia,'Times New Roman',serif;color:#fbf8f2;">${escapeHtml(service.formLabel)}</p>
    <p style="margin:0;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#d9d3c6;">${escapeHtml(enquiry.pickup)} &rarr; ${escapeHtml(enquiry.destination)}</p>
  </td></tr>
  <tr><td style="padding:22px 28px 6px;">
    <a href="${escapeHtml(telHref)}" style="${buttonStyle}background:#f4a259;color:#0a1628;margin:0 8px 8px 0;">Call ${escapeHtml(enquiry.phone)}</a>
    ${emailButton}
  </td></tr>
  <tr><td style="padding:6px 28px 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${htmlRows}
    </table>
  </td></tr>
  <tr><td style="padding:18px 28px 28px;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#6b7689;">
    ${
      enquiry.email
        ? "Reply to this email to respond to the customer directly."
        : "The customer did not leave an email address — please contact them by phone."
    }<br />
    This is an enquiry only. The booking is not confirmed until you confirm it with the customer.<br />
    Sent from the booking form on the ${escapeHtml(display.name)} website.
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html, text, ...(enquiry.email ? { replyTo: enquiry.email } : {}) };
}

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; reason: "provider_rejected" | "timeout" | "network"; status?: number; detail: string };

/**
 * Sends the email and reports success only when Resend confirms it accepted the
 * message (HTTP 2xx with a message id).
 */
export async function sendBookingEmail(config: EmailConfig, email: BookingEmail): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const payload: unknown = await response.json().catch(() => null);
    const record = (typeof payload === "object" && payload !== null ? payload : {}) as Record<string, unknown>;

    if (response.ok && typeof record.id === "string" && record.id.length > 0) {
      return { ok: true, id: record.id };
    }

    return {
      ok: false,
      reason: "provider_rejected",
      status: response.status,
      detail: typeof record.message === "string" ? record.message : response.statusText || "Unexpected response",
    };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      reason: aborted ? "timeout" : "network",
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    clearTimeout(timer);
  }
}
