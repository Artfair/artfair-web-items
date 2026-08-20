"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { localizeHref } from "../lib/slugs";
import type { NavItem } from "../lib/navigation";

// Social-Ziele — identisch zur „Folgen"-Liste im Mega-Menü.
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/artduesseldorf/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/artdusseldorf/",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/76572846/",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v1.57A6 6 0 0 1 16 8z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

const LINKS = {
  de: [
    { label: "Tickets", href: "/tickets" },
    { label: "Anreise", href: "/visit#anreise" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Presse", href: "/press" },
    { label: "Kontakt", href: "mailto:info@art-dus.de" },
    { label: "Impressum", href: "/imprint" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
  en: [
    { label: "Tickets", href: "/tickets" },
    { label: "Getting here", href: "/visit#anreise" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "mailto:info@art-dus.de" },
    { label: "Imprint", href: "/imprint" },
    { label: "Privacy", href: "/datenschutz" },
  ],
} as const;

// Dunkler Footer — Schwarz mit Lime-Akzentlinie, weiße Schrift.
// Links in Zweier-Spalten: Tickets/Anreise · Presse/Kontakt · Impressum/Datenschutz.
export default function Footer({ nav }: { nav?: { items?: NavItem[] } | null }) {
  const pathname = usePathname();
  const lang: "de" | "en" = pathname.startsWith("/en") ? "en" : "de";

  // Footer-Links aus dem CMS (siteNavigation.footer); Fallback: feste Liste.
  const cmsLinks = (nav?.items ?? [])
    .filter((i) => !i.hidden && i.href && (i.label?.de || i.label?.en))
    .map((i) => ({
      label: (i.label?.[lang] || i.label?.de || i.label?.en) as string,
      href: i.href as string,
    }));
  const links = cmsLinks.length
    ? cmsLinks
    : LINKS[lang].map((l) => ({ label: l.label as string, href: l.href as string }));

  // Interne Links: Sprache präfigieren + deutsche Slugs (lib/site/slugs.ts).
  const withLang = (href: string) => localizeHref(href, lang);

  // Links in Zweier-Spalten gruppieren (Reihenfolge aus CMS bzw. Fallback).
  const linkCols: (typeof links)[] = [];
  for (let i = 0; i < links.length; i += 2) linkCols.push(links.slice(i, i + 2));

  return (
    <footer className="bg-artdus-black text-white">
      <div className="px-[var(--page-x)] pt-[clamp(46px,6vw,84px)] pb-[clamp(30px,3.5vw,44px)]">
        <div className="grid grid-cols-3 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-[clamp(16px,3vw,32px)] gap-y-10 items-start">
          {/* Spalte 1: Wortmarke + Adresse — mobil als eigene Zeile über den Links */}
          <div className="col-span-3 md:col-span-1 flex flex-col gap-6">
            <Logo className="text-white h-4 w-auto self-start" />
            <div className="text-[13px] leading-[1.7] text-neutral-400 whitespace-pre-line">
              {"art.fair International GmbH\nMaria-Hilf-Str. 9\n50677 Köln"}
            </div>
          </div>
          {/* Link-Spalten à zwei Einträge */}
          {linkCols.map((col, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              {col.map((l) => (
                <Link
                  key={l.label}
                  href={withLang(l.href)}
                  className="text-[13px] text-white hover:text-artdus-lime transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/15 mt-[clamp(32px,4vw,56px)] pt-5 flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-400">© 2026 Art Düsseldorf</span>
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-neutral-400 hover:text-artdus-lime transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
