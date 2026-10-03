// ─────────────────────────────────────────────────────────────────────────
// Prüfung des Leisten-Vertrags (siehe CLAUDE.md). Läuft bei jedem PR.
//
//   npm run pruefen
//
// Fehler (Abbruch, PR wird rot):
//   1. Jede Bauart im Section-Typ hat einen Fall im SectionRenderer.
//   2. Jede Bauart hat einen Griff — außer sie steht in OHNE_GRIFF (Bestand).
//   3. Jeder Griff gehört zu einer Bauart, steht unter einer Menü-Überschrift
//      von Webby, und jedes Fach gibt es als Feld in der Datenform.
//   4. Jede Leiste mit Griff lässt sich leer und voll, Deutsch und Englisch,
//      ohne Fehler darstellen.
//   5. Verbote in Leisten-Bauteilen (components/items): feste Farben,
//      Messe-Namen, Datenzugriffe — außer sie stehen in BESTAND (Altlasten).
// Hinweise (kein Abbruch):
//   - Beispieltext eines Fachs taucht in der vollen Darstellung nicht auf.
//   - Ein BESTAND-Eintrag ist inzwischen sauber und kann gestrichen werden.
// ─────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GRIFFE, beispiel, type Fach } from "../src/lib/griffe";
import SectionRenderer from "../src/components/SectionRenderer";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const fehler: string[] = [];
const hinweise: string[] = [];

// Menü-Überschriften in Webbys „Abschnitt hinzufügen" (src/lib/sections.ts dort).
const MENUE_GRUPPEN = ["Layout", "Kopf / Hero", "Inhalt", "Medien & Logos", "Programm & Newsletter", "Ganze Seiten", "Formulare"];

// Bestand: Bauarten, deren Formular in Webby noch von Hand geschrieben ist.
// Neue Bauarten kommen hier NICHT hinzu — sie bringen ihren Griff mit.
const OHNE_GRIFF = [
  "spacer", "aboutPage", "linkHub", "pressPage", "talksSchedule", "salesHero",
  "newsletterPage", "businessPage", "inquiryForm", "faqPage", "partnerPage",
];

// Feste Riegel: Inhalt kommt im Code über `slots`, es gibt nichts zu befüllen —
// sie brauchen keinen Griff. Bewusst nicht in Webbys Katalog (nur Programm-Seite);
// ein Griff würde sie dort ins Menü aller Seiten bringen.
const FEST_IM_CODE = ["programmArtWalks", "programmSchedule", "programmCurated"];

// Bestand: Altlasten in Leisten-Bauteilen, je Datei und Regel, mit Grund.
// Neue Einträge hier sind eine bewusste Ausnahme und brauchen Walters Freigabe.
const BESTAND: Record<string, { regel: Regel; grund: string }[]> = {
  "AdvertorialCardsItem.tsx": [{ regel: "feste Farbe", grund: "Galerie-Fokus mit eigener Grünfläche, vor dem Vertrag gebaut" }],
  "ExhibitorArchiveItem.tsx": [{ regel: "feste Farbe", grund: "Schatten-Farbwert, vor dem Vertrag gebaut" }],
  "FairPlanItem.tsx": [{ regel: "feste Farbe", grund: "Fokus-Schatten, vor dem Vertrag gebaut" }],
  "LinkHubItem.tsx": [{ regel: "Messe-Name", grund: "Rückfalltexte „© Art Düsseldorf“, vor dem Vertrag gebaut" }],
  "NewsletterPopupItem.tsx": [{ regel: "Messe-Name", grund: "Standard-Copy „Inside Art Düsseldorf“, vor dem Vertrag gebaut" }],
  "NewsletterPageItem.tsx": [{ regel: "Messe-Name", grund: "Absender-Vorschau, vor dem Vertrag gebaut" }],
};

type Regel = "feste Farbe" | "Messe-Name" | "Datenzugriff";

