// Menü-Typen der Website-Navigation (Sanity-Dokument „siteNavigation").
// NUR Typen — das Fetchen bleibt beim Konsumenten (AD27 und Webby haben je
// ihren eigenen Sanity-Client). Header/Footer bekommen `nav` als Prop.
// Sprachen der Instanzen: de/en (art.fair), en/ja (Tokyo Gendai). Bewusst
// benannte Felder statt offener Achse — sonst passen die eigenen Menütypen
// der Instanzen (AD27 lib/site) nicht mehr. Neue Sprache = hier ergänzen.
export type LocaleField = { de?: string; en?: string; ja?: string }

export interface NavItem {
  _key?: string
  label?: LocaleField
  href?: string
  hidden?: boolean
}

export interface NavGroup {
  _key?: string
  head?: LocaleField
  href?: string // optional: macht die Spalten-Überschrift selbst zum Link
  items?: NavItem[]
}

export interface SiteNav {
  cols?: NavGroup[]
  more?: NavGroup
  company?: NavGroup
  footer?: { items?: NavItem[] }
}
