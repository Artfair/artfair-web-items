import {HeroSplitItem} from './HeroSplitItem'
import {NumberedBlocksItem} from './NumberedBlocksItem'

// „Über uns & Kontakt" — die ganze Seite als EIN Baukasten-Item. Das Layout ist
// 1:1 die feste Handoff-Gestaltung (10.8.2026); editierbar sind ausschließlich
// die Inhalte, die als Props hereinkommen (Texte, Zitate, Team, Sektionen,
// Themen, Kontakt, Adressen, Bilder). Der SectionRenderer löst die {de,en}-
// Felder auf und reicht fertige Strings/Arrays herein.
// Entscheidung Annalena 14.8.2026: Über uns komplett OHNE Eyebrows — auch die
// Zwischenheadline „Kontakt & Team" ohne die Versalzeile mit Lime-Punkt. Die
// *Eyebrow-Props bleiben als @deprecated erhalten und werden ignoriert.

type Cta = {label: string; href: string}
type Quote = {text: string; author: string; role: string; draft: boolean}
type SectionRow = {name: string; body: string}
type Member = {name: string; role: string; email: string; phone: string}
type EnquiryLink = {href: string; label: string; acid: boolean}
type EnquiryBlock = {heading: string; body: string; links: EnquiryLink[]}
type Address = {
  label: string
  name: string
  lines: string
  phone: string
  email: string
  tone: 'lime' | 'black'
}

function QuoteFigure({quote, size}: {quote: Quote; size: 'lg' | 'md' | 'xl'}) {
  if (!quote.text) return null
  const q =
    size === 'xl'
      ? 'font-light text-[clamp(24px,2.6vw,40px)] leading-[1.2] tracking-[-0.01em]'
      : size === 'lg'
        ? 'font-light text-[clamp(24px,2.4vw,36px)] leading-[1.22] tracking-[-0.01em]'
        : 'font-light text-[clamp(21px,1.9vw,28px)] leading-[1.25]'
  return (
    <>
      <blockquote className={q}>{quote.text}</blockquote>
      <figcaption>
        {quote.author ? <span className="block text-[15px] font-medium">{quote.author}</span> : null}
        {quote.role ? (
          <span className="block text-[12px] font-semibold tracking-[0.14em] uppercase text-neutral-500 mt-1">
            {quote.role}
          </span>
        ) : null}
        {quote.draft ? (
          <span className="block text-[12px] text-neutral-400 mt-1">Zitat-Entwurf zur Freigabe</span>
        ) : null}
      </figcaption>
    </>
  )
}

function TeamNumRow({no}: {no: string}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-[15px] text-neutral-600 tracking-[0.08em]">{no}</span>
      <span aria-hidden="true" className="flex-1 h-px bg-neutral-300" />
    </div>
  )
}

function TeamName({children}: {children: React.ReactNode}) {
  return (
    <h3 className="text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.15] mb-2.5">{children}</h3>
  )
}

