"use client";

import Image from "next/image";
import Link from "next/link";
import type { ExpertProfile } from "@/data/experts";
import { useL } from "@/lib/i18n";

export interface ExpertCardLabels {
  verified: string;
  viewProfile: string;
  rating: string;
  years: string;
}

interface ExpertCardProps {
  expert: ExpertProfile;
  labels: ExpertCardLabels;
  categoryLabel: string;
  className?: string;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]?.slice(0, 2) ?? "";
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
}

export function ExpertCard({
  expert,
  labels,
  categoryLabel,
  className = "",
}: ExpertCardProps) {
  const l = useL();
  const name = l(expert.name);
  const initials = initialsFromName(name);

  return (
    <Link
      href={`/experts/${expert.id}`}
      aria-label={`${labels.viewProfile}: ${name}`}
      className={`group flex aspect-[5/6] min-h-[18.5rem] flex-col rounded-[1.1rem] border border-teal-900/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal-700/25 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-4 focus:ring-offset-cream-100 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-teal-900/8 pb-3">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {categoryLabel}
        </span>
        {expert.isVerified && (
          <span className="text-[0.65rem] font-semibold text-teal-700">
            {labels.verified}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col items-center text-center">
        <span className="grid aspect-[4/5] w-[4.75rem] place-items-center overflow-hidden rounded-2xl border border-teal-900/8 bg-cream-100 text-xl font-semibold text-teal-700 md:w-[5.5rem]">
          {expert.image ? (
            <Image
              src={expert.image}
              alt={name}
              width={264}
              height={330}
              sizes="88px"
              className="h-full w-full object-cover"
              style={{ objectPosition: "top center" }}
            />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </span>
        <h3 className="mt-4 text-balance text-lg font-bold leading-tight text-ink md:text-[1.05rem]">
          {name}
        </h3>
        <p className="mt-2 min-h-[2.35rem] text-balance text-[0.8rem] font-semibold leading-snug text-teal-700 md:text-[0.86rem]">
          {l(expert.title)}
        </p>
      </div>

      <p className="mt-4 line-clamp-3 text-center text-[0.8rem] leading-relaxed text-ink-soft md:text-[0.86rem]">
        {l(expert.shortBio)}
      </p>

      <div className="mt-auto border-t border-teal-900/8 pt-4">
        <div className="flex items-center justify-center gap-2 text-[0.72rem] font-medium text-ink-faint">
          <span>{expert.rating.toFixed(1)} {labels.rating}</span>
          <span aria-hidden="true">/</span>
          <span>{expert.yearsExperience}+ {labels.years}</span>
        </div>
        <span className="mt-3 block text-center text-[0.84rem] font-semibold text-teal-700 transition-colors group-hover:text-teal-900">
          {labels.viewProfile}
        </span>
      </div>
    </Link>
  );
}
