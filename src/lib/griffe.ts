// ─────────────────────────────────────────────────────────────────────────
// Der Griff einer Leiste — damit Webby sie von hinten greifen kann.
//
// Bild: Zwei Profilschienen (Website vorne, Webby hinten), dazwischen Leisten in
// Standardbreite. Die Leisten kommen aus diesem Schrank. Damit der Bibliothekar
// eine Leiste befüllen kann, braucht er ihre Fächer: welche Felder, welche
// Beschriftung, welche Reihenfolge. Bisher stand das für jede Leiste von Hand in
// Webby (SectionEditor.tsx) — eine neue Leiste ließ sich ansehen, aber nicht
// einräumen, bis dort jemand ein Formular dazuschrieb. Jetzt liegt der Griff
// mit im Karton: Webby liest ihn und baut das Formular selbst.
//
// Vier Grundfächer decken den Großteil ab (in Webbys 36 Formularen gezählt:
// übersetzter Text 250×, Text 71×, Bild 36×, Knopf 27×). Listen und
// Sonderfächer kommen dazu, wenn eine Leiste sie braucht.
//
// HERKUNFT DER ERSTEN 13 GRIFFE: maschinell aus Webbys Formularen abgelesen
// (Stand Webby ded8edc, 01.10.2026) — Beschriftung, Reihenfolge, Mehrzeiligkeit
// und Platzhalter sind damit Wort für Wort gleich. Wird ein handgeschriebenes
// Formular in Webby durch den Griff ersetzt, ändert sich für die Redaktion nichts.
// ─────────────────────────────────────────────────────────────────────────

import type { SectionType } from "./sections";

export type Fach =
  /** Einfacher Text, nicht übersetzt (Sprungmarke, Adresse, Zahl). */
  | { art: "text"; feld: string; label: string; platzhalter?: string }
  /** Übersetzter Text — ein Wert je Sprache der Instanz. */
  | { art: "loc"; feld: string; label: string; mehrzeilig?: boolean; platzhalter?: string }
  /** Ein Bild (URL bzw. Sanity-Asset + Alt-Text). */
  | { art: "bild"; feld: string; label: string }
  /** Knopf: übersetzte Beschriftung + Ziel. */
  | { art: "knopf"; feld: string; label: string }
  /** Liste von Bildern, sortierbar. */
  | { art: "bildliste"; feld: string; label: string };

export interface Griff {
  /** Bauart der Leiste — der `_type` im CMS. */
  typ: SectionType;
  /** So heißt die Leiste im Katalog, aus dem die Redaktion wählt. */
  name: string;
  /** Eine Zeile, wofür die Leiste gedacht ist. */
  hinweis: string;
  /** Die Fächer in der Reihenfolge, in der sie im Formular stehen. */
  faecher: Fach[];
  /** Startbefüllung einer neu eingelegten Leiste (ohne _key/_type). */
  leer?: Record<string, unknown>;
}

