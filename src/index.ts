// Geteiltes Design-Regal der Art Düsseldorf.
//
// Framework-unabhängiger Kern:
export * from './lib/sections' // Section-Typen + loc()-Helfer
export * from './lib/slugs' // DE_SLUGS + localizeHref()

// Anzeige-Regal: der SectionRenderer mappt Abschnitte auf die Web-Items.
export { default as SectionRenderer } from './components/SectionRenderer'

// Magazin-Listenseite (Anzeige): geteilte Komponente + Kartentypen. CSS liegt
// unter '@artfair/web-items/styles/magazine.css' (Konsument importiert sie).
export {
  MagazineListing,
  type MagListCard,
  type MagListPill,
} from './components/MagazineListing'

// Web-Items einzeln (der „Schrank") — Konsumenten können jedes Bauteil direkt
// importieren; gepflegt wird es nur hier im Paket.
export * from './components/items'

// Rahmen: Header (Mega-Menü), Footer, Chrome (Layout-Klammer), Logo.
// nav-Daten kommen als Prop (Konsument fetcht siteNavigation selbst).
export { default as Header, type MagazineTeaser } from './components/Header'
export { default as Footer } from './components/Footer'
export { default as Chrome } from './components/Chrome'
export { default as Logo } from './components/Logo'
export * from './lib/navigation' // SiteNav, NavItem, NavGroup, LocaleField

// Custom-Items (einmal entwickelt, nicht als Riegel editierbar):
export { default as HeaderAnimation } from './components/HeaderAnimation' // Hero-Video
export { default as AskArtDus } from './components/AskArtDus' // Digitaler Concierge
export { withBase } from './lib/assets' // Asset-Basis-Auflösung

// Programm-Custom-Items (feste Code-Riegel: Art Walks, Talks-Fahrplan, Kuratiert):
export { ProgrammArtWalks } from './components/programm/ProgrammArtWalks'
export { ProgrammSchedule } from './components/programm/ProgrammSchedule'
export { ProgrammCurated } from './components/programm/ProgrammCurated'
