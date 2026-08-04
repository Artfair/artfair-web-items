// Geteiltes Design-Regal der Art Düsseldorf.
//
// Framework-unabhängiger Kern:
export * from './lib/sections' // Section-Typen + loc()-Helfer
export * from './lib/slugs' // DE_SLUGS + localizeHref()

// Anzeige-Regal: der SectionRenderer mappt Abschnitte auf die Web-Items.
export { default as SectionRenderer } from './components/SectionRenderer'
export { type MagCard } from './components/items/MagazineStripItem'

// Rahmen: Header (Mega-Menü), Footer, Chrome (Layout-Klammer), Logo.
// nav-Daten kommen als Prop (Konsument fetcht siteNavigation selbst).
export { default as Header } from './components/Header'
export { default as Footer } from './components/Footer'
export { default as Chrome } from './components/Chrome'
export { default as Logo } from './components/Logo'
export * from './lib/navigation' // SiteNav, NavItem, NavGroup, LocaleField
