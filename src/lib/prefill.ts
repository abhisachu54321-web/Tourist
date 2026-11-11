import type { ServiceId } from "@/config/site";

/**
 * Lets any button on the page tell the booking form what to preselect
 * (for example "Enquire about a taxi" → service = taxi).
 */
export type BookingPrefill = { service?: ServiceId; destination?: string };

const EVENT_NAME = "booking:prefill";

export function requestBookingPrefill(detail: BookingPrefill) {
  window.dispatchEvent(new CustomEvent<BookingPrefill>(EVENT_NAME, { detail }));
}

export function onBookingPrefill(handler: (detail: BookingPrefill) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<BookingPrefill>).detail ?? {});
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
