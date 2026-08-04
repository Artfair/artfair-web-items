import Link from "next/link";

// Baukasten-Item „Magazin-Streifen" — Überschrift + „mehr"-Link über drei
// Magazin-Karten. 1:1 aus der Startseite herausgelöst. Die Karten liefert die
// Seite (kuratierte/aktuelle Magazin-Artikel), damit der Streifen aktuell bleibt.

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
}: {
  title: string;
  moreLabel: string;
  moreHref: string;
  cards: MagCard[];
}) {
  if (cards.length === 0) return null;
  return (
    <section className="px-[var(--page-x)] py-[clamp(48px,7vw,110px)]">
      <div className="flex items-baseline justify-between gap-5 flex-wrap mb-[clamp(28px,4vw,48px)]">
        <h2 className="font-light text-[clamp(30px,4vw,56px)] tracking-[-0.02em] leading-tight">
          {title}
        </h2>
        <Link
          href={moreHref}
          className="text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px]"
        >
          {moreLabel} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.4vw,36px)]">
        {cards.map((m) => (
          <Link key={m.href + m.title} href={m.href} className="flex flex-col gap-3.5 group">
            <div className="aspect-[4/3] overflow-hidden bg-artdus-black">
              {m.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.img}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                />
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-neutral-600">
              {m.tag}
            </span>
            <h3 className="font-light text-[clamp(20px,1.8vw,26px)] leading-[1.15]">{m.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
