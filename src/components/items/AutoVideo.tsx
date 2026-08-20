'use client'

import {useEffect, useRef} from 'react'

// Stummes Schleifen-Video für Bausteine (CTA-Band, Hero Split): Browser
// pausieren Autoplay-Videos beim Tab-/Seitenwechsel und starten sie beim
// Zurückkommen nicht zuverlässig neu — besonders Safari, wenn die Seite aus
// dem Back-Forward-Cache kommt, und Safari stoppt auch Videos, die aus dem
// Sichtbereich scrollen (Leonie, 20.8.2026: „hält an", „nicht im Loop").
// Deshalb: play() nachschieben bei pageshow/visibilitychange/focus, beim
// Zurückscrollen in den Sichtbereich (IntersectionObserver) und falls trotz
// loop ein ended durchkommt.
export function AutoVideo({
  src,
  poster,
  className,
}: {
  src: string
  poster?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const resume = () => {
      const v = ref.current
      if (v && v.paused && document.visibilityState === 'visible') {
        v.play().catch(() => {}) // z. B. iOS-Stromsparmodus: Poster bleibt stehen
      }
    }
    const onEnded = () => {
      const v = ref.current
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('pageshow', resume)
    window.addEventListener('focus', resume)
    const v = ref.current
    v?.addEventListener('ended', onEnded)
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) resume()
          })
        : null
    if (v && io) io.observe(v)
    resume()
    return () => {
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('pageshow', resume)
      window.removeEventListener('focus', resume)
      v?.removeEventListener('ended', onEnded)
      io?.disconnect()
    }
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}
