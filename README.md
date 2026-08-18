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

- **Eyebrows nur mit Text** (seit v0.13.0, Annalena 14.8.2026): Die
  Eyebrow-Zeile (Lime-Quadrat + Versaltext) erscheint nur, wenn im CMS Text
  gepflegt ist — ein leeres Feld erzeugt keine Zeile und keinen einzelnen
  Punkt mehr. Impressum und Datenschutz bleiben so ohne Eyebrow (Feld leer
  lassen). Die Über-uns-Seite (`aboutPage`) ist grundsätzlich ohne Eyebrows,
  einschließlich der Zwischenheadline „Kontakt & Team" — dort sind die
  Felder `@deprecated` und werden ignoriert.
- **FAQ ohne Suchfeld** (seit v0.13.0, Annalena 14.8.2026): Die FAQ-Seite
  filtert nur über die Themen-Pills; `searchPlaceholder`/`emptyText` sind
  `@deprecated`.

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
