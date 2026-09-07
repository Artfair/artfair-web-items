import React from 'react'

// Vollständige Magazin-LISTENSEITE als geteilte Anzeige-Komponente (Schrank).
// Rein präsentational: Daten kommen als Props (fertige Karten). Nutzt die
// Magazin-Klassen aus `@artfair/web-items/styles/magazine.css` — der Konsument
// importiert diese CSS einmal (Layout/Seite). So rendern AD27 (Live) und Webby
// (Editor-Vorschau) dieselbe Seite im gleichen Look.

export interface MagListCard {
  id: string
  href: string
  title: string
  excerpt?: string | null
  kicker: string // fertig lokalisiertes Label (Rubrik / Menschen-Typ)
  dateLabel?: string | null
  imageUrl?: string | null
  category: string
  peopleType?: string | null
}

export interface MagListPill {
  key: string
  label: string
  href: string
  active: boolean
}

// Gelbes Pull-Quote-Band mitten im unteren Karten-Raster: EIN Zitat aus einem
// Artikel, verlinkt dorthin. `after` = nach wie vielen Karten des unteren
// Rasters das Band steht (das Puzzle-Muster startet danach neu — gewollt, das
// Band wirkt als Kapitelmarke). Idealerweise steht das Band nahe beim Artikel
// der zitierten Person.
export interface MagListQuote {
  text: string // ohne Anführungszeichen — der Renderer setzt „…“
  attribution: string
  href: string
  linkLabel: string // z. B. „Zum Interview“
  kicker?: string // Default: „Aus dem Magazin“/„From the magazine“
  after?: number // Default 6
}

// HTML-Entities aus WordPress-Import dekodieren (server-sicher, kein DOM).
const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  bdquo: '„', szlig: 'ß', auml: 'ä', ouml: 'ö', uuml: 'ü',
  Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü',
}
function decode(input: string | null | undefined): string {
  if (!input) return ''
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED[name] ?? m)
    .trim()
}

// Sanity-Bild skalieren (identisch zu AD27 lib/magazine/format.ts). Beim
// Zuschnitt (height gesetzt) liegt der Fokuspunkt bei 35 % von oben statt
// mittig — Gesichter stehen fast immer im oberen Bilddrittel; ein mittiger
// Crop schneidet bei Hochformat-Quellen die Köpfe an.
function scaled(url: string | null | undefined, width: number, height?: number): string {
  if (!url) return ''
  if (!url.includes('cdn.sanity.io')) return url
  const sep = url.includes('?') ? '&' : '?'
  return height
    ? `${url}${sep}w=${width}&h=${height}&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.35&auto=format`
    : `${url}${sep}w=${width}&auto=format&fit=max`
}

// wide = Karte auf den Puzzle-Positionen 1/4 im Viererblock (CSS: 3:2 quer).
// Der geladene Zuschnitt MUSS zum CSS-Seitenverhältnis passen, sonst wird das
// Bild zweimal beschnitten (Sanity-Crop 3:4 + object-fit-Crop aufs 3:2-Feld)
// und es bleibt nur ein schmaler Streifen aus der Bildmitte übrig.
function Card({ a, wide = false }: { a: MagListCard; wide?: boolean }) {
  const title = decode(a.title)
  const excerpt = decode(a.excerpt)
  return (
    <a href={a.href} data-article={a.id} className="mag-card">
      <div className={`mag-card__img${a.imageUrl ? '' : ' mag-card__img--empty'}`}>
        {a.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wide ? scaled(a.imageUrl, 900, 600) : scaled(a.imageUrl, 600, 800)}
            alt={title}
            loading="lazy"
          />
        ) : (
          <span aria-hidden>{title.slice(0, 1)}</span>
        )}
        <span
          className="mag-card__bubble"
          data-cat={a.category}
          data-subcat={a.category === 'people' ? a.peopleType ?? '' : ''}
        >
          {a.kicker}
        </span>
      </div>
      <h3 className="mag-card__title">{title}</h3>
      {excerpt && <p className="mag-card__excerpt">{excerpt}</p>}
      {a.dateLabel && <div className="mag-card__meta">{a.dateLabel}</div>}
    </a>
  )
}