// ── Datenform: Bauarten und ihre Felder aus src/lib/sections.ts ──────────────
const SECTIONS = join(WURZEL, "src/lib/sections.ts");
const programm = ts.createProgram([SECTIONS], { strict: true, noEmit: true, jsx: ts.JsxEmit.ReactJSX });
const pruefer = programm.getTypeChecker();
const quelle = programm.getSourceFile(SECTIONS)!;
const felderJeTyp = new Map<string, ts.Type>();
ts.forEachChild(quelle, (knoten) => {
  if (!ts.isInterfaceDeclaration(knoten)) return;
  for (const m of knoten.members) {
    if (!ts.isPropertySignature(m) || m.name.getText(quelle) !== "_type" || !m.type) continue;
    if (ts.isLiteralTypeNode(m.type) && ts.isStringLiteral(m.type.literal)) {
      felderJeTyp.set(m.type.literal.text, pruefer.getTypeAtLocation(knoten));
    }
  }
});
const namen = (t: ts.Type) => new Set(t.getProperties().map((p) => p.getName()));
function elementTyp(t: ts.Type, feld: string): ts.Type | undefined {
  const p = t.getProperty(feld);
  if (!p?.valueDeclaration) return undefined;
  const ft = pruefer.getNonNullableType(pruefer.getTypeOfSymbolAtLocation(p, p.valueDeclaration));
  return pruefer.isArrayType(ft) ? pruefer.getTypeArguments(ft as ts.TypeReference)[0] : undefined;
}

