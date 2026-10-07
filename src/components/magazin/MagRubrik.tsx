import Link from "next/link";
import { MagKarte, type MagKarteProps } from "./MagKarte";

// Rubrik- bzw. Archiv-Ansicht: Kopf mit Titel, optional Unterfilter-Pillen,
// darunter das Karten-Mosaik. Aus AD27 (RubrikView/ArchivView) übernommen.
export function MagRubrik({
  titel,
  filter,
  karten,
  leerText,
}: {
  titel: string;
  /** Unterfilter (z. B. Menschen: Alle · Sammeln · Kunst …); fehlt er, keine Pillen. */
  filter?: { href: string; label: string; aktiv: boolean }[];
  karten: (MagKarteProps & { id: string })[];
  leerText: string;
}) {
  return (
    <>
      <div className="mag-rubrik-head">
        <h2 className="mag-rubrik-title">{titel}</h2>
        {filter && (
          <div className="mag-sub-nav">
            {filter.map((f) => (
              <Link key={f.href} href={f.href} className={`mag-pill${f.aktiv ? " mag-pill--active" : ""}`}>
                {f.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {karten.length === 0 ? (
        <p className="mag-empty">{leerText}</p>
      ) : (
        <div className="mag-mosaic">
          {karten.map(({ id, ...k }) => (
            <MagKarte key={id} {...k} />
          ))}
        </div>
      )}
    </>
  );
}
