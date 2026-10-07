import Link from "next/link";
import { magBild, magDatum, magEntitaeten } from "../../lib/magazin";

// Artikel-Karte in Rubrik- und Archiv-Mosaik. Aus AD27 (components/magazine/
// ArticleCard) übernommen, Markup unverändert; Rubrik-Name und Link liefert
// die Instanz.
export interface MagKarteProps {
  href: string;
  titel: string;
  auszug?: string | null;
  bildUrl?: string | null;
  /** Rubrik- bzw. Unterrubrik-Name im Bubble. */
  kicker: string;
  datum?: string | null;
  lang: string;
  /** Für Farb-Regeln in magazine.css (data-cat / data-subcat). */
  kategorie: string;
  unterkategorie?: string | null;
}

export function MagKarte({ href, titel, auszug, bildUrl, kicker, datum, lang, kategorie, unterkategorie }: MagKarteProps) {
  const title = magEntitaeten(titel);
  const excerpt = magEntitaeten(auszug);
  return (
    <Link href={href} className="mag-card">
      <div className={`mag-card__img${bildUrl ? "" : " mag-card__img--empty"}`}>
        {bildUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={magBild(bildUrl, 600, 800)} alt={title} loading="lazy" />
        ) : (
          <span aria-hidden>{title.slice(0, 1)}</span>
        )}
        <span className="mag-card__bubble" data-cat={kategorie} data-subcat={kategorie === "people" ? (unterkategorie ?? "") : ""}>
          {kicker}
        </span>
      </div>
      <h3 className="mag-card__title">{title}</h3>
      {excerpt && <p className="mag-card__excerpt">{excerpt}</p>}
      {datum && <div className="mag-card__meta">{magDatum(datum, lang)}</div>}
    </Link>
  );
}
