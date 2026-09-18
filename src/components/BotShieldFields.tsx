'use client'

import {useEffect, useState} from 'react'

// Unsichtbare Bot-Abwehr für die Newsletter-Formulare (Stufe 1, 18.9.2026 —
// Reaktion auf die Bot-Flut in Brevo). Zwei Bausteine, beide ohne UX-Kosten:
//
// 1. Honeypot „website" — für Menschen unsichtbar (off-screen, nicht
//    display:none, das überspringen manche Bots), Formular-Bots füllen es aus.
//    Der Server tut bei gefülltem Feld so, als hätte die Anmeldung geklappt,
//    ruft Brevo aber nicht auf.
// 2. Signiertes Zeit-Token „t" — beim Mount per GET von der Anmelde-Route
//    geholt; der Server lehnt POSTs ohne gültiges, mindestens ~2 s altes Token
//    ab. Stoppt Bots, die direkt auf /api/newsletter posten, ohne die Seite
//    je geladen zu haben.
//
// Serverseitige Prüfung: AD27 app/api/newsletter/route.ts (Branch
// feat/newsletter-bot-schutz). Eine ältere Route ohne Prüfung ignoriert die
// zusätzlichen FormData-Felder einfach — das Bauteil ist abwärtskompatibel.
export function BotShieldFields({action}: {action?: string}) {
  const [token, setToken] = useState('')

  useEffect(() => {
    if (!action) return // rein clientseitige Formulare brauchen kein Token
    let cancelled = false
    fetch(action, {method: 'GET'})
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.t === 'string') setToken(d.t)
      })
      .catch(() => {
        /* Route ohne GET (altes AD27) → Feld bleibt leer */
      })
    return () => {
      cancelled = true
    }
  }, [action])

  return (
    <>
      <input type="hidden" name="t" value={token} />
      <div aria-hidden="true" className="fixed -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  )
}
