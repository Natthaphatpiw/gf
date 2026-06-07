"use client";

/* ============================================================
 * The 4-letter archetype code rendered as four small framed
 * letters (e.g. L · T · F · B).
 * ============================================================ */

export function CodeLetters({ code }: { code: string }) {
  const letters = code.slice(0, 4).split("");
  return (
    <div className="flex items-center justify-center gap-2">
      {letters.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="grid h-11 w-11 place-items-center rounded-xl border border-teal-700/25 bg-cream-50 font-display text-xl font-bold text-teal-800"
        >
          {ch}
        </span>
      ))}
    </div>
  );
}
