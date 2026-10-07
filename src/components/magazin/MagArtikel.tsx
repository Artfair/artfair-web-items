import Link from "next/link";
import { MagVenuesItem } from "../items/MagVenuesItem";
import { magBild, magDatum, magEntitaeten, type MagBlock } from "../../lib/magazin";

// Artikelseite des Magazins: Aufmacherbild, Kicker mit Datum, Titel,
// Unterzeile, Übersetzungs-Link, Textblöcke, Zurück-Link. Aus AD27
// (app/[lang]/magazine/[segment] — ArticleView/BodyBlock) übernommen, Markup
// unverändert. Daten, Rubrik-Namen und Texte kommen von der Instanz.

function videoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  return null;
}

function TextBlock({ block, ausstellungenLabel }: { block: MagBlock; ausstellungenLabel: string }) {
  switch (block._type) {
    case "headlineBlock":
      return <h2 className="mag-art__h2">{magEntitaeten(block.text)}</h2>;
    case "htmlBlock":
      return (
        // HTML aus dem CMS-Import (WordPress) — kein Nutzerinhalt.
        // eslint-disable-next-line react/no-danger
        <div className="mag-art__html" dangerouslySetInnerHTML={{ __html: block.html }} />
      );
    case "imageBlock":
      if (!block.imageUrl) return null;
      return (
        <figure className={`mag-art__figure mag-art__figure--${block.imageSize ?? "wide"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={magBild(block.imageUrl, 1400)} alt={block.caption ?? ""} />
          {block.caption && <figcaption className="mag-art__caption">{magEntitaeten(block.caption)}</figcaption>}
        </figure>
      );
    case "videoBlock": {
      const embed = videoEmbed(block.url);
      return embed ? (
        <div className="mag-art__video">
          <iframe src={embed} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Video" />
        </div>
      ) : (
        <p className="mag-art__html">
          <a href={block.url} target="_blank" rel="noopener noreferrer">
            {block.url}
          </a>
        </p>
      );
    }
    case "venuesBlock":
      // Abbinder „Ausstellungen" (Styles: .mag-venues in magazine.css).
      return <MagVenuesItem label={block.label || ausstellungenLabel} venues={block.venues ?? []} />;
    default:
      return null;
  }
}

export function MagArtikel({
  titel,
  untertitel,
  heroUrl,
  kicker,
  datum,
  lang,
  body,
  uebersetzung,
  zurueck,
  ausstellungenLabel,
}: {
  titel: string;
  untertitel?: string | null;
  heroUrl?: string | null;
  /** Rubrik- bzw. Unterrubrik-Name über dem Titel. */
  kicker: string;
  datum?: string | null;
  lang: string;
  body: MagBlock[] | null | undefined;
  /** Link zur Fassung in der anderen Sprache, falls es eine gibt. */
  uebersetzung?: { href: string; label: string } | null;
  zurueck: { href: string; label: string };
  /** Überschrift des Ausstellungs-Abbinders, wenn der Block selbst keine trägt. */
  ausstellungenLabel: string;
}) {
  const title = magEntitaeten(titel);
  const meta = magDatum(datum, lang);
  return (
    <article className="mag-art">
      {heroUrl && (
        <div className="mag-art__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={magBild(heroUrl, 1600)} alt={title} />
        </div>
      )}

      <div className="mag-art__body">
        <p className="mag-kicker">
          {kicker}
          {datum ? ` · ${magDatum(datum, lang)}` : ""}
        </p>

        <h1 className="mag-art__title">{title}</h1>

        {untertitel && <p className="mag-art__sub">{magEntitaeten(untertitel)}</p>}

        {meta && <p className="mag-art__meta">{meta}</p>}

        {uebersetzung && (
          <Link href={uebersetzung.href} className="mag-art__translation">
            {uebersetzung.label}
          </Link>
        )}

        {body?.map((block) => (
          <TextBlock key={block._key} block={block} ausstellungenLabel={ausstellungenLabel} />
        ))}

        <Link href={zurueck.href} className="mag-art__back">
          ← {zurueck.label}
        </Link>
      </div>
    </article>
  );
}
