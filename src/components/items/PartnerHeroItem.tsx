'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

// Baukasten-Item „Partner-Hero" (Header-Typ 2b) — Split: links Textbox mit
// 3px-Acid-Rahmen (Kicker, H1, Text, Knöpfe), rechts Foto mit dunklem
// Overlay und rotierendem weißen Partner-Logo-Karussell (Cross-Fade).
// „Bewegung reduzieren" friert das Karussell auf dem ersten Logo ein.
// Design-Handoff „Seiten-Header-System", Typ 2b (Partner).

export interface PartnerHeroLogo {
  src: string
  alt: string
  // Form-Klasse zur OPTISCHEN Vereinheitlichung (statt rein geometrisch):
  //   'wortmarke' = breit/niedrig → an der Breite ausrichten
  //   'wappen'    = quadratisch/hoch → an der Höhe ausrichten (sonst zu klein)
  //   'mix'       = Mischform (Default)
  variant?: 'wortmarke' | 'mix' | 'wappen'
  // Feinabgleich der OPTISCHEN Größe pro Logo (0.85–1.15 üblich); 1 = neutral.
  scale?: number
}

// Gemeinsame Box je Form-Klasse: max. Höhe + Breite in % der Foto-Fläche.
// Alle Logos teilen sich dadurch dasselbe Höhenband → kein Größensprung im
// Karussell; die Klasse verhindert, dass Wortmarken zu breit / Wappen zu klein
// werden. Der scale-Faktor gleicht die optische Schwere fein nach.
const LOGO_BOX: Record<NonNullable<PartnerHeroLogo['variant']>, {h: number; w: number}> = {
  wortmarke: {h: 24, w: 84},
  mix: {h: 32, w: 68},
  wappen: {h: 44, w: 54},
}

const ROTATE_MS = 1500

export function PartnerHeroItem({
  id,
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  logos,
}: {
  id?: string
  eyebrow?: string // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  title: string
  body: string
  primaryCta?: {label: string; href: string}
  secondaryCta?: {label: string; href: string}
  imageSrc: string
  imageAlt: string
  logos: PartnerHeroLogo[]
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (logos.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % logos.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [logos.length])

  return (
    <section id={id} className="px-[var(--page-x)] pt-[clamp(24px,2.8vw,40px)] pb-[clamp(36px,3.9vw,56px)]">
      <div className="grid md:grid-cols-2 gap-[clamp(20px,2.8vw,40px)] items-stretch">
        <div className="flex flex-col justify-center border-[3px] border-artdus-lime p-[clamp(28px,3.3vw,48px)]">
          {eyebrow && (
            <span className="flex items-center gap-2.5 text-[13px] font-medium tracking-[0.18em] uppercase mb-[clamp(18px,1.8vw,26px)]">
              <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-normal text-[clamp(42px,5.8vw,84px)] leading-[0.98] tracking-[-0.01em]">
            {title}
          </h1>
          <p className="text-[clamp(17px,1.5vw,22px)] leading-[1.4] text-neutral-700 max-w-[460px] mt-[clamp(20px,1.9vw,28px)] mb-[clamp(26px,2.8vw,40px)]">
            {body}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-artdus-black text-white text-[13px] font-medium tracking-[0.14em] uppercase px-[28px] py-[15px]"
                >
                  {primaryCta.label} →
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center border border-artdus-black text-[13px] font-medium tracking-[0.14em] uppercase px-[26px] py-[14px]"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="relative min-h-[380px] md:min-h-[540px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/[0.38]" />
          <div aria-hidden="true" className="absolute inset-0">
            {logos.map((logo, i) => (
              <div
                key={logo.src}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {(() => {
                  const box = LOGO_BOX[logo.variant ?? 'mix']
                  const s = logo.scale ?? 1
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={logo.src}
                      alt=""
                      className="object-contain brightness-0 invert"
                      style={{maxHeight: `${box.h * s}%`, maxWidth: `${box.w * s}%`}}
                    />
                  )
                })()}
              </div>
            ))}
          </div>
          {/* Für Screenreader: die Partnernamen als Liste statt Bildwechsel */}
          <ul className="sr-only">
            {logos.map((logo) => (
              <li key={logo.src}>{logo.alt}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
