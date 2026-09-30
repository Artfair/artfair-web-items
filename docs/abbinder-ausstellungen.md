# Abbinder „Ausstellungen" (MagVenuesItem) — Handoff

**Stand:** 30.9.2026 · Paket v1.3.0 · erster Einsatz: Gräfling-Sammlerinterview

## Was es ist

Der Soft-Rosé-Kasten (`#efdfe5`, Farbe aus dem Gräfling-Content-Newsletter) am
Ende eines Magazin-Artikels, der auf laufende Ausstellungen hinweist — Lime-Chip
als Label, Orte als Spalten, Enddatum als Outline-Pille. Ursprünglich (v1.2.0)
nur als CSS gedacht, Markup als roher `htmlBlock` aus Webby. **Seit v1.3.0 ist
er ein globales Item:** typisierte Komponente `MagVenuesItem` im Paket, die
Redaktion füllt Felder statt HTML zu kopieren. Einsetzbar unter jedem Artikel.

## Bausteine

- **Paket:** `src/components/items/MagVenuesItem.tsx` (Export über den
  Schrank) + Styles `.mag-venues` in `src/styles/magazine.css`.
- **AD27:** Body-Block `venuesBlock` — Typ in `lib/magazine/types.ts`,
  GROQ-Projektion in `lib/magazine/queries.ts`, Render-Case in
  `app/[lang]/magazine/[segment]/page.tsx`. Ohne gepflegtes Label fällt der
  Chip auf „Aktuelle Ausstellungen" / „Currently on view" zurück (Sprache des
  Artikels); fürs Gräfling-Interview ist „Die Sammlung erleben" gesetzt.

## Felder je Ort (`venues[]`)

| Feld | Pflicht | Beispiel |
| --- | --- | --- |
| `name` | ja | Salon Kennedy |
| `address` | nein | Cranachstraße 5 · Frankfurt am Main |
| `linkLabel` + `href` | nein | Ausstellungstitel → externe Seite |
| `date` | nein | bis 15. Februar 2027 |

Einträge ohne `name` und Blöcke ohne Einträge werden nicht gerendert — die
Seite bricht nie.

## Offen (Webby)

1. Eingabemaske für den Body-Block `venuesBlock` anlegen (Label optional +
   Liste der Orte mit den vier Feldern oben) — ersetzt den htmlBlock-Weg.
2. Paket-Pin auf `v1.3.0` heben, damit die Editor-Vorschau dasselbe Item
   rendert.
3. Tag `v1.3.0` setzen, sobald der Branch gemerged ist — AD27s Pin und
   Lockfile lösen über Git-Tags (siehe AD27-Commit zur Linkseite, v0.16.0).
