// ─────────────────────────────────────────────────────────────────────────
// Deutsche Slugs (Entscheidung Annalena 28.7.2026: die deutsche Seite trägt
// immer deutsche Slugs). Die Routen im Dateisystem bleiben kanonisch englisch
// (app/[lang]/visit …) — next.config.ts spannt daraus Rewrites (/de/besuch
// zeigt /de/visit) und Redirects (alte /de/visit-URLs leiten auf /de/besuch).
// localizeHref() übersetzt interne Links beim Rendern.
//
// Markennamen bleiben unverändert (Business meets Art, VIP, FAQ, Tickets,
// Partner, Newsletter); /datenschutz ist schon deutsch. artists →
// kuenstler-innen (Stern geht nicht in URLs; Schreibweise Annalena 28.7.).
// ─────────────────────────────────────────────────────────────────────────

export const DE_SLUGS: Record<string, string> = {
  artists: "kuenstler-innen",
  visit: "besuch",
  press: "presse",
  about: "ueber-uns",
  galleries: "galerien",
  catalogue: "katalog",
  talks: "programm",
  exhibitors: "aussteller",
  magazine: "magazin",
  // Plural „Galerien" (Annalena 13.8.2026) — die alte Live-Seite lief unter
  // /de/faq-fuer-galerien, die neue heißt einheitlich Galerien-FAQ.
  "gallery-faq": "galerien-faq",
  imprint: "impressum",
};

// Slug-Verzeichnis je Sprache: Sprachkürzel → (kanonischer Slug → lokaler).
// Sprachen ohne Eintrag behalten die kanonischen englischen Slugs — das gilt
// für Englisch selbst und für jede Sprache, die keine eigenen Wege braucht.
export type SlugMap = Record<string, Record<string, string>>;

// Standard ist das Verzeichnis der Art Düsseldorf. Eine andere Messe reicht
// ihr eigenes als dritten Parameter durch (oder gar keins).
export const DEFAULT_SLUG_MAP: SlugMap = { de: DE_SLUGS };

// Interne Links mit Sprache präfigieren und den Slug in die Sprache übersetzen.
// Anker, mailto und externe URLs bleiben unberührt; bereits sprach-
// präfigierte Links werden nicht doppelt präfigiert (aber noch übersetzt).
export function localizeHref(
  href: string,
  lang: string,
  slugs: SlugMap = DEFAULT_SLUG_MAP,
): string {
  if (/^(mailto:|tel:|https?:|#)/.test(href)) return href;
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;

  // ggf. vorhandenes Sprachpräfix abtrennen — jedes Zwei-Buchstaben-Kürzel,
  // nicht nur de/en, sonst bliebe „/ja/visit" beim Umschalten kleben.
  const prefixed = href.match(/^\/([a-z]{2})(\/.*|#.*|)$/);
  const path = prefixed ? prefixed[2] || "/" : href;

  const verzeichnis = slugs[lang];
  if (verzeichnis) {
    const m = path.match(/^\/([^/#?]+)(.*)$/);
    if (m && verzeichnis[m[1]]) return `/${lang}/${verzeichnis[m[1]]}${m[2]}`;
  }
  return `/${lang}${path === "/" ? "" : path}`;
}