function TeamCardBody({person, nameHidden}: {person: Member; nameHidden?: boolean}) {
  return (
    <>
      {!nameHidden && <TeamName>{person.name}</TeamName>}
      <span className="block text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-600">
        {person.role}
      </span>
      <span className="flex flex-col items-start gap-1 mt-[18px] font-mono text-[14px]">
        {person.phone && (
          <a
            href={`tel:${person.phone.replace(/[\s-]+/g, '')}`}
            className="hover:underline underline-offset-[3px]"
          >
            {person.phone}
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`} className="hover:underline underline-offset-[3px]">
            {person.email}
          </a>
        )}
      </span>
    </>
  )
}

function enquiryExtra(links: EnquiryLink[]): React.ReactNode {
  const mono = links.filter((l) => !l.acid && (l.href || l.label))
  const acid = links.filter((l) => l.acid && l.href)
  if (mono.length === 0 && acid.length === 0) return undefined
  return (
    <>
      {mono.length > 0 && (
        <span className="flex flex-col items-start gap-1 mt-[18px] font-mono text-[14px] text-artdus-black">
          {mono.map((i) => (
            <a key={i.href} href={i.href} className="hover:underline underline-offset-[3px]">
              {i.label || i.href}
            </a>
          ))}
        </span>
      )}
      {acid.map((i) => (
        <a
          key={i.href}
          href={i.href}
          className="self-start inline-block mt-[18px] text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px]"
        >
          {i.label || i.href}
        </a>
      ))}
    </>
  )
}

export function AboutPageItem(props: {
  heroTitle: string
  heroBody: string
  heroPrimaryCta?: Cta
  heroSecondaryCta?: Cta
  heroVideoSrc?: string
  heroPoster?: string
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  visionEyebrow?: string
  visionHeading: string
  visionBody: string
  visionQuote: Quote
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  collectorsEyebrow?: string
  collectorsHeading: string
  collectorsBody: string
  collectorsImage?: {src: string; alt: string}
  collectorsQuote: Quote
  arealImage?: {src: string; alt: string}
  arealLabel: string
  arealBody: string
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  profileEyebrow?: string
  profileHeading: string
  profileSections: SectionRow[]
  profileThemesLabel: string
  profileThemes: string[]
  profileQuote: Quote
  profileImage?: {src: string; alt: string}
  contactAnchor: string
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  contactEyebrow?: string
  contactHeading: string
  contactBody: string
  contactCta?: Cta
  contactAddressLine: string
  contactPhone: string
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  teamEyebrow?: string
  teamHeading: string
  team: Member[]
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  enquiriesEyebrow?: string
  enquiriesHeading: string
  enquiries: EnquiryBlock[]
  /** @deprecated Über uns ohne Eyebrows (Annalena 14.8.2026) — wird ignoriert. */
  addressesEyebrow?: string
  addressesHeading: string
  addresses: Address[]
}) {
  const p = props
  return (
    <div className="pt-14 animate-fade-in">
      <HeroSplitItem
        title={p.heroTitle}
        body={p.heroBody}
        primaryCta={p.heroPrimaryCta ?? {label: '', href: '#'}}
        secondaryCta={p.heroSecondaryCta}
        videoSrc={p.heroVideoSrc || undefined}
        poster={p.heroPoster || undefined}
      />

      {/* Vision */}
      <section id="vision" className="px-[var(--page-x)] py-[clamp(72px,10vw,144px)] scroll-mt-14">
        <div className="grid md:grid-cols-2 gap-x-[clamp(40px,6vw,96px)] gap-y-12 items-start">
          <div>
            <h2 className="font-light text-[clamp(30px,3.4vw,52px)] leading-[1.06] tracking-[-0.02em] max-w-[24ch]">
              {p.visionHeading}
            </h2>
            <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.62] text-neutral-600 max-w-[62ch] mt-7 whitespace-pre-line">
              {p.visionBody}
            </p>
          </div>
          <figure className="m-0 border-l border-artdus-black pl-[clamp(24px,3vw,48px)] flex flex-col gap-6">
            <QuoteFigure quote={p.visionQuote} size="lg" />
          </figure>
        </div>
      </section>

      {/* Sammlerschaft & Institutionen */}
      <section className="px-[var(--page-x)] pb-[clamp(72px,10vw,144px)]">
        <div className="grid md:grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-10 items-stretch">
          <div className="relative min-h-[360px]">
            {p.collectorsImage?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.collectorsImage.src}
                alt={p.collectorsImage.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h2 className="font-light text-[clamp(28px,3vw,44px)] leading-[1.06] tracking-[-0.02em] max-w-[22ch]">
                {p.collectorsHeading}
              </h2>
              <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.62] text-neutral-600 max-w-[52ch] mt-6 whitespace-pre-line">
                {p.collectorsBody}
              </p>
            </div>
            <figure className="m-0 p-[clamp(24px,2.6vw,36px)] bg-white border border-artdus-black flex flex-col gap-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
              <QuoteFigure quote={p.collectorsQuote} size="md" />
            </figure>
          </div>
        </div>
      </section>

      {/* Areal Böhler */}
      <section id="areal" className="pb-[clamp(72px,10vw,144px)] scroll-mt-14">
        <div className="relative w-full h-[clamp(420px,72vh,820px)]">
          {p.arealImage?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.arealImage.src}
              alt={p.arealImage.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="px-[var(--page-x)] pt-5">
          <div className="grid md:grid-cols-3 gap-x-[clamp(24px,4vw,64px)] gap-y-4 items-start">
            <p className="text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-500">
              {p.arealLabel}
            </p>
            <p className="md:col-span-2 text-[clamp(17px,1.4vw,20px)] leading-[1.62] text-neutral-600 max-w-[74ch] whitespace-pre-line">
              {p.arealBody}
            </p>
          </div>
        </div>
      </section>

      {/* Kuratorisches Profil */}
      <section id="profil" className="px-[var(--page-x)] pb-[clamp(72px,10vw,144px)] scroll-mt-14">
        <h2 className="font-light text-[clamp(28px,3vw,44px)] leading-[1.06] tracking-[-0.02em] mb-[clamp(32px,4vw,56px)]">
          {p.profileHeading}
        </h2>
        <div className="border-t border-artdus-black">
          {p.profileSections.map((s, i) => (
            <div
              key={s.name || i}
              className="grid grid-cols-[48px_1fr] md:grid-cols-[64px_minmax(180px,1fr)_minmax(280px,2fr)] gap-x-[clamp(16px,3vw,48px)] gap-y-2 items-baseline py-[clamp(24px,3vw,40px)] border-b border-artdus-black"
            >
              <span className="text-[15px] text-neutral-400 tracking-[0.08em]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-light text-[clamp(22px,2.2vw,32px)] leading-[1.1]">{s.name}</h3>
              <p className="col-start-2 md:col-start-3 text-[15px] leading-[1.62] text-neutral-600 max-w-[60ch]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
        {p.profileThemes.length > 0 && (
          <div className="mt-[clamp(32px,4vw,56px)]">
            <span className="block text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-500 mb-5">
              {p.profileThemesLabel}
            </span>
            <div className="flex flex-wrap gap-3">
              {p.profileThemes.map((t) => (
                <span
                  key={t}
                  className="inline-flex border border-artdus-black rounded-full px-4 py-[6px] text-[13px] font-medium tracking-[0.06em] uppercase whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-10 items-center pt-[clamp(40px,5vw,72px)]">
          <figure className="m-0 flex flex-col gap-6">
            <QuoteFigure quote={p.profileQuote} size="xl" />
          </figure>
          <div className="relative min-h-[clamp(280px,34vw,440px)]">
            {p.profileImage?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.profileImage.src}
                alt={p.profileImage.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* Kontakt & Team (#kontakt) */}
      <section
        id={p.contactAnchor || 'kontakt'}
        className="px-[var(--page-x)] pt-[clamp(48px,6vw,88px)] pb-10 scroll-mt-14"
      >
        <div className="flex items-stretch gap-[clamp(20px,2.5vw,36px)]">
          <div aria-hidden="true" className="w-[28px] bg-artdus-lime shrink-0" />
          <div className="flex-1 flex flex-wrap justify-between items-end gap-10">
            <div>
              <h2 className="font-light text-[clamp(44px,5.5vw,84px)] leading-none tracking-[-0.02em]">
                {p.contactHeading}
              </h2>
              <p className="text-[clamp(18px,1.6vw,23px)] leading-[1.4] text-neutral-600 max-w-[640px] mt-7 whitespace-pre-line">
                {p.contactBody}
              </p>
            </div>
            {p.contactCta?.href ? (
              <a
                href={p.contactCta.href}
                className="inline-flex items-center gap-2 bg-artdus-black text-white text-[13px] font-semibold tracking-[0.14em] uppercase px-7 py-[15px] whitespace-nowrap shrink-0"
              >
                {p.contactCta.label}
              </a>
            ) : null}
          </div>
        </div>
        <div aria-hidden="true" className="h-px bg-artdus-black mt-6" />
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[13px] font-semibold tracking-[0.14em] uppercase text-neutral-600">
          {p.contactAddressLine ? <span>{p.contactAddressLine}</span> : null}
          {p.contactPhone ? (
            <a
              href={`tel:${p.contactPhone.replace(/[\s-]+/g, '')}`}
              className="hover:text-artdus-black transition-colors"
            >
              {p.contactPhone}
            </a>
          ) : null}
        </div>
      </section>

      {/* Team-Verzeichnis — mobil eine Spalte, Desktop zwei versetzte Spalten */}
      <section className="px-[var(--page-x)] pt-[clamp(64px,8vw,128px)]">
        <h2 className="font-light text-[clamp(32px,3.6vw,52px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
          {p.teamHeading}
        </h2>
        <div className="flex flex-col gap-[clamp(40px,5vw,72px)] md:hidden">
          {p.team.map((person, i) => (
            <div key={person.email || i}>
              <TeamNumRow no={String(i + 1).padStart(2, '0')} />
              <TeamCardBody person={person} />
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-2 md:grid-rows-[auto_auto_1fr] gap-x-[clamp(40px,5vw,88px)]">
          {p.team.length > 0 && (
            <>
              <div className="col-start-1 row-start-1">
                <TeamNumRow no="01" />
              </div>
              <div className="col-start-1 row-start-2">
                <TeamName>{p.team[0].name}</TeamName>
              </div>
              <div className="col-start-1 row-start-3 flex flex-col gap-[clamp(40px,5vw,72px)]">
                <div>
                  <TeamCardBody person={p.team[0]} nameHidden />
                </div>
                {p.team
                  .filter((_, i) => i % 2 === 0)
                  .slice(1)
                  .map((person) => (
                    <div key={person.email || person.name}>
                      <TeamNumRow no={String(p.team.indexOf(person) + 1).padStart(2, '0')} />
                      <TeamCardBody person={person} />
                    </div>
                  ))}
              </div>
              <div className="col-start-2 row-start-3 flex flex-col gap-[clamp(40px,5vw,72px)]">
                {p.team
                  .filter((_, i) => i % 2 === 1)
                  .map((person) => (
                    <div key={person.email || person.name}>
                      <TeamNumRow no={String(p.team.indexOf(person) + 1).padStart(2, '0')} />
                      <TeamCardBody person={person} />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Anliegen */}
      <NumberedBlocksItem
        heading={p.enquiriesHeading}
        blocks={p.enquiries.map((b) => ({
          heading: b.heading,
          body: b.body,
          extra: enquiryExtra(b.links),
        }))}
      />

      {/* Adressen */}
      <section className="px-[var(--page-x)] pb-[clamp(72px,10vw,140px)]">
        <h2 className="font-light text-[clamp(32px,3.6vw,52px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,48px)]">
          {p.addressesHeading}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-6">
          {p.addresses.map((a, i) => {
            const dark = a.tone === 'black'
            return (
              <address
                key={a.name || i}
                className={`not-italic px-10 pt-11 pb-12 min-h-[320px] flex flex-col ${
                  dark ? 'bg-artdus-black text-white' : 'bg-artdus-lime text-artdus-black'
                }`}
              >
                <span className="text-[13px] font-semibold tracking-[0.14em] uppercase">
                  {a.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px mt-5 mb-8 ${dark ? 'bg-artdus-lime' : 'bg-artdus-black'}`}
                />
                <span className="block font-light text-[clamp(28px,2.6vw,40px)] leading-[1.06] tracking-[-0.02em] whitespace-pre-line">
                  {a.name}
                </span>
                {a.phone || a.email ? (
                  <span className="mt-auto pt-8 flex flex-wrap justify-between items-end gap-x-10 gap-y-6">
                    <span
                      className={`block text-[17px] leading-[1.62] whitespace-pre-line ${
                        dark ? 'text-[#C4C4C4]' : ''
                      }`}
                    >
                      {a.lines}
                    </span>
                    <span className="flex flex-col items-start gap-[5px] font-mono text-[14px]">
                      {a.phone && (
                        <a
                          href={`tel:${a.phone.replace(/[\s-]+/g, '')}`}
                          className="hover:underline underline-offset-[3px]"
                        >
                          {a.phone}
                        </a>
                      )}
                      {a.email && (
                        <a
                          href={`mailto:${a.email}`}
                          className="hover:underline underline-offset-[3px]"
                        >
                          {a.email}
                        </a>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="block text-[17px] leading-[1.62] mt-auto pt-8 whitespace-pre-line">
                    {a.lines}
                  </span>
                )}
              </address>
            )
          })}
        </div>
      </section>
    </div>
  )
}
