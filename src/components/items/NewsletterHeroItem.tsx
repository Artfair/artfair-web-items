'use client'

import {useState} from 'react'

// Baukasten-Item „Newsletter-Hero" (Header-Typ 6 · Editorial) — Split:
// links Kicker, Headline, Text und E-Mail-Eingabe mit 2px-Rahmen und
// schwarzem Abonnieren-Knopf; rechts zwei gestapelte Fotos. Anmeldung
// wie NewsletterForm vorerst clientseitig bestätigt.
// Design-Handoff „Seiten-Header-System", Typ 6 (Newsletter) — Headline
// abweichend vom Handoff in der Weissenhof (Entscheidung Annalena
// 28.7.2026: Serif bleibt exklusiv dem Magazin vorbehalten).

export function NewsletterHeroItem({
  id,
  eyebrow,
  title,
  body,
  emailPlaceholder,
  submitLabel,
  thanksText,
  images,
}: {
  id?: string
  eyebrow?: string // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  title: string
  body: string
  emailPlaceholder: string
  submitLabel: string
  thanksText: string
  images: {src: string; alt: string}[] // zwei gestapelte Fotos rechts
}) {
  const [done, setDone] = useState(false)

  return (
    <section id={id} className="grid md:grid-cols-[1.1fr_1fr] items-stretch">
      <div className="flex flex-col justify-center px-[var(--page-x)] py-[clamp(48px,6.1vw,88px)] md:pr-[clamp(28px,3.3vw,48px)]">
        {eyebrow && (
          <span className="flex items-center gap-2.5 text-[13px] font-medium tracking-[0.2em] uppercase mb-[clamp(14px,1.5vw,22px)]">
            <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-normal text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-[clamp(16px,1.7vw,24px)]">
          {title}
        </h1>
        <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.5] text-neutral-700 max-w-[480px] mb-[clamp(24px,2.5vw,36px)]">
          {body}
        </p>
        {done ? (
          <p className="text-[15px] text-neutral-600">{thanksText}</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
            className="flex max-w-[520px] border-2 border-artdus-black"
          >
            <label htmlFor="newsletter-hero-email" className="sr-only">
              {emailPlaceholder}
            </label>
            <input
              id="newsletter-hero-email"
              type="email"
              required
              autoComplete="email"
              placeholder={emailPlaceholder}
              className="flex-1 min-w-0 border-0 outline-none text-[16px] px-5 py-4 bg-white placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="bg-artdus-black text-white text-[13px] font-medium tracking-[0.14em] uppercase px-[26px] whitespace-nowrap"
            >
              {submitLabel} →
            </button>
          </form>
        )}
      </div>
      <div className="grid grid-rows-2 gap-[2px] bg-neutral-100 min-h-[400px] md:min-h-0">
        {images.slice(0, 2).map((img) => (
          <div key={img.src} className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
