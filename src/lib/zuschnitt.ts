// ─────────────────────────────────────────────────────────────────────────
// Bild-Zuschnitt je Format.
//
// Ein Bild erscheint an mehreren Stellen in verschiedenen Seitenverhältnissen
// (Magazin-Aufmacher 4:5, Karte 3:4, Mosaik quer 3:2, Startseiten-Streifen 4:3).
// Ohne Angabe schneidet der Bild-Dienst mit einem festen Fokuspunkt zu
// (waagerecht mittig, 35 % von oben) — das trifft oft, aber nicht immer.
//
// Ein Zuschnitt sagt pro Bild:
//   fokus    wohin das Wichtige gehört (0–1 von links/oben) — gilt für alle Formate
//   formate  je Format ein eigener Ausschnitt (0–1, relativ zur Quelle)
// Gespeichert wird er von der Instanz (z. B. am Magazin-Artikel, zusammen mit
// der Kennung des Bildes); die Bausteine bekommen ihn als Prop.
// Ohne Zuschnitt sind alle Adressen Zeichen für Zeichen wie bisher.
// ─────────────────────────────────────────────────────────────────────────

export type Ausschnitt = { x: number; y: number; w: number; h: number };

export type BildZuschnitt = {
  /** Kennung des Bildes, zu dem der Zuschnitt gehört (z. B. Sanity-Asset-ID). */
  asset?: string | null;
  fokus?: { x: number; y: number } | null;
  formate?: Partial<Record<BildFormat, Ausschnitt | null>> | null;
};

/** Die Formate, in denen die Bausteine ein Bild zuschneiden. */
export const BILDFORMATE = [
  { key: "aufmacher", label: "Magazin-Aufmacher", ratio: [4, 5] },
  { key: "karte", label: "Magazin-Karte", ratio: [3, 4] },
  { key: "karteQuer", label: "Magazin-Mosaik (quer)", ratio: [3, 2] },
  { key: "streifen", label: "Startseiten-Streifen und Menü", ratio: [4, 3] },
] as const;

export type BildFormat = (typeof BILDFORMATE)[number]["key"];

/** Fokuspunkt, wenn keiner gesetzt ist (Gesichter stehen meist im oberen Drittel). */
export const STANDARD_FOKUS = { x: 0.5, y: 0.35 } as const;

const zahl = (v: unknown, lo = 0, hi = 1): number | null =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : null;

/** Maße aus einer Sanity-Bildadresse (…-1194x1688.png); null, wenn nicht ablesbar. */
export function bildMasse(url: string): { breite: number; hoehe: number } | null {
  const m = url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i);
  return m ? { breite: Number(m[1]), hoehe: Number(m[2]) } : null;
}

/**
 * Größter Ausschnitt im Seitenverhältnis `ratio`, mittig um den Fokuspunkt,
 * innerhalb des Bildes — so schneidet auch der Bild-Dienst mit Fokuspunkt zu.
 */
export function ausschnittUmFokus(
  masse: { breite: number; hoehe: number },
  ratio: readonly [number, number],
  fokus: { x: number; y: number } = STANDARD_FOKUS,
): Ausschnitt {
  const ziel = ratio[0] / ratio[1];
  const quelle = masse.breite / masse.hoehe;
  const w = quelle > ziel ? ziel / quelle : 1; // relativ zur Breite
  const h = quelle > ziel ? 1 : quelle / ziel; // relativ zur Höhe
  const x = Math.min(1 - w, Math.max(0, fokus.x - w / 2));
  const y = Math.min(1 - h, Math.max(0, fokus.y - h / 2));
  return { x, y, w, h };
}

/**
 * Sanity-Bildadresse in `width` × `height` mit Zuschnitt. Ohne `height` nur
 * skaliert. Reihenfolge: eigener Ausschnitt des Formats → Fokuspunkt →
 * Standard-Fokuspunkt (= bisheriges Verhalten). Andere Adressen unverändert.
 */
export function bildMitZuschnitt(
  url: string | null | undefined,
  width: number,
  height?: number,
  zuschnitt?: BildZuschnitt | null,
  format?: BildFormat,
): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  if (!height) return `${url}${sep}w=${width}&auto=format&fit=max`;

  const a = format ? zuschnitt?.formate?.[format] : null;
  const masse = a ? bildMasse(url) : null;
  if (a && masse) {
    const x = zahl(a.x), y = zahl(a.y), w = zahl(a.w, 0.01), h = zahl(a.h, 0.01);
    if (x !== null && y !== null && w !== null && h !== null) {
      const r = [x * masse.breite, y * masse.hoehe, w * masse.breite, h * masse.hoehe].map((v) => Math.round(v));
      return `${url}${sep}rect=${r.join(",")}&w=${width}&h=${height}&fit=crop&auto=format`;
    }
  }
  const fx = zahl(zuschnitt?.fokus?.x), fy = zahl(zuschnitt?.fokus?.y);
  const fp = fx !== null && fy !== null ? { x: fx, y: fy } : STANDARD_FOKUS;
  return `${url}${sep}w=${width}&h=${height}&fit=crop&crop=focalpoint&fp-x=${fp.x}&fp-y=${fp.y}&auto=format`;
}
