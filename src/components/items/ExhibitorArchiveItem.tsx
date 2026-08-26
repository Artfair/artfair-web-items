'use client'

// Baukasten-Item „Galerien-Archiv" — die Galerienliste einer ABGESCHLOSSENEN
// Ausgabe (z. B. 2026) im Look des Galerien-Index (Design-Handoff
// „Galerienliste" 4a/7a): typografisches Register in bis zu drei Spalten mit
// kombinierbaren Filtern (Sektion, Land, Anfangsbuchstabe, Freitext). Kein
// Liste/Katalog-Umschalter, keine Kati-Suche, kein Themen-Filter — das Archiv
// zeigt, wer dabei war (Annalena 26.8.2026). Die Daten liegen fest im Paket
// (lib/exhibitors2026.ts, Quelle Messeplan); das CMS platziert nur das Item
// und kann Titel/Intro übersteuern. Sektionsfarben laut Messeplan; eine
// Galerie kann in mehreren Sektionen stehen (Sexauer 2026: Main + Paper).
// Zusätzlich zur Live-Liste: die Standnummer rechts unter der Sektion.
//
// Mobil (<md): Inline-Variante wie der Galerien-Index (Entscheidung Annalena
// 28.7.) — Suchfeld voll breit, scrollende Sektions-Pillen mit „Filter"-Knopf,
// der Land/A–Z darunter ausklappt.

import { useMemo, useState } from 'react'
import {
  ARCHIVE_EDITIONS,
  type ArchiveExhibitor,
  type ArchiveSectionKey,
  type ArchiveThemeKey,
} from '../../lib/exhibitors2026'

// Führende Artikel/Gattungswörter fallen für die Einsortierung weg (wie im
// Galerien-Index des Konsumenten).
const SORT_STOPWORDS = new Set(['the', 'galerie', 'galleria', 'gallery', 'galería', 'galeria'])
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function sortKey(e: ArchiveExhibitor): string {
  const words = e.name.trim().split(/\s+/)
  while (words.length > 1 && SORT_STOPWORDS.has(words[0].toLowerCase())) words.shift()
  return words.join(' ')
}

