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
  "gallery-faq": "galerie-faq",
  imprint: "impressum",
};

// Interne Links mit Sprache präfigieren und für Deutsch den Slug übersetzen.
// Anker, mailto und externe URLs bleiben unberührt; bereits sprach-
// präfigierte Links werden nicht doppelt präfigiert (aber noch übersetzt).
export function localizeHref(href: string, lang: "de" | "en"): string {
  if (/^(mailto:|tel:|https?:|#)/.test(href)) return href;
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;

  // ggf. vorhandenes Sprachpräfix abtrennen
  const prefixed = href.match(/^\/(de|en)(\/.*|#.*|)$/);
  const path = prefixed ? prefixed[2] || "/" : href;

  if (lang === "de") {
    const m = path.match(/^\/([^/#?]+)(.*)$/);
    if (m && DE_SLUGS[m[1]]) return `/de/${DE_SLUGS[m[1]]}${m[2]}`;
  }
  return `/${lang}${path === "/" ? "" : path}`;
}
