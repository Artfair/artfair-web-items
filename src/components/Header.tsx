"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizeHref } from "../lib/slugs";
import Logo from "./Logo";
import type { SiteNav, NavItem } from "../lib/navigation";

// Mega-Menü-Inhalte (Design-Handoff, Variante B), DE/EN
const MENU = {
  de: {
    tickets: "Tickets",
    cols: [
      {
        head: "Messe",
        href: "/visit",
        items: [
          { label: "Tickets", href: "/tickets" },
          { label: "Öffnungszeiten", href: "/visit#oeffnungszeiten" },
          { label: "Anreise", href: "/visit#anreise" },
          { label: "Messeplan", href: "/visit#messeplan" },
          { label: "Hotels", href: "/visit#hotels" },
          { label: "Messerestaurant", href: "/visit#gastronomie" },
          { label: "Besucher-FAQ", href: "/faq" },
          { label: "Partner", href: "/partner" },
        ],
      },
      {
        head: "Programm",
        href: "/talks",
        items: [
          { label: "Themen 2027", href: "/#themen" },
          { label: "Talks", href: "/talks" },
          { label: "Führungen", href: "/talks" },
          { label: "Business meets Art", href: "/business-meets-art" },
          { label: "Sektionen", href: "/about" },
          { label: "Community", href: "/vip" },
          { label: "VIP", href: "/vip" },
          { label: "VIP PORTAL 26", href: "https://art-dus.de/vip/" },
        ],
      },
      {
        head: "Aussteller",
        items: [
          { label: "Galerien 2027", href: "/galleries" },
          { label: "Künstler*innen 2027", href: "/artists" },
          { label: "Katalog", href: "/catalogue" },
          { label: "Galerien-FAQ", href: "/gallery-faq" },
          { label: "Anmeldung", href: "https://register.art-dus.de" },
          { label: "Bewerbung", href: "https://application.art-dus.de" },
          { label: "Ausstellerportal", href: "https://exhibitor.art-dus.de" },
        ],
      },
    ],
    moreHead: "Mehr von der Art Düsseldorf",
    more: [
      { label: "Newsletter", href: "/de/newsletter" },
      { label: "Magazin", href: "/de/magazine" },
      { label: "Partner", href: "/partner" },
      { label: "Presse", href: "/press" },
    ],
    followHead: "Folgen",
    companyHead: "Unternehmen",
    company: [
      { label: "Über uns", href: "/about" },
      { label: "Kontakt", href: "mailto:info@art-dus.de" },
      { label: "Impressum", href: "/imprint" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
    magHead: "Neu im Magazin",
  },
  en: {
    tickets: "Tickets",
    cols: [
      {
        head: "The Fair",
        href: "/visit",
        items: [
          { label: "Tickets", href: "/tickets" },
          { label: "Opening hours", href: "/visit#oeffnungszeiten" },
          { label: "Getting here", href: "/visit#anreise" },
          { label: "Floor plan", href: "/visit#messeplan" },
          { label: "Hotels", href: "/visit#hotels" },
          { label: "Fair restaurant", href: "/visit#gastronomie" },
          { label: "Visitor FAQ", href: "/faq" },
          { label: "Partners", href: "/partner" },
        ],
      },
      {
        head: "Program",
        href: "/talks",
        items: [
          { label: "Topics 2027", href: "/en#themen" },
          { label: "Talks", href: "/talks" },
          { label: "Guided tours", href: "/talks" },
          { label: "Business meets Art", href: "/business-meets-art" },
          { label: "Sections", href: "/about" },
          { label: "Community", href: "/vip" },
          { label: "VIP", href: "/vip" },
          { label: "VIP PORTAL 26", href: "https://art-dus.de/vip/" },
        ],
      },
      {
        head: "Exhibitors",
        items: [
          { label: "Galleries 2027", href: "/galleries" },
          { label: "Artists 2027", href: "/artists" },
          { label: "Catalogue", href: "/catalogue" },
          { label: "Gallery FAQ", href: "/gallery-faq" },
          { label: "Registration", href: "https://register.art-dus.de" },
          { label: "Application", href: "https://application.art-dus.de" },
          { label: "Exhibitor Portal", href: "https://exhibitor.art-dus.de" },
        ],
      },
    ],
    moreHead: "More from Art Düsseldorf",
    more: [
      { label: "Newsletter", href: "/en/newsletter" },
      { label: "Magazine", href: "/en/magazine" },
      { label: "Partners", href: "/partner" },
      { label: "Press", href: "/press" },
    ],
    followHead: "Follow us",
    companyHead: "Company",
    company: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "mailto:info@art-dus.de" },
      { label: "Imprint", href: "/imprint" },
      { label: "Privacy", href: "/datenschutz" },
    ],
    magHead: "New in the magazine",
  },
} as const;

