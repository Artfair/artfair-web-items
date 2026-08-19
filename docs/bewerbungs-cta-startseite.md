# Bewerbungs-News auf der Startseite — Webby-Pflegeanleitung

**Entscheidung (Annalena, 19.8.2026, nachmittags):** Der Bewerbungs-Riegel wird
zum **News-Item mit Datums-Kasten** (`newsDate`, neu in v0.14.0) — nach dem
Design-Handoff „Bewerbungsbereich" (GitHub-Ordner `design_handoff_bewerbungsbereich`).
Ersetzt das schlichte `textCta`-Item vom 19.8. vormittags („etwas einsam"),
das wiederum die frühere Badge-Spezifikation ersetzt hatte.

Links Text wie beim Text-CTA (Eyebrow, Headline, Fließtext, optional Knopf),
rechts ein Datums-Kasten: zwei Versalzeilen, großes Datum, Unterzeile.

- **Zustand A (bis 31.8.):** Kasten mit Lime-Rahmen kündigt an, wann das
  Portal öffnet; kein Knopf.
- **Zustand B (ab 1.9.):** Kasten als gefüllte Lime-Fläche zeigt die
  Bewerbungsfrist; Knopf „Zum Bewerbungsportal" erscheint.

---

## Anlegen in Webby

Startseite → das bestehende „Text + Knopf"-Item (Bewerbung) durch den neuen
Abschnitt **„News + Datum"** (`newsDate`) ersetzen. Position bleibt: direkt
nach dem **Willkommen-Panel** (`welcomePanel`).

Feste Felder (in beiden Zuständen gleich):

| Feld | Wert |
|---|---|
| `anchor` | `bewerbung` |
| `eyebrow` | DE `Für Galerien` · EN `For galleries` |
| `heading` | DE `Bewerbung zur\nArt Düsseldorf 2027` · EN `Apply to\nArt Düsseldorf 2027` |
| `boxKicker` | DE `Bewerbungsportal` · EN `Application portal` |
| `cta.label` | DE `Zum Bewerbungsportal` · EN `Application portal` |
| `cta.href` | Portal-URL — **noch offen** |

⚠️ Ausgaben-Jahr („2027") weiterhin unbestätigt — vor dem Anlegen klären.

## Zustand A — vor Bewerbungsstart (jetzt)

| Feld | Wert |
|---|---|
| `body` | DE `Das Bewerbungsportal für die kommende Ausgabe öffnet am 1. September 2026. Alle Informationen zu Konditionen und Ablauf finden Sie dann an dieser Stelle.` · EN `The application portal for the upcoming edition opens on September 1, 2026. Details on conditions and the application process will be available here.` |
| `boxIntro` | DE `Öffnet am` · EN `Opens on` |
| `boxDate` | `1.` |
| `boxLabel` | `September` (DE = EN) |
| `boxTone` | `outline` (Lime-Rahmen) |
| `cta.hidden` | `true` |

## Zustand B — Frist läuft (ab 1.9., manuell umschalten)

1. `cta.href` auf die finale Portal-URL setzen (falls noch nicht geschehen),
   `cta.hidden` auf `false`.
2. Felder ändern:

| Feld | Wert |
|---|---|
| `body` | DE `Die Bewerbung läuft vom 1. September bis 28. Oktober 2026. Alle Informationen zu Konditionen und Ablauf finden Sie im Bewerbungsportal.` · EN `Applications are open from September 1 to October 28, 2026. You will find all details on conditions and the application process in the application portal.` |
| `boxIntro` | DE `Bewerbung bis` · EN `Apply by` |
| `boxDate` | `28.` |
| `boxLabel` | DE `Oktober` · EN `October` |
| `boxTone` | `lime` (gefüllte Fläche) |

Bewerbungsfrist **28. Oktober 2026** — von Annalena am 19.8.2026 bestätigt.
(Das „15. Dezember" in Handoff-Variante 1b war ein Design-Platzhalter.)

Der Knopf-Mechanismus ist derselbe wie beim Ticket-Button: `hidden` blendet
nur aus, Label und Link bleiben gespeichert (`resolveCta` unterdrückt den
Knopf bei `hidden` oder leerem `href`). Ohne gepflegtes `boxDate` fällt der
Riegel auf die ruhige Textsektion zurück (wie das alte textCta ohne Knopf).

## Integration (außerhalb dieses Pakets)

- **Webby:** `sections.ts`-Spiegel + Editor-Schema um `newsDate` ergänzen
  (Vorschlagsname im Editor: „News + Datum", Hinweistext: „Heller Abschnitt,
  Datums-Kasten rechts").
- **AD27:** Der LOKALE SectionRenderer kennt neue Typen nicht automatisch
  (bekannte Doppelgänger-Falle, vgl. textCta-Fix PR #94 und Logo-Laufband
  PR #93) — Case `newsDate` dort nachziehen, Felder vollständig durchreichen.

## Offen

1. **Portal-URL** — solange `href` leer ist, erscheint auch bei
   `hidden: false` kein Knopf.
2. **Ausgaben-Jahr** in der Headline bestätigen (2027?).
3. **Erinnerung 1.9.:** kein Datums-Automatismus — Umschalten auf Zustand B
   ist ein manueller Webby-Schritt (Kalendereintrag empfohlen).
