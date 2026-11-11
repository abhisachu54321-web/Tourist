import { serviceIds, vehicleOptions, type ServiceId } from "@/config/site";

/**
 * Booking enquiry rules shared by the browser form and the server endpoint,
 * so both always agree on what a valid enquiry looks like.
 */

/** Hidden anti-spam field. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "referenceCode";

export const LIMITS = {
  name: 80,
  phone: 24,
  email: 254,
  place: 120,
  notes: 1500,
  passengersMax: 500,
  travelDaysMax: 60,
} as const;

export type TripType = "one-way" | "round-trip";

export const bookingFields = [
  "service",
  "name",
  "phone",
  "email",
  "passengers",
  "pickup",
  "destination",
  "tripType",
  "departureDate",
  "pickupTime",
  "returnDate",
  "travelDays",
  "vehicle",
  "notes",
] as const;

export type BookingField = (typeof bookingFields)[number];
export type BookingFormValues = Record<BookingField, string>;
export type BookingErrors = Partial<Record<BookingField, string>>;

export const emptyBookingValues: BookingFormValues = {
  service: "",
  name: "",
  phone: "",
  email: "",
  passengers: "",
  pickup: "",
  destination: "",
  tripType: "one-way",
  departureDate: "",
  pickupTime: "",
  returnDate: "",
  travelDays: "",
  vehicle: "",
  notes: "",
};

/** A validated, normalised enquiry — the only shape the email code ever receives. */
export type BookingEnquiry = {
  service: ServiceId;
  name: string;
  phone: string;
  email?: string;
  passengers: number;
  pickup: string;
  destination: string;
  tripType?: TripType;
  departureDate: string;
  pickupTime?: string;
  returnDate?: string;
  travelDays?: number;
  vehicle?: string;
  notes?: string;
};

export type BookingValidation =
  | { ok: true; data: BookingEnquiry }
  | { ok: false; errors: BookingErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const WHOLE_NUMBER_PATTERN = /^\d{1,4}$/;
// Control characters other than tab / new line.
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function readLine(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).replace(CONTROL_CHARACTERS, "").replace(/\s+/g, " ").trim();
}

function readText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function isValidISODate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Today's date (YYYY-MM-DD) in the visitor's own time zone. Browser use. */
export function localISODate(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** A UTC date (YYYY-MM-DD) shifted by a number of days. Server use. */
export function utcISODate(offsetDays = 0, now = new Date()): string {
  const shifted = new Date(now.getTime() + offsetDays * 86_400_000);
  return shifted.toISOString().slice(0, 10);
}

export function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && (serviceIds as readonly string[]).includes(value);
}

/**
 * Validates raw form values.
 * `earliestDate` is the first departure date that is still acceptable (YYYY-MM-DD):
 * the browser passes the visitor's "today"; the server passes yesterday (UTC) so that
 * visitors in time zones behind the server are never wrongly rejected.
 */
