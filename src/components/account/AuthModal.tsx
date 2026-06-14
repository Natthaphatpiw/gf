"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useAccount } from "@/lib/account";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useT } from "@/lib/i18n";
import accountDict from "@/lib/i18n/dictionaries/account";

type Mode = "login" | "register";

export function AuthModal() {
  const { authOpen, closeAuth, login, register } = useAccount();
  const t = useT(accountDict).auth;

  const [mode, setMode] = useState<Mode>("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authOpen) return;
    setError(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  const errorText = (key: string | null): string | null => {
    if (!key) return null;
    const errs = t.errors as Record<string, string>;
    return errs[key] ?? t.errors.server_error;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const res =
      mode === "login"
        ? await login(email, password)
        : await register({ firstName, lastName, phone, email, password });
    setLoading(false);
    if (!res.ok) setError(res.error ?? "server_error");
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.close}
        onClick={closeAuth}
        className="absolute inset-0 bg-teal-950/50 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[1.4rem] bg-cream-50 p-6 shadow-deep sm:max-h-[88vh] sm:max-w-md sm:rounded-[1.4rem] md:p-7">
        <button
          type="button"
          aria-label={t.close}
          onClick={closeAuth}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white text-teal-800 shadow-soft transition-colors hover:bg-teal-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-display text-2xl font-semibold text-teal-900">{t.gateTitle}</h2>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-ink-soft">{t.gateIntro}</p>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-cream-200/70 p-1">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`rounded-full py-2 text-[0.82rem] font-semibold transition-colors ${
                mode === m ? "bg-white text-teal-900 shadow-soft" : "text-ink-soft"
              }`}
            >
              {m === "login" ? t.loginTab : t.registerTab}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.firstName} value={firstName} onChange={setFirstName} required autoComplete="given-name" />
              <Field label={t.lastName} value={lastName} onChange={setLastName} required autoComplete="family-name" />
            </div>
          )}
          {mode === "register" && (
            <Field label={t.phone} value={phone} onChange={setPhone} required type="tel" autoComplete="tel" />
          )}
          <Field label={t.email} value={email} onChange={setEmail} required type="email" autoComplete="email" />
          <Field
            label={t.password}
            value={password}
            onChange={setPassword}
            required
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && (
            <p className="rounded-[0.7rem] bg-red-50 px-3 py-2 text-[0.8rem] font-medium text-red-700">
              {errorText(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? t.processing : mode === "login" ? t.login : t.register}
          </button>
        </form>

        <p className="mt-4 text-center text-[0.82rem] text-ink-soft">
          {mode === "login" ? t.noAccount : t.haveAccount}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="font-semibold text-teal-700 hover:text-teal-900"
          >
            {mode === "login" ? t.switchToRegister : t.switchToLogin}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.72rem] font-semibold text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-[0.7rem] border border-teal-900/15 bg-white px-3 py-2.5 text-[0.86rem] text-ink outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
      />
    </label>
  );
}
