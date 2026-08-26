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
  stand: string // Standnummer laut Messeplan
  url?: string // optional nachrüstbar (Portal führte 2026 Websites)
}

export interface ArchiveEdition {
  edition: string // z. B. "2026"
  sections: ArchiveSectionMeta[]
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

export const EXHIBITORS_2026: ArchiveExhibitor[] = [
  {name: '10 A.M. ART', cities: ['Mailand'], country: 'IT', sections: ['solo'], stand: 'D05'},
  {name: 'AG18 Gallery', cities: ['Wien', 'Los Angeles'], country: 'AT', sections: ['next'], stand: 'H17'},
  {name: 'Alexander Levy', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F01'},
  {name: 'Alice Folker Gallery', cities: ['Kopenhagen'], country: 'DK', sections: ['solo'], stand: 'G08'},
  {name: 'AM Galeria SP', cities: ['São Paulo'], country: 'BR', sections: ['next'], stand: 'H16'},
  {name: 'Anahita Sadighi Gallery', cities: ['Berlin'], country: 'DE', sections: ['fragile'], stand: 'I01.6'},
  {name: 'Andreae', cities: ['Bonn'], country: 'DE', sections: ['main'], stand: 'J09'},
  {name: 'Anton Janizewski', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D09'},
  {name: 'AOA;87', cities: ['Berlin'], country: 'DE', sections: ['solo'], stand: 'H02'},
  {name: 'Artesilva', cities: ['Seregno'], country: 'IT', sections: ['friends'], stand: 'I06'},
  {name: 'Beck & Eggeling International Fine Art', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J01'},
  {name: 'Behncke Gallery', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H19'},
  {name: 'Benden & Ackermann', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'I08'},
  {name: 'Bernhard Knaus Fine Art', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'I05'},
  {name: 'Berthold Pott', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'H09'},
  {name: 'BOA-basedonart', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'C06'},
  {name: 'Britta Rettberg', cities: ['München'], country: 'DE', sections: ['next'], stand: 'D10'},
  {name: 'Buchmann Galerie', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'B04'},
  {name: 'carlier | gebauer', cities: ['Berlin', 'Madrid'], country: 'DE', sections: ['main'], stand: 'G07'},
  {name: 'City Galerie Wien', cities: ['Wien'], country: 'AT', sections: ['friends'], stand: 'F07'},
  {name: 'Coelner Zimmer', cities: ['Düsseldorf'], country: 'DE', sections: ['next'], stand: 'H20'},
  {name: 'COSAR', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'H06'},
  {name: 'Crone', cities: ['Wien', 'Berlin'], country: 'AT', sections: ['solo'], stand: 'H05'},
  {name: 'Dep Art Gallery', cities: ['Mailand', 'Ceglie Messapica'], country: 'IT', sections: ['friends'], stand: 'I06'},
  {name: 'Dittrich & Schlechtriem', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F06'},
  {name: 'DOD Gallery', cities: ['Köln'], country: 'DE', sections: ['fragile'], stand: 'I01.3'},
  {name: 'Dürst Britt & Mayhew', cities: ['Den Haag'], country: 'NL', sections: ['solo'], stand: 'G15'},
  {name: 'Elektrohalle Rhomberg', cities: ['Salzburg'], country: 'AT', sections: ['next'], stand: 'E06'},
  {name: 'Encounter', cities: ['Lissabon'], country: 'PT', sections: ['next'], stand: 'D12'},
  {name: 'Esther Schipper', cities: ['Berlin', 'Paris', 'Seoul'], country: 'DE', sections: ['main'], stand: 'D06'},
  {name: 'EXILE', cities: ['Wien', 'Berlin'], country: 'AT', sections: ['main'], stand: 'D01'},
  {name: 'Falko Alexander', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'G14'},
  {name: 'fiebach, minninger', cities: ['Köln'], country: 'DE', sections: ['solo'], stand: 'G16'},
  {name: 'Filiale', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'F04'},
  {name: 'Fuocherello', cities: ['Turin'], country: 'IT', sections: ['next'], stand: 'H15'},
  {name: 'Galerie 3AP', cities: ['Düsseldorf', 'Frankfurt'], country: 'DE', sections: ['next'], stand: 'H23'},
  {name: 'Galerie Andreas Binder', cities: ['München'], country: 'DE', sections: ['main'], stand: 'I07'},
  {name: 'Galerie Bene Taschen', cities: ['Köln'], country: 'DE', sections: ['solo'], stand: 'G11'},
  {name: 'Galerie Boisserée', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'G01'},
  {name: 'Galerie Burster', cities: ['Berlin', 'Karlsruhe'], country: 'DE', sections: ['solo'], stand: 'J03'},
  {name: 'Galerie Bärbel Grässlin', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'F04'},
  {name: 'Galerie Dr. Dorothea van der Koelen', cities: ['Mainz', 'Venedig'], country: 'DE', sections: ['main'], stand: 'J07'},
  {name: 'Galerie Droste', cities: ['Düsseldorf', 'Berlin', 'Paris'], country: 'DE', sections: ['main'], stand: 'H12'},
  {name: 'Galerie Elisabeth & Klaus Thoman', cities: ['Innsbruck', 'Wien'], country: 'AT', sections: ['main'], stand: 'H11'},
  {name: 'Galerie Ernst Hilger', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'E04'},
  {name: 'Galerie Friese', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'B06'},
  {name: 'Galerie Georg Nothelfer', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'H01'},
  {name: 'Galerie Gisela Clement', cities: ['Bonn'], country: 'DE', sections: ['paper'], stand: 'B05.1'},
  {name: 'Galerie Jochen Hempel', cities: ['Leipzig'], country: 'DE', sections: ['solo'], stand: 'I04'},
  {name: 'Galerie Kandlhofer', cities: ['Wien'], country: 'AT', sections: ['next'], stand: 'E05'},
  {name: 'Galerie Karin Guenther', cities: ['Hamburg'], country: 'DE', sections: ['friends'], stand: 'J06'},
  {name: 'Galerie Kaufmann', cities: ['Hamburg'], country: 'DE', sections: ['fragile'], stand: 'I01.7'},
  {name: 'Galerie Krinzinger', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'E03'},
  {name: 'Galerie Lætitia Gorsy', cities: ['Leipzig'], country: 'DE', sections: ['main'], stand: 'F08'},
  {name: 'Galerie Löhrl', cities: ['Mönchengladbach'], country: 'DE', sections: ['main'], stand: 'I02'},
  {name: 'Galerie Martin Kudlek', cities: ['Köln', 'Brüssel'], country: 'DE', sections: ['paper'], stand: 'B05.5'},
  {name: 'Galerie Max Mayer', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F03'},
  {name: 'Galerie Roberta Keil', cities: ['Wien'], country: 'AT', sections: ['fragile'], stand: 'I01.1'},
  {name: 'Galerie Rupert Pfab', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'A17'},
  {name: 'Galerie Russi Klenner', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D11'},
  {name: 'Galerie Steinek', cities: ['Wien'], country: 'AT', sections: ['solo'], stand: 'B02'},
  {name: 'Galerie Watson', cities: ['Hamburg'], country: 'DE', sections: ['friends'], stand: 'G02'},
  {name: 'Galerie Zink', cities: ['Waldkirchen'], country: 'DE', sections: ['main'], stand: 'H13'},
  {name: 'Galerie3', cities: ['Wien', 'Klagenfurt'], country: 'AT', sections: ['solo'], stand: 'G12'},
  {name: 'Galleria Studio G7', cities: ['Bologna'], country: 'IT', sections: ['main'], stand: 'G10'},
  {name: 'Gebr. Lehmann', cities: ['Dresden'], country: 'DE', sections: ['paper'], stand: 'B05.2'},
  {name: 'Gether Contemporary', cities: ['Kopenhagen'], country: 'DK', sections: ['main'], stand: 'A12'},
  {name: 'Gezwanzig', cities: ['Wien', 'Innsbruck'], country: 'AT', sections: ['next'], stand: 'A10'},
  {name: 'Grölle', cities: ['Wuppertal', 'Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J11'},
  {name: 'HOS Gallery', cities: ['Warschau'], country: 'PL', sections: ['next'], stand: 'D08'},
  {name: 'Jahn und Jahn', cities: ['München', 'Lissabon'], country: 'DE', sections: ['main'], stand: 'H07'},
  {name: 'Kai Middendorff Galerie', cities: ['Frankfurt'], country: 'DE', sections: ['main'], stand: 'A16'},
  {name: 'Kaune Gallery', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'B01'},
  {name: 'Knust Kunz Galerie', cities: ['München'], country: 'DE', sections: ['paper'], stand: 'B05.4'},
  {name: 'Konrad Fischer Galerie', cities: ['Düsseldorf', 'Berlin', 'Los Angeles'], country: 'DE', sections: ['main'], stand: 'C05'},
  {name: 'Kornfeld Galerie', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'J08'},
  {name: 'Kristin Hjellegjerde Gallery', cities: ['London', 'Berlin', 'West Palm Beach'], country: 'GB', sections: ['fragile'], stand: 'I01.2'},
  {name: 'La Bibi + Reus', cities: ['Palma de Mallorca'], country: 'ES', sections: ['main'], stand: 'H04'},
  {name: 'LABS Contemporary Art', cities: ['Bologna'], country: 'IT', sections: ['paper'], stand: 'B05.3'},
  {name: 'Lage Egal Curatorial Projects', cities: ['Brüssel', 'Berlin'], country: 'BE', sections: ['main'], stand: 'A15'},
  {name: 'Linn Lühn', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'G06'},
  {name: 'Lohaus Sominsky', cities: ['München'], country: 'DE', sections: ['main'], stand: 'H10'},
  {name: 'Ludorff', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'J10'},
  {name: 'MAM Mario Mauroner Contemporary Art', cities: ['Salzburg'], country: 'AT', sections: ['main'], stand: 'J04'},
  {name: 'Martinetz', cities: ['Köln'], country: 'DE', sections: ['fragile'], stand: 'I01.8'},
  {name: 'max goelitz', cities: ['München', 'Berlin'], country: 'DE', sections: ['main'], stand: 'G04'},
  {name: 'Mazzoli', cities: ['Berlin', 'Modena'], country: 'DE', sections: ['main'], stand: 'D02'},
  {name: 'NADAN', cities: ['Berlin'], country: 'DE', sections: ['friends'], stand: 'G02'},
  {name: 'Nosbaum Reding', cities: ['Luxemburg', 'Brüssel'], country: 'LU', sections: ['main'], stand: 'C01'},
  {name: 'Nouveaux Deuxdeux', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H14'},
  {name: 'OstLicht. Gallery for Photography', cities: ['Wien'], country: 'AT', sections: ['main'], stand: 'J02'},
  {name: 'Patrick Heide Contemporary Art', cities: ['London', 'Brüssel'], country: 'GB', sections: ['paper'], stand: 'B05.6'},
  {name: 'PAW', cities: ['Karlsruhe'], country: 'DE', sections: ['next'], stand: 'E07'},
  {name: 'Persons Projects', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'G09'},
  {name: 'Petra Rinck Galerie', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'I03'},
  {name: 'Petrine', cities: ['Paris', 'Düsseldorf'], country: 'FR', sections: ['main'], stand: 'G03'},
  {name: 'Piero Atchugarry Gallery', cities: ['Miami', 'Garzón'], country: 'US', sections: ['main'], stand: 'E02'},
  {name: 'Produzentengalerie Hamburg', cities: ['Hamburg'], country: 'DE', sections: ['main'], stand: 'B03'},
  {name: 'Rehbein Galerie', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'D03'},
  {name: 'Reiners Contemporary Art', cities: ['Marbella'], country: 'ES', sections: ['fragile'], stand: 'I01.4'},
  {name: 'RizzutoGallery', cities: ['Palermo', 'Düsseldorf'], country: 'IT', sections: ['main'], stand: 'A13'},
  {name: 'Robert Morat Galerie', cities: ['Berlin'], country: 'DE', sections: ['solo'], stand: 'A11'},
  {name: 'Ruttkowski;68', cities: ['Düsseldorf', 'Köln', 'Bochum', 'Paris', 'New York'], country: 'DE', sections: ['main'], stand: 'C04'},
  {name: 'SchenkWeitzdörfer', cities: ['Köln'], country: 'DE', sections: ['main'], stand: 'F05'},
  {name: 'See You Next Tuesday', cities: ['Basel'], country: 'CH', sections: ['fragile'], stand: 'I01.5'},
  {name: 'SETAREH', cities: ['Düsseldorf', 'Berlin', 'London'], country: 'DE', sections: ['main'], stand: 'H03'},
  {name: 'Sevil Dolmaci', cities: ['Istanbul', 'Dubai'], country: 'TR', sections: ['main'], stand: 'C03'},
  {name: 'SEXAUER', cities: ['Berlin'], country: 'DE', sections: ['main', 'paper'], stand: 'A14'},
  {name: 'Shore', cities: ['Wien'], country: 'AT', sections: ['friends'], stand: 'F07'},
  {name: 'Sies + Höke', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'G05'},
  {name: 'Société', cities: ['Berlin'], country: 'DE', sections: ['main'], stand: 'F02'},
  {name: 'Soy Capitán', cities: ['Berlin'], country: 'DE', sections: ['friends'], stand: 'J05'},
  {name: 'Sperling', cities: ['München'], country: 'DE', sections: ['main'], stand: 'D04'},
  {name: 'Suppan', cities: ['Wien'], country: 'AT', sections: ['next'], stand: 'H21'},
  {name: 'The Tiger Room', cities: ['München'], country: 'DE', sections: ['next'], stand: 'H22'},
  {name: 'THK Gallery', cities: ['Kapstadt', 'Köln'], country: 'ZA', sections: ['main'], stand: 'H18'},
  {name: 'VAN HORN', cities: ['Düsseldorf'], country: 'DE', sections: ['main'], stand: 'H08'},
  {name: 'Walter Storms Galerie', cities: ['München', 'Berlin'], country: 'DE', sections: ['solo'], stand: 'C02'},
  {name: 'Weserhalle', cities: ['Berlin'], country: 'DE', sections: ['next'], stand: 'D07'},
]

export const ARCHIVE_EDITIONS: Record<string, ArchiveEdition> = {
  '2026': { edition: '2026', sections: SECTIONS_2026, exhibitors: EXHIBITORS_2026 },
}
