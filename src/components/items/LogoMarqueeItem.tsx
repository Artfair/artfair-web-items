// Baukasten-Item „Logo-Laufband" — Überschrift + endlos laufende Reihe von
// Partner-Logos, oben/unten mit Hairline. 1:1 aus der Startseite herausgelöst.

export interface MarqueeLogo {
  src: string;
  alt: string;
  // Form-Klasse zur OPTISCHEN Vereinheitlichung (wie im Partner-Hero):
  //   'wortmarke' = breit/niedrig → etwas flacher, sonst wirkt sie riesig
  //   'wappen'    = quadratisch/hoch → etwas höher, sonst wirkt es winzig
  //   'mix'       = Mischform (Default)
  variant?: "wortmarke" | "mix" | "wappen";
  // Feinabgleich der OPTISCHEN Größe pro Logo; 1 = neutral.
  // Webby-Schieberegler erlaubt 30–180 % (0.3–1.8).
  scale?: number;
}

// Höhenfaktor je Form-Klasse, relativ zur Basishöhe der Reihe. Gleiche
// Verhältnisse wie die LOGO_BOX im Partner-Hero (24/32/44 zu Basis 32).
const VARIANT_FACTOR: Record<NonNullable<MarqueeLogo["variant"]>, number> = {
  wortmarke: 0.75,
  mix: 1,
  wappen: 1.375,
};

// SVGs von Sanity müssen OHNE Transformations-Parameter (w=, q=, auto=)
// ausgeliefert werden: mit Parametern rastert das CDN den Vektor zu einem
// kleinen Pixelbild — auf Retina sichtbar unscharf.
function vectorSafe(src: string): string {
  if (!src.includes("cdn.sanity.io")) return src;
  const q = src.indexOf("?");
  const path = q === -1 ? src : src.slice(0, q);
  return path.endsWith(".svg") ? path : src;
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
        {/* Nahtloser Loop: translateX(-50%) trifft nur dann exakt eine Periode,
            wenn die Trackbreite aus zwei identischen Hälften besteht. Deshalb
            Abstand als margin-right AN JEDEM Logo (statt gap + padding-left am
            Track — die machten die Hälften ungleich, das Band sprang am Ende).
            Eager statt lazy: nachladende Bilder ändern die Trackbreite mitten
            in der Animation und lassen das Band ebenfalls springen. */}
        {/* w-max ist Pflicht: ohne explizite Breite gibt der Browser dem
            inline-flex-Track eine Shrink-to-fit-Breite KLEINER als der Inhalt
            (Kinder laufen über), und translateX(-50%) verfehlt die Periode —
            das Band springt am Loop-Ende. max-content = exakte Inhaltsbreite,
            halbe Breite = genau eine Logo-Periode. */}
        <div className="inline-flex w-max items-center animate-marquee [animation-duration:48s]">
          {loop.map((p, i) => {
            const f = VARIANT_FACTOR[p.variant ?? "mix"] * (p.scale ?? 1);
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${p.alt}-${i}`}
                src={vectorSafe(p.src)}
                alt={p.alt}
                loading="eager"
                className="w-auto max-w-none object-contain flex-none mr-[clamp(72px,9vw,150px)]"
                style={{ height: `calc(clamp(26px, 2.6vw, 40px) * ${f.toFixed(3)})` }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
