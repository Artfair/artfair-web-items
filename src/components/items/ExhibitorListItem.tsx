// Baukasten-Item „Ausstellerliste" — alle Aussteller einer Ausgabe als
// Bildkarten (Foto, Name, Städte), gruppiert nach Sektor, mit Sprungmarken je
// Sektor oben. Die Aussteller sind Daten im CMS, nicht im Code (anders als das
// Galerien-Archiv). Ohne Sektoren: eine Gruppe ohne Zwischentitel.

export interface Exhibitor {
  name: string;
  cities: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
}

export interface ExhibitorGroup {
  /** Sprungmarke der Gruppe, z. B. "hana". */
  id: string;
  /** Sektor-Name; leer = Gruppe ohne Zwischentitel. */
  label: string;
  exhibitors: Exhibitor[];
}

export function ExhibitorListItem({
  id,
  eyebrow,
  title,
  intro,
  groups,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  groups: ExhibitorGroup[];
}) {
  const mitSektoren = groups.length > 1 || !!groups[0]?.label;
  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(48px,6vw,96px)] scroll-mt-20">
      {eyebrow && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-brand-accent" />
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-5">{title}</h2>
      )}
      {intro && <p className="text-[17px] leading-[1.6] text-brand-ink-70 max-w-[60ch] whitespace-pre-line mb-8">{intro}</p>}

      {mitSektoren && (
        <nav aria-label={title || "Sectors"} className="flex flex-wrap gap-2 mb-[clamp(32px,4vw,56px)]">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="text-[13px] font-medium tracking-[0.06em] border border-brand-ink px-4 py-2 transition-colors hover:bg-brand-ink hover:text-brand-paper"
            >
              {g.label}
              <span className="ml-2 text-brand-muted">{g.exhibitors.length}</span>
            </a>
          ))}
        </nav>
      )}

      {groups.map((g) => (
        <div key={g.id} id={g.id} className="scroll-mt-24 mb-[clamp(40px,5vw,72px)] last:mb-0">
          {g.label && (
            <h3 className="text-[clamp(22px,2.2vw,30px)] font-normal border-t border-brand-ink pt-4 mb-6">{g.label}</h3>
          )}
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {g.exhibitors.map((a, i) => {
              const inhalt = (
                <>
                  <div className="overflow-hidden mb-3 bg-brand-surface">
                    {a.imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.imageSrc}
                        alt={a.imageAlt}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div aria-hidden="true" className="w-full aspect-[4/3]" />
                    )}
                  </div>
                  <p className="text-[16px] leading-[1.3] font-medium">{a.name}</p>
                  {a.cities && <p className="mt-1 text-[13px] leading-[1.45] text-brand-muted">{a.cities}</p>}
                </>
              );
              return (
                <li key={`${i}-${a.name}`} className="group">
                  {a.href ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className="block">
                      {inhalt}
                    </a>
                  ) : (
                    inhalt
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