export function MagazineListing({
  lang,
  heading,
  intro,
  pills,
  featured,
  mosaic,
  mostRead,
  newsletterTitle,
  newsletterBody,
  quote,
  chrome = true,
}: {
  lang: 'de' | 'en'
  heading?: string
  intro?: string | null
  pills?: MagListPill[]
  featured: MagListCard | null
  mosaic: MagListCard[]
  mostRead: MagListCard[]
  // Texte des gelben Newsletter-Störers in der Sidebar (Label + Untertext);
  // leer = eingebaute Defaults.
  newsletterTitle?: string
  newsletterBody?: string
  // Optionales Pull-Quote-Band im unteren Raster; weglassen = kein Band.
  quote?: MagListQuote | null
  // chrome=true rendert die ganze Seite (Rahmen: .magazine-theme/.mag-wrap +
  // Masthead + Nav). chrome=false rendert NUR den Inhalt (Standfirst + Hero +
  // Mosaik + Sidebar + Extra) — für Konsumenten, die Rahmen/Masthead/Nav selbst
  // liefern (AD27-Layout). Webby nutzt chrome=true.
  chrome?: boolean
}) {
  const readMore = lang === 'de' ? 'Weiterlesen' : 'Read more'
  const mostReadLabel =
    lang === 'de' ? 'Unsere meist gelesenen Artikel' : 'Our most read articles'
  const mosaicMain = mosaic.slice(0, 6)
  const mosaicExtra = mosaic.slice(6)

  const inner = (
    <>
      {intro && <p className="mag-standfirst">{intro}</p>}

        {featured && (
          <a href={featured.href} data-article={featured.id} className="mag-hero">
            <div className="mag-hero__text">
              <p className="mag-kicker">
                {featured.kicker}
                {featured.dateLabel ? ` · ${featured.dateLabel}` : ''}
              </p>
              <h2 className="mag-hero__title">{decode(featured.title)}</h2>
              {featured.excerpt && (
                <p className="mag-hero__excerpt">{decode(featured.excerpt)}</p>
              )}
              <span className="mag-hero__cta">{readMore} →</span>
            </div>
            <div className="mag-hero__visual">
              <div className="mag-hero__frame">
                {featured.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={scaled(featured.imageUrl, 1200, 1500)} alt={decode(featured.title)} />
                )}
              </div>
              <div className="mag-hero__bar" aria-hidden="true" />
            </div>
          </a>
        )}

        <div className="mag-content">
          <div className="mag-mosaic">
            {mosaicMain.map((a, i) => (
              <Card key={a.id} a={a} wide={i % 4 === 0 || i % 4 === 3} />
            ))}
          </div>

          <aside className="mag-sidebar">
            {mostRead.length > 0 && (
              <div className="mag-mostread">
                <h3 className="mag-mostread__title">{mostReadLabel}</h3>
                <ol className="mag-mostread__list">
                  {mostRead.map((a, i) => (
                    <li key={a.id} className="mag-mostread__item">
                      <span className="mag-mostread__num">{String(i + 1).padStart(2, '0')}</span>
                      <a href={a.href} data-article={a.id} className="mag-mostread__link">
                        <span
                          className="mag-card__bubble mag-mostread__cat"
                          data-cat={a.category}
                          data-subcat={a.category === 'people' ? a.peopleType ?? '' : ''}
                        >
                          {a.kicker}
                        </span>
                        <span className="mag-mostread__item-title">{decode(a.title)}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Gelber Newsletter-Störer (Annalena 7.9.): reiner Teaser OHNE
                Formular — verlinkt auf die Anmeldeseite (dort steht das echte
                Brevo-Formular). */}
            <a href={`/${lang}/newsletter`} className="mag-newsletter mag-newsletter--link">
              <p className="mag-newsletter__title">
                {newsletterTitle || 'Newsletter'}
              </p>
              <h3 className="mag-newsletter__headline">
                {lang === 'de' ? 'Community.\nInsights.\nTermine.' : 'Community.\nInsights.\nDates.'}
              </h3>
              <p className="mag-newsletter__sub">
                {newsletterBody ||
                  (lang === 'de'
                    ? 'Werden Sie Teil der Art-Düsseldorf-Community – mit Einblicken hinter die Kulissen und allen wichtigen Terminen zuerst.'
                    : 'Join the Art Düsseldorf community – with behind-the-scenes insights and every key date first.')}
              </p>
              <span className="mag-newsletter__cta">
                {lang === 'de' ? 'Jetzt anmelden' : 'Sign up now'} →
              </span>
            </a>
          </aside>
        </div>

        {(() => {
          // Band mitten im unteren Raster: Karten davor/danach als GETRENNTE
          // Grids (das nth-child-Puzzle-Muster darf nicht durch ein fremdes
          // Grid-Kind verschoben werden — es startet nach dem Band neu).
          const cut = quote ? Math.min(quote.after ?? 6, mosaicExtra.length) : mosaicExtra.length
          const before = mosaicExtra.slice(0, cut)
          const after = mosaicExtra.slice(cut)
          const grid = (cards: MagListCard[], key: string) =>
            cards.length > 0 && (
              <div key={key} className="mag-mosaic mag-mosaic--extra">
                {cards.map((a, i) => (
                  <Card key={a.id} a={a} wide={i % 4 === 0 || i % 4 === 3} />
                ))}
              </div>
            )
          return (
            <>
              {grid(before, 'extra1')}
              {quote && (
                <a href={quote.href} className="mag-quoteband">
                  <p className="mag-quoteband__kicker">
                    {quote.kicker || (lang === 'de' ? 'Aus dem Magazin' : 'From the magazine')}
                  </p>
                  <p className="mag-quoteband__quote">„{quote.text}“</p>
                  <p className="mag-quoteband__attrib">
                    {quote.attribution}&nbsp;&nbsp;·&nbsp;&nbsp;{quote.linkLabel} →
                  </p>
                </a>
              )}
              {grid(after, 'extra2')}
            </>
          )
        })()}
    </>
  )

  if (!chrome) return inner

  return (
    <div className="magazine-theme">
      <div className="mag-wrap">
        <header className="mag-masthead">
          <h1 className="mag-masthead__title">{heading}</h1>
        </header>

        <nav className="mag-nav">
          {(pills ?? []).map((p) => (
            <a
              key={p.key}
              href={p.href}
              data-view={p.key}
              className={`mag-pill${p.active ? ' mag-pill--active' : ''}`}
            >
              {p.label}
            </a>
          ))}
        </nav>

        {inner}
      </div>
    </div>
  )
}
