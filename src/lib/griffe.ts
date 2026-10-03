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
// HERKUNFT DER ERSTEN 13 GRIFFE: aus Webbys Formularen abgelesen (Stand Webby
// ded8edc, 01.10.2026). In v1.5 fehlten dabei Hinweiszeilen, ein Zwischentitel und
// die Auswahl „Kasten-Farbe" (newsDate) — seit v1.6 sind die 13 vollständig und
// gegen die handgeschriebenen Formulare Element für Element geprüft. Wird ein
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
  | { art: "bildliste"; feld: string; label: string }
  /** Auswahl aus festen Werten (Klappliste); `standard` gilt, solange nichts gewählt ist. */
  | { art: "wahl"; feld: string; label: string; optionen: { wert: string; label: string }[]; standard: string }
  /** Zwischentitel im Formular — kein Feld, gliedert nur. */
  | { art: "zwischentitel"; text: string }
  /** Grauer Hinweis im Formular — kein Feld, erklärt nur. */
  | { art: "notiz"; text: string }
  /**
   * Liste von Einträgen mit eigenen Fächern (Karten, Logos, Fakten …). Jeder Eintrag
   * bekommt einen `_key` mit dem Präfix `schluessel`. In Beschriftungen der
   * Eintrags-Fächer steht `{n}` für die laufende Nummer (1, 2, …).
   */
  | {
      art: "liste";
      feld: string;
      /** Überschrift der Liste im Formular. */
      label: string;
      eintrag: EintragFach[];
      /** Beschriftung des Hinzufügen-Knopfs, z. B. „+ Karte". */
      neu: string;
      schluessel: string;
      /** Tooltip des Entfernen-Knopfs, z. B. „Karte entfernen". */
      entfernen: string;
      /** Beschriftung des Entfernen-Knopfs (Standard „✕ entfernen"). */
      entfernenText?: string;
      /** Pfeile ↑↓ zum Umsortieren, mit ihren Tooltips. */
      sortierbar?: { hoch: string; runter: string };
      /** Startwerte eines neuen Eintrags (neben `_key`). */
      start?: Record<string, unknown>;
      /** Höchstzahl — danach verschwindet der Hinzufügen-Knopf. */
      hoechstens?: number;
      /** Mindestzahl, ab der die Website die Leiste überhaupt zeigt (z. B. Nav-Mosaik: 4). */
      mindestens?: number;
    }
  /** Liste übersetzter Zeilen ohne weitere Fächer (Laufband-Meldungen, Meta-Zeile). */
  | { art: "locliste"; feld: string; label: string; eintrag: string; neu: string }
  /**
   * Logo-Feinjustierung: Form-Klasse (`variant`) und Größe (`scale`) eines Logos.
   * Nur in Listeneinträgen — sie setzt zwei Felder des Eintrags zugleich.
   */
  | { art: "logofein" };

/** Was in einem Listeneintrag stehen kann. */
export type EintragFach = Extract<Fach, { art: "text" | "loc" | "bild" | "knopf" | "wahl" | "logofein" }>;

