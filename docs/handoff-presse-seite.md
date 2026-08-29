# An Walter: Presseseite als Baukasten-Item (pressPage) in AD27 einbinden

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

   - `BREVO_PRESS_LIST_ID` — ID der neuen Presseverteiler-Liste
     (Annalena legt die Liste in Brevo an)
   - DOI-Template/Redirect: entweder die Newsletter-Werte wiederverwenden
     oder eigene `BREVO_PRESS_DOI_TEMPLATE_ID`/`…_REDIRECT_URL` (empfohlen:
     eigenes DOI-Template, damit die Bestätigungsmail „Presseverteiler" sagt)

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
  Hinweis. `signupPrivacyHref` zeigt vorerst auf `/datenschutz`; **WICHTIG
  (Annalena 29.8.): Die Datenschutzerklärung erwähnt den Presseverteiler
  aktuell NICHT — eine eigene Ziffer ergänzen** (Zweck, Brevo als
  Auftragsverarbeiter, Widerruf), dann den Link mit Anker auf diese Ziffer
  pflegen (z. B. `/datenschutz#presseverteiler`).
- **contacts** (Überschrift-Default „Pressekontakt."; Karten wechseln
  Lime/Schwarz der Reihe nach):
  1. label „Allgemeine Presseanfragen" / „General press enquiries",
     name „Kathrin Luz",
     lines „Art.Fair International GmbH\nMaria-Hilf-Str. 9\n50677 Köln",
     phone „M +49 171 310 24 72", email „kl@luz-communication.de"
  2. label „Interviewanfragen & Markenkommunikation" /
     „Interview requests & brand communication",
     name „Dr. Annalena Roters",
     lines „Art.Fair International GmbH\nMaria-Hilf-Str. 9\n50677 Köln",
     phone „M +49 15155480502", email „roters@art-dus.de"

## Webby-Editor (analog linkHub)

Sektionstyp `pressPage` in Typen, Palette („Presseseite"), emptySection und
SectionEditor ergänzen: releases/downloads/contacts als Listen (hinzufügen,
umsortieren, hidden-Schalter pro Eintrag), releasesHidden als Schalter auf
Sektionsebene. Nach dem Release-Tag v0.17.0 im Items-Repo den Pin in Webby
auf `^0.17.0` heben (npm install, Lockfile).
