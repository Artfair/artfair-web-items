'use client'

// Baukasten-Item „Messeplan" — eigener, prominenter Block: Sektionskopf,
// der Plan in voller Breite (SVG/Bild), darunter Erläuterung und
// optionaler Link (z. B. PDF-Download), sobald im CMS hinterlegt.
//
// Vollbild-Ansicht (Annalena 26.8.2026, Mobil-Feedback „zu klein, nicht
// antippbar"): Antippen/Klicken öffnet den Plan als Overlay, in dem mit zwei
// Fingern gezoomt und mit einem Finger verschoben wird — der Plan selbst,
// nicht die Seite (Seiten-Pinch ist nicht intuitiv und in In-App-Browsern
// oft deaktiviert). Zusätzlich +/−-Knöpfe und Schließen per × oder Escape.

import { useEffect, useRef, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 5

const T = {
  de: { open: 'Plan vergrößern', close: 'Schließen', zoomIn: 'Vergrößern', zoomOut: 'Verkleinern', hint: 'Zum Vergrößern antippen' },
  en: { open: 'Enlarge plan', close: 'Close', zoomIn: 'Zoom in', zoomOut: 'Zoom out', hint: 'Tap to enlarge' },
}

export function FairPlanItem({
  id,
  eyebrow,
  heading,
  body,
  planSrc,
  planAlt,
  link,
  lang = 'de',
}: {
  id?: string // Sprungmarke für Menü-Links (z. B. "messeplan")
  eyebrow?: string // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  heading: string
  body: string
  planSrc: string
  planAlt: string
  link?: { label: string; href: string }
  lang?: 'de' | 'en' // nur für die Beschriftungen der Vollbild-Ansicht
}) {
  const t = T[lang]
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Pinch-Zustand: Fingerabstand + Zoom beim Start der Geste.
  const pinch = useRef<{ dist: number; zoom: number } | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // Pinch-Geste nativ anbinden — touchmove muss non-passive sein, damit
  // preventDefault den Browser-Seitenzoom unterbindet.
  useEffect(() => {
    const el = scrollRef.current
    if (!open || !el) return
    const dist = (e: TouchEvent) =>
      Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinch.current = { dist: dist(e), zoom }
    }
    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinch.current) {
        e.preventDefault()
        const next = (pinch.current.zoom * dist(e)) / pinch.current.dist
        setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)))
      }
    }
    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch.current = null
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [open, zoom])

  const openOverlay = () => {
    setZoom(1)
    setOpen(true)
  }

  const zoomBtn =
    'w-[44px] h-[44px] border border-artdus-black bg-white text-[20px] leading-none transition-colors hover:bg-artdus-black hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-artdus-black'

  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      {eyebrow && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      <button
        type="button"
        onClick={openOverlay}
        aria-label={t.open}
        className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#E7FA31]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={planSrc} alt={planAlt} loading="lazy" className="w-full h-auto" />
        <span className="mt-2 flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-neutral-500 md:hidden">
          <span aria-hidden="true" className="inline-flex w-[18px] h-[18px] items-center justify-center border border-neutral-400 text-[13px] leading-none">+</span>
          {t.hint}
        </span>
      </button>
      <div className="mt-[clamp(20px,2.5vw,32px)] flex flex-wrap items-baseline justify-between gap-x-12 gap-y-5">
        <p className="text-[15px] leading-[1.62] text-neutral-600 max-w-[62ch]">{body}</p>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] whitespace-nowrap"
          >
            {link.label} →
          </a>
        )}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={heading} className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between gap-4 px-[var(--page-x)] py-3 border-b border-neutral-200 shrink-0">
            <span className="min-w-0 truncate text-[13px] font-semibold tracking-[0.14em] uppercase">{heading}</span>
            <div className="flex items-center gap-[6px]">
              <button type="button" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))} disabled={zoom <= MIN_ZOOM} aria-label={t.zoomOut} className={zoomBtn}>
                −
              </button>
              <button type="button" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))} disabled={zoom >= MAX_ZOOM} aria-label={t.zoomIn} className={zoomBtn}>
                +
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className={`${zoomBtn} ml-2`}>
                ×
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-auto overscroll-contain [touch-action:pan-x_pan-y]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={planSrc}
              alt={planAlt}
              draggable={false}
              className="h-auto max-w-none select-none"
              style={{ width: `${zoom * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
