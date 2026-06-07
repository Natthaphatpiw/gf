import Link from "next/link";

/* ============================================================
 * Brand mark — a hand-drawn leaf within a circle, plus wordmark.
 * ============================================================ */

export function LeafMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="18.5"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.45"
      />
      <path
        d="M27.5 11.5C20 13 14.5 18 13.2 27.2c7.6-.6 13.4-5.4 14.6-13.4.1-.8-.1-1.7-.3-2.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13.6 26.8C17 21.5 21.5 17.4 26.6 13.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function Logo({ sub }: { sub: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-teal-800">
      <LeafMark className="h-9 w-9 shrink-0" />
      <span className="leading-none">
        <span className="font-display block text-lg font-semibold tracking-wide">
          Goodfill Care
        </span>
        <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.28em] text-gold-600">
          {sub}
        </span>
      </span>
    </Link>
  );
}
