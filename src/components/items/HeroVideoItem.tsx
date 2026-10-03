"use client";

import { useEffect, useRef, useState } from "react";

// Kopf-Video — fertig geschnittenes Video in voller Breite: Desktop 16:9, unter
// 768 px ein eigener Hochformat-Schnitt (falls gepflegt). Bei
// prefers-reduced-motion bleibt das Standbild stehen. Optional liegt oben eine
// Partnerzeile (Text links, Logo rechts, weiß auf dunklem Verlauf) als
// HTML-Overlay darüber. Trägt keine H1 — die Seite braucht ihre Überschrift
// weiter unten.
//
// Herkunft: die feste HeaderAnimation der art.fair-Startseite, Verhalten und
// Markup 1:1, nur dass Videos, Standbilder und Partnerzeile jetzt Daten sind.

export function HeroVideoItem({
  id,
  videoSrc,
  videoSrcMobile,
  poster,
  posterMobile,
  partnerLabel,
  partnerLogo,
}: {
  id?: string;
  videoSrc?: string;
  /** Eigener Hochformat-Schnitt unter 768 px; ohne ihn läuft das Desktop-Video weiter. */
  videoSrcMobile?: string;
  poster?: string;
  posterMobile?: string;
  partnerLabel?: string;
  partnerLogo?: { src: string; alt: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const desktop = { src: videoSrc, poster };
    const mobil = videoSrcMobile ? { src: videoSrcMobile, poster: posterMobile || poster } : null;
    const mobileMedia = window.matchMedia("(max-width: 768px)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateSrc = () => {
      const istMobil = mobileMedia.matches && !!mobil;
      setIsMobile(istMobil);
      const target = istMobil && mobil ? mobil : desktop;
      if (target.poster) video.poster = target.poster;
      if (!target.src) return;

      // Bewegung reduziert: Video gar nicht erst laden — das Standbild steht.
      if (motionMedia.matches) {
        video.pause();
        return;
      }

      const tryPlay = () => {
        video.play().catch(() => {
          /* Safari Low Power Mode / user-gesture rejection — fine to ignore */
        });
      };

      if (video.src.endsWith(target.src)) {
        tryPlay();
        return;
      }

      const onCanPlay = () => tryPlay();
      video.addEventListener("canplay", onCanPlay, { once: true });
      video.addEventListener("loadeddata", onCanPlay, { once: true });
      video.src = target.src;
      video.load();
    };

    updateSrc();
    mobileMedia.addEventListener("change", updateSrc);
    motionMedia.addEventListener("change", updateSrc);
    window.addEventListener("resize", updateSrc);
    document.addEventListener("visibilitychange", updateSrc);
    return () => {
      mobileMedia.removeEventListener("change", updateSrc);
      motionMedia.removeEventListener("change", updateSrc);
      window.removeEventListener("resize", updateSrc);
      document.removeEventListener("visibilitychange", updateSrc);
    };
  }, [videoSrc, videoSrcMobile, poster, posterMobile]);

  const partnerzeile = !!(partnerLabel || partnerLogo);

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden bg-black ${
        isMobile ? "aspect-[1080/1500]" : "aspect-video"
      }`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {partnerzeile && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-[clamp(110px,14vw,200px)] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between px-[var(--page-x)] pt-[clamp(18px,2.2vw,42px)] pointer-events-none">
            <span className="text-white text-[clamp(18px,1.78vw,33px)] leading-none tracking-[0.04em] uppercase [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
              {partnerLabel}
            </span>
            {partnerLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partnerLogo.src}
                alt={partnerLogo.alt}
                className="h-[clamp(30px,3.13vw,58px)] w-auto"
                style={{ filter: "drop-shadow(0 1px 10px rgba(0,0,0,0.45))" }}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}
