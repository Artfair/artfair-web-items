'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

// Baukasten-Item „Partner-Hero" (Header-Typ 2b) — Split: links Textbox mit
// 3px-Acid-Rahmen (H1, Text, Knöpfe), rechts Foto mit dunklem
// Overlay und rotierendem weißen Partner-Logo-Karussell (Cross-Fade).
// „Bewegung reduzieren" friert das Karussell auf dem ersten Logo ein.
// Design-Handoff „Seiten-Header-System", Typ 2b (Partner).

export interface PartnerHeroLogo {
  src: string
  alt: string
}

const ROTATE_MS = 1500

export function PartnerHeroItem({
  id,
  title,
  body,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  logos,
}: {
  id?: string
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  eyebrow?: string
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt=""
                  className="max-w-[70%] max-h-[46%] object-contain brightness-0 invert"
                />
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
