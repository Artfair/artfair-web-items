import Link from "next/link";

// Baukasten-Item „Magazin-Streifen" — Überschrift + „mehr"-Link über drei
// Magazin-Karten. 1:1 aus der Startseite herausgelöst. Die Karten liefert die
// Seite (kuratierte/aktuelle Magazin-Artikel), damit der Streifen aktuell bleibt —
// oder der Streifen trägt eigene Karten aus dem CMS (dann ist der „mehr"-Link optional).

export interface MagCard {
  tag: string;
  title: string;
  img: string | null;
  href: string;
}

export function MagazineStripItem({
  title,
  moreLabel,
  moreHref,
  cards,
  intro,
}: {
  title: string;
  /** Optionaler Einleitungstext unter der Überschrift. */
  intro?: string;
  moreLabel: string;
  /** Ohne Adresse kein „mehr"-Link (nur bei eigenen Karten). */
  moreHref?: string;
  cards: MagCard[];
}) {
  if (cards.length === 0) return null;
  const ueberschrift = (
    <h2 className="font-light text-[length:calc(clamp(30px,4vw,56px)*var(--schrift-titel,1))] tracking-[-0.02em] leading-tight">
      {title}
    </h2>
  );
  return (
    <section className="px-[var(--page-x)] py-[clamp(48px,7vw,110px)]">
      {(title || moreHref) && (
        <div className="flex items-baseline justify-between gap-5 flex-wrap mb-[clamp(28px,4vw,48px)]">
          {intro ? (
            <div className="flex flex-col gap-4 min-w-0">
              {ueberschrift}
              <p className="text-[length:calc(17px*var(--schrift-text,1))] leading-[1.6] text-neutral-600 max-w-[52ch] whitespace-pre-line">
                {intro}
              </p>
            </div>
          ) : (
            ueberschrift
          )}
          {moreHref && (
            <Link
              href={moreHref}
              className="text-[length:calc(13px*var(--schrift-klein,1))] font-semibold tracking-[0.06em] uppercase border-b-2 border-brand-accent pb-[3px]"
            >
              {moreLabel} →
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.4vw,36px)]">
        {cards.map((m) => (
          <Link key={m.href + m.title} href={m.href} className="flex flex-col gap-3.5 group">
            <div className="aspect-[4/3] overflow-hidden bg-brand-ink">
              {m.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.img}
                  alt=""
                  loading="lazy"
                  // Fokus oben statt mittig: der 4:3-Kasten schneidet Hochformat-
                  // Bilder sonst so, dass Gesichter (oberes Drittel) verloren gehen.
                  className="w-full h-full object-cover object-[50%_25%] group-hover:scale-[1.02] transition-transform"
                />
              )}
            </div>
            <span className="text-[length:calc(11px*var(--schrift-klein,1))] font-semibold tracking-[0.1em] uppercase text-neutral-600">
              {m.tag}
            </span>
            <h3 className="font-light text-[length:calc(clamp(20px,1.8vw,26px)*var(--schrift-zwischentitel,1))] leading-[1.15]">{m.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
