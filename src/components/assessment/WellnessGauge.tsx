"use client";

/* ============================================================
 * WellnessGauge — custom SVG semicircle gauge with a needle.
 * The arc fills proportionally to `value` (0-100) and is
 * coloured by band. For "mental" the colour logic is inverted
 * (high = flourishing = calm/teal) — the caller passes the
 * already-resolved `color`.
 * ============================================================ */

const HIGH_COLOR = "#bf6b4f"; // warm terracotta — used inline by callers

export const GAUGE_COLORS = {
  calm: "var(--color-teal-500)",
  moderate: "var(--color-gold-500)",
  high: HIGH_COLOR,
} as const;

export function WellnessGauge({
  value,
  color,
  label,
}: {
  /** 0-100 */
  value: number;
  /** Resolved arc/needle colour. */
  color: string;
  /** Accessible label, e.g. "Stress level". */
  label: string;
}) {
  const v = Math.max(0, Math.min(100, value));

  // Geometry: a 180deg arc from left (180deg) to right (0deg).
  const cx = 100;
  const cy = 100;
  const r = 78;
  const stroke = 14;

  // Semicircle path (left -> right, over the top).
  const startX = cx - r;
  const endX = cx + r;
  const trackPath = `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`;

  // Arc length of a semicircle and the dash for the filled portion.
  const semi = Math.PI * r;
  const filled = (v / 100) * semi;

  // Needle angle: 180deg (left) at 0 -> 0deg (right) at 100.
  const angle = Math.PI - (v / 100) * Math.PI;
  const needleLen = r - 6;
  const nx = cx + needleLen * Math.cos(angle);
  const ny = cy - needleLen * Math.sin(angle);

  return (
    <svg
      viewBox="0 0 200 116"
      className="w-full"
      role="img"
      aria-label={`${label}: ${Math.round(v)} out of 100`}
    >
      {/* track */}
      <path
        d={trackPath}
        fill="none"
        stroke="var(--color-teal-100)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* filled arc */}
      <path
        d={trackPath}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${semi}`}
        style={{ transition: "stroke-dasharray 0.9s var(--ease-gentle)" }}
      />
      {/* needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        style={{ transition: "all 0.9s var(--ease-gentle)" }}
      />
      <circle cx={cx} cy={cy} r={7} fill={color} />
      <circle cx={cx} cy={cy} r={3} fill="var(--color-cream-50)" />
    </svg>
  );
}
