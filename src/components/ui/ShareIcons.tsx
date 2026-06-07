"use client";

/* ============================================================
 * Social share row — Facebook, Instagram, X.
 * Display-only for now (no live share integration yet), styled
 * as refined monochrome circles.
 * ============================================================ */

function CircleIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-teal-700/25 text-teal-800 transition-all duration-300 hover:border-teal-700 hover:bg-teal-700 hover:text-cream-50"
    >
      {children}
    </button>
  );
}

export function ShareIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CircleIcon label="Facebook">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H8.5v3h2.8v7h2.2Z" />
        </svg>
      </CircleIcon>
      <CircleIcon label="Instagram">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </CircleIcon>
      <CircleIcon label="X">
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor" aria-hidden="true">
          <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.5 3h6.2l4.3 5.7L17.8 3Zm-1 16.2h1.7L7.8 4.7H6L16.7 19.2Z" />
        </svg>
      </CircleIcon>
    </div>
  );
}
