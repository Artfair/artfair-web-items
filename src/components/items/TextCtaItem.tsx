// Baukasten-Item „Text-CTA" — heller Abschnitt: Eyebrow, Headline, kurzer
// Text und ein Button; optional mit Foto als zweiter Hälfte (Bild links,
// Gegenstück zum dunklen CTA-Band mit Bild rechts). Für Partner-Verweise
// wie den Hotelpartner. Externe Ziele (http/https) öffnen in neuem Tab.

export function TextCtaItem({
  id,
  eyebrow,
  heading,
  body,
  cta,
  imageSrc,
  imageAlt,
}: {
  id?: string; // Sprungmarke für Menü-Links (z. B. "hotels")
  eyebrow: string;
  heading: string; // Zeilenumbruch als \n
  body: string;
  cta: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
}) {
  const isExternal = /^https?:/.test(cta.href);

  const content = (
    <>
      <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
        {eyebrow}
      </span>
      <h2 className="font-light text-[clamp(30px,3.8vw,54px)] leading-[1.04] tracking-[-0.02em] whitespace-pre-line">
        {heading}
      </h2>
      <p className="text-[17px] leading-[1.6] text-neutral-600 max-w-[52ch]">{body}</p>
      <a
        href={cta.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="self-start text-[13px] font-semibold tracking-[0.14em] uppercase text-white bg-artdus-black px-[30px] py-[15px]"
      >
        {cta.label} →
      </a>
    </>
  );

  if (imageSrc) {
    return (
      <section id={id} className="grid md:grid-cols-[0.9fr_1.1fr] px-[var(--page-x)] scroll-mt-14">
        <div className="relative min-h-[300px] max-md:order-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-7 px-[clamp(40px,5vw,80px)] py-[clamp(64px,8vw,128px)] max-md:order-1">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(56px,7vw,104px)] scroll-mt-14">
      <div className="flex flex-col gap-7">{content}</div>
    </section>
  );
}
