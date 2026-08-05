// ─────────────────────────────────────────────────────────────────────────
// Baukasten-Kompositions-Schicht: Section-Typen, die 1:1 Annalenas
// components/items/* spiegeln. Jeder Section-Eintrag beschreibt EINEN Item
// mit seinem Inhalt; der SectionRenderer mappt _type → Item-Komponente.
//
// GESPIEGELT mit Webby/src/lib/sections.ts (Webby schreibt, AD27 liest).
// An den Item-Komponenten wird NICHTS geändert — nur ihre Props als CMS-Felder
// abgebildet (Texte als {de,en}, Bilder als {url,alt}).
// Siehe HANDOFF-Baukasten-fuer-Annalena.md.
// ─────────────────────────────────────────────────────────────────────────

export type Loc = { de?: string; en?: string };

export interface ImageRef {
  _ref?: string; // Sanity-Asset-ID
  url?: string; // denormalisierte CDN-URL (oder lokaler /images/-Pfad)
  alt?: string;
}

// Knopf/Link — entspricht { label, href } der Items.
// hidden: Knopf ausgeblendet (z. B. außerhalb der Ticketphase);
// Beschriftung/Link bleiben gespeichert und können wieder aktiviert werden.
export interface Cta {
  label?: Loc;
  href?: string;
  hidden?: boolean;
}

// 01 — Ticker (TickerItem)
export interface TickerSection {
  _key: string;
  _type: "ticker";
  items?: Loc[]; // laufende Kurzmeldungen
  image?: ImageRef;
}

// 02 — Hero Split (HeroSplitItem) — trägt die H1, pro Seite max. einmal
export interface HeroSplitSection {
  _key: string;
  _type: "heroSplit";
  eyebrow?: Loc;
  title?: Loc; // Zeilenumbruch mit \n
  body?: Loc;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  videoUrl?: string; // eingebettete Video-Datei
  poster?: ImageRef;
}

// 03 — Fakten-Zeile (FactsRowItem)
export interface Fact {
  _key: string;
  label?: Loc;
  value?: Loc;
  muted?: boolean;
}
export interface FactsRowSection {
  _key: string;
  _type: "factsRow";
  anchor?: string; // Sprungmarke (z. B. "oeffnungszeiten")
  facts?: Fact[];
}

// 04 — CTA-Band (CtaBandItem)
export interface CtaBandSection {
  _key: string;
  _type: "ctaBand";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  body?: Loc;
  cta?: Cta;
  image?: ImageRef;
}

// 05 — Text + CTA (TextCtaItem)
export interface TextCtaSection {
  _key: string;
  _type: "textCta";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  body?: Loc;
  cta?: Cta;
  image?: ImageRef; // optional — mit Bild links, ohne nur Text
}

// 06 — Messeplan (FairPlanItem)
export interface FairPlanSection {
  _key: string;
  _type: "fairPlan";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  body?: Loc;
  plan?: ImageRef;
  link?: Cta;
}

// 07 — Nummerierte Blöcke (NumberedBlocksItem)
export interface NumBlock {
  _key: string;
  heading?: Loc;
  body?: Loc;
}
export interface NumberedBlocksSection {
  _key: string;
  _type: "numberedBlocks";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  image?: ImageRef;
  imageCaption?: Loc;
  headLink?: Cta;
  blocks?: NumBlock[];
}

// 08 — Karten-Trio (CardTrioItem)
export interface TrioCardData {
  _key: string;
  anchor?: string;
  image?: ImageRef;
  imageFit?: "cover" | "contain";
  label?: Loc;
  title?: Loc;
  body?: Loc;
  link?: Cta;
}
export interface CardTrioSection {
  _key: string;
  _type: "cardTrio";
  eyebrow?: Loc;
  heading?: Loc;
  cards?: TrioCardData[];
}

// 09 — Logo-Grid (LogoGridItem)
export interface LogoData {
  _key: string;
  image?: ImageRef; // url = src, alt = Partnername
  href?: string;
}
export interface LogoGridSection {
  _key: string;
  _type: "logoGrid";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  logos?: LogoData[];
}

// ── Homepage-Bausteine (aus components/home herausgelöst) ───────────────────

// 10 — Willkommen-Panel (WelcomePanelItem)
export interface WelcomePanelSection {
  _key: string
  _type: 'welcomePanel'
  kicker?: Loc
  title?: Loc
  body?: Loc
  videoUrl?: string
  poster?: ImageRef
}

