import { createHash } from "node:crypto";
import { HONEYPOT_FIELD, utcISODate, validateBooking, type BookingErrors } from "@/lib/booking";
import { buildBookingEmail, readEmailConfig, sendBookingEmail } from "@/lib/email";
import { clientAddress, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_CHARACTERS = 16_000;
const TEN_MINUTES = 10 * 60 * 1000;
const REQUESTS_PER_WINDOW = 30; // any request to this endpoint, per address
const SENDS_PER_WINDOW = 5; // emails actually sent, per address
// If the host does not tell us the visitor's address, everyone shares one counter,
// so the limits are loosened to avoid turning away genuine customers.
const SHARED_COUNTER_MULTIPLIER = 4;

type ErrorCode =
  | "FORBIDDEN"
  | "UNSUPPORTED"
  | "TOO_LARGE"
  | "INVALID_REQUEST"
  | "REJECTED"
  | "VALIDATION"
  | "RATE_LIMITED"
  | "EMAIL_NOT_CONFIGURED"
  | "EMAIL_FAILED";

function success(extra: Record<string, unknown> = {}) {
  return Response.json({ ok: true, ...extra }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

function failure(
  status: number,
  code: ErrorCode,
  message: string,
  extra: { errors?: BookingErrors; retryAfter?: number } = {},
) {
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (extra.retryAfter) headers["Retry-After"] = String(extra.retryAfter);
  return Response.json(
    { ok: false, code, message, ...(extra.errors ? { errors: extra.errors } : {}) },
    { status, headers },
  );
}

// Remembers enquiries that were accepted in the last few minutes so an accidental
// resubmission of the exact same details does not email the business twice.
const recentlyAccepted = new Map<string, number>();

function wasRecentlyAccepted(fingerprint: string, now: number) {
  for (const [key, time] of recentlyAccepted) {
    if (now - time > TEN_MINUTES) recentlyAccepted.delete(key);
  }
  return recentlyAccepted.has(fingerprint);
}

export async function POST(request: Request) {
  // Browsers label cross-site requests; this form is only ever submitted from its own site.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return failure(403, "FORBIDDEN", "This request isn't allowed.");
  }

  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return failure(415, "UNSUPPORTED", "Unsupported request format.");
  }

  const address = clientAddress(request);
  const limitScale = address === "unknown" ? SHARED_COUNTER_MULTIPLIER : 1;
  const requestLimit = rateLimit(`request:${address}`, REQUESTS_PER_WINDOW * limitScale, TEN_MINUTES);
  if (!requestLimit.allowed) {
    return failure(429, "RATE_LIMITED", "Too many attempts in a short time. Please wait a few minutes and try again.", {
      retryAfter: requestLimit.retryAfterSeconds,
    });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return failure(400, "INVALID_REQUEST", "We couldn't read your enquiry. Please try again.");
  }
  if (rawBody.length > MAX_BODY_CHARACTERS) {
    return failure(413, "TOO_LARGE", "Your enquiry is too long. Please shorten the additional requirements.");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return failure(400, "INVALID_REQUEST", "We couldn't read your enquiry. Please try again.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return failure(400, "INVALID_REQUEST", "We couldn't read your enquiry. Please try again.");
  }

  // Honeypot: a hidden field that people never fill in. We refuse the submission
  // openly instead of pretending it worked, so a genuine visitor is never misled.
  const honeypot = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return failure(400, "REJECTED", "We couldn't accept this submission. Please contact us directly instead.");
  }

  // Accept "yesterday" in UTC so visitors in time zones behind the server can still pick their today.
  const validation = validateBooking(body, { earliestDate: utcISODate(-1) });
  if (!validation.ok) {
    return failure(400, "VALIDATION", "Please check the highlighted details and try again.", {
      errors: validation.errors,
    });
  }

  const emailConfig = readEmailConfig();
  if (!emailConfig.ok) {
    console.error(`[booking] Email delivery is not configured. Missing: ${emailConfig.missing.join(", ")}`);
    return failure(
      503,
      "EMAIL_NOT_CONFIGURED",
      "Online enquiries aren't switched on yet, so your details were not sent. Please contact us directly. (Site owner: add the email settings described in the README.)",
    );
  }

  const now = Date.now();
  const fingerprint = createHash("sha256").update(JSON.stringify(validation.data)).digest("hex");
  if (wasRecentlyAccepted(fingerprint, now)) {
    // The identical enquiry has already been accepted for delivery moments ago.
    return success({ duplicate: true });
  }

  const sendLimit = rateLimit(`send:${address}`, SENDS_PER_WINDOW * limitScale, TEN_MINUTES);
  if (!sendLimit.allowed) {
    return failure(
      429,
      "RATE_LIMITED",
      "You've sent several enquiries in a short time. Please wait a few minutes, or contact us directly.",
      { retryAfter: sendLimit.retryAfterSeconds },
    );
  }

  const email = buildBookingEmail(validation.data, new Date(now));
  const result = await sendBookingEmail(emailConfig.config, email);

  if (!result.ok) {
    // Log the provider's reason for the site owner; never log credentials or customer details.
    console.error("[booking] The email provider did not accept the enquiry.", {
      reason: result.reason,
      status: result.status,
      detail: result.detail,
    });
    return failure(
      502,
      "EMAIL_FAILED",
      "We couldn't send your enquiry just now. Your details are still in the form — please try again in a moment, or contact us directly.",
    );
  }

  recentlyAccepted.set(fingerprint, now);
  return success();
}
