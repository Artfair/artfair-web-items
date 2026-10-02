'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import SectionRenderer from './SectionRenderer'
import type { Section } from '../lib/sections'
import { GRIFFE, beispiel, type Beispielfall, type Griff } from '../lib/griffe'

// ─────────────────────────────────────────────────────────────────────────
// Schaukasten: jede Leiste mit Griff, dargestellt mit ihren Beispieldaten.
// Hier wird eine neue Leiste angesehen, bevor Walter sie freigibt
// (Leisten-Vertrag, CLAUDE.md). Läuft an zwei Stellen: in Webby (/schaukasten,
// mit den Hausschriften der Instanz) und als eigene Vorschau des Schranks
// (schaukasten/, je PR ein Vercel-Link, mit Ersatzschrift).
//
// „Gegenprobe" setzt ein fremdes Farbschema über die Marken-Variablen: Eine
// Leiste, die Farben fest eingebaut hat statt der Marken-Tokens, fällt dort auf.
// ─────────────────────────────────────────────────────────────────────────

const GEGENPROBE: CSSProperties = {
  ['--brand-ink' as string]: '#1f2a44',
  ['--brand-accent' as string]: '#ff8a65',
  ['--brand-paper' as string]: '#fbf6ee',
  ['--brand-surface' as string]: '#f1ebe0',
  ['--brand-line' as string]: '#ddd3c4',
  ['--brand-muted' as string]: '#7a7266',
  ['--brand-border' as string]: '#1f2a44',
}

// Leisten, die als Overlay über der ganzen Seite erscheinen und dabei das Scrollen
// sperren (Newsletter-Popup). Im Schaukasten nicht live — sie säßen unsichtbar in
// ihrer Vitrine, und die Sperre ließe sich nicht lösen.
const OVERLAYS = ['newsletterPopup']

const GRUPPEN = ['Kopf / Hero', 'Inhalt', 'Medien & Logos', 'Programm & Newsletter', 'Ganze Seiten', 'Formulare', 'Layout']