// 11 — Advertorial-Karten / Galerie-Fokus (AdvertorialCardsItem)
export interface AdCardData {
  _key: string
  cat?: Loc
  name?: Loc
  teaser?: Loc
  image?: ImageRef
  href?: string
}
export interface AdvertorialCardsSection {
  _key: string
  _type: 'advertorialCards'
  kicker?: Loc
  title?: Loc
  adLabel?: Loc
  adTag?: Loc
  moreLabel?: Loc
  cards?: AdCardData[]
}

// 12 — Nav-Mosaik (NavMosaicItem) — genau 4 Kacheln
export interface MosaicTileData {
  _key: string
  label?: Loc
  image?: ImageRef
  href?: string
}
export interface NavMosaicSection {
  _key: string
  _type: 'navMosaic'
  title?: Loc
  sub?: Loc
  tiles?: MosaicTileData[]
}

// 13 — Logo-Laufband (LogoMarqueeItem)
export interface LogoMarqueeSection {
  _key: string
  _type: 'logoMarquee'
  headline?: Loc
  logos?: LogoData[]
}

// 14 — Magazin-Streifen (MagazineStripItem) — Karten liefert die Seite
export interface MagazineStripSection {
  _key: string
  _type: 'magazineStrip'
  title?: Loc
  moreLabel?: Loc
  moreHref?: string
}

// 15 — Themen-Sektion (ThemesSection)
export interface ThemeEntryData {
  _key: string
  image?: ImageRef
  heading?: Loc
  body?: Loc
  ratio?: '4/5' | '4/3'
}
export interface ThemesSectionData {
  _key: string
  _type: 'themesSection'
  anchor?: string
  title?: Loc
  intro?: Loc
  themes?: ThemeEntryData[]
}

// 16 — Newsletter (NewsletterBlockItem) — Formular fix, Text editierbar
export interface NewsletterSection {
  _key: string
  _type: 'newsletter'
  title?: Loc
  body?: Loc
}

// ── Programm-Bausteine (Partner/Talks) ──────────────────────────────────────

// 17 — Partner-Porträt (PartnerFeatureItem)
export interface PartnerFeatureSection {
  _key: string;
  _type: "partnerFeature";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  image?: ImageRef; // großes Foto (Pflicht fürs Rendern)
  title?: Loc; // Partnername
  body?: Loc;
  link?: Cta;
}

// 18 — Talkprogramm (TalksScheduleItem)
export interface TalkSpeakerData {
  _key: string;
  name?: string; // nicht lokalisiert
  role?: Loc;
}
export interface TalkData {
  _key: string;
  time?: string; // "14:00"
  duration?: Loc; // z. B. "60 Min" / "60 min"
  title?: Loc;
  image?: ImageRef; // Kartenhintergrund (dekorativ, ohne Alt)
  speakers?: TalkSpeakerData[];
  moderationName?: string;
  moderationRole?: Loc;
}
export interface TalkDayData {
  _key: string;
  weekday?: Loc; // "Freitag" / "Friday"
  date?: Loc; // "17. April" / "April 17"
  theme?: Loc; // Tagesthema
  talks?: TalkData[];
}
export interface TalksScheduleSection {
  _key: string;
  _type: "talksSchedule";
  anchor?: string;
  eyebrow?: Loc;
  heading?: Loc;
  intro?: Loc;
  image?: ImageRef; // großes 21:9-Foto (optional)
  imageCaption?: Loc;
  days?: TalkDayData[];
  credit?: Loc;
}

// ── Seiten-Header-Bausteine (Header-System, Typ 2) ──────────────────────────

// 19 — Hero-Bühne (HeroStageItem, Typ 2a) — trägt die H1, pro Seite max. einmal
export interface HeroStageSection {
  _key: string;
  _type: "heroStage";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  body?: Loc;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image?: ImageRef; // ganzflächiges Foto (Pflicht fürs Rendern)
}

// 20 — Partner-Hero (PartnerHeroItem, Typ 2b) — trägt die H1
export interface PartnerHeroSection {
  _key: string;
  _type: "partnerHero";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  body?: Loc;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image?: ImageRef; // Foto rechts (Pflicht fürs Rendern)
  logos?: LogoData[]; // weißes Karussell; alt = Partnername
}

