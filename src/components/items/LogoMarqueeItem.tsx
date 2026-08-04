// Baukasten-Item „Logo-Laufband" — Überschrift + endlos laufende Reihe von
// Partner-Logos, oben/unten mit Hairline. 1:1 aus der Startseite herausgelöst.

export interface MarqueeLogo {
  src: string;
  alt: string;
}

export function LogoMarqueeItem({
  headline,
  logos,
}: {
  headline: string;
  logos: MarqueeLogo[];
}) {
  if (logos.length === 0) return null;
  // Reihe auffüllen und verdoppeln für eine lückenlose Schleife.
  const base: MarqueeLogo[] = [];
  while (base.length < 8) base.push(...logos);
  const loop = [...base, ...base];

  return (
    <section className="py-[clamp(40px,5vw,80px)] border-t border-b border-artdus-line overflow-hidden">
      <div className="text-xs tracking-[0.12em] uppercase text-artdus-black px-[var(--page-x)] mb-[clamp(22px,3vw,36px)]">
        {headline}
      </div>
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-flex items-center gap-[clamp(72px,9vw,150px)] animate-marquee [animation-duration:48s] pl-[clamp(72px,9vw,150px)]">
          {loop.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${p.alt}-${i}`}
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="h-[clamp(26px,2.6vw,40px)] w-auto object-contain flex-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
