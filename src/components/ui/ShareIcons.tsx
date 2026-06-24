"use client";

import React, { useState, useEffect } from "react";
import { Link2, Check, Instagram, Share2, Download } from "lucide-react";

/* ============================================================
 * Social share row: Facebook, Instagram Story, LINE, Copy Link.
 * Fully functional social share integration.
 * ============================================================ */

interface CircleIconProps {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export type ShareIconLabels = {
  facebook: string;
  instagram: string;
  line: string;
  copy: string;
  copied: string;
  native: string;
  save: string;
};

function CircleIcon({ label, onClick, children }: CircleIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-teal-700/25 text-teal-800 transition-all duration-300 hover:border-teal-700 hover:bg-teal-700 hover:text-cream-50 cursor-pointer shrink-0"
    >
      {children}
    </button>
  );
}

export function ShareIcons({
  className = "",
  labels,
  shareTitle,
  shareText,
  shareUrl,
  shareImageUrl,
}: {
  className?: string;
  labels: ShareIconLabels;
  shareTitle: string;
  shareText?: string;
  shareUrl?: string;
  shareImageUrl?: string;
}) {
  const [resolvedShareUrl, setResolvedShareUrl] = useState(shareUrl ?? "");
  const [copied, setCopied] = useState(false);
  const [isMobileShareAvailable, setIsMobileShareAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setResolvedShareUrl(shareUrl ?? window.location.href);
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        setIsMobileShareAvailable(true);
      }
    }
  }, [shareUrl]);

  const resolvedShareText = shareText ?? shareTitle;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        document.body.removeChild(textarea);
      }
      return ok;
    }
  };

  const handleFacebookShare = () => {
    if (!resolvedShareUrl) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolvedShareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleLineShare = () => {
    if (!resolvedShareUrl) return;
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resolvedShareUrl)}&text=${encodeURIComponent(resolvedShareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareImageFile = async (): Promise<File | null> => {
    if (!shareImageUrl) return null;
    try {
      const response = await fetch(shareImageUrl);
      if (!response.ok) return null;
      const blob = await response.blob();
      const extension = blob.type.includes("jpeg") ? "jpg" : "png";
      return new File([blob], `goodfill-archetype.${extension}`, {
        type: blob.type || "image/png",
      });
    } catch {
      return null;
    }
  };

  const handleInstagramShare = async () => {
    if (!resolvedShareUrl) return;
    const message = `${resolvedShareText}\n${resolvedShareUrl}`;
    const copiedOk = await copyToClipboard(resolvedShareUrl);
    if (copiedOk) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const file = await shareImageFile();
      if (
        file &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: shareTitle,
            text: message,
            files: [file],
          });
          return;
        } catch {
          /* user cancelled or target rejected files - continue to link share */
        }
      }

      try {
        await navigator.share({
          title: shareTitle,
          text: resolvedShareText,
          url: resolvedShareUrl,
        });
        return;
      } catch {
        /* user cancelled or share sheet unavailable - fall through */
      }
    }

    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleDownloadCard = async () => {
    if (!shareImageUrl) return;
    try {
      const res = await fetch(shareImageUrl);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "goodfill-character.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* download blocked — ignore */
    }
  };

  const handleCopyLink = async () => {
    if (!resolvedShareUrl) return;
    const ok = await copyToClipboard(resolvedShareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (!resolvedShareUrl) return;
    try {
      await navigator.share({
        title: shareTitle,
        text: resolvedShareText,
        url: resolvedShareUrl,
      });
    } catch {
      await handleCopyLink();
    }
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <CircleIcon label={labels.facebook} onClick={handleFacebookShare}>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H8.5v3h2.8v7h2.2Z" />
        </svg>
      </CircleIcon>
      <CircleIcon label={labels.instagram} onClick={handleInstagramShare}>
        <Instagram className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </CircleIcon>
      <CircleIcon label={labels.line} onClick={handleLineShare}>
        <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="currentColor" aria-hidden="true">
          <path d="M21.1 9.9c0-3.5-4.1-6.4-9.1-6.4S3 6.4 3 9.9c0 3.1 3.2 5.8 7.6 6.3.3 0 .7.3.8.7l.3 1.8c0 .2.2.4.4.4.2 0 .3 0 .4-.1.1 0 2.2-1.5 3-2.2 3.6-1 5.6-3.7 5.6-6.9zm-11.7 2H8.1V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5h1.8c.3 0 .5-.2.5-.5s-.2-.6-.5-.6zm2.4 0V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5s.5-.2.5-.5zm4.8-2.6H15c-.2 0-.3-.1-.3-.3V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5s-.2-.6-.5-.6zm3.3-1.9c0-.3-.2-.5-.5-.5h-2.1c-.3 0-.5.2-.5.5v4.5c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5s-.2-.6-.5-.6h-1.5V11h1.5c.3 0 .5-.2.5-.5s-.2-.6-.5-.6h-1.5V9.1h1.5c.3 0 .5-.2.5-.5z" />
        </svg>
      </CircleIcon>
      {shareImageUrl && (
        <CircleIcon label={labels.save} onClick={handleDownloadCard}>
          <Download className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </CircleIcon>
      )}
      <CircleIcon label={copied ? labels.copied : labels.copy} onClick={handleCopyLink}>
        {copied ? (
          <Check className="h-[18px] w-[18px] text-emerald-600 animate-scale" strokeWidth={2.2} />
        ) : (
          <Link2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
        )}
      </CircleIcon>
      {isMobileShareAvailable && (
        <CircleIcon label={labels.native} onClick={handleWebShare}>
          <Share2 className="h-[17px] w-[17px]" strokeWidth={1.8} />
        </CircleIcon>
      )}
    </div>
  );
}
