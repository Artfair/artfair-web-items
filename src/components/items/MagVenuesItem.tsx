// Abbinder „Ausstellungen" — abgesetzter Soft-Rosé-Kasten am Ende eines
// Magazin-Artikels (erster Einsatz: Gräfling-Sammlerinterview, „Die Sammlung
// erleben", Annalena 30.9.2026). Als globales Item einsetzbar unter jedem
// Artikel, der auf laufende Ausstellungen hinweist: Lime-Chip als Label auf
// der Oberkante, Orte als Spalten (Name in der Magazin-Serife, Adresse
// gedämpft, Ausstellungslink lime-unterstrichen mit ↗, Enddatum als
// Outline-Pille); mobil einspaltig. Styling: .mag-venues in
// styles/magazine.css — der Konsument importiert sie (AD27: Magazin-Layout).
//
// Kein Baukasten-Riegel: der Abbinder gehört in den Artikel-Body (AD27 rendert
// ihn über den Body-Block `venuesBlock`), darum gibt es keinen Case im
// SectionRenderer.

export interface MagVenue {
  /** Name des Ortes, z. B. "Salon Kennedy" — ohne Name entfällt der Eintrag. */
  name: string;
  /** Adresszeile, z. B. "Cranachstraße 5 · Frankfurt am Main" */
  address?: string;
  /** Link zur laufenden Ausstellung (öffnet extern in neuem Tab). */
  href?: string;
  /** Linktext, üblicherweise der Ausstellungstitel — ohne href kein Link. */
  linkLabel?: string;
  /** Enddatum als gepflegter Text, z. B. "bis 15. Februar 2027" */
  date?: string;
}

export function MagVenuesItem({
  label,
  venues,
}: {
  /** Chip auf der Oberkante, z. B. "Die Sammlung erleben" — leer: kein Chip. */
  label?: string;
  venues: MagVenue[];
}) {
  const list = (venues ?? []).filter((v) => v?.name);
  if (list.length === 0) return null;

  return (
    <div className="mag-venues">
      {label && <p className="mag-venues__label">{label}</p>}
      {list.map((v, i) => (
        <p key={i} className="mag-venues__item">
          <span className="mag-venues__name">{v.name}</span>
          {v.address && <span className="mag-venues__addr">{v.address}</span>}
          {v.href && v.linkLabel && (
            <span className="mag-venues__link">
              <a href={v.href} target="_blank" rel="noopener noreferrer">
                {v.linkLabel} ↗
              </a>
            </span>
          )}
          {v.date && <span className="mag-venues__date">{v.date}</span>}
        </p>
      ))}
    </div>
  );
}