// 21 — Sales-Hero (SalesHeroItem, Typ 3) — trägt die H1, pro Seite max. einmal
export interface SlideData {
  _key: string;
  image?: ImageRef; // Slideshow-Bild; alt nur beim ersten (Basis-)Bild nötig
}
export interface SalesHeroSection {
  _key: string;
  _type: "salesHero";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  body?: Loc;
  primaryCta?: Cta; // Acid-Knopf
  secondaryCta?: Cta;
  images?: SlideData[]; // erstes Bild = Basis (Pflicht fürs Rendern)
}

// 22 — Info-Header (InfoHeaderItem, Typ 4) — trägt die H1, pro Seite max.
// einmal. Suchfeld/Filter-Pills (FAQ) liefert die Seite, nicht das CMS.
export interface InfoHeaderSection {
  _key: string;
  _type: "infoHeader";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  body?: Loc;
  action?: Cta; // schwarzer Knopf rechts unten (z. B. Presskit)
  meta?: Loc[]; // Meta-Zeile unter der Haarlinie (z. B. Stand, Kontakt)
}

// 23 — Listen-Header (ListHeaderItem, Typ 5) — trägt die H1, pro Seite max.
// einmal. Filter-Pills/Suche/Zählerstand liefert die Seite (Live-Daten);
// das CMS pflegt nur Kicker, Titel und Zähler-Beschriftung.
export interface ListHeaderSection {
  _key: string;
  _type: "listHeader";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  counterValue?: string; // z. B. "142" oder "380+" (leer = kein Zähler)
  counterLabel?: Loc; // z. B. "Galerien"
}

// 24 — Newsletter-Hero (NewsletterHeroItem, Typ 6) — trägt die H1, pro Seite
// max. einmal. Headline in Weissenhof (Serif bleibt dem Magazin vorbehalten);
// das Formular selbst ist fix.
export interface NewsletterHeroSection {
  _key: string;
  _type: "newsletterHero";
  anchor?: string;
  eyebrow?: Loc;
  title?: Loc;
  body?: Loc;
  images?: SlideData[]; // zwei gestapelte Fotos rechts
}

// Marker für feste, im Code gepflegte Riegel (Talks-Fahrplan usw.): im CMS nur
// Typ + _key, der Inhalt kommt als React-Knoten über SectionRenderer `slots`.
export interface SlotMarkerSection {
  _key: string;
  _type: "programmArtWalks" | "programmSchedule" | "programmCurated";
  anchor?: string;
}

// Abstandhalter: leeres, farbiges Band (kein Text) — reine Layout-Luft.
export interface SpacerSection {
  _key: string;
  _type: "spacer";
  anchor?: string;
  color?: string; // Hintergrundfarbe (Hex aus fester Palette); leer = transparent
  height?: string; // CSS-Höhe, z. B. "64px"
}

export interface ContactCardData {
  _key?: string;
  name?: Loc;
  lines?: Loc; // Adresse, mehrzeilig
  contact?: Loc; // Telefon/E-Mail, mehrzeilig
}
export interface ContactBlockSection {
  _key: string;
  _type: "contactBlock";
  anchor?: string;
  heading?: Loc;
  cards?: ContactCardData[];
}

export type Section =
  | SlotMarkerSection
  | SpacerSection
  | ContactBlockSection
  | TickerSection
  | HeroSplitSection
  | FactsRowSection
  | CtaBandSection
  | TextCtaSection
  | FairPlanSection
  | NumberedBlocksSection
  | CardTrioSection
  | LogoGridSection
  | WelcomePanelSection
  | AdvertorialCardsSection
  | NavMosaicSection
  | LogoMarqueeSection
  | MagazineStripSection
  | ThemesSectionData
  | NewsletterSection
  | PartnerFeatureSection
  | TalksScheduleSection
  | HeroStageSection
  | PartnerHeroSection
  | SalesHeroSection
  | InfoHeaderSection
  | ListHeaderSection
  | NewsletterHeroSection;

export type SectionType = Section["_type"];

// Sprachwahl mit Rückfall (identisch zu sanity.ts#pick).
export function loc(field: Loc | undefined, lang: "de" | "en"): string {
  if (!field) return "";
  return field[lang] || field.de || field.en || "";
}
