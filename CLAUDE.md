# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                        # dev server (default port 3000)
npm run build                      # production build — primary verification gate
npx tsc --noEmit --incremental false   # typecheck only (faster than a full build)
```

There is no test suite or linter configured. Verification = `tsc` + `next build` + exercising the flow against a running dev server (all API routes work without any env keys — see Demo mode).

**Never run `next build` while `next dev` is serving** — both write to `.next/` and the dev server wedges (pages still 200 but POST routes hang/return empty). Stop dev first, or restart it after building.

## Architecture

Next.js 15 App Router (params are Promises: `await params` in routes/pages, `use(params)` in client components), React 19, Tailwind CSS v4 (CSS-first: all design tokens live in `@theme` in `src/app/globals.css` — there is no tailwind.config). Path alias `@/*` → `./src/*`.

### Graceful degradation everywhere (demo mode)

The platform must work with an empty `.env`:

- `src/lib/gemini.ts` — `hasGeminiKey()` gates every LLM call. `api/assessment` computes a deterministic rule-based profile first, then lets Gemini refine it; `api/recommend` tries Gemini first and falls back to `ruleBasedRecommendations()` on any failure. Either way LLM output is validated/clamped against the rule-based result (band reconciliation, archetype-code whitelist; `normaliseRecommendations()` re-buckets picks by the catalog's real tier — never the model's claimed tier — clamps matchScore to 55–99 and tops up each tier from the rule-based ranking, so the response is always exactly 2/2/2). LLM failures must never 500.
- `src/lib/store.ts` — `getSupabase()` returns null without env keys; falls back to in-memory Maps on `globalThis.__gcMemoryDb` (cleared on server restart). All persistence goes through this module's helpers, never direct Supabase calls. The client is memoized **including the null result** — after adding Supabase env keys, restart the server.

### Bilingual system (strict)

Custom lightweight i18n in `src/lib/i18n/`:

- `LocaleProvider` + `useT(dict)` / `useL()` hooks; per-namespace dictionaries in `src/lib/i18n/dictionaries/*.ts`, each `satisfies Record<Locale, unknown>`.
- Data (packages, questions, archetypes, partners, API responses) carries `LText = { th, en }`; render via `useL()`/`pickL()`.
- **Hard rule: zero hardcoded UI strings in components.** Every string comes from a dictionary or an `LText`. When locale is `en` the rendered page must contain no Thai characters at all (this is verified; English needs singular/plural handling — see `units.day`/`units.days` in `common.ts`). The rule is one-directional: English in the Thai locale is fine and used deliberately for brand/category labels; proper-noun brand name arrays (e.g. `TrustStrip`) are the one tolerated hardcode.
- SSR renders Thai (default); the real locale applies client-side after hydration from localStorage `gc-locale`. (`setLocale` also writes a `gc-locale` cookie, but nothing reads it server-side — don't assume the cookie drives SSR.)

### Domain flow and state

- **Client session state** lives in localStorage via `src/lib/session.ts` only (profile, goals, favorites, consult flags, family IDs, booking refs, customer info). Helpers dispatch a `gc-session-change` window event that components listen to — use these helpers, not raw localStorage.
- **Assessment** (`/assessment` → `api/assessment`): 10-scene gamified quiz defined in `src/data/questions.ts` (the `mbti`/`text` question kinds are dormant plumbing — handled but unused). Scoring maps answers → stress/migraine/mental scores + 4 axis letters (Recharge S/L, Pace A/T, Structure P/F, Focus B/M) → one of 16 archetypes in `src/lib/archetypes.ts`. Returns a `WellnessProfile` with id `SW-XXXXXX`. Starting the quiz requires PDPA consent **and** a gender selection.
- **PDPA is enforced in code**: consent must be `true` or APIs return 400; `api/assessment/[id]` returns only `{ id, archetypeName }` (used for family-member lookups — keep it minimal); `supabase/schema.sql` has RLS on all tables (service-role only, zero anon policies) and an `anonymize_customer()` erasure function; `/privacy` renders the bilingual PDPA policy from its dictionary.
- **Recommendation** (`api/recommend` + `recommend-core.ts`): picks exactly 2 Basic / 2 Premium / 2 Deluxe from the 15-package catalog (`src/data/packages.ts`, real Samui businesses only — `catalogForLlm()` produces the compact form for the system prompt). Rule-based scoring uses `presentScore()` (rank decay + per-id jitter) so tied scores don't all show the same match %, and rotating reason templates so the 6 reasons differ. Family mode boosts the dedicated `deluxe-family-shore` package and silently skips family assessment ids that don't resolve.
- **Booking status machine**: `booked → (expert_review if consultRequested) → processing → contacted → completed`, history appended in `status_history`. Expert flow: expert sends guidance (`approved: false`) → customer accepts via `PATCH api/bookings/[id]` with `{ action: "accept_adjustments" }` (`customerAccepted: true`) → expert approves (`approved: true`, status → `processing`). The booking page route is `/booking/[packageId]` (param is the package being booked, not a booking ref).
- **Expert console**: two gated pages — `/expert` (queue) and `/expert/[bookingId]` (review workbench where the guidance/approve flow happens). Auth is a plain access code checked server-side against `EXPERT_ACCESS_CODE` (default `samui-expert`), sent as the `x-expert-code` header to `api/expert/*` routes; the shared helper lives in `src/components/expert/auth.ts` (not `src/lib/`), and `GET api/expert/queue` doubles as the login verifier.
- **Check-in T1/T2** (`/checkin/[bookingId]` → `api/checkin`, results at `/checkin/result/[id]`, id `CI-XXXXXX`): the measurement counterpart to the playful T0 quiz. Questions live in `src/data/checkin.ts` with **fixed hidden anchor values** (`CHECKIN_INSTRUMENT_VERSION`, currently `cv1.0` — bump it on any wording/anchor change; deltas only compare within one version). The 5 dial scores (stress/migraine/sleep/mind/energy) are computed **in code** in `src/lib/checkin-core.ts` — the LLM (`src/lib/checkin-llm.ts`) only reads/interprets Q8 (red flags, summaries, T2 narrative + next pick from the real catalog) and its output is validated/clamped (`mergeLlmAnalysis`); safety rules are a code-enforced floor the LLM can raise but never lower (migraine ≥ 70, BP ≥ 160/100, red flags → `expertReviewRequired`; urgent kills the next recommendation). T2 deltas use a ±5 deadband ("steady") and direction-aware trends. Timepoint is inferred server-side: no T1 → T1, T1 only → T2 (else 409/`t1_required`). `GET api/checkin?bookingId=` returns ids/timepoints only (data minimisation); staff brief (`summaryForStaff`) and red-flag details are Thai-only by spec (clinic-facing, rendered in the expert workbench via `CheckinBriefPanel`); testimonial reuse is a separate PATCH opt-in. Entry point: `CheckinCard` on `/bookings/[id]`.

### Partners directory (work in progress)

Static partner profiles in `src/data/partners.ts`: 12 `PartnerProfile` entries (every display field is `LText`), but only `hug-samui` is complete and live — 6 are `draftPartner()` stubs. The single route `/partners/[id]` is gated to `hug-samui` in **three places** that must all change to launch another partner: the `partner.id === "hug-samui"` link check in `src/components/landing/TopBrands.tsx`, `generateStaticParams()`, and the runtime `notFound()` guard in `src/app/partners/[id]/page.tsx`. There is no `/partners` index page and no nav/tab entry — the landing `TopBrands` rail is the only way in. Assets follow `public/partners/<id>/logo.png` + `intro.mp4`. `PartnerDetailClient.tsx` has a deliberate video state machine (muted autoplay, tap-to-unmute, mobile scroll auto-pause/resume tracked via refs) — don't simplify it casually. Note: the `partners: string[]` field on packages in `src/data/packages.ts` is plain display strings with **no relationship** to `PartnerProfile`.

### Design rules

Cream/teal/gold palette from `@theme` tokens (plus `sage-*`/`ink-*` families), serif display headings (`font-display`, a plain CSS class in globals.css — h1–h3 get the serif face automatically), mobile-first at 390px with a fixed bottom `MobileTabBar` (5 hardcoded tabs: Home/Assessment/Packages/Favorites/Bookings). No emoji anywhere in the UI. Shared UI primitives in `src/components/ui/` (Button, Logo, ConsentCheckbox, ShareIcons); the package card + tier badge + favorite button + `formatPrice()` live in `src/components/packages/PackageCard.tsx`.

The landing page (`src/app/page.tsx`) is a server component stacking self-contained `"use client"` sections from `src/components/landing/` (Hero → WellnessTypes → TopBrands → TrustStrip → HowItWorks → Pillars → Featured → QuoteBreak → AssessmentTeaser → ClosingCTA); no props flow between them — each reads its own namespace of the landing dictionary. Icon arrays in sections (WellnessTypes, Pillars, HowItWorks) are positionally coupled to the dictionary item arrays: adding/reordering an item means touching the component's icon array and **both** the `th` and `en` arrays together. Horizontal rails rely on the hand-written `no-scrollbar` utility in globals.css.

### Gemini model note

`GEMINI_MODEL` env (set to `gemini-3.5-flash` per project owner's request) overrides the code default `gemini-2.5-flash` in `src/lib/gemini.ts`. If the env model id is rejected by the API the rule-based fallback covers it — don't "fix" the env value without asking.
