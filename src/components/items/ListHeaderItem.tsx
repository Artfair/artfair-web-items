'use client'

// Baukasten-Item „Listen-Header" (Header-Typ 5 · Liste) — kompakter Titel
// mit Zähler rechts, darunter Filter-Pills und Suchfeld, abgeschlossen von
// der 5px-Acid-Linie. Der Header leitet direkt in die Liste der Seite über;
// Filter/Suche sind kontrolliert (State besitzt die Seite). Ohne filters/
// onSearchChange rendert nur die Titelzeile + Acid-Linie (CMS-Variante).
// Design-Handoff „Seiten-Header-System", Typ 5 (Galerien, Artists, Katalog).

export function ListHeaderItem({
  id,
  eyebrow,
  title,
  counterValue,
  counterLabel,
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
}: {
  id?: string
  eyebrow?: string // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  title: string
  counterValue?: string // z. B. "142" oder "380+"
  counterLabel?: string // z. B. "Galerien"
  filters?: {value: string | null; label: string}[] // null = alle
  activeFilter?: string | null
  onFilterChange?: (value: string | null) => void
  searchQuery?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  searchLabel?: string
}) {
  return (
    <section id={id}>
      <div className="px-[var(--page-x)] pt-[clamp(40px,5vw,72px)] pb-[clamp(20px,2.2vw,32px)] flex items-end justify-between gap-x-10 gap-y-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <span className="flex items-center gap-2.5 text-[13px] font-medium tracking-[0.18em] uppercase mb-[clamp(14px,1.5vw,22px)]">
              <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-normal text-[clamp(40px,5vw,72px)] leading-[0.98] tracking-[-0.01em]">
            {title}
          </h1>
        </div>
        {counterValue && (
          <div className="text-[20px] text-neutral-600 whitespace-nowrap">
            <strong className="text-artdus-black font-medium">{counterValue}</strong>{' '}
            {counterLabel}
          </div>
        )}
      </div>

      {(filters || onSearchChange) && (
        <div className="px-[var(--page-x)] pb-[clamp(18px,1.9vw,28px)] flex items-center justify-between gap-6 flex-wrap">
          {filters && onFilterChange && (
            <div className="flex gap-3 flex-wrap">
              {filters.map((f) => {
                const isActive = (activeFilter ?? null) === f.value
                return (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onFilterChange(f.value)}
                    className={`rounded-[50px] border border-artdus-black px-[20px] py-[6px] text-[15px] transition-colors ${
                      isActive
                        ? 'bg-artdus-black text-white'
                        : 'bg-white hover:bg-artdus-black hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          )}
          {onSearchChange && (
            <div className="flex items-center border-[1.5px] border-artdus-black min-w-[260px] max-w-[360px] flex-1">
              <span aria-hidden="true" className="px-[14px] text-[18px] text-neutral-600">⌕</span>
              <input
                type="search"
                value={searchQuery ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchLabel}
                className="flex-1 min-w-0 border-0 outline-none text-[15px] py-[11px] pr-2 bg-white"
              />
            </div>
          )}
        </div>
      )}

      <div aria-hidden="true" className="mx-[var(--page-x)] h-[5px] bg-artdus-lime" />
    </section>
  )
}
