# An Walter: Presseseite als Baukasten-Item (pressPage) in AD27 einbinden

> Von Annalena/Claude, 29.08.2026. Das Items-Paket **v0.17.0** enthält das neue
> Item `PressPageItem` (Sektionstyp `pressPage`): die GANZE Presseseite als
> EIN Item (Muster faqPage/aboutPage). Es löst die in AD27 fest verdrahtete
> Route `app/[lang]/press/page.tsx` ab, damit Stand, Mitteilungen, Downloads
> und Kontakte in Webby gepflegt werden können.
>
> Design-Entscheidungen (Annalena 29.8.):
> – Header ohne Eyebrow und ohne Presskit-Knopf; KEINE „Stand:"-Zeile mehr
>   (Annalena 29.8., zweite Runde — Meta-Zeile nur noch Pressekontakt)
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

## Inhalte für Webby (Startzustand, Annalena 29.8.)

Sektion `pressPage`, eine pro Seite:

- **title**: „Presse." / „Press."
- **intro**: „Pressemitteilungen und Bildmaterial zur Art Düsseldorf 2027." /
  „Press releases and image material for Art Düsseldorf 2027."
- **meta**: [„Pressekontakt: press@art-dus.de" /
  „Press contact: press@art-dus.de"] — bewusst OHNE „Stand:"-Zeile
- **releasesHidden**: AN (keine aktuellen Mitteilungen; Liste leer lassen,
  Einträge erst pflegen, wenn etwas da ist — Felder pro Eintrag: date,
  title, teaser, href optional, hidden)
- **accreditationBody/-Cta**: LEER lassen (Sektion erscheint dadurch nicht;
  2027 Body + Formular-Link eintragen, Überschrift-Default „Akkreditierung")
- **downloads** (Überschrift-Default „Presseinfos"):
  1. „Pressefotos" → href: **Public Press File Art Düsseldorf**
     (URL bei Annalena erfragen — Dropbox/Ablage, stand am 29.8. noch aus)
  2. „Logo-Paket (Demnächst)" — ohne href (reiner Text)
  - „Pressemappe 2027" ist bewusst RAUS
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