export default function Schaukasten({ zurueck, unterzeile }: { zurueck?: { href: string; label: string }; unterzeile?: string }) {
  const [lang, setLang] = useState<'de' | 'en'>('de')
  const [fall, setFall] = useState<Beispielfall>('voll')
  const [gegenprobe, setGegenprobe] = useState(false)
  const [gruppe, setGruppe] = useState('')
  const [suche, setSuche] = useState('')

  // Schutz: Setzt eine Leiste trotzdem eine Scroll-Sperre auf die Seite, sofort aufheben.
  useEffect(() => {
    const loesen = () => {
      if (document.body.style.overflow === 'hidden') document.body.style.overflow = ''
    }
    const beobachter = new MutationObserver(loesen)
    beobachter.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    return () => beobachter.disconnect()
  }, [])

  const q = suche.trim().toLowerCase()
  const liste = GRIFFE.filter(
    (g) => (!gruppe || g.gruppe === gruppe) && (!q || g.name.toLowerCase().includes(q) || g.typ.toLowerCase().includes(q)),
  )

  const knopf = (aktiv: boolean): CSSProperties => ({
    padding: '6px 12px', fontSize: 12.5, fontWeight: 600, borderRadius: 999, cursor: 'pointer',
    border: aktiv ? '1px solid #0a0a0a' : '1px solid #d9d5cc', background: aktiv ? '#0a0a0a' : '#fff', color: aktiv ? '#fff' : '#333',
  })

  return (
    <div className="min-h-screen bg-[#efeee9]">
      <header className="sticky top-0 z-20 border-b border-[#d9d5cc] bg-white/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3">
          {zurueck && (
            <a href={zurueck.href} className="text-[12px] uppercase tracking-[0.12em] text-neutral-500 hover:text-black">← {zurueck.label}</a>
          )}
          <h1 className="mr-auto text-[20px] font-semibold">
            Schaukasten · {GRIFFE.length} Leisten mit Griff
            {unterzeile && <span className="ml-2 text-[12.5px] font-normal text-neutral-500">{unterzeile}</span>}
          </h1>
          <div className="flex gap-1">
            {(['de', 'en'] as const).map((l) => <button key={l} style={knopf(lang === l)} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </div>
          <div className="flex gap-1">
            {(['voll', 'leer'] as const).map((f) => <button key={f} style={knopf(fall === f)} onClick={() => setFall(f)}>{f === 'voll' ? 'voll befüllt' : 'frisch eingelegt'}</button>)}
          </div>
          <div className="flex gap-1">
            <button style={knopf(!gegenprobe)} onClick={() => setGegenprobe(false)}>Markenbild</button>
            <button style={knopf(gegenprobe)} onClick={() => setGegenprobe(true)} title="Fremdes Farbschema: fest eingebaute Farben fallen auf">Gegenprobe</button>
          </div>
        </div>
        <div className="mx-auto mt-2 flex max-w-[1400px] flex-wrap items-center gap-2">
          <button style={knopf(gruppe === '')} onClick={() => setGruppe('')}>Alle</button>
          {GRUPPEN.filter((g) => GRIFFE.some((x) => x.gruppe === g)).map((g) => (
            <button key={g} style={knopf(gruppe === g)} onClick={() => setGruppe(g)}>{g}</button>
          ))}
          <input
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Leiste suchen …"
            aria-label="Leiste suchen"
            className="ml-auto min-w-0 flex-1 rounded-full border border-[#d9d5cc] px-3 py-1.5 text-[13px] sm:max-w-[260px]"
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-6 px-5 py-6">
        {liste.map((g) => (
          <Vitrine key={g.typ} griff={g} fall={fall} lang={lang} stil={gegenprobe ? GEGENPROBE : undefined} />
        ))}
        {liste.length === 0 && <p className="py-10 text-center text-neutral-500">Keine Leiste passt.</p>}
      </main>
    </div>
  )
}

function Vitrine({ griff, fall, lang, stil }: { griff: Griff; fall: Beispielfall; lang: 'de' | 'en'; stil?: CSSProperties }) {
  const buehne = useRef<HTMLDivElement>(null)
  const [leer, setLeer] = useState(false)
  // Zeigt die Website die Leiste mit diesen Daten gar nicht (z. B. zu wenige Einträge)?
  useEffect(() => {
    setLeer(!buehne.current || buehne.current.childElementCount === 0)
  }, [griff, fall, lang])

  return (
    <section className="overflow-hidden rounded-xl border border-[#d9d5cc] bg-white">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[#e6e3db] px-4 py-2.5">
        <span className="text-[15px] font-semibold">{griff.name}</span>
        <code className="text-[11.5px] text-neutral-500">{griff.typ}</code>
        <span className="rounded-full bg-[#f1f0ea] px-2 py-0.5 text-[11px] text-neutral-600">{griff.gruppe ?? 'ohne Gruppe'}</span>
        <span className="text-[12.5px] text-neutral-500">{griff.hinweis}</span>
      </div>
      {/* translateZ(0): fest positionierte Teile (z. B. das Newsletter-Popup) bleiben in ihrer Vitrine */}
      {OVERLAYS.includes(griff.typ) ? (
        <p className="px-4 py-6 text-[13px] text-neutral-500">
          Overlay: erscheint auf der Website über der ganzen Seite, sobald man ein Stück gescrollt hat, und sperrt
          solange das Scrollen. Darum hier nicht live — ansehen auf der Startseite in Webby.
        </p>
      ) : (
        <div ref={buehne} style={{ ...stil, transform: 'translateZ(0)' }} className="bg-brand-paper text-brand-ink">
          <SectionRenderer sections={[beispiel(griff, fall) as unknown as Section]} lang={lang} />
        </div>
      )}
      {leer && !OVERLAYS.includes(griff.typ) && (
        <p className="px-4 py-6 text-[13px] text-neutral-500">
          Die Website zeigt diese Leiste mit diesen Daten nicht — sie braucht mehr Inhalt, Live-Daten über einen Anschluss oder erscheint erst beim Scrollen.
        </p>
      )}
    </section>
  )
}
