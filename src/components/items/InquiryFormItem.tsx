'use client'

import {useId, useState} from 'react'

// Baukasten-Item „Anfrage-Formular" — schlankes Kontaktformular (Business
// meets Art, Sektion 7 der Content-Spez 8/2026): Unternehmen, Ansprechpartner,
// Zeitraum (Messetage), Gästezahl, optionaler Anlass. Versand: mit `action`
// wird per POST an die angegebene Route geschickt (Andock-Stelle fürs
// AD27-Backend, Entscheidung Annalena 12.8.); ohne `action` bestätigt das
// Formular rein clientseitig (wie NewsletterForm), es wird nichts verschickt.
// Alle Beschriftungen kommen als fertige Strings herein (Sprache löst der
// SectionRenderer bzw. die Seite auf).

const labelClass = 'block text-[13px] font-medium tracking-[0.1em] uppercase mb-2'
const fieldClass =
  'w-full text-[15px] text-artdus-black px-[16px] py-[13px] border border-artdus-black bg-white outline-none placeholder:text-neutral-500 focus:border-artdus-lime focus:ring-1 focus:ring-artdus-lime'

// Props auch als Typ exportiert — das BusinessPageItem bettet das Formular
// als Teilobjekt ein (inquiry-Prop) und reicht sie 1:1 durch.
export interface InquiryFormProps {
  id?: string // Sprungmarke (z. B. "anfrage") — Ziel der „Anfrage senden"-Knöpfe
  eyebrow?: string
  heading: string
  intro?: string
  companyLabel: string // Pflichtfeld: Unternehmen
  contactLabel: string // Pflichtfeld: Ansprechpartner + Position
  periodLabel: string // Pflichtfeld: gewünschter Zeitraum (Dropdown)
  periodOptions: string[] // Messetage AD27
  guestsLabel: string // Pflichtfeld: ungefähre Gästezahl (Dropdown-Ranges)
  guestOptions: string[]
  contextLabel: string // optionales Freitextfeld: Kontext/Anlass
  contextPlaceholder?: string
  optionalHint?: string // Zusatz hinter optionalen Labels, z. B. "optional"
  selectPlaceholder?: string // leere erste Dropdown-Zeile, z. B. "Bitte wählen"
  submitLabel: string
  confirmation: string // Bestätigungstext nach dem Absenden
  action?: string // POST-Ziel (API-Route des Konsumenten); ohne: nur clientseitige Bestätigung
  errorText?: string // Meldung, wenn der Versand über `action` fehlschlägt
}

export function InquiryFormItem({
  id,
  eyebrow,
  heading,
  intro,
  companyLabel,
  contactLabel,
  periodLabel,
  periodOptions,
  guestsLabel,
  guestOptions,
  contextLabel,
  contextPlaceholder,
  optionalHint,
  selectPlaceholder,
  submitLabel,
  confirmation,
  action,
  errorText,
}: InquiryFormProps) {
  const uid = useId()
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  async function submit(form: HTMLFormElement) {
    if (!action) {
      setDone(true)
      return
    }
    setSending(true)
    setFailed(false)
    try {
      const res = await fetch(action, {method: 'POST', body: new FormData(form)})
      if (!res.ok) throw new Error(String(res.status))
      setDone(true)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(64px,8vw,128px)] scroll-mt-14">
      <div className="max-w-[720px]">
        {eyebrow && (
          <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
            <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-light text-[clamp(30px,3.8vw,54px)] leading-[1.04] tracking-[-0.02em]">
          {heading}
        </h2>
        {intro && <p className="text-[17px] leading-[1.6] text-neutral-600 mt-5">{intro}</p>}

        {done ? (
          <p role="status" className="flex items-start gap-3 text-[17px] leading-[1.6] mt-10">
            <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime shrink-0 mt-[9px]" />
            {confirmation}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void submit(e.currentTarget)
            }}
            className="grid sm:grid-cols-2 gap-x-6 gap-y-7 mt-10"
          >
            <div>
              <label htmlFor={`${uid}-company`} className={labelClass}>
                {companyLabel} *
              </label>
              <input
                id={`${uid}-company`}
                name="company"
                type="text"
                required
                autoComplete="organization"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-contact`} className={labelClass}>
                {contactLabel} *
              </label>
              <input
                id={`${uid}-contact`}
                name="contact"
                type="text"
                required
                autoComplete="name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-period`} className={labelClass}>
                {periodLabel} *
              </label>
              <select id={`${uid}-period`} name="period" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  {selectPlaceholder ?? '–'}
                </option>
                {periodOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-guests`} className={labelClass}>
                {guestsLabel} *
              </label>
              <select id={`${uid}-guests`} name="guests" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  {selectPlaceholder ?? '–'}
                </option>
                {guestOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-context`} className={labelClass}>
                {contextLabel}
                {optionalHint && (
                  <span className="normal-case tracking-normal font-normal text-neutral-500">
                    {' '}
                    ({optionalHint})
                  </span>
                )}
              </label>
              <textarea
                id={`${uid}-context`}
                name="context"
                rows={4}
                placeholder={contextPlaceholder}
                className={`${fieldClass} resize-y`}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-artdus-lime text-artdus-black text-[13px] font-semibold tracking-[0.14em] uppercase px-[30px] py-[15px] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {submitLabel} →
              </button>
              {failed && (
                <p role="alert" className="text-[14px] leading-[1.5] text-artdus-red mt-3">
                  {errorText ?? ''}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
