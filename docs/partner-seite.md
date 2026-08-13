# Partner-Seite — als ein Item ins Paket (Webby-pflegbar)

Handoff für das AD27-Team. Die in AD27 bereits neu aufgebaute Partner-Seite
(`app/[lang]/partner/page.tsx`, Commits „Partner-Seite neu aufgebaut" /
„Feinschliff" / Sie-Form / Typ-2-Header) liegt ab **v0.11.0** als EIN
Custom-Item im Paket `@artfair/web-items`: `PartnerPageItem`, Section-Typ
`partnerPage` (Muster `aboutPage`/`businessPage`/`faqPage`). Damit wandert
die Inhaltspflege nach Webby — Partner wechseln von Ausgabe zu Ausgabe,
deshalb sind Porträts und Logo-Gruppen **Listen** (beliebig viele, sortierbar),
keine festen Slots.

> **Update v0.12.0 (13.8.2026): Eyebrows abgeschafft.** Die Eyebrow-Zeilen
> (Lime-Quadrat + Versaltext), die dieses Dokument noch erwähnt (`heroEyebrow`,
> `eyebrow` je Porträt/Logo-Gruppe, `contactEyebrow`), werden nicht mehr
> gerendert. Die Felder existieren weiter (deprecated, ignoriert) — in Webby
> gepflegte Werte sind unschädlich, müssen aber nicht mehr gepflegt werden.

## Aufbau des Items (Reihenfolge fest im Code)

1. **Partner-Hero** (`PartnerHeroItem`, Typ 2b) — Lime-Rahmen links (Kicker,
   H1, Text, Knöpfe), Foto rechts mit weißem Logo-Karussell.
2. **Partner-Porträts** (`PartnerFeatureItem`, Liste `features`) — z. B.
   Headline Partner, Main Partner; je Eintrag optionale Sprungmarke (`anchor`).
3. **Logo-Raster** (`LogoGridItem`, Liste `logoGroups`) — z. B. Exhibition
   Partner, VIP Programm, Media Partner; je Gruppe optionale Sprungmarke.
4. **CTA-Band** (`CtaBandItem`) — dunkles Band „Werden Sie Partner"; Anker
   fest `#werde-partner` (Ziel der „Partner werden"-Knöpfe).

Leere Sektionen werden übersprungen (Porträt ohne Bild, Gruppe ohne Logos,
Band ohne Heading/CTA/Bild entfällt).

## Integration in AD27 (wie /about, PR #66)

1. `@artfair/web-items` auf `#semver:^0.11.0` heben.
2. **Webby ist vorbereitet** (13.8.2026): eigener Editor unter
   `/website/partner` (Dokument `sitePage-partner`, Pfad `/partner`,
   Entwurf → Vorschau → Live), gespiegelte `sections.ts` inkl. `partnerPage`,
   Erst-Bestückung mit der Referenz unten (`src/lib/partnerSeed.ts`),
   „Bearbeiten"-Knopf in der Navigations-Steuerung.
3. `app/[lang]/partner/page.tsx` liest die Abschnitte aus `sitePage-partner`
   und rendert sie über den `SectionRenderer` (Muster FAQ/About); als
   Fallback `<PartnerPageItem …/>` mit denselben Inhalten hartkodiert. Der
   Metadata-Block der Seite kann bleiben.

## Referenz-Komposition (Inhalte der bereits gebauten AD27-Seite)

Alle Texte/Bilder 1:1 aus `app/[lang]/partner/page.tsx` übernommen — mit
einer Korrektur: Im National-Bank-Text stand noch eine Du-Form („Besuch die
National-Bank-Lounge … lerne sie kennen"); unten auf Sie-Form korrigiert
(die Seite ist sonst durchgehend Sie).

- **heroEyebrow**: „Partner · AD27" / „Partners · AD27"
- **heroTitle**: „Unsere Partner." / „Our partners."
- **heroBody**: „Verbinden Sie Ihre Marke mit einer der wichtigsten
  Kunstmessen Europas — und einem internationalen Publikum aus Sammlerinnen,
  Kuratoren und Entscheidern." / „Connect your brand with one of Europe's
  most important art fairs — and an international audience of collectors,
  curators and decision-makers."
- **heroPrimaryCta**: „Partner werden" / „Become a partner" → `#werde-partner`
- **heroImage**: `/images/partners/partner-lounge.jpg`, alt „Gäste in der
  Partner-Lounge der Art Düsseldorf."
- **heroLogos** (alt = Partnername): national-bank.png, walter-knoll,
  talbot-runhof, slice, monopol, insel-hombroich, bentley, kpm,
  kunstsammlung-nrw, stayinart (alle unter `/images/partners/logos/`,
  National-Bank unter `/images/partners/national-bank.png`)

**features** (2 Einträge):

1. anchor `headline-partner`, eyebrow „Im Porträt"/„In focus", heading
   „Headline Partner.", Bild `/images/partners/national-bank-stand.jpg`
   (alt „Die National-Bank-Lounge auf der Art Düsseldorf."), title
   „National-Bank AG", body: „Die National-Bank ist die führende Bank in und
   aus Nordrhein-Westfalen — getragen von rund 5.300 Anteilseignern. Seit
   Jahrzehnten steht sie privaten Kunden und mittelständischen Unternehmen
   partnerschaftlich zur Seite: kluge Beratung und persönlicher Service statt
   Call-Center, Solidität und Stabilität in der Bilanz. Besuchen Sie die
   National-Bank-Lounge auf der Messe und lernen Sie sie kennen." (EN wie in
   AD27), link „Zur National-Bank"/„Visit National-Bank" →
   https://www.national-bank.de
2. anchor `main-partner`, eyebrow „Partner und Versicherer"/„Partner &
   insurer", heading „Main Partner.", Bild
   `/images/partners/allianz-stand.jpg` (alt „Gäste am Allianz-Stand
   ‚Kultur. KI. Zukunft.' auf der Art Düsseldorf."), title „Allianz", body
   wie in AD27 (Gründungspartner/ArtPrivat/MoMA…), link „ArtPrivat
   erkunden"/„Explore ArtPrivat" → https://www.allianz.de

**logoGroups** (3 Gruppen, Logos wie in AD27 unter
`/images/partners/logos/`):

1. anchor `exhibition-partner`, eyebrow „Auf der Messe"/„At the fair",
   heading „Exhibition Partner." — 12 Logos (Walter Knoll, E.ON Foundation,
   Bentley Düsseldorf, Champagne Laurent-Perrier, Annayake, Talbot Runhof,
   Farrow & Ball, KPM Berlin, Kuoni Tumlare Congress, Visit Düsseldorf,
   The Bloke, Sattler)
2. anchor `vip-programm`, eyebrow „Museen & Institutionen"/„Museums &
   institutions", heading „VIP Programm."/„VIP programme." — 15 Logos
   (Kunstsammlung NRW, Kunstpalast, Kunstverein, Langen Foundation, Philara,
   KAI10, Bilker Bunker, ZERO foundation, The Wellem, Malkasten, Kunsthalle,
   Insel Hombroich, Skulpturenhalle, Kunstmuseen Krefeld, KIT)
3. anchor `media-partner`, eyebrow „Magazine & Medien"/„Press & media",
   heading „Media Partner." — 16 Logos (Monopol, stayinart, PARNASS,
   kultur.west, ARTMAPP, Cahier, THE DORF, Collectors Agenda, ArtJunk,
   ART'N'TRAVEL, kunst:art, Arts of the Working Class, Ocula, SLICE,
   Artprice, Kunstforum)

**CTA-Band**: eyebrow „Partnerschaft"/„Partnership", heading „Werden Sie
Partner der\nArt Düsseldorf." / „Become a partner of\nArt Düsseldorf.",
body wie in AD27 (Plattform-Satz + Kontakt Johanna Sucec sucec@art-dus.de /
Sabine Jansen jansen@art-dus.de), cta „Anfrage senden"/„Get in touch" →
`mailto:sucec@art-dus.de`, Bild `/images/partners/vip-lounge.jpg` (alt „Die
VIP-Lounge der Art Düsseldorf, eingerichtet mit Partnermobiliar.").

## Offene Punkte

- In AD27 liegt uncommittet ein Entwurf `PartnerSpotlightItem.tsx`
  (Partner-Porträt nach 2026er-Vorbild: Headline Partner = 1 Panorama-Bild,
  Main Partner = 2 Bilder nebeneinander, Logo links/Text rechts) plus
  National-Bank-Fotos und `partner-cta.mp4`. Der Entwurf ist NICHT Teil des
  Pakets — falls die Porträts auf dieses Layout wechseln sollen, bauen wir
  das Spotlight als nächstes Item hier im Paket und hängen es als Variante
  an `partnerPage`.
- Die Live-Website zeigt noch die alte 2026er-Partner-Seite; der Umstieg
  passiert mit der AD27-Integration oben.
