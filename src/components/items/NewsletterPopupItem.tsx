'use client'

import {useEffect, useRef, useState} from 'react'

// Baukasten-Item „Newsletter-Popup" (INSIDE ART DÜSSELDORF) — scrollausgelöstes
// Anmelde-Overlay nach Agentur-Handoff 18.9.2026 (Optik/Copy abgenommen: Lime-
// Fläche, harte Kanten, Pill nur am Knopf, „Get inside." bleibt unübersetzt).
// Abweichungen vom Handoff, bewusst (Entscheidung 18.9.):
//  · Versand über das bestehende POST /api/newsletter (Brevo-Double-Opt-in,
//    gleicher Kontrakt wie NewsletterForm: FormData email+language+consent) —
//    NICHT über die im Handoff mitgelieferte Direkt-Route ohne Opt-in.
//  · Trigger erst, wenn BEIDES erreicht ist (250px UND 15 % der Seite) —
//    das Handoff-ODER hätte das Popup praktisch sofort gezeigt.
//  · Nach erfolgreicher Anmeldung dauerhaft still (localStorage), nach dem
//    Wegklicken nur für die laufende Sitzung (sessionStorage).
//  · Bild stapelt mobil oben (feste 240px-Spalte hätte das Handy zerlegt).

const SCROLL_MIN_PX = 250 // Mindest-Scrolltiefe …
const SCROLL_RATIO = 0.15 // … UND Mindest-Anteil der scrollbaren Strecke
const SESSION_KEY = 'ad27_newsletter_popup_dismissed' // weggeklickt → diese Sitzung still
const DONE_KEY = 'ad27_newsletter_popup_done' // angemeldet → dauerhaft still

// sessionStorage/localStorage können werfen (Private Mode, blockierte Cookies) —
// dann verhält sich das Popup wie bei einem Erstbesuch.
function flagged(storage: 'session' | 'local', key: string): boolean {
  try {
    const s = storage === 'session' ? window.sessionStorage : window.localStorage
    return s.getItem(key) === '1'
  } catch {
    return false
  }
}
function flag(storage: 'session' | 'local', key: string) {
  try {
    const s = storage === 'session' ? window.sessionStorage : window.localStorage
    s.setItem(key, '1')
  } catch {
    /* still bleiben */
  }
}

// Feste Texte (Copy abgenommen, Handoff 18.9.2026); eyebrow/headline/body sind
// per Props (Webby) überschreibbar, die Formular-Mikrotexte bleiben fix.
const COPY = {
  de: {
    eyebrow: 'Inside Art Düsseldorf',
    headline: 'Get inside.',
    body:
      'Ein genauerer Blick auf die Kunstwelt, kuratiert von Art Düsseldorf. Monatliche Highlights, Sammlerperspektiven und was sich in der Rheinland-Kunstszene wirklich lohnt.',
    placeholder: 'Deine E-Mail-Adresse',
    button: 'Get Inside',
    consentPre: 'Ich stimme der',
    consentLink: 'Datenschutzerklärung',
    consentPost: 'zu und möchte den Newsletter erhalten. Jederzeit kündbar.',
    success: 'Fast geschafft — bitte bestätige deine Anmeldung per E-Mail.',
    error: 'Da ist etwas schiefgelaufen — bitte versuch es erneut.',
    close: 'Schließen',
    dialogLabel: 'Newsletter-Anmeldung',
  },
  en: {
    eyebrow: 'Inside Art Düsseldorf',
    headline: 'Get inside.',
    body:
      "A closer look at the art world, curated by Art Düsseldorf. Monthly highlights, collector perspectives, and what's actually worth seeing in the Rhineland art scene.",
    placeholder: 'Your email address',
    button: 'Get Inside',
    consentPre: 'I agree to the',
    consentLink: 'privacy policy',
    consentPost: 'and to receive the newsletter. Unsubscribe anytime.',
    success: "You're in — please confirm your signup via the link in your inbox.",
    error: 'Something went wrong — please try again.',
    close: 'Close',
    dialogLabel: 'Newsletter signup',
  },
} as const

export interface NewsletterPopupProps {
  lang: 'de' | 'en'
  eyebrow?: string
  headline?: string
  body?: string
  imageSrc?: string // 3:4-Messefoto; ohne Bild volle Textbreite
  imageAlt?: string
  action?: string // Anmelde-Endpoint; Default: bestehende DOI-Route
  privacyHref?: string // Default: /<lang>/datenschutz (beide Sprachen deutscher Slug)
}

