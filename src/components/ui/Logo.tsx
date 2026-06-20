import Link from "next/link";

/* ============================================================
 * Brand mark — using the new spiral logo icon.
 * Supports both color (default) and white variants.
 * ============================================================ */

export function LeafMark({
  className = "h-9 w-9",
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white";
}) {
  const src = variant === "white" ? "/images/logo-icon-white.png" : "/images/logo-icon.png";
  return (
    <div className={`relative ${className} flex items-center justify-center`} aria-hidden="true">
      <img
        src={src}
        alt="Goodfill Care Logo Icon"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export function Logo({ sub }: { sub: string }) {
  return (
    <Link href="/" className="flex items-center" aria-label={`Goodfill Care ${sub}`}>
      <img
        src="/images/logo.png"
        alt="Goodfill Care"
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}
