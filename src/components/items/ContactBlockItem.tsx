// Baukasten-Item „Kontakt-Block" — Überschrift + Adress-/Kontaktkarten
// (Name, Adresszeilen, Telefon/E-Mail). Ersetzt die früheren schwarzen
// Adress-Blöcke der Über-uns-Seite; editierbar in Webby, mit Sprungmarke
// (anchor), damit der Menüpunkt „Kontakt" direkt hierher springen kann.

export interface ContactCard {
  name: string;
  lines: string; // Adresse, mehrzeilig
  contact: string; // Telefon/E-Mail, mehrzeilig
}

export function ContactBlockItem({
  anchor,
  heading,
  cards,
}: {
  anchor?: string;
  heading: string;
  cards: ContactCard[];
}) {
  if (cards.length === 0 && !heading) return null;
  return (
    <section id={anchor} className="px-[var(--page-x)] py-[clamp(48px,7vw,110px)] scroll-mt-14">
      {heading && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-[clamp(24px,3vw,44px)]">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
          {heading}
        </span>
      )}
      <div className={`grid gap-8 ${cards.length >= 2 ? "md:grid-cols-2" : ""}`}>
        {cards.map((c, i) => (
          <address key={i} className="not-italic border border-artdus-line p-8">
            {c.name && <h3 className="text-xl font-normal leading-[1.15] mb-3">{c.name}</h3>}
            {c.lines && (
              <p className="text-[15px] leading-[1.62] text-neutral-600 whitespace-pre-line">{c.lines}</p>
            )}
            {c.contact && (
              <p className="mt-4 text-sm font-mono text-neutral-600 whitespace-pre-line">{c.contact}</p>
            )}
          </address>
        ))}
      </div>
    </section>
  );
}
