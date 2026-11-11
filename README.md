# Travel & Tourism Website

A premium, single-page website for a family-owned travel business offering **taxi services, tourist bus
rentals and customised tour packages**. Its main job is to turn visitors into booking enquiries: customers
fill in a short form and the details are emailed to the business.

> **Current status — setup mode.** The business name, location, phone, WhatsApp number and email were not
> supplied, so the site shows clearly marked placeholders and dashed **Setup** notes. Nothing has been
> invented. Fill in `src/config/site.ts` and the email environment variables (both described below) and the
> placeholders disappear on their own.

---

## Contents

1. [Features](#features)
2. [Technology](#technology)
3. [Getting started](#getting-started)
4. [Add your business details](#add-your-business-details)
5. [Environment variables](#environment-variables)
6. [Email setup (Resend)](#email-setup-resend)
7. [Testing the booking form](#testing-the-booking-form)
8. [How the booking endpoint behaves](#how-the-booking-endpoint-behaves)
9. [Changing content, photos and colours](#changing-content-photos-and-colours)
10. [GitHub workflow](#github-workflow)
11. [Deployment](#deployment)
12. [Launch checklist](#launch-checklist)
13. [What has and has not been tested](#what-has-and-has-not-been-tested)
14. [Photo credits](#photo-credits)

---

## Features

- **Cinematic hero**, editorial service layouts, a destination mosaic, "why choose us", a three-step booking
  explainer, an about section and a contact footer.
- **Booking enquiry form** with service preselection (each service button selects its own option), fields
  that adapt to the chosen service, friendly inline validation, past-date and return-date checks, a loading
  state, duplicate-click protection, and data that is kept if sending fails.
- **Real server-side email delivery** through [Resend](https://resend.com). The success message appears only
  after Resend confirms it accepted the email. Failures show an honest error and let the customer retry.
- **Spam protection**: hidden honeypot field, per-address rate limits, request size limit, server-side
  validation, cross-site request rejection.
- **WhatsApp and tap-to-call** buttons built from your configured numbers, plus an optional "send these
  details via WhatsApp" link that pre-fills the customer's enquiry. No chatbot.
- **Responsive and accessible**: mobile-first layouts, full-screen mobile menu, sticky mobile action bar,
  keyboard focus styles, labelled fields, reduced-motion support, skip link.
- **SEO basics**: page title and description, Open Graph image, favicon, `robots.txt`, `sitemap.xml`,
  structured data, custom 404 page, privacy policy page.
- **No database.** Enquiries go straight to your inbox.

## Technology

| Area       | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19 + TypeScript                         |
| Styling    | Tailwind CSS 4 (brand tokens in `src/app/globals.css`)                  |
| Fonts      | Fraunces (headlines) and Manrope (text), self-hosted by `next/font`     |
| Email      | Resend HTTP API, called from a server route — no extra package needed   |
| Images     | Local, optimised by `next/image` (responsive sizes, lazy loading, WebP) |

```
src/
  config/site.ts            ← business details and all editable content (start here)
  app/
    page.tsx                ← home page (assembles the sections)
    privacy/page.tsx        ← privacy policy (template wording — review it)
    not-found.tsx           ← custom 404
    api/booking/route.ts    ← receives enquiries and sends the email
    globals.css             ← brand colours, fonts, shared styles
  components/               ← Header, Hero, Services, Destinations, BookingForm, Footer…
  lib/booking.ts            ← validation rules shared by the form and the server
  lib/email.ts              ← email content + Resend call (server only)
  lib/rate-limit.ts         ← request limits
  assets/images/            ← photographs
```

The `src/db` folder and the Drizzle/PostgreSQL packages come from the starter template this project was
built on. **The website does not use them** and needs no `DATABASE_URL`; they can be removed if you wish.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env      # then fill in the values — see below
npm run dev               # http://localhost:3000
```

Other commands:

```bash
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript
```

## Add your business details

Open **`src/config/site.ts`** and fill in the block at the top:

```ts
export const business = {
  name: "",       // trading name
  location: "",   // town / region you are based in and serve
  email: "",      // public contact email shown on the site
  phone: "",      // as customers should see it, with country code
  whatsapp: "",   // country code + number, digits only (no "+", spaces or leading 0)
  timeZone: "UTC" // e.g. "Asia/Kolkata" — used for the timestamp in enquiry emails
};
```

How these are used:

- **Name and location are required.** While either is empty the site is in *setup mode*: placeholders and
  Setup notes are shown, and search engines are asked not to index the site.
- **Phone, WhatsApp and email are optional.** Once setup mode is off, any that are left empty are simply
  hidden — the site never shows a made-up number or a dead link.
- The WhatsApp button opens `https://wa.me/<your number>`, a genuine WhatsApp chat with that number.

The same file holds the services, destinations, about text, "why choose us" points, booking steps and the
vehicle options offered in the form.

> The destinations (Munnar, Alappuzha, Wayanad, Thekkady, Kochi) are **sample data** taken from the project
> brief. Replace them with places in your own service area. The site presents them as ideas only, not as
> fixed routes, prices or availability.

`about.facts` is empty on purpose. Add entries such as years in business or fleet size only when you can
stand behind them.

## Environment variables

Private settings are never stored in the code. Copy `.env.example` to `.env` locally, and add the same names
in your host's dashboard for production.

| Name                   | Required | Purpose                                                                                           |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Yes      | Resend API key. Server-side only.                                                                 |
| `BOOKING_TO_EMAIL`     | Yes      | Inbox that receives enquiries. Several addresses may be separated by commas.                      |
| `BOOKING_FROM_EMAIL`   | For launch | Sender, on a domain verified in Resend, e.g. `Website Enquiries <bookings@your-domain.com>`.    |
| `NEXT_PUBLIC_SITE_URL` | For launch | Public address, e.g. `https://www.your-domain.com`. Used for canonical links, sitemap, previews. |

Notes:

- `.env` is listed in `.gitignore`. **Never commit it**, and never prefix the API key with `NEXT_PUBLIC_`.
- If `BOOKING_FROM_EMAIL` is empty the site uses Resend's test sender `onboarding@resend.dev`, which can
  only deliver to the email address of your own Resend account. Good for a first test, not for launch.
- On Vercel, `NEXT_PUBLIC_SITE_URL` falls back to the project's production domain automatically.
- Environment variables are read when the server starts (and public ones at build time), so redeploy or
  restart after changing them.

## Email setup (Resend)

1. Create an account at [resend.com](https://resend.com).
2. **API key** — go to *API Keys*, create a key with "Sending access", and put it in `RESEND_API_KEY`.
3. **Recipient** — set `BOOKING_TO_EMAIL` to the inbox where you want enquiries.
4. **First test** — leave `BOOKING_FROM_EMAIL` empty and set `BOOKING_TO_EMAIL` to the email address you
   signed up to Resend with. Submit the form; the enquiry should arrive within a few seconds.
5. **Sender identity for launch** — in Resend go to *Domains*, add your domain and create the DNS records it
   shows you. When the domain is verified, set
   `BOOKING_FROM_EMAIL="Website Enquiries <bookings@your-domain.com>"`. You can then deliver to any inbox.
6. Check Resend's current plan limits to be sure they cover your expected number of enquiries.

Each enquiry email has the subject `New Travel Booking Enquiry — <Service> · <Name> · <Departure date>` and
lists the customer's name, phone, email, service, pickup, destination, dates, pickup time, passengers,
vehicle preference, trip duration, additional requirements and the submission time. If the customer gave an
email address, pressing **Reply** answers them directly.

**Using a different provider:** all provider-specific code is in `sendBookingEmail()` in `src/lib/email.ts`.
Swap that one function for another provider's API and the rest of the site is unchanged.

## Testing the booking form

In the browser: run the site, press any **Enquire** button, fill in the form and send.

- Email settings missing → the form shows *"Your enquiry was not sent"* and keeps what you typed.
- Email settings present → *"Your enquiry has been sent"* appears and the email arrives.

From a terminal (use a date in the future):

```bash
curl -i -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"service":"taxi","name":"Test Customer","phone":"+00 12345 67890",
       "passengers":"2","pickup":"Town centre","destination":"Airport",
       "departureDate":"2030-01-15","tripType":"one-way"}'
```

If an email does not arrive, look at the server log (Vercel: *Project → Logs*). The site records Resend's
reason for refusing a message — for example an unverified sender domain — without logging customer details.

## How the booking endpoint behaves

`POST /api/booking` accepts JSON and replies with `{ "ok": true }` or
`{ "ok": false, "code": "...", "message": "...", "errors": { field: message } }`.

| Status | Code                   | Meaning                                                              |
| ------ | ---------------------- | -------------------------------------------------------------------- |
| 200    | —                      | Resend accepted the email                                            |
| 400    | `VALIDATION`           | Missing or invalid fields (details in `errors`)                      |
| 400    | `REJECTED`             | Hidden anti-spam field was filled in                                 |
| 400    | `INVALID_REQUEST`      | Body was not valid JSON                                              |
| 403    | `FORBIDDEN`            | Request came from another website                                    |
| 413    | `TOO_LARGE`            | Body over the size limit                                             |
| 415    | `UNSUPPORTED`          | Not sent as JSON                                                     |
| 429    | `RATE_LIMITED`         | Too many requests from one address                                   |
| 502    | `EMAIL_FAILED`         | Resend refused the message or could not be reached                   |
| 503    | `EMAIL_NOT_CONFIGURED` | `RESEND_API_KEY` or `BOOKING_TO_EMAIL` is missing                    |

Good to know:

- **Limits**: 5 sent enquiries and 30 requests per address per 10 minutes. They are held in server memory,
  so on serverless hosting they are best-effort. For strict limits, add your host's firewall rules or a
  shared store such as Upstash Redis in `src/lib/rate-limit.ts`. The visitor's address is read from the
  `x-forwarded-for` header that hosts such as Vercel set; if your host does not provide it, all visitors
  share one counter and the limits are automatically four times higher.
- **Duplicates**: an identical enquiry repeated within 10 minutes is acknowledged without a second email.
- **Dates**: the browser blocks past dates using the visitor's own clock. The server allows one extra day so
  visitors in time zones behind the server are not wrongly refused.
- **No storage**: enquiries are not saved anywhere by the website. If a send fails, the customer is told and
  can retry or contact you directly.

## Changing content, photos and colours

- **Text and lists** — `src/config/site.ts`.
- **Photos** — replace a file in `src/assets/images/` with one of the same name, or import a new file at the
  top of `src/config/site.ts` and update the matching `imageAlt` description. Landscape photos about
  1600–2400px wide work well.
- **Colours** — the `@theme` block at the top of `src/app/globals.css` (`night`, `sand`, `lagoon`, `sunset`).
- **Fonts** — `src/app/layout.tsx`.
- **Logo** — `src/components/Logo.tsx` (text logo with a simple mark) and `src/app/icon.svg` (favicon).
- **Social preview image** — `src/app/opengraph-image.jpg` (1200 × 630).
- **Privacy policy** — `src/app/privacy/page.tsx`. It is template wording describing how this website
  works; review it against your real practices and local legal requirements before launch.

## GitHub workflow

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

For later changes, work on a branch, open a pull request and merge into `main`. Run
`npm run lint && npm run typecheck && npm run build` before pushing. Confirm with `git status` that `.env`
is not listed before your first commit.

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub.
2. In Vercel choose **Add New → Project** and import the repository. The defaults are correct.
3. Under **Settings → Environment Variables** add `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL`
   and `NEXT_PUBLIC_SITE_URL`.
4. Deploy, then send a test enquiry from the live site.
5. Add your domain under **Settings → Domains**. Every push to `main` redeploys automatically.

### Any Node.js host

```bash
npm ci && npm run build && npm run start
```

Set the same environment variables on the server and run it behind HTTPS.

### GitHub Pages

GitHub Pages only serves static files, so it **cannot run the server route that sends the email**, and an
email API key must never be placed in browser code. If you must use Pages, host the form handler somewhere
that can run server code (for example deploy this same project to Vercel and use it only for
`/api/booking`), or switch the form to a hosted form service designed for static sites. Deploying the whole
site to a server-capable host such as Vercel is simpler and is what this project is built for.

## Launch checklist

- [ ] Business name, location, phone, WhatsApp and email filled in (`src/config/site.ts`)
- [ ] Sample destinations replaced with your own
- [ ] Service descriptions, vehicle options and "why choose us" points reviewed for accuracy
- [ ] `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` set, sender domain verified in Resend
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live address
- [ ] A real test enquiry sent from the live site and received in your inbox (check spam too)
- [ ] Call and WhatsApp buttons tried on a phone
- [ ] Privacy policy reviewed
- [ ] Setup notice no longer appears in the footer

## What has and has not been tested

Tested during development, in a headless Chromium browser and from the command line:

- Type-check, lint and production build pass.
- Layout at 320, 390, 820 and 1440 pixels wide: no horizontal overflow, no broken images, no console errors.
- All navigation links and call-to-action buttons scroll to the right section, including from the privacy
  page; each service button preselects its service; destination tiles pre-fill the destination.
- Required fields, phone/email formats, past departure dates and return-before-departure are rejected in the
  browser and again on the server.
- With no email settings the form reports a failure and keeps the entered data.
- Against a **local stand-in for Resend's API**: the request is correctly formed, the success state appears
  only after the provider accepts the message, a refused message shows an error, rapid repeated clicks send
  one email, and the rate limit engages.

**Not tested:** delivery of a real email through Resend, because no Resend account or API key was available.
Send a real test enquiry after adding your credentials. The call and WhatsApp links were checked with test
numbers only, since no real numbers were supplied.

## Photo credits

All photographs are from [Pexels](https://www.pexels.com) and used under the
[Pexels licence](https://www.pexels.com/license/) (free to use; attribution appreciated but not required).

| File                 | Photographer             | Source                                                                                          |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `hero-road.jpg`      | Yogendra Singh           | https://www.pexels.com/photo/road-on-hill-with-forest-and-field-16443099/                       |
| `taxi-driver.jpg`    | Amir Esrafili            | https://www.pexels.com/photo/unrecognizable-couple-travelling-in-car-6516279/                   |
| `taxi-mirror.jpg`    | Lukas Kloeppel           | https://www.pexels.com/photo/black-vehicle-side-mirror-2416595/                                 |
| `bus-road.jpg`       | Harsh Suthar             | https://www.pexels.com/photo/scenic-mountain-road-with-mini-buses-in-bhutan-34556119/           |
| `road-ridge.jpg`     | Wei86 Travel             | https://www.pexels.com/photo/scenic-mountain-road-amidst-lush-greenery-28439927/                |
| `tours-sunset.jpg`   | Maive & Nahuel Fotografía | https://www.pexels.com/photo/family-walking-on-sandy-beach-at-sunset-40458301/                 |
| `dest-munnar.jpg`    | Ritesh Mitha             | https://www.pexels.com/photo/scenic-tea-plantations-in-munnar-india-35994957/                   |
| `dest-alappuzha.jpg` | Harish .P                | https://www.pexels.com/photo/scenic-houseboats-in-alappuzha-backwaters-kerala-31746465/         |
| `dest-wayanad.jpg`   | Abin T                   | https://www.pexels.com/photo/man-walking-in-lush-forest-wayanad-40849542/                       |
| `dest-thekkady.jpg`  | Mohit Khare              | https://www.pexels.com/photo/scenic-boat-ride-on-serene-lake-surrounded-by-forest-36717711/     |
| `dest-kochi.jpg`     | Mohammed Nasim           | https://www.pexels.com/photo/the-chinese-fishing-nets-at-fort-kochi-in-kerala-india-12593493/   |
| `about-family.jpg`   | Souvik Dutta             | https://www.pexels.com/photo/family-walking-on-serene-country-road-34368995/                    |
| `about-drive.jpg`    | cottonbro studio         | https://www.pexels.com/photo/person-driving-car-5329293/                                        |

The photos are illustrative. They do not show the business's own vehicles, staff or customers — replace
them with your own photography when you can. The Thekkady image's source page does not name its location;
swap it if you want a verified local photo.
