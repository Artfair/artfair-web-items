# An Walter: Presseseite als Baukasten-Item (pressPage) in AD27 einbinden

> **NACHTRAG v0.18.0 (31.8., Seite ist live):** Pressemitteilungen können
> jetzt einen **Volltext** tragen — aufklappbar auf der Seite, mit „Text
> kopieren"-Knopf (Zwischenablage, für Redaktionen) und „PDF herunterladen"-
> Knopf. Neue Felder: `PressReleaseData.body` (Loc, Absätze \n\n, Links als
> [Text](URL)) — `href` wird mit body zum PDF-Knopf, ohne body verlinkt
> weiter der Titel; Micro-Copy `releaseFullTextLabel`/`releaseCopyLabel`/
> `releaseCopiedLabel`/`releasePdfLabel` (Renderer-Fallbacks vorhanden).
> Dafür: **Pin auf `^0.18.0` heben** (npm install, Lockfile), Typ + Case neu
> aus dem Paket spiegeln. Anlass: erste echte PM (DE/EN) liegt vor — Annalena
> lädt die PDFs zu pixx.io, Volltexte + Links kommen dann in die releases.

> Von Annalena/Claude, 29.08.2026. Das Items-Paket **v0.17.0** enthält das neue
> Item `PressPageItem` (Sektionstyp `pressPage`): die GANZE Presseseite als
> EIN Item (Muster faqPage/aboutPage). Es löst die in AD27 fest verdrahtete
> Route `app/[lang]/press/page.tsx` ab, damit Stand, Mitteilungen, Downloads
> und Kontakte in Webby gepflegt werden können.
>
> Design-Entscheidungen (Annalena 29.8.):
> – Header ohne Eyebrow und ohne Presskit-Knopf; Meta-Zeile KOMPLETT leer
>   (Annalena 29.8.: „Stand:" raus, „Pressekontakt:" raus — die konkreten
>   Ansprechpartnerinnen stehen unten als Kontakt-Karten)
> – Presseverteiler-Formular (Name, E-Mail, Medium/Redaktion, Pflicht-
>   Consent NICHT vorausgefüllt) → Brevo-Double-Opt-in wie der Newsletter,
>   eigene Brevo-Liste; braucht eine neue API-Route in AD27 (unten)
> – Intro ohne „Akkreditierung" („Pressemitteilungen und Bildmaterial …")
> – Pressemitteilungen per Schalter `releasesHidden` KOMPLETT ausblendbar —
>   derzeit AUS, erst wieder an, wenn es tatsächlich neue Mitteilungen gibt
> – Akkreditierung vorerst ganz draußen (kommt erst 2027 mit dem Formular):
>   die Sektion rendert nur, wenn `accreditationBody` oder `accreditationCta`
>   gepflegt sind — bis dahin beide leer lassen
> – Downloads-Sektion heißt „Presseinfos" (nicht mehr „Pressemappen"),
>   OHNE Rahmen-Box, Lime-Quadrat-Bullets; Einträge mit Link klickbar
>   (extern in neuem Tab), ohne Link reiner Text („Logo-Paket (Demnächst)")
> – Pressekontakt als Karten-Paar im Look der Über-uns-Adressen (Lime-Box +
>   Schwarz-Box nebeneinander); Telefon/E-Mail Weissenhof Light, keine Mono

## Was in AD27 zu tun ist (ein kleiner PR)

1. **Paket-Pin heben** — `package.json`:

   ```json
   "@artfair/web-items": "github:Artfair/artfair-web-items#semver:^0.17.0"
   ```

   danach `npm install` (Lockfile committen). Achtung: `^0.16.0` löst 0.17.0
   NICHT auf, der Pin muss wirklich angehoben werden.

2. **Typ spiegeln** — `lib/site/sections.ts` (vor dem Union-Ende, und
   `| PressPageSection;` an die Union anhängen). Quelle: `src/lib/sections.ts`
   im Items-Repo, Block „31 — Presse-Seite" (PressReleaseData,
   PressDownloadData, PressContactData, PressPageSection) — 1:1 kopieren.

3. **Renderer-Case** — `components/sections/SectionRenderer.tsx`:
   Import `PressPageItem` aus `@artfair/web-items` ergänzen und den Case
   `case "pressPage"` aus dem Paket-SectionRenderer
   (`src/components/SectionRenderer.tsx`) übernehmen. Renderer-Fallbacks:
   Titel „Presse."/„Press.", Überschriften „Pressemitteilungen"/„Press
   releases", „Akkreditierung"/„Accreditation", „Presseinfos"/„Press
   information", „Pressekontakt."/„Press contact.".

4. **Alte Route ablösen** — `app/[lang]/press/page.tsx`: Die fest verdrahtete
   Seite entfernen bzw. auf die sitePage-Rendering-Logik umstellen (wie bei
   den anderen Webby-Seiten), damit die Universal-Route mit der Webby-Seite
   `/press` greift. Indexierbarkeit (`robotsFor('/press')`) beibehalten.

