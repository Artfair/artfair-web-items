import Link from "next/link";

// Baukasten-Item „Karten-Trio" — Sektionskopf + drei Bild-Karten
// (Bild, Label, Titel, Text, optionaler Link).

export interface TrioCard {
  id?: string; // Sprungmarke für Menü-Links (z. B. "gastronomie")
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain"; // contain z. B. für Logos
  label: string;
  title: string;
  body: string;
  extra?: React.ReactNode; // z. B. Reservierungskontakt
  link?: { label: string; href: string };
}

export function CardTrioItem({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow: string;
  heading: string;
  cards: TrioCard[];
}) {
  return (
    <section className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)]">
      <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
        {eyebrow}
      </span>
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      <div className={`grid gap-8 ${cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {cards.map((card) => (
          <div key={card.title} id={card.id} className="flex flex-col group scroll-mt-14">
            <div className="overflow-hidden mb-4 bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.imageSrc}
                alt={card.imageAlt}
                loading="lazy"
                className={`w-full aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                  card.imageFit === "contain" ? "object-contain p-[12%]" : "object-cover"
                }`}
              />
            </div>
            <span className="text-[13px] font-medium tracking-[0.14em] uppercase text-neutral-600 mb-2">
              {card.label}
            </span>
            <h3 className="text-xl font-normal leading-[1.15] mb-2.5">{card.title}</h3>
            <p className="text-[15px] leading-[1.62] text-neutral-600 whitespace-pre-line">
              {card.body}
            </p>
            {card.extra}
            {card.link && (
              <Link
                href={card.link.href}
                className="self-start text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] mt-4"
              >
                {card.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
