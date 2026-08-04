"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "../lib/assets";

// Header-Animation (Custom-Item, „einmal entwickelt"): ein fertig gerendertes
// Hero-Video mit einkomponierten Messefotos — Desktop 16:9, mobil Hochformat.
// Bei prefers-reduced-motion bleibt das Posterbild stehen. Die Partnerzeile
// (HEADLINE PARTNER / NATIONAL-BANK) liegt als HTML-Overlay darüber.
//
// Nicht als Riegel editierbar — fixes Anzeige-Bauteil. `assetBase` löst die
// (im Website-public liegenden) Video-/Bildpfade auf: leer = lokal (AD27),
// Website-Adresse = wenn ein anderer Konsument (Webby) es rendert.
const DESKTOP = {
  src: "/videos/AD27_Header_Embedded_Desktop.mp4",
  poster: "/images/home/ad-hero-poster.jpg",
};
const MOBILE = {
  src: "/videos/AD27_Header_Embedded_Mobil.mp4",
  poster: "/images/home/ad-hero-poster-mobil.jpg",
};
const PARTNER_LOGO = "/images/partners/logos/national-bank-white.svg";

export default function HeaderAnimation({ assetBase = "" }: { assetBase?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mobileMedia = window.matchMedia("(max-width: 768px)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateSrc = () => {
      setIsMobile(mobileMedia.matches);
      const target = mobileMedia.matches ? MOBILE : DESKTOP;
      const src = withBase(target.src, assetBase);
      video.poster = withBase(target.poster, assetBase);

      // Bewegung reduziert: Video gar nicht erst laden — das Poster steht.
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
      video.src = src;
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
  }, [assetBase]);

  return (
    <section
      className={`relative w-full overflow-hidden bg-black ${
        isMobile ? "aspect-[1080/1500]" : "aspect-video"
      }`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        poster={withBase(DESKTOP.poster, assetBase)}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-[clamp(110px,14vw,200px)] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-[var(--page-x)] pt-[clamp(18px,2.2vw,42px)] pointer-events-none">
        <span className="text-white text-[clamp(18px,1.78vw,33px)] leading-none tracking-[0.04em] uppercase [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
          Headline Partner
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase(PARTNER_LOGO, assetBase)}
          alt="NATIONAL-BANK"
          className="h-[clamp(30px,3.13vw,58px)] w-auto"
          style={{ filter: "drop-shadow(0 1px 10px rgba(0,0,0,0.45))" }}
        />
      </div>
    </section>
  );
}