export interface Griff {
  /** Bauart der Leiste — der `_type` im CMS. */
  typ: SectionType;
  /** So heißt die Leiste im Katalog, aus dem die Redaktion wählt. */
  name: string;
  /** Eine Zeile, wofür die Leiste gedacht ist. */
  hinweis: string;
  /**
   * Unter welcher Überschrift die Leiste in Webbys Menü „Abschnitt hinzufügen"
   * steht — einer der Gruppentitel dort (z. B. „Kopf / Hero"). Ohne Angabe oder
   * bei unbekanntem Titel landet sie unter „Weitere". Ohne Gruppe wäre eine neue
   * Leiste zwar im Katalog, aber im Menü unauffindbar.
   */
  gruppe?: string;
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
    gruppe: "Kopf / Hero",
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
    gruppe: "Inhalt",
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
    gruppe: "Inhalt",
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
    gruppe: "Inhalt",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "bewerbung" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift (Zeilenumbruch erlaubt)", mehrzeilig: true },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "cta", label: "Knopf" },
      { art: "zwischentitel", text: "Datums-Kasten" },
      { art: "loc", feld: "boxKicker", label: "Versalzeile 1 (z. B. Bewerbungsportal)" },
      { art: "loc", feld: "boxIntro", label: "Versalzeile 2 (z. B. Öffnet am)" },
      { art: "loc", feld: "boxDate", label: "Datum groß (z. B. 1.) — leer = kein Kasten" },
      { art: "loc", feld: "boxLabel", label: "Unterzeile (z. B. September, Zeilenumbruch erlaubt)", mehrzeilig: true },
      {
        art: "wahl",
        feld: "boxTone",
        label: "Kasten-Farbe",
        optionen: [
          { wert: "outline", label: "Lime-Rahmen (Ankündigung)" },
          { wert: "lime", label: "Lime-Fläche (Frist läuft)" },
        ],
        standard: "outline",
      },
    ],
  },
  {
    typ: "fairPlan",
    name: "Messeplan",
    hinweis: "Plan in voller Breite + Erläuterung",
    gruppe: "Medien & Logos",
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
    gruppe: "Ganze Seiten",
    faecher: [
      {
        art: "notiz",
        text: "Galerienliste einer vergangenen Ausgabe — die Galerien (Namen, Sektionen, Stände, Orte) liegen fest im Bauteil und werden hier nicht gepflegt.",
      },
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
    gruppe: "Kopf / Hero",
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
    gruppe: "Medien & Logos",
    faecher: [
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "moreLabel", label: "Mehr-Link-Beschriftung" },
      { art: "text", feld: "moreHref", label: "Mehr-Link (Adresse)", platzhalter: "/magazine" },
      { art: "notiz", text: "Die Karten füllt die Website automatisch mit aktuellen Magazin-Artikeln." },
    ],
  },
  {
    typ: "newsletter",
    name: "Newsletter",
    hinweis: "Überschrift + Text (Formular fix)",
    gruppe: "Programm & Newsletter",
    faecher: [
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "notiz", text: "Das Anmeldeformular selbst ist fest — nur Überschrift und Text sind editierbar." },
    ],
  },
  {
    typ: "newsletterPopup",
    name: "Newsletter-Popup",
    hinweis: "Scrollausgelöstes Anmelde-Overlay „INSIDE\" — Texte optional (leer = Standard-Copy), Foto 3:4",
    gruppe: "Programm & Newsletter",
    faecher: [
      { art: "loc", feld: "headline", label: "Kleine Zeile oben (Standard: Get inside.)" },
      { art: "loc", feld: "eyebrow", label: "Große Zeile (Standard: INSIDE ART DÜSSELDORF)" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "bild", feld: "image", label: "Foto (3:4, mobil oben)" },
      {
        art: "notiz",
        text: "Scrollausgelöstes Overlay: erscheint einmal je Sitzung nach ~15 % Scroll; nach Anmeldung dauerhaft still. Leere Textfelder nutzen die abgenommene Standard-Copy; Formular und Verhalten sind fest.",
      },
    ],
  },
  {
    typ: "partnerFeature",
    name: "Partner-Porträt",
    hinweis: "Großes Foto, daneben Name, Text und Link",
    gruppe: "Inhalt",
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
    gruppe: "Kopf / Hero",
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
    gruppe: "Kopf / Hero",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "text", feld: "counterValue", label: "Zähler-Wert (optional, z. B. 142 oder 380+)" },
      { art: "loc", feld: "counterLabel", label: "Zähler-Beschriftung (z. B. Galerien)" },
      { art: "notiz", text: "Filter-Pills, Suche und die Liste selbst liefert die Website-Seite (Live-Daten)." },
    ],
  },
  {
    typ: "heroCarousel",
    name: "Bildkarussell",
    hinweis: "Ganzflächige Bilder ohne Text, wechseln sich ab — trägt keine H1",
    gruppe: "Kopf / Hero",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "bildliste", feld: "images", label: "Bilder" },
    ],
    leer: { images: [] },
  },
  {
    typ: "ticker",
    name: "Laufband",
    hinweis: "Laufende Kurzmeldungen über Foto",
    gruppe: "Medien & Logos",
    faecher: [
      { art: "locliste", feld: "items", label: "Laufende Meldungen", eintrag: "Meldung {n}", neu: "+ Meldung" },
      { art: "bild", feld: "image", label: "Hintergrund-Foto" },
    ],
  },
  {
    typ: "contactBlock",
    name: "Kontakt-Block",
    hinweis: "Überschrift + Adress-/Kontaktkarten (Name, Adresse, Tel/E-Mail), mit Sprungmarke",
    gruppe: "Ganze Seiten",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (für den Menüpunkt Kontakt)", platzhalter: "kontakt" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      {
        art: "liste", feld: "cards", label: "Kontakt-/Adresskarten", neu: "+ Karte", schluessel: "addr", entfernen: "Karte entfernen",
        eintrag: [
          { art: "loc", feld: "name", label: "Name / Titel" },
          { art: "loc", feld: "lines", label: "Adresse (mehrzeilig)", mehrzeilig: true },
          { art: "loc", feld: "contact", label: "Telefon / E-Mail (mehrzeilig)", mehrzeilig: true },
        ],
      },
    ],
  },
  {
    typ: "factsRow",
    name: "Fakten-Zeile",
    hinweis: "Bis zu vier Kurzinfos (Label + Wert)",
    gruppe: "Inhalt",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional, für Menü-Links)", platzhalter: "oeffnungszeiten" },
      {
        art: "liste", feld: "facts", label: "Fakten (bis 4)", neu: "+ Faktum", schluessel: "fact", entfernen: "Faktum entfernen",
        eintrag: [
          { art: "loc", feld: "label", label: "Label" },
          { art: "loc", feld: "value", label: "Wert (Zeilenumbruch erlaubt)", mehrzeilig: true },
        ],
      },
    ],
  },
  {
    typ: "numberedBlocks",
    name: "Nummerierte Blöcke",
    hinweis: "Editoriale 01…-Blöcke, optional Foto",
    gruppe: "Inhalt",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "anreise" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      { art: "bild", feld: "image", label: "Foto im Kopf (optional)" },
      { art: "loc", feld: "imageCaption", label: "Bild-Beschriftung (optional)" },
      { art: "knopf", feld: "headLink", label: "Link im Kopf (optional)" },
      {
        art: "liste", feld: "blocks", label: "Blöcke (werden 01, 02, … nummeriert)", neu: "+ Block", schluessel: "blk", entfernen: "Block entfernen",
        eintrag: [
          { art: "loc", feld: "heading", label: "Block {n} — Überschrift" },
          { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
        ],
      },
    ],
  },
  {
    typ: "cardTrio",
    name: "Karten (2–3)",
    hinweis: "Bild-Karten mit Label, Titel, Text, Link",
    gruppe: "Inhalt",
    faecher: [
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      {
        art: "liste", feld: "cards", label: "Karten (2–3)", neu: "+ Karte", schluessel: "card", entfernen: "Karte entfernen", entfernenText: "✕ Karte entfernen",
        eintrag: [
          { art: "bild", feld: "image", label: "Karte {n} — Bild" },
          { art: "loc", feld: "label", label: "Label" },
          { art: "loc", feld: "title", label: "Titel" },
          { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
          { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
          { art: "knopf", feld: "link", label: "Link (optional)" },
        ],
      },
    ],
  },
  {
    typ: "logoGrid",
    name: "Logo-Raster",
    hinweis: "Raster aus Partner-Logos",
    gruppe: "Medien & Logos",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker" },
      { art: "loc", feld: "heading", label: "Überschrift" },
      {
        art: "liste", feld: "logos", label: "Logos", neu: "+ Logo", schluessel: "logo", entfernen: "Logo entfernen",
        sortierbar: { hoch: "Nach oben", runter: "Nach unten" },
        eintrag: [
          { art: "bild", feld: "image", label: "Logo {n} (Alt-Text = Partnername)" },
          { art: "text", feld: "href", label: "Link zur Partner-Website (optional)" },
          { art: "logofein" },
        ],
      },
    ],
  },
  {
    typ: "advertorialCards",
    name: "Advertorial-Karten",
    hinweis: "Galerie-Fokus: Karten mit „Anzeige\"-Badge",
    gruppe: "Inhalt",
    faecher: [
      { art: "loc", feld: "kicker", label: "Kicker" },
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "adLabel", label: "Anzeige-Label (oben rechts)" },
      { art: "loc", feld: "adTag", label: "Anzeige-Badge (auf dem Bild)" },
      { art: "loc", feld: "moreLabel", label: "Mehr-Link-Beschriftung" },
      {
        art: "liste", feld: "cards", label: "Karten", neu: "+ Karte", schluessel: "card", entfernen: "Karte entfernen",
        eintrag: [
          { art: "bild", feld: "image", label: "Karte {n} — Bild" },
          { art: "loc", feld: "cat", label: "Kategorie" },
          { art: "loc", feld: "name", label: "Name" },
          { art: "loc", feld: "teaser", label: "Teaser", mehrzeilig: true },
          { art: "text", feld: "href", label: "Link", platzhalter: "/catalogue" },
        ],
      },
    ],
  },
  {
    typ: "navMosaic",
    name: "Nav-Mosaik",
    hinweis: "Vier verlinkte Bildkacheln",
    gruppe: "Medien & Logos",
    faecher: [
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "sub", label: "Untertitel", mehrzeilig: true },
      {
        art: "liste", feld: "tiles", label: "Kacheln (genau 4: erste groß)", neu: "+ Kachel", schluessel: "tile", entfernen: "Kachel entfernen",
        mindestens: 4,
        eintrag: [
          { art: "bild", feld: "image", label: "Kachel {n} — Bild" },
          { art: "loc", feld: "label", label: "Beschriftung" },
          { art: "text", feld: "href", label: "Link", platzhalter: "/galleries" },
        ],
      },
    ],
  },
  {
    typ: "themesSection",
    name: "Themen",
    hinweis: "Nummerierte Bild-Text-Reihen",
    gruppe: "Inhalt",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)", platzhalter: "themen" },
      { art: "loc", feld: "title", label: "Überschrift" },
      { art: "loc", feld: "intro", label: "Einleitung", mehrzeilig: true },
      {
        art: "liste", feld: "themes", label: "Themen (Bild-Text-Reihen)", neu: "+ Thema", schluessel: "theme", entfernen: "Thema entfernen",
        start: { ratio: "4/3" },
        eintrag: [
          { art: "bild", feld: "image", label: "Thema {n} — Bild" },
          { art: "loc", feld: "heading", label: "Titel" },
          { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
          {
            art: "wahl", feld: "ratio", label: "Bildformat", standard: "4/3",
            optionen: [
              { wert: "4/3", label: "4:3 (quer)" },
              { wert: "4/5", label: "4:5 (hoch)" },
            ],
          },
        ],
      },
    ],
  },
  {
    typ: "infoHeader",
    name: "Info-Header (Text)",
    hinweis: "Seiten-Header: Text auf Weiß, Acid-Balken links, Haarlinie + Meta",
    gruppe: "Kopf / Hero",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "loc", feld: "body", label: "Text (optional)", mehrzeilig: true },
      { art: "knopf", feld: "action", label: "Knopf rechts (schwarz, optional — z. B. Presskit)" },
      { art: "locliste", feld: "meta", label: "Meta-Zeile unter der Haarlinie (z. B. „Stand: …“, Kontakt)", eintrag: "Eintrag {n}", neu: "+ Eintrag" },
      { art: "notiz", text: "Suchfeld und Filter-Pills (FAQ-Seiten) liefert die Website-Seite selbst." },
    ],
  },
  {
    typ: "newsletterHero",
    name: "Newsletter-Hero",
    hinweis: "Seiten-Header: Titel, E-Mail-Anmeldung + zwei Fotos (Formular fix)",
    gruppe: "Kopf / Hero",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      {
        art: "liste", feld: "images", label: "Zwei gestapelte Fotos (rechte Hälfte)", neu: "+ Foto", schluessel: "slide", entfernen: "Foto entfernen",
        hoechstens: 2,
        eintrag: [{ art: "bild", feld: "image", label: "Foto {n}" }],
      },
      { art: "notiz", text: "Das Anmeldeformular selbst ist fest — editierbar sind Texte und Fotos." },
    ],
  },
  {
    typ: "logoMarquee",
    name: "Logo-Laufband",
    hinweis: "Laufende Reihe von Partner-Logos",
    gruppe: "Medien & Logos",
    faecher: [
      { art: "loc", feld: "headline", label: "Überschrift", mehrzeilig: true },
      {
        art: "liste", feld: "logos", label: "Logos", neu: "+ Logo", schluessel: "logo", entfernen: "Logo entfernen",
        sortierbar: { hoch: "Nach vorne", runter: "Nach hinten" },
        eintrag: [
          { art: "bild", feld: "image", label: "Logo {n} (Alt-Text = Partnername)" },
          { art: "text", feld: "href", label: "Link (optional)" },
          { art: "logofein" },
        ],
      },
    ],
    leer: { logos: [] },
  },
  {
    typ: "partnerHero",
    name: "Partner-Hero (Split)",
    hinweis: "Seiten-Header: Acid-Rahmen-Box + Foto mit Logo-Karussell",
    gruppe: "Kopf / Hero",
    faecher: [
      { art: "text", feld: "anchor", label: "Sprungmarke (optional)" },
      { art: "loc", feld: "eyebrow", label: "Kicker (kleine Zeile)" },
      { art: "loc", feld: "title", label: "Titel (H1 der Seite)" },
      { art: "loc", feld: "body", label: "Text", mehrzeilig: true },
      { art: "knopf", feld: "primaryCta", label: "Erster Knopf (schwarz gefüllt)" },
      { art: "knopf", feld: "secondaryCta", label: "Zweiter Knopf (umrandet, optional)" },
      { art: "bild", feld: "image", label: "Foto (rechte Hälfte, Pflicht)" },
      {
        art: "liste", feld: "logos", label: "Logo-Karussell (weiß eingefärbt, wechselt alle 1,5 s)", neu: "+ Logo", schluessel: "logo", entfernen: "Logo entfernen",
        sortierbar: { hoch: "Nach vorne (früher im Wechsel)", runter: "Nach hinten (später im Wechsel)" },
        eintrag: [
          { art: "bild", feld: "image", label: "Logo {n} (Alt-Text = Partnername)" },
          { art: "logofein" },
        ],
      },
    ],
    leer: { primaryCta: {}, secondaryCta: {}, logos: [] },
  },
];

