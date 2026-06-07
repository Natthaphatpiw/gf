"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { WellnessPackage } from "@/lib/types";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import booking from "@/lib/i18n/dictionaries/booking";
import {
  addBookingRef,
  getFamilyIds,
  getStoredCustomer,
  getStoredProfile,
  hasConsultFlag,
  storeCustomer,
  storeFamilyIds,
  toggleConsultFlag,
} from "@/lib/session";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { PackageSummary } from "@/components/booking/PackageSummary";
import { Field } from "@/components/booking/Field";

/* ============================================================
 * BookingForm — registration + booking, with a full-page calm
 * success screen on completion.
 * ============================================================ */

const ID_RE = /^SW-[A-Z0-9]{4,8}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MemberRow {
  label: string;
  assessmentId: string;
  /** undefined = untouched, true = found, false = not found */
  valid?: boolean;
}

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

export function BookingForm({ pkg }: { pkg: WellnessPackage }) {
  const t = useT(booking);
  const tc = useT(common);

  // contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // assessment + consult
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [consult, setConsult] = useState(false);

  // family
  const [isFamily, setIsFamily] = useState(false);
  const [familySize, setFamilySize] = useState(2);
  const [members, setMembers] = useState<MemberRow[]>([]);

  // pdpa + flow
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // ----- prefill from session -----
  useEffect(() => {
    const c = getStoredCustomer();
    if (c) {
      setFirstName(c.firstName);
      setLastName(c.lastName);
      setPhone(c.phone);
      setEmail(c.email);
    }
    const profile = getStoredProfile();
    if (profile?.id) setAssessmentId(profile.id);
    setConsult(hasConsultFlag(pkg.id));
  }, [pkg.id]);

  // ----- keep member rows length in sync with familySize -----
  useEffect(() => {
    if (!isFamily) return;
    const needed = Math.max(0, familySize - 1); // booker excluded
    setMembers((prev) => {
      if (prev.length === needed) return prev;
      if (prev.length < needed) {
        const stored = getFamilyIds();
        const next = [...prev];
        while (next.length < needed) {
          const i = next.length;
          next.push({ label: "", assessmentId: stored[i] ?? "" });
        }
        return next;
      }
      return prev.slice(0, needed);
    });
  }, [isFamily, familySize]);

  // ----- validation -----
  const phoneDigits = digits(phone);
  const errs = {
    firstName: firstName.trim() ? "" : t.errors.firstName,
    lastName: lastName.trim() ? "" : t.errors.lastName,
    phone:
      phoneDigits.length >= 9 && phoneDigits.length <= 10 ? "" : t.errors.phone,
    email: EMAIL_RE.test(email.trim()) ? "" : t.errors.email,
  };

  const memberIdErrors = members.map((m) => {
    const v = m.assessmentId.trim();
    if (!v) return "";
    if (!ID_RE.test(v)) return t.errors.memberId;
    if (m.valid === false) return t.errors.memberNotFound;
    return "";
  });

  const show = (k: string) => (touched[k] || attempted) ?? false;

  const formValid =
    !errs.firstName &&
    !errs.lastName &&
    !errs.phone &&
    !errs.email &&
    memberIdErrors.every((e) => !e) &&
    consent;

  // ----- validate a member assessment id against the API -----
  async function checkMember(index: number) {
    const m = members[index];
    const v = m.assessmentId.trim().toUpperCase();
    if (!v || !ID_RE.test(v)) return;
    try {
      const res = await fetch(`/api/assessment/${encodeURIComponent(v)}`);
      setMembers((prev) => {
        const next = [...prev];
        if (next[index]) next[index] = { ...next[index], valid: res.ok };
        return next;
      });
    } catch {
      /* network — leave undefined, treated as optional */
    }
  }

  function updateMember(index: number, patch: Partial<MemberRow>) {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function toggleConsult() {
    setConsult((c) => !c);
    toggleConsultFlag(pkg.id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setSubmitError(null);
    if (!formValid) return;

    setSubmitting(true);
    const customer = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    };
    const familyMembers = isFamily
      ? members
          .filter((m) => m.assessmentId.trim() || m.label.trim())
          .map((m) => ({
            assessmentId: m.assessmentId.trim().toUpperCase(),
            label: m.label.trim() || undefined,
          }))
      : undefined;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          customer,
          assessmentId: assessmentId ?? undefined,
          isFamily,
          familySize: isFamily ? familySize : undefined,
          familyMembers,
          consultRequested: consult,
          consent,
        }),
      });
      if (!res.ok) throw new Error("create failed");
      const data = (await res.json()) as { booking: { id: string } };

      // persist for the guest's next visit
      storeCustomer(customer);
      addBookingRef({
        bookingId: data.booking.id,
        packageId: pkg.id,
        email: customer.email,
        createdAt: new Date().toISOString(),
      });
      if (isFamily && familyMembers) {
        storeFamilyIds(familyMembers.map((m) => m.assessmentId).filter(Boolean));
      }
      setBookingId(data.booking.id);
    } catch {
      setSubmitError(t.errors.submit);
    } finally {
      setSubmitting(false);
    }
  }

  // ----- success screen -----
  if (bookingId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center md:py-24">
        <div className="animate-rise grid h-28 w-28 place-items-center rounded-full bg-gold-100 ring-1 ring-gold-400/40">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-cream-50">
            <CheckCircle2 className="h-10 w-10 text-gold-500" />
          </div>
        </div>
        <p className="eyebrow animate-rise-1 mt-7">{t.success.eyebrow}</p>
        <h1 className="font-display animate-rise-1 mt-2 text-3xl font-semibold text-teal-900">
          {t.success.title}
        </h1>
        <div className="animate-rise-2 mt-7 w-full rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
            {t.success.refLabel}
          </p>
          <p className="font-display mt-1.5 text-3xl font-bold tracking-wide text-teal-800">
            {bookingId}
          </p>
        </div>
        <p className="animate-rise-2 mt-6 text-sm leading-relaxed text-ink-soft">
          {t.success.message}
        </p>
        {consult && (
          <p className="animate-rise-2 mt-3 rounded-2xl bg-gold-100/70 px-4 py-3 text-xs leading-relaxed text-gold-600">
            {t.success.consultNote}
          </p>
        )}
        <div className="animate-rise-3 mt-8 flex w-full flex-col gap-3">
          <ButtonLink href={`/bookings/${bookingId}`} size="lg">
            {t.success.track}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            {t.success.home}
          </ButtonLink>
        </div>
      </div>
    );
  }

  // ----- registration form -----
  return (
    <div className="mx-auto max-w-xl px-5 pt-8 md:pt-12">
      <header className="animate-rise">
        <p className="eyebrow">{t.register.eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold leading-tight text-teal-900 md:text-4xl">
          {t.register.title}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
          {t.register.subtitle}
        </p>
      </header>

      {/* package summary + consult toggle */}
      <section className="animate-rise-1 mt-7">
        <p className="eyebrow mb-2.5 text-ink-faint">
          {t.register.summaryTitle}
        </p>
        <PackageSummary pkg={pkg}>
          <button
            type="button"
            onClick={toggleConsult}
            aria-pressed={consult}
            className={`mt-3 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
              consult
                ? "border-teal-600/40 bg-teal-50"
                : "border-teal-900/10 bg-cream-50 hover:border-teal-600/30"
            }`}
          >
            <ShieldCheck
              className={`h-5 w-5 shrink-0 ${
                consult ? "text-teal-600" : "text-ink-faint"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-teal-900">
                {t.register.consultPill}
              </span>
              <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-ink-faint">
                {t.register.consultHint}
              </span>
            </span>
            <span
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                consult ? "bg-teal-600" : "bg-teal-900/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-soft transition-transform ${
                  consult ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        </PackageSummary>
      </section>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
        {/* contact details */}
        <section className="animate-rise-2 space-y-4 rounded-3xl border border-teal-900/10 bg-white p-5 shadow-soft md:p-6">
          <p className="eyebrow text-ink-faint">{t.register.sectionContact}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t.register.firstName}
              placeholder={t.register.firstNamePlaceholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
              error={show("firstName") ? errs.firstName : undefined}
              autoComplete="given-name"
            />
            <Field
              label={t.register.lastName}
              placeholder={t.register.lastNamePlaceholder}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
              error={show("lastName") ? errs.lastName : undefined}
              autoComplete="family-name"
            />
          </div>
          <Field
            label={t.register.phone}
            type="tel"
            inputMode="tel"
            placeholder={t.register.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
            error={show("phone") ? errs.phone : undefined}
            autoComplete="tel"
          />
          <Field
            label={t.register.email}
            type="email"
            inputMode="email"
            placeholder={t.register.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            error={show("email") ? errs.email : undefined}
            autoComplete="email"
          />
          {assessmentId && (
            <p className="flex items-center gap-1.5 text-[0.7rem] text-ink-faint">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
              {t.register.linkedAssessment}{" "}
              <span className="font-semibold tracking-wide text-teal-700">
                {assessmentId}
              </span>
            </p>
          )}
        </section>

        {/* family group */}
        <section className="animate-rise-2 rounded-3xl border border-teal-900/10 bg-white p-5 shadow-soft md:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={isFamily}
              onChange={(e) => setIsFamily(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-teal-700"
            />
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-teal-900">
                <Users className="h-4 w-4 text-teal-600" />
                {t.register.familyToggle}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                {t.register.familyHint}
              </span>
            </span>
          </label>

          {isFamily && (
            <div className="animate-fade mt-5 space-y-5 border-t border-teal-900/10 pt-5">
              {/* stepper */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t.register.familySize}
                  </p>
                  <p className="text-[0.7rem] text-ink-faint">
                    {t.register.familySizeNote}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="decrease"
                    disabled={familySize <= 2}
                    onClick={() => setFamilySize((n) => Math.max(2, n - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full border border-teal-900/15 text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-display w-8 text-center text-xl font-bold text-teal-800">
                    {familySize}
                  </span>
                  <button
                    type="button"
                    aria-label="increase"
                    disabled={familySize >= 8}
                    onClick={() => setFamilySize((n) => Math.min(8, n + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full border border-teal-900/15 text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* member rows */}
              {members.length > 0 && (
                <div className="space-y-4">
                  <p className="eyebrow text-ink-faint">
                    {t.register.memberHeading}
                  </p>
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="space-y-3 rounded-2xl bg-cream-50 p-4"
                    >
                      <p className="text-[0.7rem] font-semibold tracking-wide text-ink-faint">
                        {i + 2}
                      </p>
                      <Field
                        label={t.register.memberLabel}
                        placeholder={t.register.memberLabelPlaceholder}
                        value={m.label}
                        onChange={(e) =>
                          updateMember(i, { label: e.target.value })
                        }
                      />
                      <div>
                        <Field
                          label={`${t.register.memberAssessmentId} (${t.register.memberIdOptional})`}
                          placeholder={t.register.memberIdPlaceholder}
                          value={m.assessmentId}
                          onChange={(e) =>
                            updateMember(i, {
                              assessmentId: e.target.value,
                              valid: undefined,
                            })
                          }
                          onBlur={() => checkMember(i)}
                          error={memberIdErrors[i] || undefined}
                          autoCapitalize="characters"
                        />
                        {m.valid === true && !memberIdErrors[i] && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] font-medium text-teal-600">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {t.register.memberIdValid}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* consent */}
        <div className="animate-rise-3">
          <ConsentCheckbox checked={consent} onChange={setConsent} />
          {attempted && !consent && (
            <p className="mt-1.5 text-[0.7rem] font-medium text-gold-600">
              {tc.pdpa.required}
            </p>
          )}
        </div>

        {submitError && (
          <p className="rounded-2xl bg-gold-100/70 px-4 py-3 text-xs font-medium text-gold-600">
            {submitError}
          </p>
        )}

        {/* sticky submit — clears the mobile tab bar */}
        <div className="sticky bottom-20 z-10 -mx-5 mb-2 border-t border-teal-900/10 bg-cream-100/85 px-5 py-4 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:pb-10">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.register.submitting}
              </>
            ) : (
              <>
                {t.register.submit}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
