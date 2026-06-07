# Goodfill Care — Samui Wellness Platform

A bilingual (Thai / English) wellness booking platform for Koh Samui.
Next.js 15 full-stack + Tailwind CSS v4 + Google Gemini + Supabase.

## The flow

1. **Landing** (`/`) — persuades visitors to begin their wellness journey.
2. **Island Journey assessment** (`/assessment`) — a playful, indirect
   questionnaire (PDPA-consented). Gemini evaluates the answers into:
   stress level, migraine tendency, mental wellness, personal traits,
   a Samui Wellness Archetype (our own 16-type system) and an
   assessment ID (`SW-XXXXXX`) used later for family packages.
3. **Result** (`/assessment/result`) — archetype + gauges visualization,
   share icons, and personal goal selection ("Shall we find the kind of
   rest that fits you?").
4. **Packages** (`/packages`) — family gate (enter each member's
   assessment ID), then Gemini curates 6 packages (2 Basic / 2 Premium /
   2 Deluxe) from the 15-package catalog of real Samui businesses.
5. **Package detail** (`/packages/[id]`) — itinerary, partners, the
   "consult a nutritionist and doctor before booking" toggle, heart
   (favourites), and booking CTA.
6. **Booking** (`/booking/[id]`) — registration (name / phone / email,
   family group option) + PDPA consent. Confirmation promises contact
   via email or phone.
7. **Tracking** (`/bookings`, `/bookings/[id]`) — status timeline:
   `booked -> (expert consultation) -> processing -> contacted -> completed`.
   Guests accept expert-recommended package adjustments here.
8. **Expert console** (`/expert`) — nutritionists / doctors see the
   consult queue (raw data included), edit package details, send
   guidance, and approve packages. Access code via `EXPERT_ACCESS_CODE`
   (default `samui-expert`).

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000

### Environment

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio key for the assessment + recommender |
| `GEMINI_MODEL` | defaults to `gemini-3.5-flash` |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase project (optional in demo mode) |
| `EXPERT_ACCESS_CODE` | access code for `/expert` |

**Demo mode:** with no Gemini key the APIs fall back to deterministic
rule-based scoring; with no Supabase keys data lives in an in-memory
store — the entire flow works out of the box on a fresh machine.

### Database

Run `supabase/schema.sql` in the Supabase SQL editor. It creates
`assessments`, `customers`, `bookings`, `consents`, `experts`, enables
RLS on everything (service-role only), and ships a PDPA
`anonymize_customer()` helper for right-to-erasure requests.

## Design

- Cream / deep-teal / soft-gold palette, serif display headings
  (Cormorant Garamond + Noto Serif Thai), Inter + Noto Sans Thai body.
- Mobile-first, app-like bottom tab bar; premium editorial layout
  inspired by Six Senses and Kamalaya.
- Strict bilingual separation — the English UI contains no Thai.
