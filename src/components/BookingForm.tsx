"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { contact, display, getService, services, vehicleOptions, whatsappLink, type ServiceId } from "@/config/site";
import {
  HONEYPOT_FIELD,
  LIMITS,
  bookingFields,
  emptyBookingValues,
  formatDisplayDate,
  formatDisplayTime,
  isServiceId,
  localISODate,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingFormValues,
} from "@/lib/booking";
import { onBookingPrefill } from "@/lib/prefill";
import { AlertIcon, ArrowRightIcon, BusIcon, CarIcon, CheckIcon, CompassIcon, SpinnerIcon, WhatsAppIcon } from "./icons";
import { SetupNote } from "./SetupNote";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; name: string }
  | { kind: "error"; message: string };

const serviceIcons: Record<ServiceId, typeof CarIcon> = { taxi: CarIcon, bus: BusIcon, tour: CompassIcon };

const SUBMIT_TIMEOUT_MS = 25_000;
const GENERIC_ERROR =
  "We couldn't send your enquiry just now. Your details are still in the form — please try again in a moment.";

// "Today" depends on the visitor's time zone, so it is only read in the browser.
const subscribeToNothing = () => () => {};
const readToday = () => localISODate();
const readTodayOnServer = () => "";

function Required() {
  return (
    <span aria-hidden="true" className="ml-1 text-lagoon-700">
      *
    </span>
  );
}

