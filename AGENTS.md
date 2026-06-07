# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                        # dev server (default port 3000)
npm run build                      # production build — primary verification gate
npx tsc --noEmit --incremental false   # typecheck only (faster than a full build)
```

There is no test suite or linter configured. Verification = `tsc` + `next build` + exercising the flow against a running dev server (all API routes work without any env keys — see Demo mode).

**Never run `next build` while `next dev` is serving** — both write to `.next/` and the dev server wedges (pages still 200 but POST routes hang/return empty). Stop dev first, or restart it after building.

## Architecture

Next.js 15 App Router (params are Promises: `await params` in routes/pages, `use(params)` in client components), React 19, Tailwind CSS v4 (CSS-first: all design tokens live in `@theme` in `src/app/globals.css` — there is no tailwind.config).

### Graceful degradation everywhere (demo mode)

The platform must work with an empty `.env`:

- `src/lib/gemini.ts` — `hasGeminiKey()` gates every LLM call. Both API routes (`api/assessment`, `api/recommend`) compute a deterministic rule-based result first and only then try Gemini; LLM output is validated/clamped against the rule-based result (band reconciliation, archetype-code whitelist). LLM failures must never 500.
- `src/lib/store.ts` — `getSupabase()` returns null without env keys; falls back to in-memory Maps on `globalThis.__gcMemoryDb` (cleared on server restart). All persistence goes through this module's helpers, never direct Supabase calls.

### Bilingual system (strict)

Custom lightweight i18n in `src/lib/i18n/`:

- `LocaleProvider` + `useT(dict)` / `useL()` hooks; per-namespace dictionaries in `src/lib/i18n/dictionaries/*.ts`, each `satisfies Record<Locale, unknown>`.
- Data (packages, questions, archetypes, API responses) carries `LText = { th, en }`; render via `useL()`/`pickL()`.
- **Hard rule: zero hardcoded UI strings in components.** Every string comes from a dictionary or an `LText`. When locale is `en` the rendered page must contain no Thai characters at all (this is verified; English needs singular/plural handling — see `units.day`/`units.days` in `common.ts`).
- SSR renders Thai (default); the real locale applies client-side after hydration from localStorage `gc-locale`.

### Domain flow and state

- **Client session state** lives in localStorage via `src/lib/session.ts` only (profile, goals, favorites, consult flags, family IDs, booking refs, customer info). Helpers dispatch a `gc-session-change` window event that components listen to — use these helpers, not raw localStorage.
- **Assessment** (`/assessment` → `api/assessment`): 14-scene gamified quiz defined in `src/data/questions.ts`. Scoring maps answers → stress/migraine/mental scores + 4 axis letters (Recharge S/L, Pace A/T, Structure P/F, Focus B/M) → one of 16 archetypes in `src/lib/archetypes.ts`. Returns a `WellnessProfile` with id `SW-XXXXXX`.
- **PDPA is enforced in code**: consent must be `true` or APIs return 400; `api/assessment/[id]` returns only `{ id, archetypeName }` (used for family-member lookups — keep it minimal); `supabase/schema.sql` has RLS on all tables (service-role only) and an `anonymize_customer()` erasure function.
- **Recommendation** (`api/recommend` + `recommend-core.ts`): picks exactly 2 Basic / 2 Premium / 2 Deluxe from the 15-package catalog (`src/data/packages.ts`, real Samui businesses only — `catalogForLlm()` produces the compact form for the system prompt). Rule-based scoring uses `presentScore()` (rank decay + per-id jitter) so tied scores don't all show the same match %, and rotating reason templates so the 6 reasons differ.
- **Booking status machine**: `booked → (expert_review if consultRequested) → processing → contacted → completed`, history appended in `status_history`. Expert flow: expert sends guidance (`approved: false`) → customer accepts via PATCH (`customerAccepted: true`) → expert approves (`approved: true`, status → `processing`).
- **Expert console** (`/expert`) auth is a plain access code checked server-side against `EXPERT_ACCESS_CODE` (default `samui-expert`), passed as a header to `api/expert/*` routes.

### Design rules

Cream/teal/gold palette from `@theme` tokens, serif display headings (`font-display`), mobile-first at 390px with a fixed bottom `MobileTabBar`. No emoji anywhere in the UI. Shared UI primitives in `src/components/ui/` (Button, Logo, ConsentCheckbox); the package card + tier badge + favorite button live in `src/components/packages/PackageCard.tsx`.

### Gemini model note

`GEMINI_MODEL` env (set to `gemini-3.5-flash` per project owner's request) overrides the code default `gemini-2.5-flash` in `src/lib/gemini.ts`. If the env model id is rejected by the API the rule-based fallback covers it — don't "fix" the env value without asking.
