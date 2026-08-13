'use client'

import {useId, useState} from 'react'

// „Newsletter-Anmeldung" — die GANZE Landingpage als EIN Baukasten-Item (wie
// AboutPageItem). Design-Handoff „Newsletter Landingpage" (11.8.2026), in die
// Haus-Entscheidungen übersetzt (Annalena 11.8.2026):
//   – Headlines in Weissenhof (Serif bleibt exklusiv dem Magazin, 28.7.2026)
//   – Submit-Knopf schwarz wie NewsletterForm/NewsletterHeroItem (kein Acid)
//   – Ink/Paper-Tokens statt der Handoff-Farbwelt (#000/#FFF)
//   – keine eigene Top Bar — die Seite läuft im normalen Site-Chrome
//   – Geräterahmen (Browser/iPhone) stilisiert-reduziert statt fotorealistisch
//   – DSGVO-/Double-Opt-in-Hinweis unterm Formular (fehlte im Handoff)
// Mobile (im Handoff offen): Grids brechen um, Vorschau zeigt nur das Phone.
// Versand wie InquiryFormItem: mit `action` POST (email + language), ohne
// `action` rein clientseitige Bestätigung.

type Img = {src: string; alt: string}

export interface NewsletterBenefitData {
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  eyebrow?: string
  title: string
  body: string
}

// Eine Zeile im angedeuteten Posteingang (Browser-Mockup).
export interface MockInboxRow {
  subject: string
  teaser: string
  date: string
}

// Vollständig aufgelöste Mockup-Inhalte — jede Zeile/jeder Text ist über das
// CMS übersteuerbar (Annalena 11.8.2026: „Mockup in allen Details anpassbar");
// die Defaults setzt das Item selbst passend zur Sprache.
interface MockConfig {
  sender: string // Absendername (Posteingang, Mail-Kopf, Masthead-Wortmarke)
  from: string // Absenderadresse im Mail-Kopf
  inboxLabel: string
  subject: string // Betreff der geöffneten (aktiven) Mail
  activeTeaser: string
  activeDate: string
  rows: MockInboxRow[] // weitere Posteingang-Zeilen unter der aktiven
  mastheadKicker: string
  kicker: string
  title: string
  text: string
  linkLabel: string
  image?: Img
}

// Beispiel-Newsletter im Haus-Look — im Code gebaut statt Screenshot
// (Annalena 11.8.2026: Posteingang soll erkennbar sein, Newsletter in unserem
// Look, kein Blur). Alle Texte kommen aus der MockConfig, das Foto als
// Bild-Slot (mailImage) über Webby; ohne Bild bleibt eine ruhige Grau-Fläche.
function MockNewsletter({mock, compact}: {mock: MockConfig; compact?: boolean}) {
  return (
    <div className="bg-white">
      <div className={`bg-artdus-black text-white text-center ${compact ? 'py-3' : 'py-4'}`}>
        <span
          className={`block font-medium uppercase tracking-[0.3em] ${compact ? 'text-[12px]' : 'text-[15px]'}`}
        >
          {mock.sender}
        </span>
        <span className="mt-1 flex items-center justify-center gap-1.5 text-[9px] tracking-[0.22em] uppercase text-neutral-400">
          <span aria-hidden="true" className="w-[5px] h-[5px] bg-artdus-lime" />
          {mock.mastheadKicker}
        </span>
      </div>
      {mock.image?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mock.image.src} alt={mock.image.alt} loading="lazy" className="w-full aspect-[16/10] object-cover" />
      ) : (
        <div aria-hidden="true" className="w-full aspect-[16/10] bg-neutral-100" />
      )}
      <div className={compact ? 'px-4 py-4' : 'px-6 py-5'}>
        <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-500">
          <span aria-hidden="true" className="w-[5px] h-[5px] bg-artdus-lime shrink-0" />
          {mock.kicker}
        </span>
        <p className={`font-normal leading-[1.2] mt-2 ${compact ? 'text-[16px]' : 'text-[19px]'}`}>
          {mock.title}
        </p>
        <p className="text-[13px] leading-[1.55] text-neutral-600 mt-2">{mock.text}</p>
        <span className="inline-block mt-3 text-[11px] font-semibold tracking-[0.08em] uppercase border-b-2 border-artdus-lime pb-[2px]">
          {mock.linkLabel}
        </span>
      </div>
    </div>
  )
}