const FOLLOW = [
  { label: "Instagram", href: "https://www.instagram.com/artduesseldorf/" },
  { label: "Facebook", href: "https://www.facebook.com/artduesseldorf/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/art-duesseldorf/" },
];

export interface MagazineTeaser {
  title: string;
  href: string;
  imageUrl: string | null;
  meta: string;
}

export default function Header({
  magazineTeaser,
  nav,
}: {
  magazineTeaser?: { de: MagazineTeaser | null; en: MagazineTeaser | null };
  nav?: SiteNav | null;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const lang: "de" | "en" = pathname.startsWith("/en") ? "en" : "de";
  const t = MENU[lang];
  const teaser = magazineTeaser?.[lang] ?? null;

  // Menü aus dem CMS (siteNavigation, Webby-Schrank); fehlt es, greifen die
  // fest hinterlegten Menüs. hidden-Punkte (live/hidden-Schalter in Webby)
  // werden herausgefiltert.
  type MenuList = { head: string; href?: string; items: { label: string; href: string }[] };
  const pickL = (f?: { de?: string; en?: string }) => f?.[lang] || f?.de || f?.en || "";
  const visible = (items?: NavItem[]) =>
    (items ?? [])
      .filter((i) => !i.hidden && i.href && (i.label?.de || i.label?.en))
      .map((i) => ({ label: pickL(i.label), href: i.href as string }));

  const cols: MenuList[] = nav?.cols?.length
    ? nav.cols
        .map((c) => ({ head: pickL(c.head), href: c.href, items: visible(c.items) }))
        .filter((c) => c.items.length > 0)
    : t.cols.map((c) => ({
        head: c.head as string,
        href: (c as {href?: string}).href,
        items: c.items.map((i) => ({ label: i.label as string, href: i.href as string })),
      }));

  const moreGroup: MenuList = nav?.more?.items?.length
    ? { head: pickL(nav.more.head) || t.moreHead, items: visible(nav.more.items) }
    : {
        head: t.moreHead,
        items: t.more.map((i) => ({ label: i.label as string, href: i.href as string })),
      };

  const companyGroup: MenuList = nav?.company?.items?.length
    ? { head: pickL(nav.company.head) || t.companyHead, items: visible(nav.company.items) }
    : {
        head: t.companyHead,
        items: t.company.map((i) => ({ label: i.label as string, href: i.href as string })),
      };

  // VIP-Portal (art-dus.de/vip) und die Aussteller-Portale (Anmeldung,
  // Bewerbung, Ausstellerportal) sind normale Menüpunkte im CMS (siteNavigation,
  // Webby-Schrank) bzw. im Code-Fallback oben. Dadurch lassen sie sich in Webby
  // per live/hidden-Schalter steuern — sie werden nicht mehr fest injiziert.

  // Externe Links (http/https) öffnen in neuem Tab; interne bleiben SPA-Links.
  const isExternal = (href: string) => /^https?:\/\//.test(href);

  // Sprachwechsel: "/" ↔ "/en" für die Startseite, /de/… ↔ /en/… für
  // sprach-präfigierte Routen; übrige (deutsch-only) Seiten → EN-Startseite.
  const langHref = (target: "de" | "en") => {
    const m = pathname.match(/^\/(de|en)(\/.*)?$/);
    if (m) {
      const rest = m[2] ?? "";
      if (rest === "") return target === "de" ? "/" : "/en";
      return `/${target}${rest}`;
    }
    if (target === "de") return pathname || "/";
    return pathname === "/" ? "/en" : "/en";
  };

  // Interne Menü-Links: Sprache präfigieren + deutsche Slugs übersetzen
  // (zentral in lib/site/slugs.ts — dort liegt auch die Slug-Tabelle).
  const withLang = (href: string) => localizeHref(href, lang);

  const close = () => setMenuOpen(false);

  const langPill = (
    <div className="inline-flex items-center border border-artdus-black rounded-full overflow-hidden">
      <Link
        href={langHref("de")}
        onClick={close}
        aria-current={lang === "de" ? "true" : undefined}
        className={`px-[15px] py-[7px] text-xs font-semibold tracking-[0.08em] transition-colors ${
          lang === "de" ? "bg-artdus-black text-white" : "text-neutral-600 hover:text-artdus-black"
        }`}
      >
        DE
      </Link>
      <Link
        href={langHref("en")}
        onClick={close}
        aria-current={lang === "en" ? "true" : undefined}
        className={`px-[15px] py-[7px] text-xs font-semibold tracking-[0.08em] transition-colors ${
          lang === "en" ? "bg-artdus-black text-white" : "text-neutral-600 hover:text-artdus-black"
        }`}
      >
        EN
      </Link>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-artdus-line text-artdus-black">
      <div className="w-full h-full flex items-center justify-between px-[var(--page-x)]">
        <Link href={lang === "en" ? "/en" : "/"} className="flex items-center" onClick={close}>
          <Logo className="text-artdus-black h-4 md:h-6 w-auto" />
        </Link>

        <div className="flex items-center gap-[18px]">
          {langPill}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menü schließen" : "Menü"}
            aria-expanded={menuOpen}
            className="-mr-2 flex flex-col justify-center gap-[5px] w-[42px] h-[34px] px-2 py-1.5 cursor-pointer"
          >
            <span className="block h-[2px] w-full bg-artdus-black" />
            <span className="block h-[2px] w-full bg-artdus-black" />
            <span className="block h-[2px] w-full bg-artdus-black" />
          </button>
        </div>
      </div>

      {/* Mega-Menü — vollflächiges weißes Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto flex flex-col animate-fade-in">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-5 px-[var(--page-x)] py-[22px]">
            <Link
              href={withLang("/tickets")}
              onClick={close}
              className="justify-self-start text-xs font-semibold tracking-[0.1em] uppercase text-white bg-artdus-black rounded-full px-4 md:px-5 py-[9px]"
            >
              {t.tickets}
            </Link>
            <Link href={lang === "en" ? "/en" : "/"} onClick={close}>
              <Logo className="text-artdus-black h-4 md:h-6 w-auto" />
            </Link>
            <div className="justify-self-end flex items-center gap-3 md:gap-[22px]">
              <span className="hidden sm:block">{langPill}</span>
              <button
                onClick={close}
                aria-label="Schließen"
                className="text-3xl leading-none cursor-pointer px-1"
              >
                ×
              </button>
            </div>
          </div>
          <div className="border-t border-artdus-line" />

          <nav
            aria-label={lang === "en" ? "Main menu" : "Hauptmenü"}
            className="w-full max-w-[1500px] mx-auto grid grid-cols-2 gap-8 md:grid-cols-[repeat(3,minmax(150px,1fr))_minmax(170px,0.85fr)_minmax(240px,300px)] md:gap-[clamp(24px,3vw,52px)] px-[var(--page-x)] pt-10 pb-16"
          >
            {cols.map((col) => (
              <div key={col.head} className="flex flex-col gap-[18px]">
                {col.href ? (
                  <Link
                    href={withLang(col.href)}
                    onClick={close}
                    className="text-[15px] lg:text-[17px] font-semibold tracking-[0.02em] uppercase underline underline-offset-[5px] hover:text-artdus-gray transition-colors self-start"
                  >
                    {col.head}
                  </Link>
                ) : (
                  <span className="text-[15px] lg:text-[17px] font-semibold tracking-[0.02em] uppercase underline underline-offset-[5px]">
                    {col.head}
                  </span>
                )}
                {col.items.map((item) =>
                  isExternal(item.href) ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="text-[15px] lg:text-[17px] text-neutral-900 hover:text-artdus-gray transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={withLang(item.href)}
                      onClick={close}
                      className="text-[15px] lg:text-[17px] text-neutral-900 hover:text-artdus-gray transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}

            {/* Meta-Spalte — schwarze Header, lime unterstrichen */}
            <div className="flex flex-col gap-[13px]">
              <span className="text-[15px] font-bold tracking-[0.04em] uppercase underline decoration-artdus-lime decoration-[3px] underline-offset-[5px]">
                {moreGroup.head}
              </span>
              {moreGroup.items.map((item) => (
                <Link
                  key={item.label}
                  href={withLang(item.href)}
                  onClick={close}
                  className="text-sm tracking-[0.04em] uppercase text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <span className="mt-2.5 text-[15px] font-bold tracking-[0.04em] uppercase underline decoration-artdus-lime decoration-[3px] underline-offset-[5px]">
                {t.followHead}
              </span>
              {FOLLOW.map((item) => (
                <a
                  key={item.label}
                  href={withLang(item.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm tracking-[0.04em] uppercase text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <span className="mt-2.5 text-[15px] font-bold tracking-[0.04em] uppercase underline decoration-artdus-lime decoration-[3px] underline-offset-[5px]">
                {companyGroup.head}
              </span>
              {companyGroup.items.map((item) => (
                <Link
                  key={item.label}
                  href={withLang(item.href)}
                  onClick={close}
                  className="text-sm tracking-[0.04em] uppercase text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Magazin-Teaser */}
            {teaser && (
              <div className="col-span-2 md:col-span-1 flex flex-col gap-[13px]">
                <span className="text-[13px] font-bold tracking-[0.06em] uppercase">{t.magHead}</span>
                <Link href={teaser.href} onClick={close} className="block aspect-[4/3] overflow-hidden bg-artdus-black">
                  {teaser.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={teaser.imageUrl} alt={teaser.title} className="w-full h-full object-cover" />
                  )}
                </Link>
                {teaser.meta && (
                  <span className="text-[11px] tracking-[0.08em] uppercase text-neutral-600">{teaser.meta}</span>
                )}
                <Link
                  href={teaser.href}
                  onClick={close}
                  className="text-xl lg:text-2xl leading-tight font-medium"
                >
                  {teaser.title}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
