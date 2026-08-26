// ─────────────────────────────────────────────────────────────────────────
// Galerienliste 2026 — abgeschlossenes Archiv, fest im Code (Annalena 26.8.2026:
// die Ausgabe ändert sich nicht mehr, deshalb keine CMS-Pflege). Quelle der
// Sektionen ist der offizielle Messeplan (AD26_Messeplan_Plots-gross_Druck.pdf,
// Sektion je Galerie aus der Farbcodierung der Stand-Chips ausgelesen); Städte
// aus der Presse-/Wissensbasis. Zählung deckt sich exakt mit der Presseinfo:
// Main 65 · Solo 13 · Next 19 · Paper 7 · Fragile Realities 8 — plus Friends 8
// (nur im Plan als eigene Sektion geführt). Sexauer hatte zwei A14-Stände
// (Main + Paper) und steht deshalb in beiden Sektionen.
// Referenztabelle: docs/galerienliste-2026.md. Weitere Jahrgänge können als
// zusätzliche Editionen in ARCHIVE_EDITIONS ergänzt werden.
// ─────────────────────────────────────────────────────────────────────────

export type ArchiveSectionKey = 'main' | 'solo' | 'next' | 'paper' | 'friends' | 'fragile'
export type ArchiveThemeKey = 'cosmic' | 'panic' | 'ojigi'

export interface ArchiveThemeMeta {
  key: ArchiveThemeKey
  label: string // Eigenname, in beiden Sprachen gleich
}

export interface ArchiveSectionMeta {
  key: ArchiveSectionKey
  label: { de: string; en: string }
  color: string // Sektionsfarbe laut Messeplan
}

export interface ArchiveExhibitor {
  name: string
  cities: string[]
  country: string // ISO-2, Primärstandort
  sections: ArchiveSectionKey[] // mehrere möglich (Sexauer: Main + Paper)
  themes?: ArchiveThemeKey[] // kuratorische Themen; mehrere möglich (Anmeldelisten Annalena 26.8.2026)
  stand: string // Standnummer laut Messeplan
  url?: string // Galerie-Website (aus dem ExhibitorPortal, Edition 2026)
}

export interface ArchiveEdition {
  edition: string // z. B. "2026"
  sections: ArchiveSectionMeta[]
  themes: ArchiveThemeMeta[]
  exhibitors: ArchiveExhibitor[]
}

// Sektionsfarben aus dem Messeplan 2026 gesampelt (26.8.2026).
export const SECTIONS_2026: ArchiveSectionMeta[] = [
  { key: 'main', label: { de: 'Main', en: 'Main' }, color: '#1C7CB4' },
  { key: 'solo', label: { de: 'Solo', en: 'Solo' }, color: '#74B47C' },
  { key: 'next', label: { de: 'Next', en: 'Next' }, color: '#D47C5C' },
  { key: 'paper', label: { de: 'Paper', en: 'Paper' }, color: '#6C84B4' },
  { key: 'friends', label: { de: 'Friends', en: 'Friends' }, color: '#FCF464' },
  { key: 'fragile', label: { de: 'Fragile Realities', en: 'Fragile Realities' }, color: '#CC5C7C' },
]

// Kuratorische Themen 2026 — Zuordnung aus den Anmeldelisten (Annalena,
// 26.8.2026): 39× Cosmic Feel · 18× Panic Attack · 12× Ōjigi; Mehrfach-
// Anmeldungen möglich (z. B. Mazzoli, Gebr. Lehmann).
export const THEMES_2026: ArchiveThemeMeta[] = [
  { key: 'cosmic', label: 'Cosmic Feel' },
  { key: 'panic', label: 'Panic Attack' },
  { key: 'ojigi', label: 'お辞儀 / Ōjigi' },
]

