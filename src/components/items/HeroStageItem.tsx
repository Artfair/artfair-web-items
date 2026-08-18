import Link from "next/link";

// Baukasten-Item „Hero-Bühne" (Header-Typ 2a · Emotional) — ganzflächiges
// Foto, Titel reversed unten links über einem Scrim-Verlauf, bis zu zwei
// Knöpfe (weiß gefüllt + weiß umrandet). Trägt die H1 — pro Seite max. einmal.
// Design-Handoff „Seiten-Header-System", Typ 2 (Programm, Über uns).

export function HeroStageItem({
  id,
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
}: {
  id?: string;
  eyebrow?: string; // leer = keine Eyebrow-Zeile (Annalena 14.8.2026)
  title: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section id={id} className="relative h-[clamp(520px,43vw,620px)] bg-artdus-black overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAlt}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[rgba(0,0,0,0.82)] to-transparent"
      />
      <div className="absolute left-0 bottom-0 px-[var(--page-x)] pb-[clamp(36px,3.9vw,56px)] max-w-[900px]">
        {eyebrow && (
          <span className="inline-flex items-center text-[13px] font-medium tracking-[0.18em] uppercase text-white mb-[clamp(14px,1.5vw,22px)]">
            {eyebrow}
          </span>
        )}
        <h1 className="font-normal text-[clamp(44px,6.1vw,88px)] leading-[0.98] tracking-[-0.01em] text-white">
          {title}
        </h1>
        {body && (
          <p className="text-[clamp(17px,1.5vw,22px)] leading-[1.4] text-white/85 max-w-[620px] mt-[clamp(16px,1.7vw,24px)]">
            {body}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap gap-3 mt-[clamp(20px,2.2vw,32px)]">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 bg-white text-artdus-black text-[13px] font-medium tracking-[0.14em] uppercase px-[28px] py-[15px]"
              >
                {primaryCta.label} →
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center text-white border border-white text-[13px] font-medium tracking-[0.14em] uppercase px-[26px] py-[14px]"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
