// Baukasten-Item „News + Datum" — heller Abschnitt wie das Text-CTA, aber mit
// einem Datums-Kasten als zweiter Hälfte (Design-Handoff „Bewerbungsbereich",
// 19.8.2026): links Eyebrow, Headline, Text und optional ein Button; rechts ein
// zentrierter Kasten mit zwei Versalzeilen, großem Datum und Unterzeile.
// Gebaut für den Bewerbungs-Riegel auf der Startseite — Zustand A kündigt die
// Portal-Öffnung an (Kasten mit Lime-Rahmen), Zustand B zeigt die laufende
// Bewerbungsfrist (Kasten als gefüllte Lime-Fläche, tone="lime").
// Ohne Datums-Kasten (kein date) fällt der Riegel auf die reine Textsektion
// zurück. Externe Ziele (http/https) öffnen in neuem Tab.

export function NewsDateItem({
  id,
  eyebrow,
  heading,
  body,
  cta,
  box,
}: {
  id?: string; // Sprungmarke für Menü-Links (z. B. "bewerbung")
  eyebrow?: string;
  heading: string; // Zeilenumbruch als \n
  body: string;
  cta?: { label: string; href: string };
  box?: {
    kicker?: string; // Versalzeile 1, z. B. "Bewerbungsportal"
    intro?: string; // Versalzeile 2, z. B. "Öffnet am"
    date: string; // groß, z. B. "1."
    label?: string; // Unterzeile, z. B. "September" — Zeilenumbruch als \n
    tone?: "outline" | "lime"; // Lime-Rahmen (Ankündigung) / Lime-Fläche (Frist)
  };
}) {
  const isExternal = cta ? /^https?:/.test(cta.href) : false;

  const text = (
    <div className="flex flex-col gap-7">
      {eyebrow && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-light text-[clamp(30px,3.8vw,54px)] leading-[1.04] tracking-[-0.02em] whitespace-pre-line">
        {heading}
      </h2>
      <p className="text-[17px] leading-[1.6] text-neutral-600 max-w-[52ch]">{body}</p>
      {cta && (
        <a
          href={cta.href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="self-start text-[13px] font-semibold tracking-[0.14em] uppercase text-white bg-artdus-black px-[30px] py-[15px]"
        >
          {cta.label} →
        </a>
      )}
    </div>
  );

  if (!box?.date) {
    return (
      <section id={id} className="px-[var(--page-x)] py-[clamp(56px,7vw,104px)] scroll-mt-14">
        {text}
      </section>
    );
  }

  const lime = box.tone === "lime";

  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(56px,7vw,104px)] scroll-mt-14">
      <div className="grid md:grid-cols-[1fr_auto] gap-[clamp(40px,5vw,60px)] items-center">
        {text}
        <div
          className={`w-[280px] max-w-full aspect-[4/3] px-10 py-12 flex flex-col items-center justify-center text-center ${
            lime ? "bg-artdus-lime" : "border-[3px] border-artdus-lime bg-white"
          }`}
        >
          {box.kicker && (
            <span className="text-[12px] tracking-[0.14em] uppercase mb-1">{box.kicker}</span>
          )}
          {box.intro && (
            <span className="text-[12px] tracking-[0.14em] uppercase mb-4">{box.intro}</span>
          )}
          <span className="font-light text-[clamp(48px,5vw,64px)] leading-none mb-2">
            {box.date}
          </span>
          {box.label && (
            <span className="text-[14px] tracking-[0.14em] uppercase leading-[1.8] whitespace-pre-line">
              {box.label}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
