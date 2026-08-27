'use client'

import {useState} from 'react'
import Logo from '../Logo'
import {renderInlineLinks} from '../inlineLinks'
import {loc, type Loc} from '../../lib/sections'

// „Linkseite" (LinkHubItem) — Linktree-artige Unterseite für die Instagram-Bio.
// Design-Handoff „Instagram Linktree" (27.8.2026), umgesetzt als Variante A
// „Foto-Bühne" (Annalenas Wahl): schwarze Seite, Foto 4:3 mit der echten
// SVG-Wortmarke im dunklen Verlauf, Lime-Pill-Buttons, Bildnachweis-Sektion.
// Abweichungen vom Handoff: echte Wortmarke statt gestapeltem Text; der
// DE/EN-Umschalter sitzt im Seitenfluss (fixed überlappte die Wortmarke).
//
// Der Umschalter wechselt die Sprache CLIENTSEITIG: die Bio verlinkt EINE
// URL, beide Sprachen müssen ohne Navigation erreichbar sein. Deshalb kommen
// alle Texte als Loc ({de,en}) herein und das Item löst selbst auf.
//
// Klicks auf die Pills gehen als Custom Event „linkseite-klick" an Vercel
// Web Analytics — über die globale window.va-Queue, die AD27s <Analytics/>
// bereitstellt. Ohne Analytics (z. B. Webby-Vorschau) passiert einfach nichts.

export interface LinkHubLink {
  label?: Loc
  href: string
}

// Bildnachweis als Textblock (statt Pille): Datum/Titel-Zeile + Fließtext.
// Ein Nachweis braucht oft mehrere Links (Fotoquelle + Lizenz) — sie stehen
// als [Text](https://…) im Fließtext und werden klickbar gerendert
// (geteilter Helfer components/inlineLinks, auch in den FAQ-Antworten).
export interface LinkHubCredit {
  heading?: Loc
  body?: Loc
}

function trackClick(label: string, href: string, sprache: string) {
  try {
    ;(window as unknown as {va?: (event: string, props?: unknown) => void}).va?.('event', {
      name: 'linkseite-klick',
      data: {label, href, sprache},
    })
  } catch {
    // Analytics nicht geladen — der Klick selbst funktioniert trotzdem.
  }
}

