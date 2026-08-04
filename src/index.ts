// Geteiltes Design-Regal der Art Düsseldorf.
//
// Framework-unabhängiger Kern:
export * from './lib/sections' // Section-Typen + loc()-Helfer
export * from './lib/slugs' // DE_SLUGS + localizeHref()

// Anzeige-Regal: der SectionRenderer mappt Abschnitte auf die Web-Items.
export { default as SectionRenderer } from './components/SectionRenderer'
export { type MagCard } from './components/items/MagazineStripItem'
