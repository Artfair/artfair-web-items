// ─────────────────────────────────────────────────────────────────────────
// Magazin — Datenformen und Hilfen für die Magazin-Bausteine
// (components/magazin). Nur Darstellung: Welche Artikel es gibt, woher sie
// kommen (Sanity-Projekt der Instanz), welche Rubriken und Texte gelten,
// entscheidet die Instanz. So bleiben die Welten getrennt — AD27 liest nur
// sein Magazin, Tokyo Gendai nur seine Stories.
// ─────────────────────────────────────────────────────────────────────────

/** Ein Block im Artikeltext (aus WordPress-Import oder Webby). */
export type MagBlock =
  | { _key: string; _type: "headlineBlock"; text: string }
  | { _key: string; _type: "htmlBlock"; html: string }
  | { _key: string; _type: "videoBlock"; url: string }
  | {
      _key: string;
      _type: "imageBlock";
      imageUrl: string | null;
      caption?: string;
      imagePosition?: string;
      imageSize?: string;
    }
  | {
      _key: string;
      _type: "venuesBlock";
      label?: string;
      venues?: { name: string; address?: string; href?: string; linkLabel?: string; date?: string }[];
    };

// Aus WordPress importierte Titel/Excerpts enthalten HTML-Entities
// (z. B. &#8220; &#8217; &#038;). Server-seitig dekodieren (kein DOM).
const BENANNT: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", laquo: "«", raquo: "»",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  bdquo: "„", szlig: "ß", auml: "ä", ouml: "ö", uuml: "ü",
  Auml: "Ä", Ouml: "Ö", Uuml: "Ü",
};

export function magEntitaeten(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => BENANNT[name] ?? m)
    .trim();
}

// Datumsformat je Sprache; unbekannte Sprachen schreiben wie Englisch (US).
const GEBIETSSCHEMA: Record<string, string> = { de: "de-DE", en: "en-US", ja: "ja-JP" };

/** Datum lesbar nach Sprache, z. B. „13. April 2026" / „April 13, 2026" / „2026年4月13日". */
export function magDatum(date: string | null | undefined, lang: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(GEBIETSSCHEMA[lang] ?? "en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Sanity-Bild skalieren. Mit h → fit=crop, Fokuspunkt bei 35 % von oben
// (Gesichter stehen fast immer im oberen Drittel). Andere Adressen unverändert.
export function magBild(url: string | null | undefined, width: number, height?: number): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  if (height) {
    return `${url}${sep}w=${width}&h=${height}&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.35&auto=format`;
  }
  return `${url}${sep}w=${width}&auto=format&fit=max`;
}
