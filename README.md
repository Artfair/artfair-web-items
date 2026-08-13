# @artfair/web-items

Das geteilte **Web-Item-Regal** der Art Düsseldorf. Ein Ort für die
Anzeige-Bauteile, aus dem **beide** Apps laden — die Website (AD27) und der
Editor (Webby) — damit sie garantiert dieselben Items im gleichen Look rendern
(kein Nachbau, keine Drift).

## Inhalt

- `src/components/items/*` — die Web-Items (Ticker, HeroSplit, FactsRow,
  CtaBand, TextCta, NumberedBlocks, CardTrio, Themen, Newsletter, …).
- `src/components/SectionRenderer.tsx` — mappt eine Abschnitts-Liste
  (`sections[]`) auf die Items; `slots` für feste Code-Riegel.
- `src/lib/{sections,slugs}.ts` — Section-Typen + `loc()`, `localizeHref()`.
- `tailwind-preset.js` — das Design-Theme (artdus-Farben, Schriften,
  Animationen). Beide Apps binden es als Tailwind-Preset ein.
- `src/styles/tokens.css` — die Farb-Variablen (einzige Quelle).

## Design-Regeln

- **Keine Eyebrows** (seit v0.12.0, Annalena 13.8.2026): Die kleine
  Versalzeile mit Lime-Quadrat über Überschriften ist abgeschafft — kein Item
  rendert sie mehr, neue Items bekommen weder ein `eyebrow`- noch ein
  `kicker`-Feld. Die alten Props/Section-Felder bleiben als `@deprecated`
  bestehen (Daten- und API-Kompatibilität für AD27/Webby), werden aber
  ignoriert. Ausnahmen (bewusst behalten): der Kicker im Willkommen-Panel und
  in den Advertorial-Karten der Startseite (eigener Look, ohne Lime-Punkt),
  die Rubrik-Labels des Magazins und der Beispiel-Newsletter im
  `NewsletterPageItem` (Mockup-Inhalt).

## Einbinden (Konsument)

```jsonc
// package.json
"@artfair/web-items": "git+https://github.com/Artfair/artfair-web-items.git#semver:^0.1.0"
```

```ts
// next.config.ts  → das Paket wird als Quelle transpiliert
transpilePackages: ['@artfair/web-items']
```

```ts
// tailwind.config.ts
import preset from '@artfair/web-items/tailwind-preset'
export default {
  presets: [preset],
  content: ['./…', './node_modules/@artfair/web-items/src/**/*.{ts,tsx}'],
}
```

```ts
import { SectionRenderer, localizeHref, type Section } from '@artfair/web-items'
import '@artfair/web-items/styles/tokens.css'
```

Zusätzlich müssen die Haus-Schriften (Weissenhof Grotesk, Cormorant) als
`--font-sans` / `--font-serif` gesetzt sein.
