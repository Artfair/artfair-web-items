# Leisten-Vertrag — web-items

Dieses Repo ist der **Schrank**: die Leisten (Bausteine), aus denen die Websites aller
Mandanten gebaut werden (art.fair, Tokyo Gendai …), und ihre **Griffe**, mit denen Webby
sie befüllt. Wer hier eine Leiste baut oder ändert — Mensch oder Code-KI —, hält sich an
diesen Vertrag. Die Prüfung `npm run pruefen` setzt ihn bei jedem PR durch.

**Freigabe:** Neue und geänderte Leisten kommen als PR. Zusammengeführt wird nur von
Walter Gehlen. Nie direkt auf `main` pushen.

## Was eine Leiste ist — fünf Teile

| Teil | Wo | Was |
|---|---|---|
| 1. Datenform | `src/lib/sections.ts` | `interface XSection { _key: string; _type: "x"; … }`, in die Union `Section` aufnehmen |
| 2. Vorderseite | `src/components/items/XItem.tsx` (+ Export in `items/index.ts`) | Darstellung auf der Website |
| 3. Renderer-Fall | `src/components/SectionRenderer.tsx` | `case "x":` — Datenform → Props der Vorderseite |
| 4. Griff | `src/lib/griffe.ts` (`GRIFFE`) | Fächer, Beschriftung, Gruppe, Startbefüllung |
| 5. Beschreibung | `name` + `hinweis` im Griff | wofür die Leiste da ist, in einer Zeile |

Beispieldaten entstehen automatisch aus dem Griff (`beispiel(griff, "leer" | "voll")`).
Die Prüfung rendert jede Leiste damit, Webbys **Schaukasten** zeigt sie.

## Regeln

**Datenform**
- Texte, die übersetzt werden: `Loc` (`{ de?, en?, … }` — offene Sprachachse, nie nur `de`/`en` annehmen).
- Text ohne Übersetzung (Sprungmarke, Adresse, Zahl): `string`.
- Bilder: `ImageRef`. Knöpfe: `Cta`. Listen: Array von Objekten mit `_key`.
- Sprungmarke heißt immer `anchor`.

**Vorderseite**
- Bekommt alles über Props. **Keine Datenzugriffe**: kein `fetch` (außer `POST` zum Absenden
  eines Formulars — der Bot-Schutz `BotShieldFields` holt dafür per `GET` ein Token von derselben
  Formular-Route), keine Imports aus `@sanity/*`, `@supabase/*`, `next/headers`, `server-only`, `node:`.
- **Nur Marken-Tokens** für Farben und Schriften (`brand-*`, `var(--brand-…)`, `font-*` aus dem
  Preset). Keine festen Farbwerte (`#…`, `rgb(…)`); erlaubt ist durchsichtiges Schwarz/Weiß
  (`rgba(0,0,0,…)`, `rgba(255,255,255,…)`) für Schleier über Fotos.
- **Mandanten-neutral:** keine Messe-Namen, Domains oder festen Texte einer Marke
  (nicht „Art Düsseldorf“, „art-dus.de“, „Tokyo Gendai“). Rückfalltexte kommen aus dem Griff
  oder der Instanz.
- Leere Felder sind normal: die Leiste sieht auch halb befüllt ordentlich aus oder blendet
  sich aus (dann im Renderer `return null`).
- Bilder mit `alt`; Überschriften-Hierarchie beachten (eine Leiste trägt höchstens dann eine
  H1, wenn sie Seitenkopf ist — im `hinweis` sagen).

**Griff**
- Jede neue Leiste hat einen Griff. Ohne Griff ist sie in Webby nicht befüllbar.
- `gruppe` ist eine Überschrift aus Webbys Menü „Abschnitt hinzufügen“:
  Layout · Kopf / Hero · Inhalt · Medien & Logos · Programm & Newsletter · Ganze Seiten · Formulare.
- Jedes Fach (`feld`) gibt es in der Datenform. Fach-Arten: `text`, `loc`, `bild`, `knopf`,
  `bildliste`, `wahl`, `liste` (mit `eintrag`-Fächern, optional `sortierbar`, `start`,
  `hoechstens`, `mindestens`), `locliste`, `logofein`, `zwischentitel`, `notiz`.
- Braucht eine Leiste eine Fach-Art, die es nicht gibt: nicht improvisieren, sondern im PR
  beschreiben — neue Fach-Arten brauchen eine Änderung an Webbys Halterung (WG).
- `mindestens` setzen, wenn die Website die Leiste erst ab einer Anzahl zeigt — sonst sind
  die Beispieldaten zu kurz.

## Wo der Vertrag endet: der Anschluss

Woher kommen die Daten einer Leiste?

1. **Aus der Seite** (die Redaktion tippt sie in Webby ein) — fast alle Leisten. Ganz im Vertrag.
2. **Fest im Code** (z. B. Galerien-Archiv 2026) — im Vertrag.
3. **Live aus einer Datenbank** (Supabase/ERIC-Katalog, Künstler, eigene Sanity-Dokumente) —
   hier endet der Vertrag. Die Leiste **beschreibt** im PR, welche Daten sie braucht:
   Name des Anschlusses, exakte TypeScript-Form der Daten, und rendert in Prüfung und
   Schaukasten mit Beispieldaten in dieser Form. **Die Abfrage selbst** (Zugang, Rechte,
   Zwischenspeicher, Schlüssel) baut die WG in der Instanz und reicht die Daten über den
   `SectionRenderer` herein (Muster: `magazine` für den Magazin-Streifen).
   Code-KIs schreiben keine Abfragen gegen echte Daten und bekommen keine Schlüssel.

Ebenfalls außerhalb: neue Fach-Arten in Webby, Releases (Version + Tag) und das Nachziehen
der Version in den Instanzen (AD27, Webby) — das macht die WG nach der Freigabe.

## Ablauf

1. Zweig anlegen, die fünf Teile bauen.
2. `npm install` und `npm run pruefen` — muss „Vertrag erfüllt.“ melden.
3. PR öffnen: was die Leiste kann, ggf. Anschluss-Beschreibung. Vercel baut zu jedem PR eine
   Vorschau des **Schaukastens** (`schaukasten/`, Projekt `web-items-schaukasten`) — der Link
   erscheint im PR. Lokal: `cd schaukasten && npm install && npm run dev` (Port 3110).
4. Walter prüft die neue Leiste im Schaukasten-Link und führt zusammen (main ist geschützt:
   PR mit grüner Prüfung Pflicht, nur Walter führt zusammen).

## Bestand

Älter als dieser Vertrag und daher in der Prüfung als Ausnahme geführt (`scripts/pruefe-leisten.ts`):
- `OHNE_GRIFF`: Leisten, deren Formular in Webby noch von Hand geschrieben ist. Wird kleiner,
  nie größer.
- `BESTAND`: Altlasten (feste Farben, Messe-Namen) in bestimmten Vorderseiten, je mit Grund.
  Ein neuer Eintrag ist eine bewusste Ausnahme und braucht Walters Freigabe im PR.

Die Prüfung meldet, wenn ein Bestandseintrag behoben ist und gestrichen werden kann.