// ── Renderer-Fälle ───────────────────────────────────────────────────────────
const renderer = readFileSync(join(WURZEL, "src/components/SectionRenderer.tsx"), "utf8");
const faelle = new Set([...renderer.matchAll(/case "([A-Za-z]+)"/g)].map((m) => m[1]));
const slotTypen = new Set([...(renderer.match(/SLOT_TYPES = \[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([A-Za-z]+)"/g)].map((m) => m[1]));

// 1 + 2: jede Bauart dargestellt, mit Griff oder im Bestand
const griffTypen = new Set(GRIFFE.map((g) => g.typ as string));
for (const typ of felderJeTyp.keys()) {
  if (!faelle.has(typ) && !slotTypen.has(typ)) fehler.push(`${typ}: kein Fall im SectionRenderer`);
  if (!griffTypen.has(typ) && !OHNE_GRIFF.includes(typ) && !FEST_IM_CODE.includes(typ)) fehler.push(`${typ}: neue Leiste ohne Griff (src/lib/griffe.ts)`);
  if (griffTypen.has(typ) && FEST_IM_CODE.includes(typ)) fehler.push(`${typ}: fester Riegel mit Griff — käme in Webbys Menü aller Seiten`);
}
for (const typ of OHNE_GRIFF) {
  if (griffTypen.has(typ)) hinweise.push(`${typ} hat jetzt einen Griff — aus OHNE_GRIFF streichen`);
}

// 3: Griffe passen zur Datenform
function pruefeFaecher(typ: string, faecher: Fach[], form: ts.Type, wo: string) {
  const vorhanden = namen(form);
  for (const f of faecher) {
    if (f.art === "notiz" || f.art === "zwischentitel") continue;
    if (f.art === "logofein") {
      for (const n of ["variant", "scale"]) if (!vorhanden.has(n)) fehler.push(`${typ}: Fach „logofein“ in ${wo}, aber Feld „${n}“ fehlt in der Datenform`);
      continue;
    }
    if (!vorhanden.has(f.feld)) fehler.push(`${typ}: Fach „${f.feld}“ in ${wo} gibt es nicht in der Datenform`);
    if (f.art === "liste") {
      const el = elementTyp(form, f.feld);
      if (!el) fehler.push(`${typ}: Fach „${f.feld}“ ist eine Liste, das Feld aber kein Array`);
      else pruefeFaecher(typ, f.eintrag, el, `Liste „${f.feld}“`);
    }
  }
}
for (const g of GRIFFE) {
  const form = felderJeTyp.get(g.typ);
  if (!form) { fehler.push(`Griff „${g.typ}“: diese Bauart gibt es nicht`); continue; }
  if (!g.gruppe || !MENUE_GRUPPEN.includes(g.gruppe)) fehler.push(`${g.typ}: Gruppe „${g.gruppe ?? ""}“ ist keine Menü-Überschrift (${MENUE_GRUPPEN.join(", ")})`);
  pruefeFaecher(g.typ, g.faecher, form, "Griff");
}

// 4: Darstellung leer/voll, DE/EN
const entities = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
function texteIn(wert: unknown, out: string[] = []): string[] {
  if (wert && typeof wert === "object") {
    const o = wert as Record<string, unknown>;
    if (typeof o.de === "string") out.push(o.de);
    else for (const v of Object.values(o)) texteIn(v, out);
  }
  return out;
}
let dargestellt = 0;
for (const g of GRIFFE) {
  for (const fall of ["leer", "voll"] as const) {
    for (const lang of ["de", "en"]) {
      const abschnitt = beispiel(g, fall);
      try {
        const html = renderToStaticMarkup(createElement(SectionRenderer, { sections: [abschnitt as never], lang }));
        dargestellt++;
        if (fall === "voll" && lang === "de") {
          const sichtbar = entities(html).replace(/\s+/g, " ");
          const fehlend = texteIn(abschnitt).filter((t) => !sichtbar.includes(t.split("\n")[0]));
          if (fehlend.length) hinweise.push(`${g.typ}: Beispieltexte nicht in der Darstellung: ${fehlend.map((t) => `„${t.split("\n")[0]}“`).join(", ")}`);
        }
      } catch (e) {
        fehler.push(`${g.typ}: Darstellung „${fall}“ (${lang}) bricht ab — ${(e as Error).message.split("\n")[0]}`);
      }
    }
  }
}

// 5: Verbote in Leisten-Bauteilen
const ITEMS = join(WURZEL, "src/components/items");
const ohneKommentare = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const REGELN: { regel: Regel; findet: (code: string) => boolean }[] = [
  // Erlaubt: durchsichtiges Schwarz/Weiß (Schleier über Fotos) — markenneutral.
  { regel: "feste Farbe", findet: (c) => /#[0-9a-fA-F]{3,8}\b/.test(c) || /\brgba?\((?!\s*(0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,)\s*\d/.test(c) },
  { regel: "Messe-Name", findet: (c) => /art\s*d(ü|ue)sseldorf|art-dus|artdus|tokyo\s*gendai/i.test(c) },
  {
    regel: "Datenzugriff",
    findet: (c) =>
      /from\s+["'](@sanity\/|@supabase\/|next\/headers|server-only|node:|fs["'])/.test(c) ||
      // fetch nur zum Absenden eines Formulars (POST)
      [...c.matchAll(/fetch\(([^;]*)/g)].some((m) => !/method:\s*["']POST["']/.test(m[1])),
  },
];
for (const datei of readdirSync(ITEMS).filter((d) => d.endsWith(".tsx"))) {
  const code = ohneKommentare(readFileSync(join(ITEMS, datei), "utf8"));
  const bestand = BESTAND[datei] ?? [];
  for (const { regel, findet } of REGELN) {
    const verletzt = findet(code);
    const erlaubt = bestand.some((b) => b.regel === regel);
    if (verletzt && !erlaubt) fehler.push(`${datei}: Verbot „${regel}“ (siehe CLAUDE.md)`);
    if (!verletzt && erlaubt) hinweise.push(`${datei}: „${regel}“ ist behoben — aus BESTAND streichen`);
  }
}

// ── Bericht ─────────────────────────────────────────────────────────────────
console.log(`Leisten-Vertrag: ${felderJeTyp.size} Bauarten, ${GRIFFE.length} mit Griff, ${FEST_IM_CODE.length} fest im Code, ${OHNE_GRIFF.length} noch ohne Griff, ${dargestellt} Darstellungen geprüft.`);
for (const h of hinweise) console.log(`  Hinweis: ${h}`);
for (const f of fehler) console.log(`  FEHLER:  ${f}`);
if (fehler.length) {
  console.log(`\n${fehler.length} Fehler — der Vertrag ist nicht erfüllt.`);
  process.exit(1);
}
console.log("\nVertrag erfüllt.");
