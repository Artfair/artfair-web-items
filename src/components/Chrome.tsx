"use client";

import { usePathname } from "next/navigation";
import { langFromPath } from "../lib/sections";

const SKIP: Record<string, string> = {
  de: "Zum Inhalt springen",
  en: "Skip to content",
  ja: "本文へスキップ",
};

export default function Chrome({
  header,
  footer,
  children,
  langs = ["de", "en"],
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  /** Sprachen dieser Instanz, erste ist die Hauptsprache. */
  langs?: readonly string[];
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  // Sprunglink-Beschriftung in der Seitensprache, Rückfall Englisch.
  const lang = langFromPath(pathname, langs[0]);
  const skip = SKIP[lang as keyof typeof SKIP] ?? SKIP.en;
  // Linkseite für die Instagram-Bio (LinkHubItem, sitePage /links): eigen-
  // ständige schwarze Seite OHNE Header/Footer — die Bio-Besucher sollen
  // die Buttons sehen, nicht das Website-Menü.
  const isBare = /^\/([a-z]{2}\/)?links\/?$/.test(pathname ?? "");

  if (isStudio || isBare) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-ink focus:text-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium"
      >
        {skip}
      </a>
      {header}
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