function groupLetter(e: ArchiveExhibitor): string {
  const c = sortKey(e).charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

function countryName(iso: string, lang: 'de' | 'en'): string {
  try {
    return new Intl.DisplayNames([lang], { type: 'region' }).of(iso) ?? iso
  } catch {
    return iso
  }
}

const T = {
  de: {
    eyebrow: 'Ausstellerliste',
    counter: 'Galerien',
    searchPlaceholder: 'Galerie suchen …',
    searchLabel: 'Galerien durchsuchen',
    all: 'Alle',
    themeLabel: 'Thema',
    countryAll: 'Alle Länder',
    countryLabel: 'Land',
    filter: 'Filter',
    stand: 'Stand',
    empty: 'Keine Treffer — Filter zurücksetzen oder anderen Begriff versuchen.',
  },
  en: {
    eyebrow: 'Exhibitor list',
    counter: 'galleries',
    searchPlaceholder: 'Search galleries …',
    searchLabel: 'Search the gallery list',
    all: 'All',
    themeLabel: 'Theme',
    countryAll: 'All countries',
    countryLabel: 'Country',
    filter: 'Filter',
    stand: 'Booth',
    empty: 'No results — reset the filters or try a different term.',
  },
}

export function ExhibitorArchiveItem({
  id,
  lang,
  edition = '2026',
  eyebrow,
  title,
  intro,
}: {
  id?: string
  lang: 'de' | 'en'
  edition?: string // Schlüssel in ARCHIVE_EDITIONS; weitere Jahrgänge ergänzbar
  eyebrow?: string // Default „Ausstellerliste"/„Exhibitor list"
  title?: string // Default „Galerien 2026."/„Galleries 2026."
  intro?: string // optionale Einordnung unter dem Kopf
}) {
  const t = T[lang]
  const data = ARCHIVE_EDITIONS[edition]
  const [sec, setSec] = useState<ArchiveSectionKey | null>(null)
  const [theme, setTheme] = useState<ArchiveThemeKey | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [letter, setLetter] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const sorted = useMemo(
    () => (data ? [...data.exhibitors].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'de')) : []),
    [data],
  )

  const countries = useMemo(() => {
    const iso = [...new Set(sorted.map((e) => e.country))]
    return iso
      .map((c) => ({ iso: c, label: countryName(c, lang) }))
      .sort((a, b) => a.label.localeCompare(b.label, lang))
  }, [sorted, lang])

  // Basis für die A–Z-Verfügbarkeit: nur Sektions- und Länderfilter
  // (nicht Suche) — wie im Handoff spezifiziert.
  const base = useMemo(
    () =>
      sorted.filter(
        (e) => (!sec || e.sections.includes(sec)) && (!country || e.country === country),
      ),
    [sorted, sec, country],
  )

  const availableLetters = useMemo(() => new Set(base.map(groupLetter)), [base])

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase()
    return base.filter(
      (e) =>
        (!theme || (e.themes ?? []).includes(theme)) &&
        (!letter || groupLetter(e) === letter) &&
        (!query ||
          e.name.toLowerCase().includes(query) ||
          e.cities.some((c) => c.toLowerCase().includes(query)) ||
          e.stand.toLowerCase().startsWith(query)),
    )
  }, [base, theme, letter, q])

  const groups = useMemo(() => {
    const map = new Map<string, ArchiveExhibitor[]>()
    for (const e of shown) {
      const l = groupLetter(e)
      if (!map.has(l)) map.set(l, [])
      map.get(l)!.push(e)
    }
    return [...map.entries()]
  }, [shown])

  if (!data) return null
  const activeCount = [sec, theme, country, letter].filter((v) => v !== null).length

  const pill = (label: string, isActive: boolean, onClick: () => void, key?: string) => (
    <button
      key={key ?? label}
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`rounded-[50px] border px-[14px] py-[3px] min-h-[26px] text-[13px] tracking-[0.06em] uppercase whitespace-nowrap transition-all duration-[120ms] ${
        isActive
          ? 'bg-artdus-lime text-artdus-black border-artdus-black'
          : 'bg-white border-artdus-black hover:border-artdus-lime hover:shadow-[inset_0_0_0_2px_#E7FA31]'
      }`}
    >
      {label}
    </button>
  )

  const sectionPills = (
    <>
      {pill(t.all, sec === null, () => setSec(null), 'sec-all')}
      {data.sections.map((s) =>
        pill(s.label[lang], sec === s.key, () => setSec(sec === s.key ? null : s.key), s.key),
      )}
    </>
  )

  const themePills = data.themes.length === 0 ? null : (
    <>
      {pill(t.all, theme === null, () => setTheme(null), 'theme-all')}
      {data.themes.map((th) =>
        pill(th.label, theme === th.key, () => setTheme(theme === th.key ? null : th.key), th.key),
      )}
    </>
  )

  const countrySelect = (
    <select
      value={country ?? 'all'}
      onChange={(e) => setCountry(e.target.value === 'all' ? null : e.target.value)}
      aria-label={t.countryLabel}
      className="border-0 border-b border-neutral-300 rounded-none py-[10px] text-[16px] bg-white outline-none focus:border-b-2 focus:border-artdus-black w-full md:w-[240px]"
    >
      <option value="all">{t.countryAll}</option>
      {countries.map((c) => (
        <option key={c.iso} value={c.iso}>
          {c.label}
        </option>
      ))}
    </select>
  )

  const azBar = (
    <div className="flex flex-wrap gap-[2px]">
      <button
        type="button"
        aria-pressed={letter === null}
        onClick={() => setLetter(null)}
        className={`min-w-[34px] h-[34px] px-2 text-[14px] transition-colors duration-[120ms] ${
          letter === null ? 'bg-artdus-lime text-artdus-black' : 'hover:bg-neutral-100'
        }`}
      >
        {t.all}
      </button>
      {ALPHABET.map((l) => {
        const available = availableLetters.has(l)
        const isActive = letter === l
        return (
          <button
            key={l}
            type="button"
            disabled={!available}
            aria-pressed={isActive}
            onClick={() => setLetter(isActive ? null : l)}
            className={`min-w-[34px] h-[34px] text-[14px] transition-colors duration-[120ms] disabled:opacity-25 ${
              isActive ? 'bg-artdus-lime text-artdus-black' : available ? 'hover:bg-neutral-100' : ''
            }`}
          >
            {l}
          </button>
        )
      })}
    </div>
  )

  const searchField = (
    <div className="flex items-center border-0 border-b border-neutral-300 focus-within:border-b-2 focus-within:border-artdus-black w-full md:w-[300px]">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchLabel}
        className="flex-1 min-w-0 border-0 outline-none text-[16px] py-[10px] bg-white placeholder:text-neutral-500"
      />
      <span aria-hidden="true" className="text-[18px] text-neutral-500 pl-2">⌕</span>
    </div>
  )

  return (
    <div id={id} className="scroll-mt-14">
      {/* Kopf */}
      <div className="px-[var(--page-x)] pt-[clamp(28px,5vw,72px)] flex items-end justify-between gap-x-10 gap-y-3 flex-wrap">
        <div className="min-w-0">
          <span className="block text-[12px] font-medium tracking-[0.18em] uppercase text-neutral-700">
            {eyebrow || t.eyebrow}
          </span>
          <h1 className="font-normal text-[clamp(44px,7.2vw,104px)] leading-[0.92] tracking-[-0.02em] mt-[14px]">
            {title || (lang === 'de' ? `Galerien ${data.edition}.` : `Galleries ${data.edition}.`)}
          </h1>
        </div>
        <div className="pb-[14px] text-[clamp(15px,1.5vw,22px)] text-neutral-600 whitespace-nowrap">
          <strong className="text-artdus-black font-medium">{data.exhibitors.length}</strong>{' '}
          {t.counter}
        </div>
      </div>
      {intro && (
        <p className="px-[var(--page-x)] pt-[14px] text-[clamp(16px,1.3vw,19px)] leading-[1.62] text-neutral-600 max-w-[62ch]">
          {intro}
        </p>
      )}

      {/* Filterblock — Desktop: zwei Reihen; Mobil: Suche + Pillen-Zeile + Aufklapper */}
      <div className="px-[var(--page-x)] pt-[clamp(20px,3vw,44px)]">
        <div className="hidden md:flex items-center justify-between gap-[18px] flex-wrap pb-[18px]">
          <div className="flex gap-2 flex-wrap">{sectionPills}</div>
          {searchField}
        </div>
        {themePills && (
          <div className="hidden md:flex items-center justify-between gap-[18px] flex-wrap border-t border-neutral-200 py-[18px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[12px] font-medium tracking-[0.18em] uppercase text-neutral-700">
                {t.themeLabel}
              </span>
              {themePills}
            </div>
            {countrySelect}
          </div>
        )}
        <div className="hidden md:flex items-center justify-between gap-[18px] flex-wrap border-t border-neutral-200 py-[18px]">
          {azBar}
          {!themePills && countrySelect}
        </div>

        {/* Mobil */}
        <div className="md:hidden flex flex-col gap-3">
          {searchField}
          <div className="flex gap-2 items-center overflow-x-auto pb-1 -mx-[var(--page-x)] px-[var(--page-x)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-[50px] bg-artdus-black text-white px-[16px] py-[4px] min-h-[26px] text-[13px] tracking-[0.06em] uppercase whitespace-nowrap shrink-0"
            >
              {t.filter}
              {activeCount > 0 ? ` (${activeCount})` : ''} {mobileOpen ? '▴' : '▾'}
            </button>
            {sectionPills}
          </div>
          {mobileOpen && (
            <div className="flex flex-col gap-4 border-t border-neutral-200 pt-4">
              {themePills && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-medium tracking-[0.18em] uppercase text-neutral-700 w-full">
                    {t.themeLabel}
                  </span>
                  {themePills}
                </div>
              )}
              {countrySelect}
              {azBar}
            </div>
          )}
        </div>

        {/* Acid-Abschlusslinie */}
        <div aria-hidden="true" className="h-[4px] bg-artdus-lime mt-[6px]" />
      </div>

      {/* Index */}
      <div className="px-[var(--page-x)] pt-[clamp(28px,3.3vw,48px)] pb-[clamp(56px,7vw,96px)]">
        {shown.length === 0 && <p className="text-[17px] text-neutral-600 py-6">{t.empty}</p>}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-[56px]">
          {groups.map(([l, items]) => (
            <section key={l} className="break-inside-avoid mb-[34px]">
              <h2 className="text-[34px] font-normal leading-none border-b-[1.5px] border-artdus-black pb-2">
                {l}
              </h2>
              <ul className="list-none">
                {items.map((e) => {
                  const row = (
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block text-[17px] leading-[1.25]">{e.name}</span>
                        <span className="block text-[12px] tracking-[0.06em] uppercase opacity-55 mt-1">
                          {e.cities.join(' · ')}, {countryName(e.country, lang)}
                        </span>
                      </span>
                      {/* Rechte Spalte: Sektion(en), darunter die Standnummer */}
                      <span className="shrink-0 text-right mt-[4px]">
                        {e.sections.map((key) => {
                          const meta = data.sections.find((s) => s.key === key)
                          if (!meta) return null
                          return (
                            <span
                              key={key}
                              className="flex items-center justify-end gap-1.5 opacity-80 [&+&]:mt-[3px]"
                            >
                              <span
                                aria-hidden="true"
                                className="w-[9px] h-[9px] rounded-full inline-block"
                                style={{ backgroundColor: meta.color }}
                              />
                              <span className="text-[10px] font-medium tracking-[0.14em] uppercase">
                                {meta.label[lang]}
                              </span>
                            </span>
                          )
                        })}
                        {(e.themes ?? []).length > 0 && (
                          <span className="block text-[13px] italic opacity-55 mt-[5px]">
                            {(e.themes ?? [])
                              .map((k) => data.themes.find((th) => th.key === k)?.label)
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        )}
                        <span className="block text-[11px] tracking-[0.08em] uppercase text-neutral-500 mt-[5px]">
                          {t.stand} {e.stand}
                        </span>
                      </span>
                    </span>
                  )
                  const rowClass =
                    'block py-[11px] pr-[10px] border-b border-neutral-200 transition-all duration-[120ms] hover:shadow-[inset_0_0_0_2px_#E7FA31] hover:border-artdus-lime hover:pl-[10px] focus-visible:shadow-[inset_0_0_0_2px_#E7FA31] focus-visible:pl-[10px] focus-visible:outline-none'
                  return (
                    <li key={e.name}>
                      {e.url ? (
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                          {row}
                        </a>
                      ) : (
                        <span className={rowClass}>{row}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