export function LinkHubItem({
  id,
  lang = 'de',
  imageSrc,
  imageAlt = '',
  dateLine,
  placeLine,
  showLanguageToggle = true,
  links,
  creditsTitle,
  creditsIntro,
  credits = [],
  footerNote,
}: {
  id?: string
  lang?: 'de' | 'en' // Startsprache (aus der Route); danach wechselt der Umschalter
  imageSrc?: string // Foto-Bühne (4:3); ohne Foto steht die Wortmarke frei
  imageAlt?: string
  dateLine?: Loc // z. B. „9 – 11 April 2027"
  placeLine?: Loc // z. B. „Areal Böhler"
  showLanguageToggle?: boolean
  links: LinkHubLink[]
  creditsTitle?: Loc // Default „Bildnachweise"/„Image credits"
  creditsIntro?: Loc // kleiner Erklärtext unter der Überschrift
  credits?: LinkHubCredit[] // Textblöcke; leer = Sektion entfällt
  footerNote?: Loc // Default „© Art Düsseldorf"
}) {
  const [l, setL] = useState<'de' | 'en'>(lang)

  const pill = (link: LinkHubLink, i: number) => {
    const label = loc(link.label, l)
    return (
      <a
        key={`${i}-${link.href}`}
        href={link.href}
        onClick={() => trackClick(label, link.href, l)}
        style={{animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both'}}
        className="animate-fade-in flex items-center justify-center text-center rounded-[50px] border-2 border-artdus-lime text-white min-h-[44px] px-6 py-3 text-[15px] uppercase tracking-[0.14em] font-medium no-underline cursor-pointer transition-colors duration-200 hover:bg-artdus-lime hover:text-artdus-black active:translate-y-px"
      >
        {label}
      </a>
    )
  }

  const langButton = (code: 'de' | 'en') => (
    <button
      key={code}
      type="button"
      aria-pressed={l === code}
      onClick={() => setL(code)}
      className={`px-3 py-2 text-[12px] font-medium uppercase tracking-[0.14em] border cursor-pointer transition-colors duration-150 ${
        l === code
          ? 'bg-artdus-lime text-artdus-black border-artdus-lime'
          : 'bg-transparent text-white border-white/25 hover:border-white/60'
      }`}
    >
      {code}
    </button>
  )

  return (
    <section id={id} className="bg-artdus-black text-white min-h-[100svh] flex justify-center px-5 py-6">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-7">
        <h1 className="sr-only">{l === 'de' ? 'Art Düsseldorf — Links' : 'Art Düsseldorf — links'}</h1>

        {showLanguageToggle && (
          <div className="w-full flex justify-end gap-1.5 -mb-2">{langButton('de')}{langButton('en')}</div>
        )}

        {/* Kopf: Foto-Bühne mit Wortmarke im Verlauf — ohne Foto Wortmarke frei */}
        <div className="w-full flex flex-col items-center">
          {imageSrc ? (
            <div className="relative w-full overflow-hidden">
              <img src={imageSrc} alt={imageAlt} className="block w-full aspect-[4/3] object-cover" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-artdus-black/75 via-artdus-black/10 to-transparent"
              />
              <div className="absolute left-5 right-5 bottom-[18px]">
                <Logo className="w-full h-auto" />
              </div>
            </div>
          ) : (
            <div className="w-full pt-1.5">
              <Logo className="w-full h-auto" />
            </div>
          )}
          {(loc(dateLine, l) || loc(placeLine, l)) && (
            <div className="flex flex-col items-center gap-1.5 text-center mt-4">
              {loc(dateLine, l) && (
                <div className="text-[14px] tracking-[0.14em] uppercase text-white/55">{loc(dateLine, l)}</div>
              )}
              {loc(placeLine, l) && (
                <div className="text-[15px] tracking-[0.14em] uppercase text-white/75">{loc(placeLine, l)}</div>
              )}
            </div>
          )}
        </div>

        {/* Haupt-Buttons */}
        {links.length > 0 && (
          <div className="w-full flex flex-col gap-3">{links.map((link, i) => pill(link, i))}</div>
        )}

        {/* Bildnachweise — Textblöcke mit Inline-Links (Fotoquelle + Lizenz) */}
        {credits.length > 0 && (
          <div className="w-full mt-1 pt-5 border-t border-white/15">
            <div className="text-[13px] font-medium tracking-[0.14em] uppercase text-artdus-lime text-center mb-3">
              {loc(creditsTitle, l) || (l === 'de' ? 'Bildnachweise' : 'Image credits')}
            </div>
            {loc(creditsIntro, l) && (
              <p className="text-[13px] leading-[1.55] text-white/50 text-center mb-5 whitespace-pre-line">
                {loc(creditsIntro, l)}
              </p>
            )}
            <ul className="w-full flex flex-col gap-4 text-left">
              {credits.map((c, i) => (
                <li key={i} className={i > 0 ? 'pt-4 border-t border-white/10' : undefined}>
                  {loc(c.heading, l) && (
                    <div className="text-[14px] font-medium text-white/90 mb-1">{loc(c.heading, l)}</div>
                  )}
                  {loc(c.body, l) && (
                    <p className="text-[13px] leading-[1.6] text-white/65 whitespace-pre-line">
                      {renderInlineLinks(loc(c.body, l), {
                        className:
                          'text-white underline decoration-artdus-lime underline-offset-[3px] transition-colors hover:text-artdus-lime',
                        onClick: (label, href) => trackClick(label, href, l),
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[12px] text-white/40 text-center">
          {loc(footerNote, l) || '© Art Düsseldorf'}
        </div>
      </div>
    </section>
  )
}
