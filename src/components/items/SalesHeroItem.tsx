'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

// Baukasten-Item „Sales-Hero" (Header-Typ 3 · Sales) — Split: links Textbox
// mit 3px-Acid-Rahmen, Acid-CTA als einziger Farbakzent; rechts eine
// Foto-Slideshow (Cross-Fade ohne Weißblitz: das erste Bild liegt immer
// deckend unten). „Bewegung reduzieren" friert die Show auf Bild 1 ein.
// Design-Handoff „Seiten-Header-System", Typ 3 (Business meets Art).

const SLIDE_MS = 1800

export function SalesHeroItem({
  id,
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  images,
  imageAlt,
  imageCaption,
}: {
  id?: string
  eyebrow?: string // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  title: string
  body: string
  primaryCta?: {label: string; href: string}
  secondaryCta?: {label: string; href: string}
  images: string[]
  imageAlt?: string
  imageCaption?: string // dezente Bildunterschrift unter der Slideshow (z. B. „Business meets Art, AD26")
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [images.length])

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
          <h1 className="font-normal text-[clamp(36px,4.5vw,64px)] leading-[1.0] tracking-[-0.01em]">
            {title}
          </h1>
          <p className="text-[clamp(17px,1.5vw,21px)] leading-[1.45] text-neutral-700 max-w-[460px] mt-[clamp(20px,1.9vw,28px)] mb-[clamp(26px,2.8vw,40px)]">
            {body}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-artdus-lime text-artdus-black text-[13px] font-semibold tracking-[0.14em] uppercase px-[30px] py-[15px]"
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
        <div className="flex flex-col">
          <div className="relative flex-1 min-h-[380px] md:min-h-[560px] overflow-hidden">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={i === 0 ? (imageAlt ?? '') : ''}
                aria-hidden={i === 0 ? undefined : true}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === 0 || i === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          {imageCaption && (
            <p className="text-[12px] leading-[1.5] text-neutral-500 mt-2.5">{imageCaption}</p>
          )}
        </div>
      </div>
    </section>
  )
}
