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

// Sanity-Bild skalieren (identisch zu AD27 lib/magazine/format.ts).
function scaled(url: string | null | undefined, width: number, height?: number): string {
  if (!url) return ''
  if (!url.includes('cdn.sanity.io')) return url
  const sep = url.includes('?') ? '&' : '?'
  return height
    ? `${url}${sep}w=${width}&h=${height}&fit=crop&auto=format`
    : `${url}${sep}w=${width}&auto=format&fit=max`
}

function Card({ a }: { a: MagListCard }) {
  const title = decode(a.title)
  const excerpt = decode(a.excerpt)
  return (
    <a href={a.href} data-article={a.id} className="mag-card">
      <div className={`mag-card__img${a.imageUrl ? '' : ' mag-card__img--empty'}`}>
        {a.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scaled(a.imageUrl, 600, 800)} alt={title} loading="lazy" />
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
}: {
  lang: 'de' | 'en'
  heading: string
  intro?: string | null
  pills: MagListPill[]
  featured: MagListCard | null
  mosaic: MagListCard[]
  mostRead: MagListCard[]
}) {
  const readMore = lang === 'de' ? 'Weiterlesen' : 'Read more'
  const mostReadLabel = lang === 'de' ? 'Meistgelesen' : 'Most Read'
  const mosaicMain = mosaic.slice(0, 6)
  const mosaicExtra = mosaic.slice(6)

  return (
    <div className="magazine-theme">
      <div className="mag-wrap">
        <header className="mag-masthead">
          <h1 className="mag-masthead__title">{heading}</h1>
        </header>

        <nav className="mag-nav">
          {pills.map((p) => (
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
            {mosaicMain.map((a) => (
              <Card key={a.id} a={a} />
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

            <div className="mag-newsletter">
              <p className="mag-newsletter__title">Newsletter</p>
              <h3 className="mag-newsletter__headline">
                {lang === 'de' ? 'Kunst.\nNeu erschlossen.' : 'Art.\nRediscovered.'}
              </h3>
              <p className="mag-newsletter__sub">
                {lang === 'de'
                  ? 'Neuigkeiten, Interviews und Einblicke aus der Welt der ART DÜSSELDORF.'
                  : 'News, interviews and insights from the world of ART DÜSSELDORF.'}
              </p>
              <form className="mag-newsletter__form" action="#" method="post">
                <input
                  type="email"
                  name="email"
                  className="mag-newsletter__input"
                  placeholder={lang === 'de' ? 'Ihre E-Mail' : 'Your email'}
                  aria-label={lang === 'de' ? 'E-Mail-Adresse' : 'Email address'}
                />
                <button type="submit" className="mag-newsletter__btn">→</button>
              </form>
            </div>
          </aside>
        </div>

        {mosaicExtra.length > 0 && (
          <div className="mag-mosaic mag-mosaic--extra">
            {mosaicExtra.map((a) => (
              <Card key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