export function NewsletterPopupItem({
  lang,
  eyebrow,
  headline,
  body,
  imageSrc,
  imageAlt,
  action = '/api/newsletter',
  privacyHref,
}: NewsletterPopupProps) {
  const t = COPY[lang] ?? COPY.en
  const privacy = privacyHref ?? `/${lang}/datenschutz`

  const [open, setOpen] = useState(false) // im DOM
  const [shown, setShown] = useState(false) // Einblend-Zustand (Transition)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<null | 'loading' | 'success' | 'error'>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Scroll-Trigger: einmalig, sobald beide Schwellen überschritten sind.
  useEffect(() => {
    if (flagged('session', SESSION_KEY) || flagged('local', DONE_KEY)) return
    function maybeShow() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const deepEnough =
        window.scrollY > SCROLL_MIN_PX &&
        (scrollable <= 0 || window.scrollY / scrollable > SCROLL_RATIO)
      if (deepEnough) {
        // Einmal pro Seitenaufruf: Listener sofort abmelden, sonst ginge das
        // Popup nach dem Wegklicken beim nächsten Scroll wieder auf.
        window.removeEventListener('scroll', maybeShow)
        setOpen(true)
      }
    }
    window.addEventListener('scroll', maybeShow, {passive: true})
    return () => window.removeEventListener('scroll', maybeShow)
  }, [])

  // Einblenden kurz nach dem Mount (damit die Transition greift) — setTimeout
  // statt requestAnimationFrame, weil rAF in Hintergrund-Tabs nie feuert und
  // das Popup dann unsichtbar hängen bliebe. Escape schließt, Seite dahinter
  // bleibt stehen.
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => setShown(true), 20)
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Fokus in den Dialog, sobald er sichtbar ist (Tastatur/Screenreader).
  useEffect(() => {
    if (shown) dialogRef.current?.focus()
  }, [shown])

  function close() {
    flag('session', SESSION_KEY)
    setOpen(false)
    setShown(false)
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('loading')
    try {
      const res = await fetch(action, {method: 'POST', body: new FormData(form)})
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      flag('local', DONE_KEY) // Angemeldete nie wieder behelligen
    } catch {
      setStatus('error')
    }
  }

  if (!open) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-6 transition-opacity duration-300 ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.dialogLabel}
        tabIndex={-1}
        className={`relative flex max-h-[calc(100vh-48px)] w-full max-w-[680px] flex-col overflow-y-auto bg-artdus-lime text-artdus-black shadow-[0_24px_60px_rgba(0,0,0,0.28)] outline-none transition-[transform,opacity] duration-300 md:flex-row ${
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.94] opacity-0'
        }`}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt ?? ''}
            className="h-44 w-full shrink-0 bg-artdus-black object-cover md:h-auto md:w-[240px]"
          />
        )}

        <button
          type="button"
          onClick={close}
          aria-label={t.close}
          className="absolute right-3 top-2.5 cursor-pointer p-1.5 text-[20px] leading-none text-artdus-black opacity-60 hover:opacity-100"
        >
          ✕
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-4 px-7 pb-7 pt-8">
          {/* Gewichtung getauscht (Annalena 18.9.): „INSIDE ART DÜSSELDORF"
              ist die große Zeile, „Get inside." die kleine darüber. */}
          <div>
            <p className="mb-1 text-[14px] font-bold tracking-[-0.01em]">
              {headline || t.headline}
            </p>
            <p className="mb-2 text-[24px] font-bold uppercase leading-[1.1] tracking-[0.08em]">
              {eyebrow || t.eyebrow}
            </p>
            <p className="text-[14px] leading-[1.45]">{body || t.body}</p>
          </div>

          {status === 'success' ? (
            <p className="text-[14px] leading-[1.45]" role="status">
              {t.success}
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <label htmlFor="newsletter-popup-email" className="sr-only">
                {t.placeholder}
              </label>
              <input
                id="newsletter-popup-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={t.placeholder}
                className="border-0 border-b-[1.5px] border-artdus-black bg-transparent px-0.5 py-2 text-[15px] text-artdus-black outline-none placeholder:text-artdus-black/60"
              />
              <input type="hidden" name="language" value={lang} />

              <label className="flex cursor-pointer select-none items-start gap-2 text-left">
                <span className="relative mt-[1px] inline-flex shrink-0">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none border-2 border-artdus-black bg-transparent checked:bg-artdus-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-artdus-black"
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 10"
                    fill="none"
                    className="pointer-events-none absolute inset-0 m-auto h-2 w-2.5 text-artdus-lime opacity-0 peer-checked:opacity-100"
                  >
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </span>
                <span className="text-[12px] leading-[1.4]">
                  {t.consentPre}{' '}
                  <a href={privacy} target="_blank" rel="noreferrer" className="underline">
                    {t.consentLink}
                  </a>{' '}
                  {t.consentPost}
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'loading' || !consent}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-artdus-black bg-artdus-black px-5 py-2.5 text-[15px] font-medium uppercase tracking-[0.02em] text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.button}
              </button>

              <p className="min-h-[14px] text-[12px]" role="alert">
                {status === 'error' && t.error}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