export const EXHIBITORS_2026: ArchiveExhibitor[] = [
  {name: '10 A.M. ART', cities: ['Mailand'], country: 'IT', sections: ['solo'], stand: 'D05', themes: ['cosmic'], url: 'https://www.10amart.it'},
  {name: 'AG18 Gallery', cities: ['Wien', 'Los Angeles'], country: 'AT', sections: ['next'], stand: 'H17', themes: ['cosmic'], url: 'https://ag18gallery.com/'},
  {name: 'Alexander Levy', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F01', url: 'https://www.alexanderlevy.de'},
  {name: 'Alice Folker Gallery', cities: ['Kopenhagen'], country: 'DK', sections: ['solo'], stand: 'G08', url: 'https://alicefolker.dk/'},
  {name: 'AM Galeria SP', cities: ['São Paulo'], country: 'BR', sections: ['next'], stand: 'H16', url: 'https://amgaleria.com.br/'},
  {name: 'Anahita Sadighi Gallery', cities: ['Berlin'], country: 'DE', sections: ['fragile'], stand: 'I01.6', url: 'https://www.anahitasadighi.com/'},
  {name: 'Andreae', cities: ['Bonn'], country: 'DE', sections: ['main'], stand: 'J09', url: 'https://galerie-andreae.de/'},
  {name: 'Anton Janizewski', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D09', themes: ['cosmic', 'panic'], url: 'https://antonjanizewski.com/'},
  {name: 'AOA;87', cities: ['Berlin'], country: 'DE', sections: ['solo'], stand: 'H02', themes: ['cosmic'], url: 'https://www.aoa-87.com/'},
  {name: 'Artesilva', cities: ['Seregno'], country: 'IT', sections: ['friends'], stand: 'I06', url: 'http://www.artesilva.com'},
  {name: 'Beck & Eggeling International Fine Art', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J01', url: 'https://www.beck-eggeling.de'},
  {name: 'Behncke Gallery', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H19', themes: ['cosmic'], url: 'https://behncke-gallery.com/de'},
  {name: 'Benden & Ackermann', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'I08', url: 'https://galerie-benden-ackermann.de'},
  {name: 'Bernhard Knaus Fine Art', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'I05', url: 'https://bernhardknaus.com/'},
  {name: 'Berthold Pott', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'H09', themes: ['ojigi'], url: 'https://www.bertholdpott.com'},
  {name: 'BOA-basedonart', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'C06', themes: ['ojigi'], url: 'https://boa-basedonart.com/'},
  {name: 'Britta Rettberg', cities: ['München'], country: 'DE', sections: ['next'], stand: 'D10', themes: ['cosmic'], url: 'https://brittarettberg.com/'},
  {name: 'Buchmann Galerie', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'B04', url: 'https://buchmanngalerie.com'},
  {name: 'carlier | gebauer', cities: ['Berlin', 'Madrid'], country: 'DE', sections: ['main'], stand: 'G07', url: 'https://www.carliergebauer.com/'},
  {name: 'City Galerie Wien', cities: ['Wien'], country: 'AT', sections: ['friends'], stand: 'F07', themes: ['cosmic'], url: 'https://city-galerie-wien.com/'},
  {name: 'Coelner Zimmer', cities: ['Düsseldorf'], country: 'DE', sections: ['next'], stand: 'H20', themes: ['panic'], url: 'https://coelner-zimmer.de/'},
  {name: 'COSAR', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'H06', url: 'https://cosar-gallery.com/'},
  {name: 'Crone', cities: ['Wien', 'Berlin'], country: 'AT', sections: ['solo'], stand: 'H05', themes: ['panic'], url: 'https://www.galeriecrone.com/'},
  {name: 'Dep Art Gallery', cities: ['Mailand', 'Ceglie Messapica'], country: 'IT', sections: ['friends'], stand: 'I06', url: 'https://www.depart.it/it/'},
  {name: 'Dittrich & Schlechtriem', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F06', url: 'https://dittrich-schlechtriem.com'},
  {name: 'DOD Gallery', cities: ['Köln'], country: 'DE', sections: ['fragile'], stand: 'I01.3', url: 'https://dodgallery.com/'},
  {name: 'Dürst Britt & Mayhew', cities: ['Den Haag'], country: 'NL', sections: ['solo'], stand: 'G15', themes: ['cosmic', 'panic'], url: 'https://www.durstbrittmayhew.com'},
  {name: 'Elektrohalle Rhomberg', cities: ['Salzburg'], country: 'AT', sections: ['next'], stand: 'E06', themes: ['cosmic'], url: 'https://elektrohalle-rhomberg.net'},
  {name: 'Encounter', cities: ['Lissabon'], country: 'PT', sections: ['next'], stand: 'D12', url: 'https://www.encountercontemporary.com/'},
  {name: 'Esther Schipper', cities: ['Berlin', 'Paris', 'Seoul'], country: 'DE', sections: ['main'], stand: 'D06', themes: ['cosmic'], url: 'https://www.estherschipper.com'},
  {name: 'EXILE', cities: ['Wien', 'Berlin'], country: 'AT', sections: ['main'], stand: 'D01', themes: ['ojigi'], url: 'https://exilegallery.org'},
  {name: 'Falko Alexander', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'G14', url: 'https://www.falko-alexander.com'},
  {name: 'fiebach, minninger', cities: ['Köln'], country: 'DE', sections: ['solo'], stand: 'G16', url: 'https://fiebach-minninger.com'},
  {name: 'Filiale', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'F04', url: 'https://www.galerie-filiale.de/news'},
  {name: 'Fuocherello', cities: ['Turin'], country: 'IT', sections: ['next'], stand: 'H15', themes: ['cosmic'], url: 'https://fuocherello.com'},
  {name: 'Galerie 3AP', cities: ['Düsseldorf', 'Frankfurt'], country: 'DE', sections: ['next'], stand: 'H23', themes: ['cosmic', 'panic'], url: 'https://galerie-3ap.de/'},
  {name: 'Galerie Andreas Binder', cities: ['München'], country: 'DE', sections: ['main'], stand: 'I07', themes: ['cosmic', 'ojigi'], url: 'https://www.galerieandreasbinder.de'},
  {name: 'Galerie Bene Taschen', cities: ['Köln'], country: 'DE', sections: ['solo'], stand: 'G11', url: 'https://www.benetaschen.com'},
  {name: 'Galerie Boisserée', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'G01', url: 'https://www.boisseree.com/'},
  {name: 'Galerie Burster', cities: ['Berlin', 'Karlsruhe'], country: 'DE', sections: ['solo'], stand: 'J03', url: 'https://www.galerieburster.com/'},
  {name: 'Galerie Bärbel Grässlin', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'F04', url: 'https://www.galerie-graesslin.de/'},
  {name: 'Galerie Dr. Dorothea van der Koelen', cities: ['Mainz', 'Venedig'], country: 'DE', sections: ['main'], stand: 'J07', themes: ['cosmic'], url: 'https://galerie.vanderkoelen.de/'},
  {name: 'Galerie Droste', cities: ['Düsseldorf', 'Berlin', 'Paris'], country: 'DE', sections: ['main'], stand: 'H12', themes: ['cosmic'], url: 'https://www.galeriedroste.com/'},
  {name: 'Galerie Elisabeth & Klaus Thoman', cities: ['Innsbruck', 'Wien'], country: 'AT', sections: ['main'], stand: 'H11', url: 'https://www.galeriethoman.com'},
  {name: 'Galerie Ernst Hilger', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'E04', themes: ['panic'], url: 'https://www.hilger.at/'},
  {name: 'Galerie Friese', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'B06', themes: ['ojigi'], url: 'https://www.galeriefriese.de/'},
  {name: 'Galerie Georg Nothelfer', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'H01', themes: ['cosmic'], url: 'https://www.galerie-nothelfer.de/de'},
  {name: 'Galerie Gisela Clement', cities: ['Bonn'], country: 'DE', sections: ['paper'], stand: 'B05.1', themes: ['cosmic', 'panic'], url: 'https://www.galerie-clement.de'},
  {name: 'Galerie Jochen Hempel', cities: ['Leipzig'], country: 'DE', sections: ['solo'], stand: 'I04', themes: ['cosmic'], url: 'https://jochenhempel.com'},
  {name: 'Galerie Kandlhofer', cities: ['Wien'], country: 'AT', sections: ['next'], stand: 'E05', url: 'https://www.kandlhofer.com/de/'},
  {name: 'Galerie Karin Guenther', cities: ['Hamburg'], country: 'DE', sections: ['friends'], stand: 'J06', url: 'https://www.galerie-karin-guenther.de/'},
  {name: 'Galerie Kaufmann', cities: ['Hamburg'], country: 'DE', sections: ['fragile'], stand: 'I01.7', url: 'https://galeriekaufmann.de/'},
  {name: 'Galerie Krinzinger', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'E03', url: 'https://galerie-krinzinger.at/'},
  {name: 'Galerie Lætitia Gorsy', cities: ['Leipzig'], country: 'DE', sections: ['main'], stand: 'F08', themes: ['panic'], url: 'https://www.shebam.art'},
  {name: 'Galerie Löhrl', cities: ['Mönchengladbach'], country: 'DE', sections: ['main'], stand: 'I02', url: 'https://galerieloehrl.de'},
  {name: 'Galerie Martin Kudlek', cities: ['Köln', 'Brüssel'], country: 'DE', sections: ['paper'], stand: 'B05.5', url: 'https://www.kudlek.com/'},
  {name: 'Galerie Max Mayer', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F03', url: 'https://maxmayer.net/'},
  {name: 'Galerie Roberta Keil', cities: ['Wien'], country: 'AT', sections: ['fragile'], stand: 'I01.1', url: 'https://www.robertakeil.com/'},
  {name: 'Galerie Rupert Pfab', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'A17', themes: ['ojigi'], url: 'https://www.galerie-pfab.com'},
  {name: 'Galerie Russi Klenner', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D11', url: 'https://www.russiklenner.de/'},
  {name: 'Galerie Steinek', cities: ['Wien'], country: 'AT', sections: ['solo'], stand: 'B02', themes: ['panic'], url: 'http://www.steinek.at'},
  {name: 'Galerie Watson', cities: ['Hamburg'], country: 'DE', sections: ['friends'], stand: 'G02', themes: ['cosmic'], url: 'https://www.galeriewatson.de/'},
  {name: 'Galerie Zink', cities: ['Waldkirchen'], country: 'DE', sections: ['main'], stand: 'H13', url: 'https://www.galerie-zink.com/home'},
  {name: 'Galerie3', cities: ['Wien', 'Klagenfurt'], country: 'AT', sections: ['solo'], stand: 'G12', themes: ['panic'], url: 'https://galerie3.com/'},
  {name: 'Galleria Studio G7', cities: ['Bologna'], country: 'IT', sections: ['main'], stand: 'G10', themes: ['cosmic', 'panic'], url: 'https://galleriastudiog7.it'},
  {name: 'Gebr. Lehmann', cities: ['Dresden'], country: 'DE', sections: ['paper'], stand: 'B05.2', themes: ['panic', 'ojigi'], url: 'https://www.galerie-gebr-lehmann.de/'},
  {name: 'Gether Contemporary', cities: ['Kopenhagen'], country: 'DK', sections: ['main'], stand: 'A12', themes: ['cosmic'], url: 'https://gethercontemporary.com'},
  {name: 'Gezwanzig', cities: ['Wien', 'Innsbruck'], country: 'AT', sections: ['next'], stand: 'A10', themes: ['cosmic'], url: 'https://www.gezwanzig.com'},
  {name: 'Grölle', cities: ['Wuppertal', 'Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J11', themes: ['cosmic'], url: 'https://www.groelle.de'},
  {name: 'HOS Gallery', cities: ['Warschau'], country: 'PL', sections: ['next'], stand: 'D08', themes: ['panic'], url: 'https://www.hosgallery.pl'},
  {name: 'Jahn und Jahn', cities: ['München', 'Lissabon'], country: 'DE', sections: ['main'], stand: 'H07', url: 'https://www.jahnundjahn.com/'},
  {name: 'Kai Middendorff Galerie', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'A16', url: 'http://www.kaimiddendorff.de'},
  {name: 'Kaune Gallery', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'B01', themes: ['cosmic'], url: 'https://www.kaunegallery.com/'},
  {name: 'Knust Kunz Galerie', cities: ['München'], country: 'DE', sections: ['paper'], stand: 'B05.4', themes: ['cosmic'], url: 'https://www.sabineknust.com'},
  {name: 'Konrad Fischer Galerie', cities: ['Düsseldorf', 'Berlin', 'Los Angeles'], country: 'DE', sections: ['main'], stand: 'C05', url: 'https://www.konradfischergalerie.de'},
  {name: 'Kornfeld Galerie', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'J08', themes: ['ojigi'], url: 'https://kornfeldgalerie.com'},
  {name: 'Kristin Hjellegjerde Gallery', cities: ['London', 'Berlin', 'West Palm Beach'], country: 'GB', sections: ['fragile'], stand: 'I01.2', url: 'https://kristinhjellegjerde.com/'},
  {name: 'La Bibi + Reus', cities: ['Palma de Mallorca'], country: 'ES', sections: ['main'], stand: 'H04', themes: ['cosmic'], url: 'https://labibigallery.com/'},
  {name: 'LABS Contemporary Art', cities: ['Bologna'], country: 'IT', sections: ['paper'], stand: 'B05.3', themes: ['cosmic'], url: 'https://www.labsgallery.it/'},
  {name: 'Lage Egal Curatorial Projects', cities: ['Brüssel', 'Berlin'], country: 'BE', sections: ['main'], stand: 'A15', url: 'https://www.lage-egal.net'},
  {name: 'Linn Lühn', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'G06', themes: ['cosmic'], url: 'https://linnluehn.com/'},
  {name: 'Lohaus Sominsky', cities: ['München'], country: 'DE', sections: ['main'], stand: 'H10', themes: ['ojigi'], url: 'https://lohaussominsky.com/'},
  {name: 'Ludorff', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J10', themes: ['panic'], url: 'https://www.ludorff.com/'},
  {name: 'MAM Mario Mauroner Contemporary Art', cities: ['Salzburg'], country: 'AT', sections: ['main'], stand: 'J04', themes: ['cosmic'], url: 'https://www.galerie-mam.com'},
  {name: 'Martinetz', cities: ['Köln'], country: 'DE', sections: ['fragile'], stand: 'I01.8', url: 'https://www.petramartinetz.de/'},
  {name: 'max goelitz', cities: ['München', 'Berlin'], country: 'DE', sections: ['main'], stand: 'G04', url: 'https://www.maxgoelitz.com/'},
  {name: 'Mazzoli', cities: ['Berlin', 'Modena'], country: 'DE', sections: ['main'], stand: 'D02', themes: ['cosmic', 'panic'], url: 'https://www.galleriamazzoli.com'},
  {name: 'NADAN', cities: ['Berlin'], country: 'DE', sections: ['friends'], stand: 'G02', themes: ['cosmic', 'ojigi'], url: 'https://nadan.org/'},
  {name: 'Nosbaum Reding', cities: ['Luxemburg', 'Brüssel'], country: 'LU', sections: ['main'], stand: 'C01', url: 'https://www.nosbaumreding.com/'},
  {name: 'Nouveaux Deuxdeux', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H14', themes: ['cosmic'], url: 'https://deuxdeux.de/'},
  {name: 'OstLicht. Gallery for Photography', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'J02', themes: ['ojigi'], url: 'https://www.ostlicht.org/site/de/home'},
  {name: 'Patrick Heide Contemporary Art', cities: ['London', 'Brüssel'], country: 'GB', sections: ['paper'], stand: 'B05.6', themes: ['ojigi'], url: 'https://www.patrickheide.com/'},
  {name: 'PAW', cities: ['Karlsruhe'], country: 'DE', sections: ['next'], stand: 'E07', url: 'https://pawgallery.de'},
  {name: 'Persons Projects', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'G09', themes: ['cosmic'], url: 'https://www.personsprojects.com/'},
  {name: 'Petra Rinck Galerie', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'I03', url: 'https://www.petrarinckgalerie.de/'},
  {name: 'Petrine', cities: ['Paris', 'Düsseldorf'], country: 'FR', sections: ['main'], stand: 'G03', url: 'https://petrine.fr'},
  {name: 'Piero Atchugarry Gallery', cities: ['Miami', 'Garzón'], country: 'US', sections: ['main'], stand: 'E02', themes: ['cosmic'], url: 'https://pieroatchugarry.com/'},
  {name: 'Produzentengalerie Hamburg', cities: ['Hamburg'], country: 'DE', sections: ['main'], stand: 'B03', url: 'https://www.produzentengalerie.com/'},
  {name: 'Rehbein Galerie', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'D03', themes: ['cosmic'], url: 'https://rehbein-galerie.de/'},
  {name: 'Reiners Contemporary Art', cities: ['Marbella'], country: 'ES', sections: ['fragile'], stand: 'I01.4', url: 'https://www.reinerscontemporaryart.eu'},
  {name: 'RizzutoGallery', cities: ['Palermo', 'Düsseldorf'], country: 'IT', sections: ['main'], stand: 'A13', url: 'https://www.rizzutogallery.com/'},
  {name: 'Robert Morat Galerie', cities: ['Berlin'], country: 'DE', sections: ['solo'], stand: 'A11', url: 'https://www.robertmorat.de'},
  {name: 'Ruttkowski;68', cities: ['Düsseldorf', 'Köln', 'Bochum', 'Paris', 'New York'], country: 'DE', sections: ['main'], stand: 'C04', url: 'https://www.ruttkowski68.com/'},
  {name: 'SchenkWeitzdörfer', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'F05', url: 'https://www.schenkweitzdoerfer.com'},
  {name: 'See You Next Tuesday', cities: ['Basel'], country: 'CH', sections: ['fragile'], stand: 'I01.5', url: 'https://seeyounexttuesday.ch'},
  {name: 'SETAREH', cities: ['Düsseldorf', 'Berlin', 'London'], country: 'DE', sections: ['main'], stand: 'H03', url: 'https://www.setareh.com'},
  {name: 'Sevil Dolmaci', cities: ['Istanbul', 'Dubai'], country: 'TR', sections: ['main'], stand: 'C03', themes: ['cosmic'], url: 'http://sevildolmaci.com'},
  {name: 'SEXAUER', cities: ['Berlin'], country: 'DE', sections: ['main', 'paper'], stand: 'A14', url: 'https://sexauer.eu/'},
  {name: 'Shore', cities: ['Wien'], country: 'AT', sections: ['friends'], stand: 'F07', themes: ['panic'], url: 'https://shore-gallery.eu/'},
  {name: 'Sies + Höke', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'G05', url: 'https://www.sieshoeke.com/'},
  {name: 'Société', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F02', url: 'https://societeberlin.com'},
  {name: 'Soy Capitán', cities: ['Berlin'], country: 'DE', sections: ['friends'], stand: 'J05', themes: ['cosmic'], url: 'https://soycapitan.de/'},
  {name: 'Sperling', cities: ['München'], country: 'DE', sections: ['main'], stand: 'D04', url: 'https://www.sperling-munich.com'},
  {name: 'Suppan', cities: ['Wien'], country: 'AT', sections: ['next'], stand: 'H21', url: 'https://suppan.art/'},
  {name: 'The Tiger Room', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H22', url: 'https://thetigerroom.de'},
  {name: 'THK Gallery', cities: ['Kapstadt', 'Köln'], country: 'ZA', sections: ['main'], stand: 'H18', themes: ['panic'], url: 'https://www.thkgallery.com'},
  {name: 'VAN HORN', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'H08', themes: ['cosmic', 'panic'], url: 'https://van-horn.net'},
  {name: 'Walter Storms Galerie', cities: ['München', 'Berlin'], country: 'DE', sections: ['solo'], stand: 'C02', themes: ['cosmic'], url: 'https://www.storms-galerie.de/'},
  {name: 'Weserhalle', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D07', url: 'https://weserhalle.com/'},
]

export const ARCHIVE_EDITIONS: Record<string, ArchiveEdition> = {
  '2026': { edition: '2026', sections: SECTIONS_2026, themes: THEMES_2026, exhibitors: EXHIBITORS_2026 },
}
