# An Walter: Archiv-Seite „Galerien 2026" in AD27 einbinden

> Von Annalena/Claude, 26.08.2026. Das Items-Paket **v0.15.0** enthält das neue
> Item `ExhibitorArchiveItem` (Sektionstyp `exhibitorArchive`): die komplette
> Galerienliste 2026 als Archiv — 119 Galerien mit Sektion, Standnummer und
> Standorten, fest im Paket (keine CMS-Pflege nötig). Quelle und Herleitung:
> `docs/galerienliste-2026.md` im Items-Repo. Außerdem hat das `FairPlanItem`
> jetzt eine Vollbild-Ansicht mit Pinch-Zoom (Mobil-Feedback: Plan „zu klein,
> nicht antippbar").

## Was in AD27 zu tun ist (ein kleiner PR)

1. **Paket-Pin heben** — `package.json`:

   ```json
   "@artfair/web-items": "github:Artfair/artfair-web-items#semver:^0.15.0"
   ```

   danach `npm install` (Lockfile committen). Achtung: `^0.14.0` löst 0.15.0
   NICHT auf, der Pin muss wirklich angehoben werden.

2. **Typ spiegeln** — `lib/site/sections.ts` (vor dem `Section`-Union-Ende,
   und `| ExhibitorArchiveSection;` an die Union anhängen):

   ```ts
   // Galerien-Archiv (ExhibitorArchiveItem im Paket) — Liste einer
   // abgeschlossenen Ausgabe; Daten liegen fest im Paket, das CMS
   // platziert nur das Item und kann Kopfzeilen übersteuern.
   export interface ExhibitorArchiveSection {
     _key: string;
     _type: "exhibitorArchive";
     anchor?: string;
     edition?: string; // Default "2026"
     eyebrow?: Loc;
     title?: Loc;
     intro?: Loc;
   }
   ```

3. **Renderer-Case** — `components/sections/SectionRenderer.tsx`:
   Import ergänzen (Zeile 1 importiert schon aus dem Paket):

   ```ts
   import { ContactBlockItem, NewsDateItem, ExhibitorArchiveItem } from "@artfair/web-items";
   ```

   und einen Case (z. B. neben `faqPage`):

   ```tsx
   case "exhibitorArchive": {
     return (
       <ExhibitorArchiveItem
         key={s._key}
         id={s.anchor}
         lang={lang}
         edition={s.edition || "2026"}
         eyebrow={loc(s.eyebrow, lang) || undefined}
         title={loc(s.title, lang) || undefined}
         intro={loc(s.intro, lang) || undefined}
       />
     );
   }
   ```

4. **Empfohlen (gleicher PR): FairPlanItem aufs Paket umstellen** — der
   AD27-Renderer importiert noch den lokalen Spiegel
   `@/components/items/FairPlanItem`. Import auf `@artfair/web-items`
   umstellen und im `fairPlan`-Case `lang={lang}` mitgeben — dann bekommt
   auch die Besuch-/Messe-Seite die Vollbild-Ansicht mit Pinch-Zoom
   (behebt das Mobil-Feedback „Plan zu klein, nicht antippbar").
   Die Props sind unverändert, `lang` ist optional (Default de).

## Was OHNE Code passiert (Webby)

5. **Seite anlegen**: sitePage `/galerien-2026` mit den Sektionen
   `exhibitorArchive` (ohne weitere Felder) und darunter optional `fairPlan`
   (Plan-Bild hochladen — die vektorisierte `AD26_Messeplan_vektorisiert.svg`
   liegt im AD27-Repo-Root, 850 KB; Link-Feld z. B. für ein Plan-PDF).
   Die Universal-Route `[lang]/[slug]` rendert die Seite automatisch,
   sobald der Renderer-Case (Punkt 3) deployt ist.
6. **Menü**: Navigationseintrag auf `/galerien-2026` in Webby ergänzen.
7. **Webby selbst** rendert das neue Item automatisch (nutzt den
   SectionRenderer aus dem Paket) — nur der Pin muss auch dort auf
   `^0.15.0`. Für komfortable Feldpflege im Editor kann Webbys
   gespiegelte `sections.ts` denselben Typ aus Punkt 2 bekommen; für die
   Seite ist das nicht zwingend (alle Felder sind optional).

## Hinweis

Die Titel-Metadaten der Universal-Route hängen „— ART DÜSSELDORF 2027" an;
„Galerien 2026 — ART DÜSSELDORF 2027" ist als Archiv-Titel so gewollt.