export const GRIFFE: Griff[] = [
  {
    typ: "heroSplit",
    name: "Hero (Farb-Block + Medium)",
    hinweis: "Großer Kopf: Titel, Text, zwei Knöpfe, Video/Bild",
    faecher: [
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (Zeilenumbruch = neue Zeile)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "primaryCta", label: "Erster Knopf" },
      { art: "knopf", feld: "secondaryCta", label: "Zweiter Knopf (optional)" },
      { art: "text", feld: "videoUrl", label: "Video-Datei-URL (optional, z. B. /videos/…mp4)" },
      { art: "bild", feld: "poster", label: "Bild / Poster (wenn kein Video)" },
    ],
  },
  {
    typ: "ctaBand",
    name: "CTA-Band (dunkel)",
    hinweis: "Dunkles Band: Text links, Foto rechts, ein Knopf",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "tickets" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift (Zeilenumbruch erlaubt)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "cta", label: "Knopf" },
      { art: "bild", feld: "image", label: "Foto (rechts)" },
    ],
  },
  {
    typ: "textCta",
    name: "Text + Knopf",
    hinweis: "Heller Abschnitt, optional Foto links",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "hotels" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift (Zeilenumbruch erlaubt)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "cta", label: "Knopf" },
      { art: "bild", feld: "image", label: "Foto links (optional)" },
    ],
  },
  {
    typ: "newsDate",
    name: "News + Datum",
    hinweis: "Heller Abschnitt, Datums-Kasten rechts (z. B. Bewerbungsfrist)",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "bewerbung" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift (Zeilenumbruch erlaubt)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "cta", label: "Knopf" },
      { art: "loc", feld: "boxKicker", label: "Versalzeile 1 (z. B. Bewerbungsportal)" },
      { art: "loc", feld: "boxIntro", label: "Versalzeile 2 (z. B. Öffnet am)" },
      { art: "loc", feld: "boxDate", label: "Datum groß (z. B. 1.) — leer = kein Kasten" },
      { art: "loc", feld: "boxLabel", label: "Unterzeile (z. B. September, Zeilenumbruch erlaubt)", mehrzeilig: true },
    ],
  },
  {
    typ: "fairPlan",
    name: "Messeplan",
    hinweis: "Plan in voller Breite + Erläuterung",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "messeplan" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "bild", feld: "plan", label: "Plan (Bild/SVG, volle Breite)" },
      { art: "knopf", feld: "link", label: "Link (optional, z. B. PDF)" },
    ],
  },
  {
    typ: "exhibitorArchive",
    name: "Galerien-Archiv (Liste)",
    hinweis: "Galerienliste einer vergangenen Ausgabe — Daten fest im Paket, nur Kopfzeilen editierbar",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "galerien" },
      { art: "text", feld: "edition", label: "Ausgabe (Edition)", platzhalter: "2026" },
      { art: "loc", feld: "eyebrow", label: "Kicker (leer = „Ausstellerliste“)" },
      { art: "loc", feld: "title", label: "Titel (leer = „Galerien 2026.“)" },
      { art: "loc", feld: "intro", label: "Intro (optional)", mehrzeilig: true },
    ],
  },
  {
    typ: "welcomePanel",
    name: "Willkommen-Panel",
    hinweis: "Lime-Block mit Text neben Bild/Video",
    faecher: [
      { art: "loc", feld: "kicker", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Überschrift (Zeilenumbruch erlaubt)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "text", feld: "videoUrl", label: "Video-Datei-URL (optional)", platzhalter: "/videos/…mp4" },
      { art: "bild", feld: "poster", label: "Bild / Standbild" },
    ],
  },
  {
    typ: "magazineStrip",
    name: "Magazin-Streifen",
    hinweis: "Überschrift + „mehr\"-Link (Karten automatisch)",
    faecher: [
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "moreLabel", label: "Mehr-Link-Beschriftung" },
      { art: "text", feld: "moreHref", label: "Mehr-Link (Adresse)", platzhalter: "/magazine" },
    ],
  },
  {
    typ: "newsletter",
    name: "Newsletter",
    hinweis: "Überschrift + Text (Formular fix)",
    faecher: [
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
    ],
  },
  {
    typ: "newsletterPopup",
    name: "Newsletter-Popup",
    hinweis: "Scrollausgelöstes Anmelde-Overlay „INSIDE\" — Texte optional (leer = Standard-Copy), Foto 3:4",
    faecher: [
      { art: "loc", feld: "headline", label: "Kleine Zeile oben (Standard: Get inside.)" },
      { art: "loc", feld: "eyebrow", label: "Große Zeile (Standard: INSIDE ART DÜSSELDORF)" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "bild", feld: "image", label: "Foto (3:4, mobil oben)" },
    ],
  },
  {
    typ: "partnerFeature",
    name: "Partner-Porträt",
    hinweis: "Großes Foto, daneben Name, Text und Link",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "partner" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      { art: "bild", feld: "image", label: "Großes Foto" },
      { art: "loc", feld: "title", label: "Partnername" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "link", label: "Link (optional)" },
    ],
  },
  {
    typ: "heroStage",
    name: "Hero-Bühne (Vollbild)",
    hinweis: "Seiten-Header: Foto ganzflächig, Titel unten links, zwei Knöpfe",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "loc", feld: "body", label: "Text (optional)", mehrzeilig: true },
      { art: "knopf", feld: "primaryCta", label: "Erster Knopf (weiß gefüllt)" },
      { art: "knopf", feld: "secondaryCta", label: "Zweiter Knopf (weiß umrandet, optional)" },
      { art: "bild", feld: "image", label: "Foto (ganzflächig, Pflicht)" },
    ],
  },
  {
    typ: "listHeader",
    name: "Listen-Header",
    hinweis: "Seiten-Header: kompakter Titel + Zähler, Acid-Linie (Filter liefert die Seite)",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "text", feld: "counterValue", label: "Zähler-Wert (optional, z. B. 142 oder 380+)" },
      { art: "loc", feld: "counterLabel", label: "Zähler-Beschriftung (z. B. Galerien)" },
    ],
  },
  {
    typ: "heroCarousel",
    name: "Bildkarussell",
    hinweis: "Ganzflächige Bilder ohne Text, wechseln sich ab — trägt keine H1",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "bildliste", feld: "images", label: "Bilder" },
    ],
    leer: { images: [] },
  },
];

/** Den Griff einer Bauart holen — `undefined`, wenn sie (noch) keinen hat. */
export function griff(typ: string): Griff | undefined {
  return GRIFFE.find((g) => g.typ === typ);
}
