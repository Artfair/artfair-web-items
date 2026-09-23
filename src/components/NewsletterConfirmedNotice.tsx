'use client'

import {useEffect, useState} from 'react'

// „Danke"-Hinweis nach bestätigtem Double-Opt-in (Annalena 23.9.2026):
// Der Bestätigungslink der Brevo-DOI-Mail leitet auf die Startseite mit
// ?newsletter=bestaetigt — dieses Bauteil zeigt dann eine schließbare
// Lime-Meldung („Vielen Dank für Ihre Newsletter-Anmeldung …"), räumt den
// Parameter aus der Adresszeile und stellt zugleich das Newsletter-Popup
// für diesen Browser dauerhaft still (wer bestätigt hat, ist angemeldet).
// Ohne den Parameter rendert es nichts — gefahrlos fest mountbar.

const PARAM = 'newsletter'
const VALUE = 'bestaetigt'
const POPUP_DONE_KEY = 'ad27_newsletter_popup_done' // gleicher Schlüssel wie NewsletterPopupItem

const COPY = {
  de: {
    text: 'Vielen Dank für Ihre Newsletter-Anmeldung. Wir halten Sie auf dem Laufenden.',
    close: 'Schließen',
  },
  en: {
    text: "Thank you for signing up for our newsletter. We'll keep you posted.",
    close: 'Close',
  },
} as const

export function NewsletterConfirmedNotice({lang}: {lang: 'de' | 'en'}) {
  const t = COPY[lang] ?? COPY.en
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (new URL(window.location.href).searchParams.get(PARAM) !== VALUE) return
    setShow(true)
    try {
      window.localStorage.setItem(POPUP_DONE_KEY, '1')
    } catch {
      /* Private Mode o. Ä. — dann bleibt nur das Popup-Verhalten wie gehabt */
    }
    // Der Parameter bleibt bis zum Schließen in der URL — würde er sofort
    // entfernt, verlöre die Meldung bei einem Remount (Dev-Hydration,
    // Router-Eigenheiten) ihren Anlass und verschwände wieder.
  }, [])

  function close() {
    setShow(false)
    const url = new URL(window.location.href)
    url.searchParams.delete(PARAM)
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }

  if (!show) return null

  return (
    <div
      role="status"
      className="fixed left-1/2 top-[72px] z-[1100] flex w-[calc(100%-32px)] max-w-[560px] -translate-x-1/2 items-start gap-3 bg-artdus-lime px-5 py-4 text-artdus-black shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
    >
      <p className="min-w-0 flex-1 text-[15px] leading-[1.5]">{t.text}</p>
      <button
        type="button"
        onClick={close}
        aria-label={t.close}
        className="shrink-0 cursor-pointer p-1 text-[18px] leading-none opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
