# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                        # dev server (default port 3000)
npm run build                      # production build — primary verification gate
npx tsc --noEmit --incremental false   # typecheck only (faster than a full build)
```

There is no test suite or linter configured. Verification = `tsc` + `next build` + exercising the flow against a running dev server (all API routes work without any env keys — see Demo mode).

**Never run `next build` while `next dev` is serving** — both write to `.next/` and the dev server wedges (pages still 200 but POST routes hang/return empty). Stop dev first, or restart it after building. When a CSS/root-page change won't show up, clear `.next` and restart dev.

## Architecture

Next.js 15 App Router (params are Promises: `await params` in routes/pages, `use(params)` in client components), React 19, Tailwind CSS v4 (CSS-first: all design tokens live in `@theme` in `src/app/globals.css` — there is no tailwind.config). Path alias `@/*` → `./src/*`.

The app has grown well past the assessment funnel: on top of the quiz + package catalog there are **accounts/cart**, an **expert-mediated consultation/order system** (with a **LINE/LIFF** expert console), a **customer plan editor with dynamic pricing**, and a **pre/post check-in (T1/T2/T3) + outcome journey** system. The original `/booking` + staff `/expert` console still exists and coexists with the newer `/orders` flow.

### Graceful degradation everywhere (demo mode)

The platform must work with an empty `.env`. Every external dependency is runtime-gated, so all routes function (with in-memory/no-op fallbacks) with zero keys:

- `src/lib/gemini.ts` — `hasGeminiKey()` gates every LLM call. LLM output is always validated/clamped against a deterministic rule-based result; LLM failures must never 500.
- `src/lib/store.ts` — `getSupabase()` returns null without env keys; falls back to in-memory Maps on `globalThis.__gcMemoryDb` (cleared on server restart, survives hot reload). All persistence goes through this module's helpers, never direct Supabase calls. The client is memoized **including the null result** — after adding Supabase env keys, restart the server. (In prod, Vercel serverless instances don't share memory — Supabase env is required for anything to persist.)
- `src/lib/line.ts` — `hasLineConfig()` gates all LINE Messaging API calls (pushes/broadcasts/profile); they no-op without `LINE_CHANNEL_ACCESS_TOKEN` + `LINE_CHANNEL_SECRET`.
- `src/lib/auth.ts` — without `AUTH_SECRET` it signs sessions with a built-in `DEMO_SECRET` (warns in prod, does **not** fail closed).

### Accounts, cart & client session

- **Auth** (`src/lib/auth.ts`): scrypt password hashing + an HMAC-signed `${customerId}.${exp}.${hmac}` token in an httpOnly `gc_session` cookie (30-day, `secure` in prod). `getSessionCustomerId()` (`src/lib/session-server.ts`) verifies the cookie server-side; it gates `api/auth/me`, `api/cart`, `api/favorites` (401 otherwise). Customer rows live in Supabase `customers` (or the in-memory map in demo mode). Routes: `api/auth/{login,register,me,logout}`.
- **Client account context** (`src/lib/account.tsx`): `useAccount()` exposes `user`, `ready`, `favorites`, `cart`, `cartCount`/`favCount`, `toggleFavorite`/`addToCart`/`removeFromCart`, `login`/`register`/`logout`, and modal/drawer plumbing (`openAuth`/`openCart`). A logged-out add-to-cart/favorite buffers the intent and replays it after auth. `ItemType` = `program | service | menu | package`.
- **Cart is advisory** — `CartDrawer` has no checkout handler. The real purchase path is consultation-mediated (see below). Don't wire cart→order.
- **Client guest state** lives in localStorage via `src/lib/session.ts` only (`gc-`-prefixed keys: `gc-profile`, `gc-goals`, `gc-consults`, `gc-booking-refs`, `gc-family-ids`, `gc-checkin-refs`, `gc-plan-progress`, `gc-order-plans`, `gc-customer`). Helpers dispatch a `gc-session-change` window event — use them, not raw localStorage. This is separate from the server-persisted account cart/favorites.

### Bilingual system (strict)

Custom lightweight i18n in `src/lib/i18n/`:

- `LocaleProvider` + `useT(dict)` / `useL()` hooks; per-namespace dictionaries in `src/lib/i18n/dictionaries/*.ts`, each `satisfies Record<Locale, unknown>`.
- Data (packages, questions, archetypes, partners, API responses) carries `LText = { th, en }`; render via `useL()`/`pickL()`.
- **Hard rule: zero hardcoded UI strings in components** (including aria-labels and SVG `<text>`). Every string comes from a dictionary or an `LText`. When locale is `en` the rendered page must contain no Thai characters at all (this is verified; English needs singular/plural handling — see `units.day`/`units.days` in `common.ts`). The rule is one-directional: English in the Thai locale is fine and used deliberately for brand/category labels; proper-noun brand-name arrays are the one tolerated hardcode.
- SSR renders Thai (default `<html lang="th">`); the real locale applies client-side after hydration from localStorage `gc-locale`. (`setLocale` also writes a `gc-locale` cookie, but nothing reads it server-side — don't assume the cookie drives SSR.)

### Assessment & PDPA

- **Assessment** (`/assessment` → `api/assessment`): 10-scene gamified quiz in `src/data/questions.ts` (the `mbti`/`text` kinds are dormant plumbing). Scoring maps answers → stress/migraine/mental scores + 4 axis letters (Recharge S/L, Pace A/T, Structure P/F, Focus B/M) → one of 16 archetypes in `src/lib/archetypes.ts`. Returns a `WellnessProfile` with id `SW-XXXXXX`. Starting requires PDPA consent **and** a gender selection. `api/assessment` computes the rule-based profile first, then lets Gemini refine it (clamped back).
- **PDPA is enforced in code**: consent must be `true` or APIs return 400; `api/assessment/[id]` returns only `{ id, archetypeName }` (family-member lookups — keep minimal); `supabase/schema.sql` has RLS on all tables (service-role only, zero anon policies) + an `anonymize_customer()` erasure function; `/privacy` renders the bilingual PDPA policy from its dictionary.

### Catalog, programs & recommendation

- **Catalog** (`src/data/packages.ts`): **22 packages** = 15 legacy curated journeys (`legacyPackages.ts`, 5/5/5 across basic/premium/deluxe) + 7 evidence-based **blueprint programs**. The programs come from `src/data/blueprintPackages.json` ("Goodfill Evidence-Based Blueprint System v1", `draft`), wrapped by `src/data/blueprintPackages.ts` and adapted to `WellnessPackage` (slots → partner services/menus + a 1-day itinerary). `catalogForLlm()` produces the compact form for the system prompt. `src/lib/catalog.ts` resolves cart/favorite item ids to display data.
- **Recommendation** (`api/recommend` + `recommend-core.ts`): returns **exactly 9** picks — **3 Basic / 3 Premium / 3 Deluxe**, with the top-scoring pick per tier flagged `hero: true`. Gemini is tried first; `normaliseRecommendations()` re-buckets by the catalog's **real** tier (never the model's claim), clamps `matchScore` to 55–99, dedups, and tops up each tier to 3 from the rule-based ranking — so the response is always 9 with one hero per tier. Any LLM failure falls back to `ruleBasedRecommendations()` (`scorePackage()` weights profile + chosen/recommended/family goals, with per-id jitter so tied scores don't all show the same match %). **LLM failures must never 500.**
- **Marketing meta** (`src/lib/packageMeta.ts`): deterministic hash-derived discount (25–55%), rating (4.5–5.0), review count, struck original price, and "what's inside" chips — pure front-end dressing, no commerce backing. Rendered by `RecommendationCard.tsx` (hero variant = wider card + gold ring + "AI แนะนำพิเศษ" ribbon).
- **Programs pages**: `/programs` (rails of programs + Hug Samui services/menus) and `/programs/[slug]` (read-only detail: mechanisms, slots, evidence levels, outcomes).

### Purchase → consultation / order flow

The live purchase path (the legacy `/booking` form still exists but the funnel points here):

- Package detail "จองแพ็กเกจนี้" → `BookPackageButton` (login-gated via `useAccount().openAuth()`) → `ConsultModal` in **purchase mode**: pick one of the **2 featured experts** + a consult type (`chat` | `managed`; `video` deferred) → **full payment** (`amount = pkg.price`, not the ฿500 deposit) → `POST api/consultations` creates a `Consultation` (id `CS-XXXXXX`) → `/orders/[id]`.
- **Consult status machine** (`src/lib/consultation.ts`, `CONSULT_STATUS_FLOW`, 10 happy states + terminal `cancelled`): `awaiting_deposit → awaiting_expert → expert_processing → awaiting_customer → coordinating_partner → payment → trip_started → in_progress → completed → awaiting_feedback`. Labels are bilingual `LText`.
- Routes under `api/consultations/[id]/`: `deposit` (advance to `awaiting_expert`, seed chat thread for `chat` type, push LINE Flex to the expert OA), `advance` (customer forward-only; server whitelist is `coordinating_partner, trip_started, in_progress, completed, awaiting_feedback` — note `payment` is in the UI's next-map but is **not** server-advanceable), `chat` (+ `chat/end`), `proposal` (+ `proposal/decide`), `feedback`. `OrderDetailClient.tsx` drives customer status-advance buttons (`CUSTOMER_NEXT` map) and renders a feedback form at `awaiting_feedback`.
- **Order→booking bridge** (`src/lib/order-booking.ts`): once an order reaches `coordinating_partner` for a package/program, `ensureOrderBooking()` lazily creates a `Booking` (caches order→booking in localStorage `gc-order-bookings`) so the booking-keyed check-in/journey system works from inside the order.

### Customer plan editor & dynamic pricing

- **Pricing** (`src/lib/pricing.ts`): a package's total = items subtotal + **platform fee 10%** + **consult fee ฿500** + **transaction fee 3%** (fees compound; constants in `PRICING`). `packageDefaultPlan(pkg)` seeds the default plan so its composed total ≈ the listed price (program slots use real service/menu prices; otherwise hash-based deterministic fallbacks — `servicePrice`/`menuPrice`). `addableCatalog()` returns all Hug Samui services + menus (no published filter — all POC data is `draft`).
- **Editor** (`src/components/orders/PlanCustomizer.tsx`, page `/orders/[id]/customize`): pointer-based drag-and-drop reorder + add/remove + live total + diff-vs-original. **The customer sees only the grand total**, never the fee breakdown. Plans persist client-side only (`gc-order-plans` via `session.ts`); edits don't reconcile payment.

### LINE / LIFF expert consultation

- `src/lib/line.ts`: `hasLineConfig()` gating, `verifyLiffToken()` (validates the LIFF access token's channel id + profile via LINE OAuth2), `buildConsultFlex()`. Creds (`LINE_CHANNEL_ACCESS_TOKEN`/`SECRET`) are **server-only env**; LIFF ids (`NEXT_PUBLIC_LIFF_*`) are public.
- `api/line/webhook` verifies `X-Line-Signature`, records expert OA followers (`line_links`), logs events. `api/line/expert/[id]/*` are **LIFF-token-authed** (not the staff access code): context, `proposal`, `chat`, `chat/end`.
- Two LIFF pages: `/line/plan` (expert drag-and-drop managed-plan editor → sends a `proposal`) and `/line/chat` (realtime expert↔customer chat; first expert message advances `awaiting_expert → expert_processing`; "End chat" advances to `coordinating_partner`). The customer side of chat lives on `/orders/[id]` (polled). The proposal flow: expert sends (`sent`, supersedes prior) → customer decides original|adjusted (`proposal/decide`) → `coordinating_partner` (sets `chosenPlan`; the chosen proposal id is persisted DB-side, not on the `Consultation` type).
- LINE credentials must never be committed to source — they belong in `.env`/Vercel env only.

### Check-in (T1/T2/T3) & program journey (pre/post)

- **Check-in** (`/checkin/[bookingId]` → `api/checkin`, results `/checkin/result/[id]`, id `CI-XXXXXX`): the measurement counterpart to the playful T0 quiz. Questions in `src/data/checkin.ts` with **fixed hidden anchors** (`CHECKIN_INSTRUMENT_VERSION`, currently `cv1.0` — bump on any wording/anchor change; deltas only compare within one version). The 5 dials (stress/migraine/sleep/mind/energy) are computed **in code** (`src/lib/checkin-core.ts`); the LLM (`src/lib/checkin-llm.ts`) only reads/interprets Q8 (red flags, summaries, T2/T3 narrative + next pick from the real catalog) and its output is validated/clamped (`mergeLlmAnalysis`). Safety is a **code-enforced floor** the LLM can raise but never lower (migraine ≥ 70, BP ≥ 160/100, red flags → `expertReviewRequired`; urgent kills the next recommendation). T2/T3 deltas use a ±5 deadband ("steady") and direction-aware trends.
- **Timepoint is inferred** from existing records: no prior → T1; T1 (or a linked T0 assessment baseline) only → T2; T1+T2 → T3. `GET api/checkin?bookingId=` returns ids/timepoints only (data minimisation). Staff brief (`summaryForStaff`) + red-flag details are Thai-only by spec (clinic-facing, shown in the expert workbench via `CheckinBriefPanel`); testimonial reuse is a separate PATCH opt-in.
- **Journey** (`/journey`, `api/journey/[bookingId]`): consolidated pre/post — `OutcomeCard.tsx` (SVG before/after card, literal hex colors for faithful PNG export + share) + a deterministic **30-day self-care plan** (`src/lib/selfcare-plan.ts`, `SelfCarePlan.tsx`, per-day check-off in `gc-plan-progress`, daily reset).
- **Entry points**: `CheckinCard` on the legacy `/bookings/[id]` tracker **and** in `OrderDetailClient` (via the order→booking bridge).

### Legacy booking & staff expert console

Coexists with the orders system above (both write to the `bookings` table):

- **Booking** (`/booking/[packageId]` form → `POST api/bookings`, id `BK-XXXXXX`; lookup `/bookings`, tracker `/bookings/[id]`). The param is the package being booked, not a booking ref. Status machine: `booked → (expert_review if consultRequested) → processing → contacted → completed`, history in `statusHistory[]`.
- **Expert flow**: expert sends guidance (`POST api/expert/review` action `send`, `approved: false`, status → `expert_review`) → customer accepts via `PATCH api/bookings/[id]` `{ action: "accept_adjustments" }` (sets `customerAccepted: true`, still `approved: false`) → expert approves (action `approve`, `approved: true`, status → `processing`).
- **Console**: `/expert` (queue) + `/expert/[bookingId]` (workbench), gated by a plain access code checked server-side against `EXPERT_ACCESS_CODE` (default `samui-expert`), sent as `x-expert-code` to `api/expert/*` (helper in `src/components/expert/`, code stored in `sessionStorage`). `GET api/expert/queue` doubles as the login verifier. This is **separate** from the LIFF-token auth used by `api/line/expert/*`.

### Experts (public) & partners

- **Experts** (`src/data/experts.ts`): only **2 verified experts** ship — `sawanan-watcharawanich`, `panrawee-praditsorn` (`FEATURED_EXPERT_IDS` / `getFeaturedExperts()`, used by `SimpleExperts`, `ConsultModal`, and the `/experts` directory). The `/experts` directory filter pills derive from categories that actually have an expert. (`ExpertShowcase.tsx` is dead code.)
- **Partners** (`src/data/partners.ts`): 13 `PartnerProfile` entries (every display field is `LText`); 6 are `draftPartner()` stubs and only `hug-samui` is complete and live. `/partners/[id]` is gated to `hug-samui` in **two** places that must both change to launch another partner: `generateStaticParams()` and the runtime `notFound()` guard in `src/app/partners/[id]/page.tsx`. There's no `/partners` index and no nav entry — the old `TopBrands` landing rail that linked in has been **cut** (`TopBrands.tsx` is now dead code). Assets: `public/partners/<id>/`. Note: the `partners: string[]` field on packages is plain display strings with **no relationship** to `PartnerProfile`.

### Design system

- **Palette** (retuned in `@theme`): a mint-cream / teal / gold scheme plus `sage-*`/`ink-*` families — never hardcode hex in components, read the tokens. Quirk: there's no `--color-*: initial` reset, so Tailwind's default colors merge with the custom ones (e.g. `teal-400` renders the default bright teal; `gold-*` outside the defined steps no-ops).
- **Fonts** (`layout.tsx`): Cormorant Garamond (Latin display) + Inter (Latin body) + **Kanit** (Thai). `--font-display` is **Kanit-first** then Cormorant; `font-display` is a plain CSS class in `globals.css` and h1–h3 get the display face automatically. `:lang(th)` rules suppress letter-spacing/uppercase tracking on Thai.
- **Landing CSS utilities** in `globals.css`: `landing-heading` (balance), `landing-copy` (pretty wrap, with `:lang(th)` line-height/word-break tuning), `ornament` (gold divider), `no-scrollbar` (hand-written, used by horizontal rails). No emoji anywhere in the UI.
- **Images**: portrait/expert/landing `<Image>` use per-image `unoptimized` + `object-cover object-top` (anchors the head/subject; sidesteps the optimizer). `next.config.ts` only sets image `qualities`. Assets live under `public/images/{opt,pillar,pe}`, `public/programs/opt`, `public/partners/<id>`.
- **Layout**: mobile-first at 390px with a fixed bottom `MobileTabBar` (5 tabs: Home / Assessment / Packages / Favorites→`/favorites` / Bookings→`/orders`). `Header` nav: Home / Assessment / Packages / Experts / Orders (the "bookings" label maps to `/orders`). Shared UI primitives in `src/components/ui/` (Button, Logo, ConsentCheckbox, ShareIcons); the package card + tier badge + favorite button + `formatPrice()` live in `src/components/packages/PackageCard.tsx`.
- **Landing page** (`src/app/page.tsx`): a server component stacking self-contained `"use client"` sections — **Hero → TrustStrip → HowItWorks → Pillars → SimpleExperts → Featured → QuoteBreak → AssessmentTeaser → ClosingCTA**. No props flow between them — each reads its own namespace of the landing dictionary. Icon arrays in sections (Pillars, HowItWorks) are positionally coupled to the dictionary item arrays: adding/reordering an item means touching the component's icon array and **both** the `th` and `en` arrays together. `Featured` hardcodes 3 program ids; `SimpleExperts` is wired to `FEATURED_EXPERT_IDS`.

### Gemini model note

`GEMINI_MODEL` env (set to `gemini-3.5-flash` per project owner's request) overrides the code default `gemini-2.5-flash` in `src/lib/gemini.ts`. If the env model id is rejected by the API the rule-based fallback covers it — don't "fix" the env value without asking.
