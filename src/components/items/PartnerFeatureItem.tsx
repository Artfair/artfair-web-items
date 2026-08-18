import Link from "next/link";

// Baukasten-Item „Partner-Porträt" — Sektionskopf + großes Foto,
// daneben Name, Beschreibung und Link (z. B. Headline/Main Partner).

export function PartnerFeatureItem({
  id,
  eyebrow,
  heading,
  imageSrc,
  imageAlt,
  title,
  body,
  link,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  link?: { label: string; href: string };
}) {
  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
        {eyebrow}
      </span>
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-[clamp(28px,4.5vw,72px)] items-start">
        <div className="overflow-hidden bg-neutral-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="w-full aspect-[3/2] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-normal leading-[1.15] mb-3">{title}</h3>
          <p className="text-[15px] leading-[1.62] text-neutral-600 whitespace-pre-line">
            {body}
          </p>
          {link && (
            <Link
              href={link.href}
              className="self-start text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] mt-5"
            >
              {link.label} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
