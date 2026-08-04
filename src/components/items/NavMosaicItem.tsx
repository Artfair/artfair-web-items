import Link from "next/link";

// Baukasten-Item „Nav-Mosaik" — Headline + Untertitel über einem Mosaik aus
// vier verlinkten Bildkacheln (erste groß, dann zwei, dann eine volle Breite).
// 1:1 aus der Startseite herausgelöst. Erwartet genau vier Kacheln.

export interface MosaicTile {
  label: string;
  img: string;
  href: string;
}

export function NavMosaicItem({
  title,
  sub,
  tiles,
}: {
  title: string;
  sub: string;
  tiles: MosaicTile[];
}) {
  if (tiles.length < 4) return null;
  return (
    <section className="px-[var(--page-x)] pt-[clamp(44px,6vw,90px)] pb-[clamp(56px,7vw,110px)]">
      <h2 className="font-light text-[clamp(34px,5.4vw,88px)] leading-[0.96] tracking-[-0.03em] mb-[clamp(12px,1.4vw,20px)]">
        {title}
      </h2>
      <p className="text-[clamp(15px,1.3vw,19px)] leading-[1.55] text-neutral-600 max-w-[52ch] mb-[clamp(26px,3.4vw,48px)]">
        {sub}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] md:grid-rows-[repeat(2,clamp(140px,18vw,250px))] gap-[clamp(8px,1vw,16px)]">
        {[0, 1, 2].map((i) => (
          <Link
            key={tiles[i].label}
            href={tiles[i].href}
            className={`relative overflow-hidden block group h-[clamp(160px,45vw,250px)] md:h-auto ${i === 0 ? "md:row-span-2" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tiles[i].img}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover brightness-[.62] group-hover:brightness-75 transition-[filter]"
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-white font-semibold tracking-[0.14em] uppercase ${
                i === 0 ? "text-[clamp(18px,2vw,30px)]" : "text-[clamp(15px,1.4vw,22px)]"
              }`}
            >
              {tiles[i].label}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href={tiles[3].href}
        className="relative overflow-hidden block group h-[clamp(140px,18vw,250px)] mt-[clamp(8px,1vw,16px)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tiles[3].img}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover brightness-[.62] group-hover:brightness-75 transition-[filter]"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-[clamp(18px,2vw,30px)] font-semibold tracking-[0.14em] uppercase">
          {tiles[3].label}
        </span>
      </Link>
    </section>
  );
}
