# Bewerbungs-CTA auf der Startseite — Webby-Pflegeanleitung

**Entscheidung (Annalena, 19.8.2026):** Kein neues Badge-Item. Stattdessen ein
bestehendes `textCta`-Item auf der Startseite, direkt **unter dem Willkommen-Panel**
(Lime-Box + Video). Kein Code-Eingriff nötig — alles in Webby pflegbar.

Ersetzt die frühere Badge-Spezifikation („Bewerbungsstart-Badge in der Lime-Box");
die dortige Sanity-Schema-Idee (`applicationWindow` in siteSettings) entfällt.

---

## Anlegen in Webby

Startseite (WYSIWYG-Editor) → Abschnitt **„Text + Knopf"** einfügen (so heißt
`textCta` in Webby; Hinweistext: „Heller Abschnitt, optional Foto links").
Position: direkt nach dem **„Willkommen-Panel"** (`welcomePanel`).

| Feld | Wert |
|---|---|
| `anchor` | `bewerbung` (für Menü-/Laufband-Links) |
| `eyebrow` | DE `Für Galerien` · EN `For galleries` |
| `heading` | DE `Bewerbung zur\nArt Düsseldorf 2027` · EN `Apply to\nArt Düsseldorf 2027` |
| `body` | siehe Zustände unten |
| `cta.label` | DE `Zum Bewerbungsportal` · EN `Application portal` |
| `cta.href` | Portal-URL — **noch offen**, siehe unten |
| `cta.hidden` | `true` bis zum Bewerbungsstart, dann `false` |
| `image` | leer lassen (reine Textsektion) — optional später Foto ergänzen |

⚠️ Ausgaben-Jahr („2027") vor dem Anlegen bestätigen — Annahme, nicht verifiziert.

## Zustand A — vor Bewerbungsstart (jetzt)

- `cta.hidden: true` → es erscheint kein Button, die Sektion ist reine Ankündigung.
- body DE: `Ab dem 1. September 2026 können sich Galerien für die kommende Ausgabe bewerben. Alle Informationen zu Konditionen und Ablauf finden Sie dann an dieser Stelle.`
- body EN: `Starting September 1, 2026, galleries can apply for the upcoming edition. Details on conditions and the application process will be available here.`

## Zustand B — Portal offen (ab 1.9., manuell umschalten)

1. `cta.href` auf die finale Portal-URL setzen (falls noch nicht geschehen).
2. `cta.hidden` auf `false` → Button „Zum Bewerbungsportal →" erscheint.
3. body DE: `Galerien können sich ab sofort für die kommende Ausgabe bewerben. Alle Informationen zu Konditionen und Ablauf finden Sie im Bewerbungsportal.`
4. body EN: `Galleries can now apply for the upcoming edition. You will find all details on conditions and the application process in the application portal.`

Der Mechanismus entspricht dem Ticket-Button außerhalb der Ticketphase:
`hidden` blendet nur aus, Label und Link bleiben gespeichert (`resolveCta`
in `SectionRenderer.tsx` unterdrückt den Button bei `hidden` oder leerem `href`).

## Offen

1. **Portal-URL** — final klären, vorher kann `href` leer bleiben (Button
   erscheint auch bei `hidden: false` nicht, solange `href` fehlt).
2. **Ausgaben-Jahr** in der Headline bestätigen (2027?).
3. **Erinnerung 1.9.:** Es gibt keinen Datums-Automatismus — das Umschalten
   auf Zustand B ist ein manueller Webby-Schritt (Kalendereintrag empfohlen).
