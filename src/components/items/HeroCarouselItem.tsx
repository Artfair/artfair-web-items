"use client";

import { useEffect, useRef, useState } from "react";

// Baukasten-Item „Bildkarussell" — ganzflächige Bilder, die einander ablösen.
// KEIN Text, keine Knöpfe, kein Scrim.
//
// Bewusst kein zweiter Hero: `heroStage` trägt die H1 und braucht einen Titel.
// Dieses Bauteil ist für Messen, deren Auftakt allein aus Bildern besteht.
// Wer eine Überschrift hat, nimmt `heroStage` — wer keine hat, soll hier keine
// erfinden müssen.
//
// Folge daraus: Eine Seite, die mit diesem Item beginnt, hat hier keine H1.
// Sie muss eine weiter unten tragen — sonst steht die Seite ohne Überschrift
// da. Das prüft das Bauteil nicht; es ist eine redaktionelle Pflicht.

export interface CarouselImage {
  src: string;
  /** Leerer Alt-Text ist zulässig und richtig, wenn das Bild rein schmückend ist. */
  alt: string;
}

export function HeroCarouselItem({
  id,
  images,
  intervalMs = 5000,
}: {
  id?: string;
  images: CarouselImage[];
  /** Wechseltakt. 0 schaltet den automatischen Wechsel ab. */
  intervalMs?: number;
}) {
  const [aktiv, setAktiv] = useState(0);
  const [laeuft, setLaeuft] = useState(true);
  const zeitgeber = useRef<ReturnType<typeof setInterval> | null>(null);

  // Wer weniger Bewegung wünscht, bekommt keinen automatischen Wechsel —
  // die Punkte bleiben, das Blättern von Hand also möglich.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const abfrage = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setzen = () => setLaeuft(!abfrage.matches);
    setzen();
    abfrage.addEventListener("change", setzen);
    return () => abfrage.removeEventListener("change", setzen);
  }, []);

  useEffect(() => {
    if (!laeuft || intervalMs <= 0 || images.length < 2) return;
    zeitgeber.current = setInterval(
      () => setAktiv((n) => (n + 1) % images.length),
      intervalMs,
    );
    return () => {
      if (zeitgeber.current) clearInterval(zeitgeber.current);
    };
  }, [laeuft, intervalMs, images.length]);

  if (!images.length) return null;

  // Ein einzelnes Bild braucht weder Punkte noch Zeitgeber.
  const einzeln = images.length === 1;

  return (
    <section
      id={id}
      className="relative h-[clamp(520px,43vw,620px)] bg-brand-ink overflow-hidden"
      aria-roledescription={einzeln ? undefined : "Karussell"}
      onMouseEnter={() => setLaeuft(false)}
      onMouseLeave={() => setLaeuft(true)}
    >
      {images.map((bild, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={bild.src}
          src={bild.src}
          alt={bild.alt}
          fetchPriority={i === 0 ? "high" : "low"}
          aria-hidden={i === aktiv ? undefined : true}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            i === aktiv ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {!einzeln && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2.5 pb-[clamp(20px,2vw,30px)]">
          {images.map((bild, i) => (
            <button
              key={bild.src}
              type="button"
              onClick={() => setAktiv(i)}
              aria-current={i === aktiv ? "true" : undefined}
              aria-label={`Bild ${i + 1} von ${images.length}`}
              className={`h-2 w-2 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                i === aktiv ? "bg-white" : "bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
