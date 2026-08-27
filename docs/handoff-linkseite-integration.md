# An Walter: Linkseite für die Instagram-Bio (/links) in AD27 einbinden

> Von Annalena/Claude, 27.08.2026. Das Items-Paket **v0.16.0** enthält das neue
> Item `LinkHubItem` (Sektionstyp `linkHub`): eine Linktree-artige Unterseite
> für die Instagram-Bio. Schwarze Seite, Foto-Bühne mit der SVG-Wortmarke im
> dunklen Verlauf, Lime-Pill-Buttons, Bildnachweis-Sektion, DE/EN-Umschalter
> auf der Seite selbst (die Bio verlinkt EINE URL, deshalb wechselt das Item
> die Sprache clientseitig). Design: Handoff „Instagram Linktree" (27.8.),
> Variante „Foto-Bühne" nach Annalenas Wahl.
>
> Außerdem in v0.16.0: `Chrome.tsx` blendet Header/Footer auf dem Pfad
> `/links` (auch `/de/links`, `/en/links`) aus — die Seite steht allein,
> Bio-Besucher sehen die Buttons, nicht das Website-Menü. Das kommt mit dem
> Paket-Update automatisch mit, kein AD27-Code nötig.

## Was in AD27 zu tun ist (ein kleiner PR)

1. **Paket-Pin heben** — `package.json`:

   ```json
   "@artfair/web-items": "github:Artfair/artfair-web-items#semver:^0.16.0"
   ```

   danach `npm install` (Lockfile committen). Achtung: `^0.15.0` löst 0.16.0
   NICHT auf, der Pin muss wirklich angehoben werden.

2. **Typ spiegeln** — `lib/site/sections.ts` (vor dem Union-Ende, und
   `| LinkHubSection;` an die Union anhängen):

   ```ts
   // Linkseite (LinkHubItem im Paket) — Linktree-artige Unterseite für
   // die Instagram-Bio; Buttons als Liste (hidden blendet aus).
   export interface LinkHubLinkData extends Cta {
     _key: string;
   }
   export interface LinkHubSection {
     _key: string;
     _type: "linkHub";
     anchor?: string;
     image?: ImageRef;
     dateLine?: Loc;
     placeLine?: Loc;
     showLanguageToggle?: boolean;
     links?: LinkHubLinkData[];
     creditsTitle?: Loc;
     credits?: LinkHubLinkData[];
     footerNote?: Loc;
   }
   ```

3. **Renderer-Case** — `components/sections/SectionRenderer.tsx`:
   Import ergänzen:

   ```ts
   import { LinkHubItem } from "@artfair/web-items";
   ```

   und ein Case (z. B. neben `exhibitorArchive`). Wichtig: Labels bleiben
   als Loc (beide Sprachen) — das Item wechselt DE/EN clientseitig,
   `lang` ist nur die Startsprache:

   ```tsx
   case "linkHub": {
     const mapLinks = (list?: typeof s.links) =>
       (list ?? [])
         .filter((x) => !x.hidden && x.href && (x.label?.de || x.label?.en))
         .map((x) => ({ label: x.label, href: x.href! }));
     const links = mapLinks(s.links);
     const credits = mapLinks(s.credits);
     if (links.length === 0 && credits.length === 0) return null;
     return (
       <LinkHubItem
         key={s._key}
         id={s.anchor}
         lang={lang}
         imageSrc={img(s.image, 1200) || undefined}
         imageAlt={s.image?.alt ?? ""}
         dateLine={s.dateLine}
         placeLine={s.placeLine}
         showLanguageToggle={s.showLanguageToggle ?? true}
         links={links}
         creditsTitle={s.creditsTitle}
         credits={credits}
         footerNote={s.footerNote}
       />
     );
   }
   ```

## Klick-Tracking (Vercel Web Analytics)

Jeder Button-Klick feuert ein Custom Event **`linkseite-klick`** mit den
Properties `label`, `href`, `sprache` — über die globale `window.va`-Queue,
die AD27s vorhandenes `<Analytics/>` (app/layout.tsx) bereitstellt. Es ist
KEINE neue Abhängigkeit nötig; ohne Analytics (z. B. Webby-Vorschau) passiert
schlicht nichts. Hinweis: Custom Events zeigt Vercel im Analytics-Tab unter
„Events" — falls dort nichts ankommt, muss Web Analytics im Vercel-Projekt
aktiv sein (Custom Events sind ab dem Pro-Plan enthalten).

## Was OHNE Code passiert (Webby)

4. **Webby ist vorbereitet** (Commit im Webby-Repo): Sektionstyp `linkHub`
   in Typen, Palette („Linkseite (Instagram-Bio)"), emptySection und
   SectionEditor — Buttons als Liste mit Beschriftung (DE/EN), Link,
   anzeigen-Schalter, Umsortieren; Foto über das normale Bildfeld
   **inkl. pixx.io-Picker**. Nach dem Release-Tag v0.16.0 im Items-Repo
   muss in Webby nur noch der Pin auf `^0.16.0` (npm install, Lockfile).
5. **Seite anlegen**: sitePage **`/links`** mit einer Sektion `linkHub`
   (Foto hochladen oder aus pixx.io, Datums-/Ortszeile, Buttons pflegen).
   Die Universal-Route rendert die Seite, sobald der Renderer-Case
   (Punkt 3) deployt ist. Der Slug muss `/links` heißen, sonst greift
   die Header/Footer-Ausnahme nicht (Liste in Chrome.tsx erweiterbar).
6. **Kein Menüpunkt** nötig — die Seite ist nur für die Instagram-Bio;
   ohne Menüeintrag setzt AD27s Indexierbarkeits-Logik sie auf noindex
   (gewollt: die Seite soll nicht in Google auftauchen).
7. **Instagram**: `https://www.art-dus.de/de/links` (oder `/en/links`)
   als Bio-Link eintragen.