export function validateBooking(input: unknown, options: { earliestDate: string }): BookingValidation {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const errors: BookingErrors = {};

  const service = readLine(raw.service);
  if (!service) errors.service = "Please choose the service you need.";
  else if (!isServiceId(service)) errors.service = "Please choose one of the listed services.";

  const name = readLine(raw.name);
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  const phone = readLine(raw.phone);
  const phoneDigits = phone.replace(/\D/g, "").length;
  if (!phone) errors.phone = "Please add a phone number so we can reach you.";
  else if (!PHONE_PATTERN.test(phone) || phoneDigits < 7 || phoneDigits > 15 || phone.length > LIMITS.phone)
    errors.phone = "That phone number doesn't look right — please check it.";

  const email = readLine(raw.email);
  if (email && (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email))
    errors.email = "That email address doesn't look right — please check it, or leave it blank.";

  const passengersRaw = readLine(raw.passengers);
  const passengers = WHOLE_NUMBER_PATTERN.test(passengersRaw) ? Number(passengersRaw) : Number.NaN;
  if (!passengersRaw) errors.passengers = "How many people are travelling?";
  else if (!Number.isInteger(passengers) || passengers < 1 || passengers > LIMITS.passengersMax)
    errors.passengers = `Please enter a whole number between 1 and ${LIMITS.passengersMax}.`;

  const pickup = readLine(raw.pickup);
  if (!pickup) errors.pickup = "Where should we pick you up?";
  else if (pickup.length < 2) errors.pickup = "Please add a little more detail.";
  else if (pickup.length > LIMITS.place) errors.pickup = `Please keep this under ${LIMITS.place} characters.`;

  const destination = readLine(raw.destination);
  if (!destination) errors.destination = "Where would you like to go?";
  else if (destination.length < 2) errors.destination = "Please add a little more detail.";
  else if (destination.length > LIMITS.place)
    errors.destination = `Please keep this under ${LIMITS.place} characters.`;

  const departureDate = readLine(raw.departureDate);
  if (!departureDate) errors.departureDate = "Please choose your departure date.";
  else if (!isValidISODate(departureDate)) errors.departureDate = "Please choose a valid date.";
  else if (departureDate < options.earliestDate) errors.departureDate = "The departure date can't be in the past.";

  const isTour = service === "tour";
  const tripType: TripType | undefined = isTour
    ? undefined
    : readLine(raw.tripType) === "round-trip"
      ? "round-trip"
      : "one-way";

  // A return date only applies to round trips and tour packages; otherwise it is ignored.
  const returnApplies = isTour || tripType === "round-trip";
  const returnDate = returnApplies ? readLine(raw.returnDate) : "";
  if (returnDate) {
    if (!isValidISODate(returnDate)) errors.returnDate = "Please choose a valid date.";
    else if (isValidISODate(departureDate) && returnDate < departureDate)
      errors.returnDate = "The return date can't be before the departure date.";
  }

  const pickupTime = readLine(raw.pickupTime);
  if (pickupTime && !TIME_PATTERN.test(pickupTime)) errors.pickupTime = "Please enter a valid time.";

  const travelDaysRaw = isTour ? readLine(raw.travelDays) : "";
  const travelDays = WHOLE_NUMBER_PATTERN.test(travelDaysRaw) ? Number(travelDaysRaw) : Number.NaN;
  if (travelDaysRaw && (!Number.isInteger(travelDays) || travelDays < 1 || travelDays > LIMITS.travelDaysMax))
    errors.travelDays = `Please enter a number of days between 1 and ${LIMITS.travelDaysMax}.`;

  const vehicle = readLine(raw.vehicle);
  if (vehicle && isServiceId(service) && !vehicleOptions[service].includes(vehicle))
    errors.vehicle = "Please choose one of the listed options.";

  const notes = readText(raw.notes);
  if (notes.length > LIMITS.notes)
    errors.notes = `Please keep this under ${LIMITS.notes.toLocaleString("en")} characters.`;

  if (Object.keys(errors).length > 0 || !isServiceId(service)) return { ok: false, errors };

  return {
    ok: true,
    data: {
      service,
      name,
      phone,
      ...(email ? { email } : {}),
      passengers,
      pickup,
      destination,
      ...(tripType ? { tripType } : {}),
      departureDate,
      ...(pickupTime ? { pickupTime } : {}),
      ...(returnDate ? { returnDate } : {}),
      ...(travelDaysRaw ? { travelDays } : {}),
      ...(vehicle ? { vehicle } : {}),
      ...(notes ? { notes } : {}),
    },
  };
}

/** "2026-03-14" → "Sat, 14 Mar 2026" */
export function formatDisplayDate(isoDate: string): string {
  if (!isValidISODate(isoDate)) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** "14:30" → "2:30 pm" */
export function formatDisplayTime(time: string): string {
  if (!TIME_PATTERN.test(time)) return time;
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
