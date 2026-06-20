"use client";

import React, { useState, useEffect } from "react";
import { Link2, Check, Share2 } from "lucide-react";

/* ============================================================
 * Social share row — Facebook, LINE, X, Copy Link.
 * Fully functional social share integration.
 * ============================================================ */

interface CircleIconProps {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export type ShareIconLabels = {
  facebook: string;
  line: string;
  x: string;
  copy: string;
  copied: string;
  native: string;
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
}: {
  className?: string;
  labels: ShareIconLabels;
  shareTitle: string;
}) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMobileShareAvailable, setIsMobileShareAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        setIsMobileShareAvailable(true);
      }
    }
  }, []);

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
    if (!shareUrl) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleLineShare = () => {
    if (!shareUrl) return;
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleXShare = () => {
    if (!shareUrl) return;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.share({
        title: shareTitle,
        url: shareUrl,
      });
    } catch (err) {
      console.log("Web share canceled or failed: ", err);
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
      <CircleIcon label={labels.line} onClick={handleLineShare}>
        <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="currentColor" aria-hidden="true">
          <path d="M21.1 9.9c0-3.5-4.1-6.4-9.1-6.4S3 6.4 3 9.9c0 3.1 3.2 5.8 7.6 6.3.3 0 .7.3.8.7l.3 1.8c0 .2.2.4.4.4.2 0 .3 0 .4-.1.1 0 2.2-1.5 3-2.2 3.6-1 5.6-3.7 5.6-6.9zm-11.7 2H8.1V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5h1.8c.3 0 .5-.2.5-.5s-.2-.6-.5-.6zm2.4 0V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5s.5-.2.5-.5zm4.8-2.6H15c-.2 0-.3-.1-.3-.3V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4.5c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5s-.2-.6-.5-.6zm3.3-1.9c0-.3-.2-.5-.5-.5h-2.1c-.3 0-.5.2-.5.5v4.5c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5s-.2-.6-.5-.6h-1.5V11h1.5c.3 0 .5-.2.5-.5s-.2-.6-.5-.6h-1.5V9.1h1.5c.3 0 .5-.2.5-.5z" />
        </svg>
      </CircleIcon>
      <CircleIcon label={labels.x} onClick={handleXShare}>
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor" aria-hidden="true">
          <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.5 3h6.2l4.3 5.7L17.8 3Zm-1 16.2h1.7L7.8 4.7H6L16.7 19.2Z" />
        </svg>
      </CircleIcon>
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
