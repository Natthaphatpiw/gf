"use client";

import { useRef, useState } from "react";
import { Download, Link2, Share2, Check } from "lucide-react";
import { useT } from "@/lib/i18n";
import outcomeDict from "@/lib/i18n/dictionaries/outcome";

/* ============================================================
 * OutcomeCard — a self-contained before/after card rendered as
 * SVG so it both displays on-page and exports to a PNG the guest
 * can share (the referral / virality loop). All colours are
 * literal hex (not CSS vars) so the rasterised image is faithful.
 * No medical claims — just the guest's own before/after readings.
 * ============================================================ */

export interface ShareDialRow {
  name: string;
  before: number;
  after: number;
  /** Goodness colour for the "after" bar. */
  color: string;
}

const CW = 1080;
const CH = 1350;

// Palette (literal — must survive rasterisation).
const CREAM = "#f6f1e7";
const CREAM2 = "#ece3cf";
const INK = "#0b312c";
const TEAL = "#1a6b60";
const TEAL_FADE = "#cfe0da";
const GOLD = "#b99355";
const SOFT = "#5b6b66";

export function OutcomeCard({
  guestName,
  programName,
  rows,
  headline,
  refId,
  shareUrl,
}: {
  guestName?: string;
  programName: string;
  rows: ShareDialRow[];
  headline: { dialName: string; magnitude: number; direction: "down" | "up" } | null;
  refId: string;
  shareUrl: string;
}) {
  const o = useT(outcomeDict);
  const t = o.share;
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const renderBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const svg = svgRef.current;
      if (!svg) return resolve(null);
      const xml = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const canvas = document.createElement("canvas");
        canvas.width = CW * scale;
        canvas.height = CH * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          return resolve(null);
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, CW, CH);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `goodfill-journey-${refId}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Defer revoke so the browser has the blob alive when the download starts.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onDownload = async () => {
    setBusy(true);
    try {
      const blob = await renderBlob();
      if (blob) triggerDownload(blob);
    } finally {
      setBusy(false);
    }
  };

  const onShare = async () => {
    setBusy(true);
    try {
      const blob = await renderBlob();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = navigator as any;
      if (blob && typeof nav.canShare === "function") {
        const file = new File([blob], `goodfill-journey-${refId}.png`, {
          type: "image/png",
        });
        if (nav.canShare({ files: [file] })) {
          await nav.share({ files: [file], title: t.cardEyebrow });
          return;
        }
      }
      if (blob) triggerDownload(blob);
    } catch {
      /* user cancelled share — ignore */
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  // Layout maths for the dial rows.
  const barX = 470;
  const barW = 560;
  const rowTop = headline ? 560 : 470;
  const rowH = Math.min(150, (CH - rowTop - 120) / Math.max(rows.length, 1));

  return (
    <div>
      <div className="overflow-hidden rounded-[1.4rem] border border-teal-900/10 shadow-deep">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CW} ${CH}`}
          width={CW}
          height={CH}
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          role="img"
        >
          <rect width={CW} height={CH} fill={CREAM} />
          <rect x={28} y={28} width={CW - 56} height={CH - 56} rx={40} fill="#ffffff" />

          {/* brand */}
          <circle cx={86} cy={104} r={26} fill={TEAL} />
          <path
            d="M86 90 C 74 100, 74 112, 86 120 C 98 112, 98 100, 86 90 Z"
            fill={CREAM}
          />
          <text x={128} y={98} fontSize={34} fontWeight="700" fill={INK} fontFamily="serif">
            Goodfill Care
          </text>
          <text x={128} y={130} fontSize={22} fill={SOFT} fontFamily="sans-serif">
            {t.cardEyebrow}
          </text>

          {/* guest + program */}
          {guestName && (
            <text x={64} y={224} fontSize={56} fontWeight="700" fill={INK} fontFamily="serif">
              {guestName}
            </text>
          )}
          <text x={64} y={guestName ? 280 : 230} fontSize={28} fill={TEAL} fontFamily="sans-serif">
            {t.cardWith} {programName}
          </text>

          {/* headline */}
          {headline && (
            <g>
              <rect x={64} y={328} width={CW - 128} height={170} rx={28} fill={CREAM} />
              <text x={92} y={388} fontSize={26} fill={SOFT} fontFamily="sans-serif">
                {headline.dialName}
              </text>
              <text x={92} y={462} fontSize={84} fontWeight="800" fill={TEAL} fontFamily="serif">
                {headline.direction === "down" ? "−" : "+"}
                {headline.magnitude}
              </text>
              <text x={300} y={462} fontSize={34} fill={SOFT} fontFamily="sans-serif">
                {o.journey.points}
              </text>
            </g>
          )}

          {/* dial rows */}
          {rows.map((r, i) => {
            const y = rowTop + i * rowH;
            const cy = y + rowH / 2;
            const beforeW = Math.max(6, (r.before / 100) * barW);
            const afterW = Math.max(6, (r.after / 100) * barW);
            return (
              <g key={r.name}>
                <text x={64} y={cy - 18} fontSize={26} fontWeight="600" fill={INK} fontFamily="sans-serif">
                  {r.name}
                </text>
                {/* before */}
                <rect x={barX} y={cy - 36} width={barW} height={20} rx={10} fill={CREAM2} />
                <rect x={barX} y={cy - 36} width={beforeW} height={20} rx={10} fill={TEAL_FADE} />
                <text x={barX + barW + 16} y={cy - 20} fontSize={22} fill={SOFT} fontFamily="sans-serif">
                  {r.before}
                </text>
                {/* after */}
                <rect x={barX} y={cy + 6} width={barW} height={20} rx={10} fill={CREAM2} />
                <rect x={barX} y={cy + 6} width={afterW} height={20} rx={10} fill={r.color} />
                <text x={barX + barW + 16} y={cy + 22} fontSize={24} fontWeight="700" fill={INK} fontFamily="sans-serif">
                  {r.after}
                </text>
              </g>
            );
          })}

          {/* before/after legend */}
          <g>
            <rect x={barX} y={rowTop - 44} width={28} height={14} rx={7} fill={TEAL_FADE} />
            <text x={barX + 38} y={rowTop - 32} fontSize={20} fill={SOFT} fontFamily="sans-serif">
              {t.cardBefore}
            </text>
            <rect x={barX + 150} y={rowTop - 44} width={28} height={14} rx={7} fill={TEAL} />
            <text x={barX + 188} y={rowTop - 32} fontSize={20} fill={SOFT} fontFamily="sans-serif">
              {t.cardAfter}
            </text>
          </g>

          {/* footer */}
          <line x1={64} y1={CH - 96} x2={CW - 64} y2={CH - 96} stroke={CREAM2} strokeWidth={2} />
          <text x={64} y={CH - 56} fontSize={22} fill={SOFT} fontFamily="sans-serif">
            goodfill.care
          </text>
          <text x={CW - 64} y={CH - 56} fontSize={22} fill={GOLD} fontFamily="sans-serif" textAnchor="end">
            {refId}
          </text>
        </svg>
      </div>

      {/* actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-[0.84rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {t.download}
        </button>
        <button
          type="button"
          onClick={onShare}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 px-5 py-2.5 text-[0.84rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50 disabled:opacity-60"
        >
          <Share2 className="h-4 w-4" />
          {t.share}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 px-5 py-2.5 text-[0.84rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50"
        >
          {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Link2 className="h-4 w-4" />}
          {copied ? t.copied : t.copyLink}
        </button>
      </div>
    </div>
  );
}
