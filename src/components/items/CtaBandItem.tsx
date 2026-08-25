import Link from "next/link";
import { AutoVideo } from "./AutoVideo";

// Baukasten-Item „CTA-Band" — dunkles, vollbreites Band: Eyebrow, große
// Headline, Text und Acid-Button links, Foto rechts.

// mailto/extern als normaler <a>, interne Ziele als SPA-Link.
function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (/^(mailto:|https?:)/.test(href)) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function CtaBandItem({
  id,
  eyebrow,
  heading,
  body,
  contact,
  cta,
  imageSrc,
  imageAlt,
  videoSrc,
  videoSrcMobile,
}: {
  id?: string;
  eyebrow?: string; // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  heading: string; // Zeilenumbruch als \n
  body: string;
  // Ansprechperson, abgesetzt vom Fließtext (statt Kontaktdaten im body).
  contact?: { name: string; role?: string; phone?: string };
  cta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  // Optionales Video statt Foto (Muster HeroSplitItem): läuft stumm in
  // Schleife, das Foto bleibt Poster/Fallback bis es lädt.
  videoSrc?: string;
  videoSrcMobile?: string; // eigener Schnitt unter md (768px)
}) {
  return (
    <section id={id} className="grid md:grid-cols-[1.1fr_0.9fr] bg-artdus-black scroll-mt-14">
      <div className="flex flex-col justify-center gap-7 px-[clamp(40px,5vw,80px)] py-[clamp(64px,8vw,128px)]">
        {eyebrow && (
          <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
            <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-light text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.02em] text-white whitespace-pre-line">
          {heading}
        </h2>
        <p className="text-[17px] leading-[1.6] text-neutral-300 max-w-[44ch]">{body}</p>
        {contact && (
          <div className="border-l-2 border-artdus-lime pl-5">
            <span className="block text-[16px] font-medium text-white">{contact.name}</span>
            {contact.role && (
              <span className="block text-[12px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mt-1">
                {contact.role}
              </span>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[\s-]+/g, "")}`}
                className="inline-block font-mono text-[14px] text-neutral-300 mt-2.5 hover:underline underline-offset-[3px]"
              >
                {contact.phone}
              </a>
            )}
          </div>
        )}
        <CtaLink
          href={cta.href}
          className="self-start text-[13px] font-semibold tracking-[0.14em] uppercase text-artdus-black bg-artdus-lime px-[30px] py-[15px] mt-1.5"
        >
          {cta.label} →
        </CtaLink>
      </div>
      <div className="relative min-h-[360px]">
        {videoSrc ? (
          // Mobil (1:1-Schnitt) füllt die Fläche, oben verankert (Logo!).
          // Ab md unbeschnitten (contain): Leonies Desktop-Schnitt ist stark
          // quer, cover schnitt in der hochkanten Spalte fast die Hälfte weg
          // (National-Bank-Logo weg, Annalena 21.8.2026) — contain legt das
          // Video in voller Breite mittig ins Schwarz des Bands.
          <AutoVideo
            className="absolute inset-0 w-full h-full object-cover object-top md:object-contain md:object-center"
            src={videoSrc}
            mobileSrc={videoSrcMobile}
            poster={imageSrc}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>
    </section>
  );
}