// Stilisierter Browser-Rahmen im „Apple-Look" (gerundet, helle Chrome-Linien,
// weicher Schatten): links ein angedeuteter Posteingang — bewusst nur eigene
// Ausgaben als Absender, keine anonymisierten Fremd-Mails —, rechts der
// geöffnete Beispiel-Newsletter.
function BrowserFrame({mock, url}: {mock: MockConfig; url: string}) {
  const rows = [
    {subject: mock.subject, teaser: mock.activeTeaser, date: mock.activeDate, active: true},
    ...mock.rows.map((r) => ({...r, active: false})),
  ]
  return (
    <div className="bg-white border border-neutral-300 rounded-[10px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-neutral-200">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
        </span>
        <span className="flex-1 text-center">
          <span className="inline-block bg-artdus-light rounded-full px-4 py-1 text-[12px] tracking-[0.04em] text-neutral-600">
            {url}
          </span>
        </span>
        <span aria-hidden="true" className="w-[46px]" />
      </div>
      <div className="flex aspect-[1040/600] overflow-hidden">
        <div className="w-[30%] shrink-0 border-r border-neutral-200 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-200 text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-500">
            {mock.inboxLabel}
          </div>
          {rows.map((r) => (
            <div
              key={r.subject}
              className={`px-5 py-3 border-b border-neutral-100 ${
                r.active ? 'bg-artdus-light border-l-2 border-l-artdus-black' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0 text-[13px] font-semibold">
                  {r.active && <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-artdus-lime shrink-0" />}
                  <span className="truncate">{mock.sender}</span>
                </span>
                <span className="text-[11px] text-neutral-400 shrink-0">{r.date}</span>
              </div>
              <div className="text-[12px] truncate mt-0.5">{r.subject}</div>
              <div className="text-[12px] text-neutral-400 truncate mt-0.5">{r.teaser}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="px-6 py-3.5 border-b border-neutral-200">
            <div className="text-[15px] font-medium truncate">{mock.subject}</div>
            <div className="text-[12px] text-neutral-500 truncate mt-0.5">{`${mock.sender} <${mock.from}>`}</div>
          </div>
          <div className="flex-1 overflow-hidden bg-artdus-light">
            <div className="max-w-[440px] mx-auto mt-6 border border-neutral-200">
              <MockNewsletter mock={mock} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stilisierter Phone-Rahmen, gerundet wie ein iPhone: Mail-Kopf mit
// AD-Monogramm, darunter derselbe Beispiel-Newsletter kompakt. Der Schatten
// sitzt nur mobil am Rahmen — auf Desktop liefert ihn der überlappende
// Wrapper (drop-shadow).
function PhoneFrame({mock, label}: {mock: MockConfig; label: string}) {
  const monogram = mock.sender
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="w-[min(280px,78vw)] md:w-[300px] bg-white border border-neutral-300 rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)] md:shadow-none">
      <div className="text-center py-2.5 border-b border-neutral-200 text-[12px] font-medium tracking-[0.14em] uppercase">
        {label}
      </div>
      <div className="aspect-[340/620] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <span className="w-9 h-9 shrink-0 bg-artdus-black text-white flex items-center justify-center text-[12px] font-semibold tracking-[0.08em]">
            {monogram}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold truncate">{mock.sender}</span>
            <span className="block text-[12px] text-neutral-500 truncate">{mock.subject}</span>
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <MockNewsletter mock={mock} compact />
        </div>
      </div>
      <div aria-hidden="true" className="py-2.5 flex justify-center">
        <span className="w-24 h-[4px] rounded-full bg-neutral-300" />
      </div>
    </div>
  )
}

export function NewsletterPageItem({
  id,
  heroTitle,
  heroBody,
  emailPlaceholder,
  submitLabel,
  showLanguageToggle = true,
  defaultLanguage,
  consentText,
  privacyLabel,
  privacyHref,
  confirmation,
  errorText,
  action,
  benefitsHeading,
  benefits,
  mosaic,
  previewHeading,
  previewUrl,
  phoneLabel,
  mailImage,
  mailSubject,
  mailFrom,
  mockSender,
  mockInboxLabel,
  mockTeaser,
  mockDate,
  mockInbox,
  mockMastheadKicker,
  mockKicker,
  mockTitle,
  mockText,
  mockLinkLabel,
  quoteText,
  quoteAttribution,
}: {
  id?: string
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  heroEyebrow?: string
  heroTitle: string
  heroBody: string
  emailPlaceholder: string
  submitLabel: string
  showLanguageToggle?: boolean // DE/EN-Pills (Newsletter-Sprache ≠ Seitensprache)
  defaultLanguage: 'de' | 'en' // vorausgewählte Newsletter-Sprache = Seitensprache
  consentText: string // DSGVO-Hinweis; der Datenschutz-Link wird angehängt
  privacyLabel: string
  privacyHref: string
  confirmation: string
  errorText: string
  action?: string // POST-Ziel (email + language); ohne: clientseitige Bestätigung
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  benefitsEyebrow?: string
  benefitsHeading: string
  benefits: NewsletterBenefitData[]
  mosaic: Img[] // bis zu 4 Fotos: 1. groß (2×2), 2./3. quadratisch, 4. breit
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  previewEyebrow?: string
  previewHeading: string
  previewUrl: string
  phoneLabel: string
  mailImage?: Img // Foto im Beispiel-Newsletter (Webby-Slot); ohne: Grau-Fläche
  mailSubject: string // Betreffzeile des Beispiel-Newsletters
  // Mockup-Feinheiten — alle optional, Defaults setzt das Item je Sprache:
  mailFrom?: string // Absenderadresse im Mail-Kopf
  mockSender?: string // Absendername (Posteingang, Mail-Kopf, Masthead)
  mockInboxLabel?: string // Überschrift der Posteingang-Spalte
  mockTeaser?: string // Vorschautext der aktiven (geöffneten) Mail
  mockDate?: string // Datums-Label der aktiven Mail, z. B. „Heute"
  mockInbox?: MockInboxRow[] // weitere Posteingang-Zeilen
  mockMastheadKicker?: string // Zeile unter der Wortmarke im Masthead
  mockKicker?: string // Eyebrow im Beispiel-Newsletter
  mockTitle?: string // Headline im Beispiel-Newsletter
  mockText?: string // Fließtext im Beispiel-Newsletter
  mockLinkLabel?: string // Link-Beschriftung, z. B. „Weiterlesen"
  quoteText: string
  quoteAttribution: string
}) {
  const uid = useId()
  const [language, setLanguage] = useState<'de' | 'en'>(defaultLanguage)
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

  const pillClass = (active: boolean) =>
    `rounded-full border border-artdus-black px-4 py-[9px] text-[13px] font-medium tracking-[0.06em] uppercase cursor-pointer transition-colors ${
      active ? 'bg-artdus-black text-white' : 'bg-white text-artdus-black hover:bg-artdus-black hover:text-white'
    }`

  // Mockup-Inhalte auflösen: CMS-Werte gewinnen, sonst Sprach-Defaults.
  const de = defaultLanguage === 'de'
  const mock: MockConfig = {
    sender: mockSender || 'Art Düsseldorf',
    from: mailFrom || 'newsletter@art-dus.de',
    inboxLabel: mockInboxLabel || (de ? 'Posteingang' : 'Inbox'),
    subject: mailSubject,
    activeTeaser:
      mockTeaser ||
      (de
        ? 'Sammlerinterview, Magazin und alle Termine der AD27 …'
        : 'Collector interview, magazine and all AD27 dates …'),
    activeDate: mockDate || (de ? 'Heute' : 'Today'),
    rows:
      mockInbox && mockInbox.length > 0
        ? mockInbox
        : de
          ? [
              {subject: 'Collector Insights #5', teaser: 'Rundgang: das Areal Böhler vor dem Aufbau …', date: '28. Juli'},
              {subject: 'Collector Insights #4', teaser: 'Galerien im Fokus: drei Neuzugänge im Porträt …', date: '14. Juli'},
              {subject: 'Save the Date — AD27', teaser: 'Die Messetage stehen fest — jetzt vormerken …', date: '30. Juni'},
            ]
          : [
              {subject: 'Collector Insights #5', teaser: 'A walk through Areal Böhler before build-up …', date: '28 July'},
              {subject: 'Collector Insights #4', teaser: 'Galleries in focus: three newcomers in portrait …', date: '14 July'},
              {subject: 'Save the Date — AD27', teaser: 'The fair dates are set — save them now …', date: '30 June'},
            ],
    mastheadKicker: mockMastheadKicker || 'Newsletter · AD27',
    kicker: mockKicker || (de ? 'Sammlerinterview' : 'Collector interview'),
    title: mockTitle || (de ? 'Zu Besuch in einer Düsseldorfer Sammlung' : 'Inside a Düsseldorf collection'),
    text:
      mockText ||
      (de
        ? 'Ein Gespräch über erste Ankäufe, Vertrauen zu Galerien und die Frage, wann ein Werk bleibt.'
        : 'A conversation about first acquisitions, trust in galleries, and when a work is there to stay.'),
    linkLabel: mockLinkLabel || (de ? 'Weiterlesen' : 'Read more'),
    image: mailImage,
  }

  // Kachel-Spannen des Mosaiks (Handoff): groß 2×2, zwei einfache, eine breite.
  const mosaicSpan = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
  ]

  return (
    <div id={id} className="pt-14 animate-fade-in scroll-mt-14">
      {/* Hero mit Anmeldung */}
      <section className="px-[var(--page-x)] pt-[clamp(64px,9vw,128px)] pb-[clamp(56px,7vw,96px)] flex flex-col items-center text-center border-b border-artdus-line">
        <h1 className="font-normal text-[clamp(38px,5vw,72px)] leading-[1.02] tracking-[-0.01em] max-w-[900px]">
          {heroTitle}
        </h1>
        <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.5] text-neutral-700 max-w-[600px] mt-6">
          {heroBody}
        </p>

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
            className="w-full max-w-[640px] mt-9"
          >
            <div className="flex flex-wrap justify-center items-stretch gap-3">
              <label htmlFor={`${uid}-email`} className="sr-only">
                {emailPlaceholder}
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={emailPlaceholder}
                className="flex-[1_1_240px] min-w-0 text-[15px] text-artdus-black px-[18px] py-[14px] border border-artdus-black bg-white outline-none placeholder:text-neutral-500 focus:border-artdus-lime focus:ring-1 focus:ring-artdus-lime"
              />
              {showLanguageToggle && (
                <div
                  role="group"
                  aria-label={defaultLanguage === 'de' ? 'Sprache des Newsletters' : 'Newsletter language'}
                  className="flex items-center gap-2"
                >
                  {(['de', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={language === l}
                      onClick={() => setLanguage(l)}
                      className={pillClass(language === l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
              <input type="hidden" name="language" value={language} />
              <button
                type="submit"
                disabled={sending}
                className="text-[13px] font-medium tracking-[0.14em] uppercase text-white bg-artdus-black px-[30px] py-[14px] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {submitLabel}
              </button>
            </div>
            {failed && (
              <p role="alert" className="text-[14px] leading-[1.5] text-artdus-red mt-4">
                {errorText}
              </p>
            )}
            {/* Aktive Einwilligung (Pflicht-Checkbox, Annalena 11.8.2026) — ohne
                Häkchen blockt die native required-Validierung das Absenden. */}
            <label className="flex items-start justify-start gap-3 max-w-[560px] mx-auto mt-5 text-left cursor-pointer select-none">
              <span className="relative inline-flex shrink-0 mt-[2px]">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="peer appearance-none w-[18px] h-[18px] border border-artdus-black bg-white checked:bg-artdus-black cursor-pointer focus-visible:outline-none focus-visible:border-artdus-lime focus-visible:ring-1 focus-visible:ring-artdus-lime"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="pointer-events-none absolute inset-0 m-auto w-[11px] h-[11px] opacity-0 peer-checked:opacity-100 text-white"
                >
                  <path d="M2 6.5L4.8 9.2 10 3.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className="text-[13px] leading-[1.6] text-neutral-500">
                {consentText}{' '}
                <a href={privacyHref} className="underline underline-offset-[3px] hover:text-artdus-black">
                  {privacyLabel}
                </a>
                .
              </span>
            </label>
          </form>
        )}
      </section>

      {/* Mehrwert */}
      {benefits.length > 0 && (
        <section className="px-[var(--page-x)] py-[clamp(64px,8vw,112px)]">
          <h2 className="font-light text-[clamp(30px,3.4vw,52px)] leading-[1.06] tracking-[-0.02em] max-w-[760px] mb-[clamp(32px,4vw,56px)]">
            {benefitsHeading}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col gap-4 pt-6 border-t-2 border-artdus-black">
                <h3 className="text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.15]">{b.title}</h3>
                <p className="text-[15px] leading-[1.6] text-neutral-600">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bildmosaik */}
      {mosaic.length > 0 && (
        <section className="px-[var(--page-x)] pb-[clamp(64px,8vw,112px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[clamp(110px,24vw,190px)] md:auto-rows-[clamp(150px,13vw,210px)] gap-3 md:gap-4">
            {mosaic.slice(0, 4).map((img, i) => (
              <div key={img.src} className={`relative overflow-hidden ${mosaicSpan[i]}`}>
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
      )}

      {/* Vorschau — Desktop: Browser mit überlappendem Phone, Mobile: nur Phone */}
      {previewHeading ? (
        <section className="bg-artdus-light border-t border-artdus-line px-[var(--page-x)] py-[clamp(64px,8vw,112px)]">
          <div className="text-center">
            <h2 className="font-light text-[clamp(30px,3.4vw,52px)] leading-[1.06] tracking-[-0.02em]">
              {previewHeading}
            </h2>
          </div>
          <div className="relative max-w-[1040px] mx-auto mt-[clamp(40px,5vw,72px)] md:mb-[90px]">
            <div className="hidden md:block">
              <BrowserFrame mock={mock} url={previewUrl} />
            </div>
            <div className="flex justify-center md:block md:absolute md:right-[-10px] md:bottom-[-70px] md:[filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.28))]">
              <PhoneFrame mock={mock} label={phoneLabel} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonial */}
      {quoteText && (
        <section className="px-[var(--page-x)] py-[clamp(72px,9vw,128px)] flex justify-center">
          <figure className="m-0 max-w-[760px] text-center flex flex-col items-center gap-7">
            <span aria-hidden="true" className="w-2 h-2 bg-artdus-lime" />
            <blockquote className="font-light text-[clamp(24px,2.6vw,40px)] leading-[1.22] tracking-[-0.01em]">
              {quoteText}
            </blockquote>
            {quoteAttribution && (
              <figcaption className="text-[12px] font-semibold tracking-[0.14em] uppercase text-neutral-500">
                {quoteAttribution}
              </figcaption>
            )}
          </figure>
        </section>
      )}
    </div>
  )
}
