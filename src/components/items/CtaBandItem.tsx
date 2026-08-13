import Link from "next/link";

// Baukasten-Item „CTA-Band" — dunkles, vollbreites Band: große
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
  heading,
  body,
  contact,
  cta,
  imageSrc,
  imageAlt,
}: {
  id?: string;
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  eyebrow?: string;
  heading: string; // Zeilenumbruch als \n
  body: string;
  // Ansprechperson, abgesetzt vom Fließtext (statt Kontaktdaten im body).
  contact?: { name: string; role?: string; phone?: string };
  cta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section id={id} className="grid md:grid-cols-[1.1fr_0.9fr] bg-artdus-black scroll-mt-14">
      <div className="flex flex-col justify-center gap-7 px-[clamp(40px,5vw,80px)] py-[clamp(64px,8vw,128px)]">
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </section>
  );
}