5. **API-Route Presseverteiler** — `app/api/press-list/route.ts`: Kopie von
   `app/api/newsletter/route.ts` (Brevo-Double-Opt-in), zusätzlich zu
   `email`/`language`/`consent` die FormData-Felder **`name`** und
   **`medium`** entgegennehmen und als Brevo-Attribute mitgeben (z. B.
   `attributes: { LANGUAGE, NAME, MEDIUM }` — Attribute vorher in Brevo
   anlegen). Eigene Env-Variablen:

   - `BREVO_PRESS_LIST_ID_DE=224` („presseverteiler") /
     `BREVO_PRESS_LIST_ID_EN=225` („Press EN") — Annalena hat ZWEI Listen
     angelegt (DE + EN, anders als beim Newsletter mit einer Liste +
     LANGUAGE-Attribut; IDs von Annalena, 29.8.). Die Route wählt die
     Liste anhand des FormData-Felds `language`:
     `includeListIds: [language === "en" ? enListId : deListId]`
   - `BREVO_PRESS_DOI_TEMPLATE_ID_DE=505` / `BREVO_PRESS_DOI_TEMPLATE_ID_EN=506`
     — zwei eigene DOI-Vorlagen (je Sprache eine, Betreff und Text sagen
     „Presseverteiler" statt „Newsletter"; angelegt + aktiviert von
     Annalena, 29.8.). Die Route wählt Vorlage UND Liste anhand des
     `language`-Felds.
   - `BREVO_PRESS_DOI_REDIRECT_URL` — Ziel nach dem Bestätigungsklick;
     Vorschlag: `https://www.art-dus.de/de/presse` (bzw. die Route hängt
     je Sprache `/de/presse` oder `/en/press` an — Walters Wahl, auch die
     Newsletter-Redirect-URL wiederzuverwenden ist okay)

   Das Item schickt per POST an `signupAction` (in Webby auf
   `/api/press-list` setzen); 2xx = Bestätigung, non-2xx = Fehlertext.

## Inhalte für Webby (Startzustand, Annalena 29.8.)

Sektion `pressPage`, eine pro Seite:

- **title**: „Presse." / „Press."
- **intro**: „Pressemitteilungen und Bildmaterial zur Art Düsseldorf 2027." /
  „Press releases and image material for Art Düsseldorf 2027."
- **meta**: LEER lassen — bewusst ohne „Stand:"- und „Pressekontakt:"-Zeile
  (die Ansprechpartnerinnen stehen unten als Karten)
- **releasesHidden**: AN (keine aktuellen Mitteilungen; Liste leer lassen,
  Einträge erst pflegen, wenn etwas da ist — Felder pro Eintrag: date,
  title, teaser, href optional, hidden)
- **accreditationBody/-Cta**: LEER lassen (Sektion erscheint dadurch nicht;
  2027 Body + Formular-Link eintragen, Überschrift-Default „Akkreditierung")
- **downloads** (Überschrift-Default „Presseinfos"):
  1. „Pressefotos" → href:
     `https://artdus.px.media/share/1787973891tSjEcy5NKqr7b9`
     (pixx.io-Share „Public Press File", Annalena 29.8.)
  2. „Logo-Paket" → href:
     `https://artdus.px.media/share/1787973819pFbOTrTJ2fE5XT`
     (pixx.io-Share, Annalena 29.8. — ohne „(Demnächst)")
  - „Pressemappe 2027" ist bewusst RAUS
- **Presseverteiler** (zwischen Presseinfos und Pressekontakt; Überschrift-
  Default „Presseverteiler."): Alle Texte haben Renderer-Fallbacks, in Webby
  muss nur **signupAction = `/api/press-list`** gesetzt werden (ohne action
  zeigt das Formular nur eine clientseitige Bestätigung — so bleibt die
  Webby-Vorschau harmlos). Felder: Name, E-Mail, Medium/Redaktion (alle
  Pflicht), Consent-Checkbox NICHT vorausgefüllt mit Zweck-Text „Ich möchte
  Pressemitteilungen zur Art Düsseldorf erhalten." + Widerrufs-/Datenschutz-
  Hinweis. Die Presseverteiler-Ziffer der Datenschutzerklärung liegt als
  Webby-Entwurf bereit (Block `blk_k3b62z5`). **Seit v0.17.1 können
  numberedBlocks-Ziffern eigene Sprungmarken tragen** (`anchor`-Feld pro
  Block, funktioniert in Mobil- UND Desktop-Layout): auf dem Ziffern-Block
  `anchor: "presseverteiler"` setzen (per Webby-API wie beim Anlegen des
  Blocks), dann im pressPage-Item
  `signupPrivacyHref: "/datenschutz#presseverteiler"` pflegen — der
  Formular-Link springt dann direkt zur Ziffer.
- **contacts** (Überschrift-Default „Pressekontakt."; Karten wechseln
  Lime/Schwarz der Reihe nach):
  1. label „Allgemeine Presseanfragen" / „General press enquiries",
     name „Kathrin Luz",
     lines „art.fair International GmbH\nMaria-Hilf-Str. 9\n50677 Köln",
     phone „M +49 171 310 24 72", email „kl@luz-communication.de"
  2. label „Interviewanfragen & Markenkommunikation" /
     „Interview requests & brand communication",
     name „Dr. Annalena Roters",
     lines „art.fair International GmbH\nMaria-Hilf-Str. 9\n50677 Köln",
     phone „M +49 15155480502", email „roters@art-dus.de"

## Webby-Editor (analog linkHub)

Sektionstyp `pressPage` in Typen, Palette („Presseseite"), emptySection und
SectionEditor ergänzen: releases/downloads/contacts als Listen (hinzufügen,
umsortieren, hidden-Schalter pro Eintrag), releasesHidden als Schalter auf
Sektionsebene. Nach dem Release-Tag v0.17.0 im Items-Repo den Pin in Webby
auf `^0.17.0` heben (npm install, Lockfile).
