'use client'

import Link from 'next/link'
import {useMemo, useState} from 'react'

// „FAQ-Seite" — die GANZE FAQ-Seite als EIN Baukasten-Item (Muster
// AboutPageItem). Löst den in AD27 fest verdrahteten FaqExplorer ab, damit
// Besucher- und Galerien-FAQ in Webby gepflegt werden können.
// Design-Entscheidungen (Annalena 13.8.2026):
//   – Header-Typ 4 reduziert: ohne Eyebrow
//   – Umschalt-Knopf zur jeweils anderen FAQ-Seite als dezente Pill oben
//     rechts (nicht als schwerer schwarzer Knopf); per CMS ausblendbar
//   – Plus-Zeichen schwarz auf Lime-Quadrat (Haus-Motiv), dreht sich zum ×
// Suche und Themen-Pills wirken zusammen (UND-Verknüpfung); die Pills sind
// Einfachauswahl, „Alle Themen" hebt den Filter auf. Fragen gehören
// strukturell zu ihrer Kategorie (Gruppen) — kein Text-Abgleich.

export interface FaqQa {
  q: string
  a: string // mehrzeilig, Absätze mit Leerzeile (\n\n)
}

export interface FaqCategory {
  label: string // Pill-Beschriftung, z. B. „Termine und Fristen"
  faqs: FaqQa[]
}

export function FaqPageItem({
  id,
  title,
  intro,
  switchCta,
  searchPlaceholder,
  searchLabel,
  allLabel,
  emptyText,
  categories,
}: {
  id?: string
  title: string
  intro?: string
  switchCta?: {label: string; href: string} // Pill oben rechts; fehlt = weg
  searchPlaceholder: string
  searchLabel: string
  allLabel: string
  emptyText: string
  categories: FaqCategory[]
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string | null>(null)

  const all = useMemo(
    () => categories.flatMap((c) => c.faqs.map((f) => ({...f, cat: c.label}))),
    [categories],
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter(
      (f) =>
        (!active || f.cat === active) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
    )
  }, [all, active, query])

  const pill = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`rounded-[50px] border border-artdus-black px-[18px] py-[5px] text-[14px] tracking-[0.02em] cursor-pointer transition-colors ${
        isActive ? 'bg-artdus-black text-white' : 'bg-white hover:bg-artdus-black hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <section id={id}>
      <div className="px-[var(--page-x)] pt-[clamp(48px,6.1vw,88px)] pb-[clamp(24px,2.8vw,40px)] flex gap-[clamp(20px,2.5vw,36px)] items-stretch">
        <div aria-hidden="true" className="w-[clamp(16px,1.9vw,28px)] bg-artdus-lime shrink-0" />
        <div className="flex-1 flex justify-between items-start gap-x-10 gap-y-6 flex-wrap">
          <div className="flex-[1_1_320px] min-w-0">
            <h1 className="font-normal text-[clamp(42px,5.8vw,84px)] leading-[0.98] tracking-[-0.01em]">
              {title}
            </h1>
            {intro && (
              <p className="text-[clamp(18px,1.6vw,23px)] leading-[1.4] text-neutral-700 max-w-[640px] mt-[clamp(20px,1.9vw,28px)]">
                {intro}
              </p>
            )}
            <div className="flex items-center border-[1.5px] border-artdus-black max-w-[560px] mt-[clamp(24px,2.8vw,40px)]">
              <span aria-hidden="true" className="px-[18px] text-[20px] text-neutral-600">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchLabel}
                className="flex-1 min-w-0 border-0 outline-none text-[16px] py-[15px] pr-2 bg-white"
              />
            </div>
          </div>
          {switchCta && (
            <Link
              href={switchCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-artdus-black bg-white px-5 py-[9px] mt-1.5 text-[13px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-artdus-black hover:text-white"
            >
              {switchCta.label}
              <span aria-hidden="true" className="text-[14px]">↗</span>
            </Link>
          )}
        </div>
      </div>
      <div className="px-[var(--page-x)] pt-[clamp(16px,1.7vw,24px)]">
        <div aria-hidden="true" className="h-px bg-artdus-black" />
      </div>

      <div className="px-[var(--page-x)] pt-5 pb-[clamp(24px,2.8vw,40px)] flex gap-3 flex-wrap">
        {pill(allLabel, active === null, () => setActive(null))}
        {categories.map((c) => pill(c.label, active === c.label, () => setActive(c.label)))}
      </div>

      <div className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)]">
        {shown.length === 0 && <p className="text-[17px] text-neutral-600 py-6">{emptyText}</p>}
        <ul className="max-w-[880px]">
          {shown.map((f) => (
            <li key={f.q} className="border-b border-neutral-200">
              <details className="group py-1">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-[17px] font-medium leading-[1.35]">{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="w-6 h-6 bg-artdus-lime text-artdus-black inline-flex items-center justify-center text-[17px] font-medium shrink-0 group-open:rotate-45 transition-transform"
                  >
                    +
                  </span>
                </summary>
                <p className="text-[16px] leading-[1.6] text-neutral-600 pb-5 max-w-[64ch] whitespace-pre-line">
                  {f.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