function Field({
  id,
  label,
  required = false,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <Required /> : <span className="ml-1.5 font-normal text-ink-600">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-[0.82rem] font-medium text-danger">
          <AlertIcon width={15} height={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[0.8rem] leading-snug text-ink-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Message used by the optional "send via WhatsApp" link — only includes what has been filled in. */
function buildWhatsAppMessage(values: BookingFormValues): string {
  const isTour = values.service === "tour";
  const lines = [
    `Hello ${display.name}, I'd like to make a travel enquiry.`,
    isServiceId(values.service) ? `Service: ${getService(values.service).formLabel}` : "",
    values.name.trim() ? `Name: ${values.name.trim()}` : "",
    values.pickup.trim() ? `Pickup: ${values.pickup.trim()}` : "",
    values.destination.trim() ? `Destination: ${values.destination.trim()}` : "",
    values.service && !isTour ? `Trip: ${values.tripType === "round-trip" ? "Round trip" : "One-way"}` : "",
    values.departureDate
      ? `Departure: ${formatDisplayDate(values.departureDate)}${
          values.pickupTime ? ` at ${formatDisplayTime(values.pickupTime)}` : ""
        }`
      : "",
    values.returnDate && (isTour || values.tripType === "round-trip")
      ? `Return: ${formatDisplayDate(values.returnDate)}`
      : "",
    values.passengers ? `Passengers: ${values.passengers}` : "",
    isTour && values.travelDays ? `Travel days: ${values.travelDays}` : "",
    values.vehicle ? `Vehicle preference: ${values.vehicle}` : "",
    values.notes.trim() ? `Notes: ${values.notes.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

/** Keeps only recognised field names with text messages from a server response. */
function readServerErrors(value: unknown): BookingErrors {
  if (typeof value !== "object" || value === null) return {};
  const record = value as Record<string, unknown>;
  const errors: BookingErrors = {};
  for (const field of bookingFields) {
    const message = record[field];
    if (typeof message === "string" && message) errors[field] = message;
  }
  return errors;
}

export function BookingForm() {
  const uid = useId();
  const today = useSyncExternalStore(subscribeToNothing, readToday, readTodayOnServer);

  const [values, setValues] = useState<BookingFormValues>(emptyBookingValues);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submittingRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  const fieldId = (field: BookingField) => `${uid}-${field}`;
  const submitting = status.kind === "submitting";
  const service = isServiceId(values.service) ? values.service : null;
  const isTour = service === "tour";
  const showTripType = service !== null && !isTour;
  const showReturnDate = isTour || (showTripType && values.tripType === "round-trip");
  const errorCount = Object.keys(errors).length;

  // Buttons elsewhere on the page ("Enquire about a taxi", a destination tile…) preselect values here.
  useEffect(
    () =>
      onBookingPrefill((prefill) => {
        setStatus((current) => (current.kind === "success" ? { kind: "idle" } : current));
        setValues((current) => {
          const next = { ...current };
          if (prefill.service && prefill.service !== current.service) {
            next.service = prefill.service;
            next.vehicle = "";
          }
          if (prefill.destination) {
            next.destination = prefill.destination;
            if (!next.service) next.service = "tour";
          }
          return next;
        });
        setErrors((current) => {
          const next = { ...current };
          if (prefill.service || prefill.destination) delete next.service;
          if (prefill.destination) delete next.destination;
          return next;
        });
      }),
    [],
  );

  // After a successful send, bring the confirmation into view and announce it.
  useEffect(() => {
    if (status.kind !== "success") return;
    const panel = successRef.current;
    if (!panel) return;
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({ block: "center" });
  }, [status.kind]);

  function update(field: BookingField, value: string) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "service" && value !== current.service) next.vehicle = "";
      return next;
    });
    // Clear the message as soon as the visitor starts fixing a field.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateField(field: BookingField) {
    const result = validateBooking(values, { earliestDate: localISODate() });
    const message = result.ok ? undefined : result.errors[field];
    setErrors((current) => {
      if (current[field] === message) return current;
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function focusFirstError(found: BookingErrors) {
    const first = bookingFields.find((field) => found[field]);
    if (!first) return;
    const id = first === "service" ? `${fieldId("service")}-${services[0].id}` : fieldId(first);
    window.requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  /** Shared props for text-like controls. */
  function control(field: BookingField, hasHint = false) {
    const id = fieldId(field);
    const error = errors[field];
    return {
      id,
      name: field,
      value: values[field],
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        update(field, event.target.value),
      onBlur: () => validateField(field),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return; // ignore double clicks while a request is in flight

    const result = validateBooking(values, { earliestDate: localISODate() });
    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ kind: "idle" });
      focusFirstError(result.errors);
      return;
    }

    submittingRef.current = true;
    setErrors({});
    setStatus({ kind: "submitting" });

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypot }),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      // Success is shown only when the server confirms the email provider accepted the message.
      if (response.ok && payload?.ok === true) {
        setValues(emptyBookingValues);
        setHoneypot("");
        setStatus({ kind: "success", name: result.data.name.split(" ")[0] ?? "" });
        return;
      }

      const serverErrors = readServerErrors(payload?.errors);
      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
        focusFirstError(serverErrors);
      }
      setStatus({
        kind: "error",
        message: typeof payload?.message === "string" && payload.message ? payload.message : GENERIC_ERROR,
      });
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      setStatus({
        kind: "error",
        message: timedOut
          ? "This is taking longer than expected, so we stopped the request. Your details are still in the form — please try again."
          : "We couldn't reach our server. Please check your connection and try again — your details are still in the form.",
      });
    } finally {
      window.clearTimeout(timer);
      submittingRef.current = false;
    }
  }

  const chatLink = whatsappLink(buildWhatsAppMessage(values));
  const card =
    "theme-light rounded-2xl bg-sand-50 p-5 text-night-900 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.75)] sm:p-8 lg:p-10";

  if (status.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={`${card} flex min-h-[26rem] flex-col justify-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lagoon-600 text-white">
          <CheckIcon width={28} height={28} />
        </span>
        <h3 className="display mt-7 text-3xl leading-tight sm:text-4xl">
          Thank you{status.name ? `, ${status.name}` : ""}. Your enquiry has been sent.
        </h3>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-600">
          Our team will review your requirements and contact you to discuss availability and pricing.
        </p>
        <p className="mt-3 max-w-xl font-medium leading-relaxed text-night-900">
          Please remember: your booking is confirmed only after confirmation from our team.
        </p>
        <div className="mt-8">
          <button type="button" className="btn btn-outline-dark" onClick={() => setStatus({ kind: "idle" })}>
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  const optionCard = (checked: boolean) =>
    `relative flex cursor-pointer items-center justify-center rounded-lg border text-center transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lagoon-700 ${
      checked
        ? "border-night-900 bg-night-900 text-sand-50"
        : "border-sand-300 bg-white text-night-900 hover:border-sand-400"
    }`;

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={submitting} aria-labelledby={`${uid}-title`} className={card}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-sand-200 pb-5">
        <h3 id={`${uid}-title`} className="display text-2xl sm:text-[1.75rem]">
          Your travel requirements
        </h3>
        <p className="text-[0.8rem] text-ink-600">
          <span aria-hidden="true" className="text-lagoon-700">
            *
          </span>{" "}
          Required
        </p>
      </div>

      <div
        className={`mt-7 grid gap-x-5 gap-y-6 transition-opacity duration-200 sm:grid-cols-2 ${
          submitting ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {/* Service */}
        <fieldset className="min-w-0 sm:col-span-2">
          <legend className="field-label">
            Service required
            <Required />
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {services.map((option) => {
              const Icon = serviceIcons[option.id];
              const checked = values.service === option.id;
              return (
                <label key={option.id} className={`${optionCard(checked)} flex-col gap-2 px-2 py-4`}>
                  <input
                    type="radio"
                    name="service"
                    id={`${fieldId("service")}-${option.id}`}
                    value={option.id}
                    checked={checked}
                    required
                    aria-describedby={errors.service ? `${fieldId("service")}-error` : undefined}
                    onChange={() => update("service", option.id)}
                    className="sr-only"
                  />
                  <Icon width={24} height={24} className={checked ? "text-sunset-300" : "text-lagoon-700"} />
                  <span className="text-[0.8rem] font-semibold leading-tight sm:text-sm">{option.formLabel}</span>
                </label>
              );
            })}
          </div>
          {errors.service && (
            <p
              id={`${fieldId("service")}-error`}
              className="mt-2 flex items-start gap-1.5 text-[0.82rem] font-medium text-danger"
            >
              <AlertIcon width={15} height={15} className="mt-0.5 shrink-0" />
              {errors.service}
            </p>
          )}
        </fieldset>

        <Field id={fieldId("name")} label="Full name" required error={errors.name}>
          <input
            {...control("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            className="field-input"
          />
        </Field>

        <Field id={fieldId("phone")} label="Phone number" required error={errors.phone}>
          <input
            {...control("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            required
            className="field-input"
          />
        </Field>

        <Field id={fieldId("email")} label="Email address" error={errors.email}>
          <input
            {...control("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={LIMITS.email}
            className="field-input"
          />
        </Field>

        <Field id={fieldId("passengers")} label="Number of passengers" required error={errors.passengers}>
          <input
            {...control("passengers")}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={3}
            required
            onChange={(event) => update("passengers", event.target.value.replace(/\D/g, "").slice(0, 3))}
            className="field-input"
          />
        </Field>

        <Field id={fieldId("pickup")} label="Pickup location" required error={errors.pickup}>
          <input
            {...control("pickup")}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.place}
            required
            placeholder="Town, address or landmark"
            className="field-input"
          />
        </Field>

        <Field id={fieldId("destination")} label="Destination" required error={errors.destination}>
          <input
            {...control("destination")}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.place}
            required
            placeholder="Where would you like to go?"
            className="field-input"
          />
        </Field>

        {showTripType && (
          <fieldset className="field-appear min-w-0 sm:col-span-2">
            <legend className="field-label">Trip type</legend>
            <div className="grid grid-cols-2 gap-2 sm:max-w-sm sm:gap-3">
              {(
                [
                  ["one-way", "One-way"],
                  ["round-trip", "Round trip"],
                ] as const
              ).map(([value, label]) => {
                const checked = values.tripType === value;
                return (
                  <label key={value} className={`${optionCard(checked)} min-h-[3.25rem] px-3 text-sm font-semibold`}>
                    <input
                      type="radio"
                      name="tripType"
                      value={value}
                      checked={checked}
                      onChange={() => update("tripType", value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <Field id={fieldId("departureDate")} label="Departure date" required error={errors.departureDate}>
          <input
            {...control("departureDate")}
            type="date"
            min={today || undefined}
            required
            className="field-input"
          />
        </Field>

        <Field id={fieldId("pickupTime")} label="Pickup time" error={errors.pickupTime}>
          <input {...control("pickupTime")} type="time" className="field-input" />
        </Field>

        {showReturnDate && (
          <Field
            id={fieldId("returnDate")}
            label="Return date"
            error={errors.returnDate}
            hint="Add it if you already know."
            className="field-appear"
          >
            <input
              {...control("returnDate", true)}
              type="date"
              min={values.departureDate || today || undefined}
              className="field-input"
            />
          </Field>
        )}

        {isTour && (
          <Field
            id={fieldId("travelDays")}
            label="Number of travel days"
            error={errors.travelDays}
            className="field-appear"
          >
            <input
              {...control("travelDays")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              maxLength={2}
              onChange={(event) => update("travelDays", event.target.value.replace(/\D/g, "").slice(0, 2))}
              className="field-input"
            />
          </Field>
        )}

        {service && (
          <Field
            id={fieldId("vehicle")}
            label="Preferred vehicle size"
            error={errors.vehicle}
            hint="Subject to availability — we'll confirm when we reply."
            className="field-appear"
          >
            <select {...control("vehicle", true)} className="field-input">
              <option value="">Not sure — please suggest</option>
              {vehicleOptions[service].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field
          id={fieldId("notes")}
          label="Additional requirements or special requests"
          error={errors.notes}
          hint="Extra stops, luggage, child seats, accessibility needs, places you'd like to see…"
          className="sm:col-span-2"
        >
          <textarea {...control("notes", true)} rows={4} maxLength={LIMITS.notes} className="field-input" />
        </Field>

        {/* Honeypot: hidden from people and assistive tech; automated form-fillers tend to complete it. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-reference`}>Leave this field empty</label>
          <input
            id={`${uid}-reference`}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {errorCount > 0 && status.kind !== "error" && (
          <p role="alert" className="flex items-start gap-2 text-[0.9rem] font-medium text-danger">
            <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
            {errorCount === 1
              ? "One detail needs your attention before we can send this."
              : `${errorCount} details need your attention before we can send this.`}
          </p>
        )}

        {status.kind === "error" && (
          <div role="alert" className="flex gap-3 rounded-lg border border-danger/35 bg-danger/5 p-4 text-[0.92rem]">
            <AlertIcon className="mt-0.5 shrink-0 text-danger" />
            <div className="min-w-0">
              <p className="font-semibold text-night-900">Your enquiry was not sent</p>
              <p className="mt-1 leading-relaxed text-night-900">{status.message}</p>
              {(contact.phoneHref || chatLink) && (
                <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-semibold text-lagoon-700">
                  {contact.phoneHref && (
                    <a href={contact.phoneHref} className="underline underline-offset-4">
                      Call {contact.phone}
                    </a>
                  )}
                  {chatLink && (
                    <a href={chatLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      Send via WhatsApp
                    </a>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          aria-disabled={submitting}
          className={`btn btn-primary min-h-14 w-full text-base ${submitting ? "cursor-progress opacity-80" : ""}`}
        >
          {submitting ? (
            <>
              <SpinnerIcon className="spinner" />
              Sending your enquiry…
            </>
          ) : (
            <>
              Send Booking Enquiry
              <ArrowRightIcon className="btn-arrow" />
            </>
          )}
        </button>
        <p role="status" className="sr-only">
          {submitting ? "Sending your enquiry, please wait." : ""}
        </p>

        <p className="text-[0.86rem] leading-relaxed text-ink-600">
          Our team will review your requirements and contact you to discuss availability and pricing. Your booking is
          confirmed only after confirmation from our team.
        </p>

        {chatLink ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-sand-200 pt-5 text-[0.9rem] text-ink-600">
            Prefer WhatsApp?
            <a
              href={chatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-lagoon-700 underline underline-offset-4"
            >
              <WhatsAppIcon width={17} height={17} />
              Send these details in a WhatsApp message instead
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
          </p>
        ) : (
          <div className="border-t border-sand-200 pt-5 empty:hidden">
            <SetupNote>
              “Send these details via WhatsApp” link — appears here once a WhatsApp number is configured.
            </SetupNote>
          </div>
        )}
      </div>
    </form>
  );
}
