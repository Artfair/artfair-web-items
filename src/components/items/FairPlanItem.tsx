// Baukasten-Item „Messeplan" — eigener, prominenter Block: Sektionskopf,
// der Plan in voller Breite (SVG/Bild), darunter Erläuterung und
// optionaler Link (z. B. PDF-Download), sobald im CMS hinterlegt.

export function FairPlanItem({
  id,
  heading,
  body,
  planSrc,
  planAlt,
  link,
}: {
  id?: string; // Sprungmarke für Menü-Links (z. B. "messeplan")
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  eyebrow?: string;
  heading: string;
  body: string;
  planSrc: string;
  planAlt: string;
  link?: { label: string; href: string };
}) {
  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={planSrc} alt={planAlt} loading="lazy" className="w-full h-auto" />
      <div className="mt-[clamp(20px,2.5vw,32px)] flex flex-wrap items-baseline justify-between gap-x-12 gap-y-5">
        <p className="text-[15px] leading-[1.62] text-neutral-600 max-w-[62ch]">{body}</p>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] whitespace-nowrap"
          >
            {link.label} →
          </a>
        )}
      </div>
    </section>
  );
}
