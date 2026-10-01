// Baukasten-Item „Logo-Grid" — Sektionskopf + Raster aus Partner-Logos
// (z. B. Exhibition Partner, VIP Programm, Media Partner).

import type { CSSProperties } from "react";

export interface GridLogo {
  src: string;
  name: string; // Partnername — dient als Alt-Text
  href?: string; // optionaler Link zur Partner-Website
  // Optische Vereinheitlichung wie im Logo-Laufband und Partner-Hero:
  // Form-Klasse (Default mix) und Feinabgleich der Größe (1 = neutral).
  variant?: "wortmarke" | "mix" | "wappen";
  scale?: number;
}

// Gleiche Form-Faktoren wie im Logo-Laufband.
const VARIANT_FACTOR: Record<NonNullable<GridLogo["variant"]>, number> = {
  wortmarke: 0.75,
  mix: 1,
  wappen: 1.375,
};

// Jedes Logo steht in einer 3:2-Kachel mit 8 % Innenabstand (Bezug: Kachelbreite).
// Die Feinjustierung ändert nur diesen Innenabstand: kleiner = mehr Rand, größer =
// weniger Rand. Breite und Höhe sind getrennt begrenzt — ein breites Logo darf bis
// an den Seitenrand der Kachel wachsen, ein hohes bis an Ober- und Unterkante, nie
// in die Nachbarkachel. Ungesetzt (Faktor 1) bleibt es bei der Klasse p-[8%].
const INHALT_B = 0.84; // nutzbare Breite bei 8 % Rand links/rechts
const INHALT_H = 2 / 3 - 0.16; // nutzbare Höhe in Kachelbreiten
function feinabstand(logo: GridLogo): CSSProperties | undefined {
  const f = VARIANT_FACTOR[logo.variant ?? "mix"] * (logo.scale ?? 1);
  if (f === 1) return undefined;
  const x = Math.max(0, ((1 - INHALT_B * f) / 2) * 100);
  const y = Math.max(0, ((2 / 3 - INHALT_H * f) / 2) * 100);
  return { padding: `${y.toFixed(2)}% ${x.toFixed(2)}%` };
}

export function LogoGridItem({
  id,
  eyebrow,
  heading,
  logos,
}: {
  id?: string;
  eyebrow?: string; // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  heading: string;
  logos: GridLogo[];
}) {
  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      {eyebrow && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-brand-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[clamp(32px,5vw,88px)] gap-y-[clamp(36px,5vw,72px)] list-none">
        {logos.map((logo) => {
          const tile = (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="w-full aspect-[3/2] object-contain p-[8%] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              style={feinabstand(logo)}
            />
          );
          return (
            <li key={logo.name} className="group">
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.name}>
                  {tile}
                </a>
              ) : (
                tile
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
