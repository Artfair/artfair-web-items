import {PartnerHeroItem, type PartnerHeroLogo} from './PartnerHeroItem'
import {PartnerFeatureItem} from './PartnerFeatureItem'
import {LogoGridItem, type GridLogo} from './LogoGridItem'
import {CtaBandItem} from './CtaBandItem'

// Partner-Seite — die GANZE Seite als EIN Baukasten-Item (Muster
// AboutPageItem). Übernimmt die in AD27 neu aufgebaute Komposition:
// Partner-Hero (Typ 2b, Lime-Rahmen + Logo-Karussell) → Partner-Porträts
// (Headline/Main Partner) → Logo-Raster (Exhibition/VIP/Media) → dunkles
// CTA-Band „Werden Sie Partner". Porträts und Logo-Gruppen sind Listen,
// weil die Partner-Riege pro Ausgabe wechselt. Editierbar sind nur die
// Inhalte, die als Props hereinkommen; der SectionRenderer löst die
// {de,en}-Felder auf und reicht fertige Strings herein. Sektionen ohne
// Inhalt werden übersprungen.
//
// Fester Anker: #werde-partner (CTA-Band) — Ziel der „Partner werden"-Knöpfe.

type Cta = {label: string; href: string}

export interface PartnerPortrait {
  id?: string // Sprungmarke, z. B. "headline-partner"
  eyebrow: string
  heading: string
  imageSrc: string
  imageAlt: string
  title: string
  body: string
  link?: Cta
}

export interface PartnerLogoGroup {
  id?: string // Sprungmarke, z. B. "exhibition-partner"
  eyebrow: string
  heading: string
  logos: GridLogo[]
}

export function PartnerPageItem(props: {
  heroEyebrow: string
  heroTitle: string
  heroBody: string
  heroPrimaryCta?: Cta
  heroSecondaryCta?: Cta
  heroImage: {src: string; alt: string}
  heroLogos: PartnerHeroLogo[]
  features: PartnerPortrait[]
  logoGroups: PartnerLogoGroup[]
  contactEyebrow: string
  contactHeading: string // Zeilenumbruch als \n
  contactBody: string
  contactPerson?: {name: string; role?: string; phone?: string}
  contactCta?: Cta
  contactImage?: {src: string; alt: string}
}) {
  const p = props
  return (
    <div className="bg-white text-artdus-black pt-14 animate-fade-in">
      <PartnerHeroItem
        eyebrow={p.heroEyebrow}
        title={p.heroTitle}
        body={p.heroBody}
        primaryCta={p.heroPrimaryCta}
        secondaryCta={p.heroSecondaryCta}
        imageSrc={p.heroImage.src}
        imageAlt={p.heroImage.alt}
        logos={p.heroLogos}
      />

      <div className="pt-[clamp(32px,4.5vw,72px)]" />

      {p.features.map((f, i) => (
        <PartnerFeatureItem
          key={f.id ?? i}
          id={f.id}
          eyebrow={f.eyebrow}
          heading={f.heading}
          imageSrc={f.imageSrc}
          imageAlt={f.imageAlt}
          title={f.title}
          body={f.body}
          link={f.link}
        />
      ))}

      {p.logoGroups.map((g, i) => (
        <LogoGridItem
          key={g.id ?? i}
          id={g.id}
          eyebrow={g.eyebrow}
          heading={g.heading}
          logos={g.logos}
        />
      ))}

      {p.contactHeading && p.contactCta && p.contactImage?.src && (
        <>
          <CtaBandItem
            id="werde-partner"
            eyebrow={p.contactEyebrow}
            heading={p.contactHeading}
            body={p.contactBody}
            contact={p.contactPerson?.name ? p.contactPerson : undefined}
            cta={p.contactCta}
            imageSrc={p.contactImage.src}
            imageAlt={p.contactImage.alt}
          />
          {/* Haarlinie zum Footer: Band und Footer sind beide schwarz — ohne
              Linie verschwimmt die Grenze und das Foto hängt frei im Schwarz.
              Gleicher Ton wie die ©-Linie im Footer (white/15). */}
          <div aria-hidden="true" className="h-0 border-t border-white/15 bg-artdus-black" />
        </>
      )}
    </div>
  )
}