/** Den Griff einer Bauart holen — `undefined`, wenn sie (noch) keinen hat. */
export function griff(typ: string): Griff | undefined {
  return GRIFFE.find((g) => g.typ === typ);
}

// ─────────────────────────────────────────────────────────────────────────
// Beispieldaten — aus dem Griff erzeugt.
//
// Jede Leiste mit Griff hat damit zwei Prüffälle: „leer" (frisch eingelegt,
// nur die Startbefüllung) und „voll" (jedes Fach befüllt, Listen mit drei
// Einträgen). Die automatische Prüfung rendert beide, der Schaukasten in Webby
// zeigt sie. Bilder sind neutrale Platzhalter ohne Netzzugriff.
// ─────────────────────────────────────────────────────────────────────────

export type Beispielfall = "leer" | "voll";

function platzhalterBild(text: string): string {
  const t = text.replace(/[<>&"]/g, "");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
    `<rect width="1200" height="800" fill="#d9d9d4"/>` +
    `<text x="600" y="414" font-family="sans-serif" font-size="40" fill="#6b6b66" text-anchor="middle">${t}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Kurzform einer Beschriftung für Beispieltexte: ohne Klammerzusätze und Anführungszeichen.
function kurz(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, "").replace(/[„“"]/g, "").replace(/\s+—.*$/, "").trim();
}

// Laufende Nummer eines Listeneintrags: ersetzt {n} in der Beschriftung, sonst angehängt.
function mitNr(label: string, nr: string): string {
  return label.includes("{n}") ? label.replace("{n}", nr.trim()) : label + nr;
}

function beispielText(label: string, nr: string, mehrzeilig = false): { de: string; en: string } {
  const k = mitNr(kurz(label), nr);
  return mehrzeilig
    ? { de: `${k} (Beispiel)\nzweite Zeile`, en: `${k} [EN]\nsecond line` }
    : { de: `${k} (Beispiel)`, en: `${k} [EN]` };
}

function fuelle(fach: Fach, nr: string): Record<string, unknown> {
  switch (fach.art) {
    case "text":
      if (/video/i.test(fach.feld)) return {}; // kein Video ohne Datei
      // Sprungmarke statt Seitenpfad: kein Vorabladen einer Seite, die es nicht gibt.
      if (/href|url|link/i.test(fach.feld)) return { [fach.feld]: fach.platzhalter ?? "#beispiel" };
      return { [fach.feld]: fach.platzhalter ?? `beispiel-${fach.feld.toLowerCase()}${nr.trim()}` };
    case "loc":
      return { [fach.feld]: beispielText(fach.label, nr, fach.mehrzeilig) };
    case "bild":
      return { [fach.feld]: { url: platzhalterBild(mitNr(kurz(fach.label), nr)), alt: `Beispielbild: ${mitNr(kurz(fach.label), nr)}` } };
    case "knopf":
      return { [fach.feld]: { label: beispielText(fach.label, nr), href: "#beispiel" } };
    case "bildliste":
      return {
        [fach.feld]: [1, 2, 3].map((i) => ({ _key: `bild-${i}`, url: platzhalterBild(`Bild ${i}`), alt: `Beispielbild ${i}` })),
      };
    case "wahl":
      // Die letzte Option, damit nicht nur der Standard geprüft wird.
      return { [fach.feld]: fach.optionen[fach.optionen.length - 1]?.wert ?? fach.standard };
    case "liste": {
      const n = Math.max(fach.mindestens ?? 0, Math.min(3, fach.hoechstens ?? 3));
      return {
        [fach.feld]: Array.from({ length: n }, (_, i) => {
          const eintrag: Record<string, unknown> = { _key: `${fach.schluessel}-${i + 1}`, ...(fach.start ?? {}) };
          for (const f of fach.eintrag) Object.assign(eintrag, fuelle(f, ` ${i + 1}`));
          return eintrag;
        }),
      };
    }
    case "locliste":
      return { [fach.feld]: [1, 2, 3].map((i) => beispielText(fach.eintrag.replace("{n}", String(i)), "")) };
    case "logofein":
      // Nur der zweite Eintrag wird justiert — so sind beide Zustände im Bild.
      return nr.trim() === "2" ? { variant: "wappen", scale: 1.2 } : {};
    default:
      return {};
  }
}

/** Beispiel-Abschnitt einer Leiste: „leer" oder „voll" befüllt. */
export function beispiel(g: Griff, fall: Beispielfall): { _type: string; _key: string } & Record<string, unknown> {
  const abschnitt: { _type: string; _key: string } & Record<string, unknown> = {
    _type: g.typ,
    _key: `beispiel-${g.typ}-${fall}`,
    ...(g.leer ?? {}),
  };
  if (fall === "voll") for (const f of g.faecher) Object.assign(abschnitt, fuelle(f, ""));
  return abschnitt;
}
