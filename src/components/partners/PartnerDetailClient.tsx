"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Pause,
  Play,
  Sparkles,
  UtensilsCrossed,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { PartnerProfile } from "@/data/partners";
import { useL, useT } from "@/lib/i18n";
import partnersDict from "@/lib/i18n/dictionaries/partners";
import { PartnerGalleryRail } from "@/components/partners/PartnerGalleryRail";

export function PartnerDetailClient({ partner }: { partner: PartnerProfile }) {
  const t = useT(partnersDict);
  const l = useL();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUserRef = useRef(false);
  const autoPausedByScrollRef = useRef(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  const playVideo = useCallback(async (unmute = true) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !unmute;
    setMuted(video.muted);
    try {
      await video.play();
      setPaused(false);
      setPlayBlocked(false);
    } catch {
      setPaused(true);
      setPlayBlocked(true);
    }
  }, []);

  const pauseVideo = useCallback((byUser: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    if (byUser) {
      pausedByUserRef.current = true;
    }
    video.pause();
    setPaused(true);
    setPlayBlocked(false);
  }, []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUserRef.current = false;
      void playVideo();
      return;
    }

    pauseVideo(true);
  }, [pauseVideo, playVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      setPaused(video.paused);
      setMuted(video.muted);
    };

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("volumechange", sync);
    video.muted = true;
    setMuted(true);
    void playVideo(false);

    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
      video.removeEventListener("volumechange", sync);
    };
  }, [playVideo]);

  useEffect(() => {
    const update = () => {
      const video = videoRef.current;
      if (!video) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (!isMobile) {
        autoPausedByScrollRef.current = false;
        return;
      }

      const shouldPauseForScroll = window.scrollY > 72;
      if (shouldPauseForScroll) {
        autoPausedByScrollRef.current = true;
        video.pause();
        video.muted = true;
        setPaused(true);
        setMuted(true);
        setPlayBlocked(false);
        return;
      }

      if (autoPausedByScrollRef.current) {
        autoPausedByScrollRef.current = false;
        if (!pausedByUserRef.current) {
          void playVideo(false);
        }
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [playVideo]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const handleVideoSurfaceClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("button")) return;
      event.preventDefault();
      const video = videoRef.current;
      if (!video) return;
      pausedByUserRef.current = false;
      void playVideo(true);
    },
    [playVideo],
  );

  return (
    <article className="bg-cream-50">
      <section className="bg-white md:bg-cream-50">
        <div className="md:mx-auto md:grid md:max-w-6xl md:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] md:gap-12 md:px-6 md:py-12">
          <div className="relative z-10 w-full md:sticky md:top-20 md:self-start md:rounded-[2rem] md:bg-white md:p-4 md:shadow-lift">
            <div className="relative h-[calc(100svh-4rem)] cursor-pointer overflow-hidden rounded-none bg-black shadow-deep md:mx-auto md:aspect-[9/16] md:h-auto md:max-h-[calc(100svh-8rem)] md:w-auto md:rounded-[1.6rem]">
              {partner.video && (
                <video
                  ref={videoRef}
                  src={partner.video}
                  className="h-full w-full object-cover"
                  autoPlay
                  playsInline
                  loop
                  muted
                  preload="metadata"
                />
              )}

              <div
                aria-hidden="true"
                onClick={handleVideoSurfaceClick}
                className="absolute inset-0 z-10"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

              <div className="absolute right-3 top-3 z-20 flex gap-2">
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={paused ? t.videoPlay : t.videoPause}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/92 text-teal-800 shadow-soft backdrop-blur transition-colors hover:bg-white"
                >
                  {paused ? (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  ) : (
                    <Pause className="h-5 w-5 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? t.videoUnmute : t.videoMute}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/92 text-teal-800 shadow-soft backdrop-blur transition-colors hover:bg-white"
                >
                  {muted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              </div>

              {(paused || playBlocked) && (
                <button
                  type="button"
                  onClick={() => playVideo(true)}
                  aria-label={t.videoPlay}
                  className="absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-teal-800 shadow-deep transition-transform hover:scale-105"
                >
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </button>
              )}
            </div>
          </div>

          <div className="px-4 py-8 md:px-0 md:py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.back}
            </Link>

            <header className="mt-8">
              <div className="flex items-center gap-4">
                {partner.logo && (
                  <Image
                    src={partner.logo}
                    alt={l(partner.name)}
                    width={76}
                    height={76}
                    className="h-16 w-16 rounded-full border border-white bg-white object-cover shadow-soft"
                  />
                )}
                <div>
                  <p className="eyebrow">{t.partnerLabel}</p>
                  <p className="mt-1 text-sm font-medium text-ink-soft">
                    {l(partner.category)}
                  </p>
                </div>
              </div>

              <h1 className="mt-7 font-display text-5xl font-semibold leading-none text-teal-900 md:text-6xl">
                {l(partner.name)}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
                {l(partner.summary)}
              </p>
            </header>

            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-teal-900/10 bg-white px-4 py-3 shadow-soft">
              <MapPin className="h-5 w-5 flex-none text-gold-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {t.location}
                </p>
                <p className="text-sm font-semibold text-ink">
                  {l(partner.location)}
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-3xl font-semibold text-teal-900">
                {t.about}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                {l(partner.story)}
              </p>
            </section>

            {(partner.serviceHref || partner.menuHref) && (
              <section className="mt-10">
                <p className="eyebrow">{t.exploreEyebrow}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {partner.serviceHref && (
                    <ExploreTile
                      href={partner.serviceHref}
                      icon={Sparkles}
                      title={t.exploreServicesTitle}
                      subtitle={t.exploreServicesSub}
                    />
                  )}
                  {partner.menuHref && (
                    <ExploreTile
                      href={partner.menuHref}
                      icon={UtensilsCrossed}
                      title={t.exploreMenusTitle}
                      subtitle={t.exploreMenusSub}
                      featured
                    />
                  )}
                </div>
              </section>
            )}

            {partner.gallery && <PartnerGalleryRail images={partner.gallery} />}

            {partner.services.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-3xl font-semibold text-teal-900">
                  {t.services}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {partner.services.map((service) => (
                    <span
                      key={service.en}
                      className="rounded-full border border-teal-700/15 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-soft"
                    >
                      {l(service)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {partner.highlights.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-3xl font-semibold text-teal-900">
                  {t.highlights}
                </h2>
                <div className="mt-4 space-y-3">
                  {partner.highlights.map((item) => (
                    <div key={item.en} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-gold-600" />
                      <p className="leading-relaxed text-ink-soft">{l(item)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {partner.visitNotes.length > 0 && (
              <section className="mt-10 rounded-2xl border border-gold-200 bg-gold-100/55 p-5">
                <h2 className="font-display text-2xl font-semibold text-teal-900">
                  {t.notes}
                </h2>
                <div className="mt-3 space-y-2">
                  {partner.visitNotes.map((item) => (
                    <p key={item.en} className="text-sm leading-relaxed text-ink-soft">
                      {l(item)}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}

function ExploreTile({
  href,
  icon: Icon,
  title,
  subtitle,
  featured = false,
}: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-2xl border p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-5 ${
        featured
          ? "border-gold-400/60 bg-gold-100/40 hover:border-gold-400"
          : "border-teal-900/10 bg-white hover:border-teal-700/30"
      }`}
    >
      <span
        className={`grid h-12 w-12 flex-none place-items-center rounded-xl ${
          featured ? "bg-gold-500/15 text-gold-600" : "bg-teal-50 text-teal-700"
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold leading-tight text-teal-900">
          {title}
        </p>
        <p className="mt-0.5 text-[0.82rem] leading-snug text-ink-soft">
          {subtitle}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 flex-none text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-teal-700" />
    </Link>
  );
}
