import Link from "next/link";

// Baukasten-Item „Advertorial-Karten" — Galerie-Fokus: Lime-Fläche mit
// Kicker, Headline, „Anzeige"-Badge und einem Raster beworbener Karten.
// 1:1 aus der Startseite herausgelöst.

export interface AdCard {
  cat: string;
  name: string;
  teaser: string;
  img: string;
  href: string;
}

export function AdvertorialCardsItem({
  kicker,
  title,
  adLabel,
  adTag,
  moreLabel,
  cards,
}: {
  kicker: string;
  title: string;
  adLabel: string;
  adTag: string;
  moreLabel: string;
  cards: AdCard[];
}) {
  return (
    <section className="bg-[#f1f5d6] px-[var(--page-x)] py-[clamp(56px,8vw,120px)]">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(30px,4vw,52px)]">
        <div className="flex flex-col gap-[clamp(10px,1.4vw,18px)]">
          <span className="text-[clamp(11px,0.9vw,13px)] font-semibold tracking-[0.2em] uppercase text-[#5c6033]">
            {kicker}
          </span>
          <h2 className="font-light text-[clamp(32px,4.6vw,64px)] leading-none tracking-[-0.01em]">
            {title}
          </h2>
        </div>
        <span className="self-start text-[10px] font-bold tracking-[0.18em] uppercase text-[#5c6033] border border-[#c8cf9c] px-3.5 py-[7px] whitespace-nowrap">
          {adLabel}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(200px,21vw,258px),1fr))] gap-[clamp(14px,1.6vw,24px)]">
        {cards.map((f) => (
          <Link
            key={f.name}
            href={f.href}
            className="bg-white flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.16)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt="" loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.16em] uppercase text-artdus-black bg-artdus-lime px-[9px] py-[5px]">
                {adTag}
              </span>
            </div>
            <div className="p-[clamp(16px,1.4vw,22px)] flex flex-col gap-[9px] flex-1">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#7a7057]">
                {f.cat}
              </span>
              <h3 className="font-light text-[clamp(19px,1.5vw,25px)] leading-[1.08]">{f.name}</h3>
              <p className="text-[13px] leading-normal text-neutral-600">{f.teaser}</p>
              <span className="mt-auto pt-2 text-xs font-semibold tracking-[0.05em] uppercase">
                {moreLabel} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
