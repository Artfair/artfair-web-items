import {SalesHeroItem} from './SalesHeroItem'
import {TextCtaItem} from './TextCtaItem'
import {FactsRowItem} from './FactsRowItem'
import {CardTrioItem} from './CardTrioItem'
import {CtaBandItem} from './CtaBandItem'
import {InquiryFormItem, type InquiryFormProps} from './InquiryFormItem'

// „Business meets Art" — die ganze Landingpage als EIN Baukasten-Item
// (Muster AboutPageItem; Content-Spez 8/2026). Komponiert die Standard-
// Riegel in fester Reihenfolge: Sales-Hero, Vertrauen, Fakten, Enthalten-
// Trio, Unabhängig-buchbar, Kontaktband, Anfrage-Formular. Editierbar sind
// ausschließlich die Inhalte, die als Props hereinkommen; der
// SectionRenderer löst die {de,en}-Felder auf und reicht fertige Strings
// herein. Sektionen ohne Inhalt werden übersprungen.
//
// Sprungmarken (fest): #vertrauen, #fakten, #format (erste Enthalten-Karte),
// #unabhaengig, #kontakt, #anfrage — die „Anfrage senden"-CTAs der Seite
// zeigen auf #anfrage, „Format ansehen" auf #format.

type Cta = {label: string; href: string}

export interface BusinessCard {
  imageSrc: string
  imageAlt: string
  label: string
  title: string
  body: string
}

export function BusinessPageItem(props: {
  heroEyebrow: string
  heroTitle: string
  heroBody: string
  heroPrimaryCta?: Cta
  heroSecondaryCta?: Cta
  heroImages: string[] // erstes Bild = Basis der Slideshow
  heroImageAlt?: string
  heroImageCaption?: string // z. B. „Business meets Art, AD26"
  trustEyebrow: string
  trustHeading: string
  trustBody: string
  factsKicker: string // Einordnungszeile, z. B. „Auf einen Blick."
  facts: {label: string; value: string}[]
  includedEyebrow: string
  includedHeading: string
  includedCards: BusinessCard[]
  independentHeading: string
  independentBody: string
  contactEyebrow: string
  contactHeading: string // Zeilenumbruch als \n
  contactBody: string
  contactPerson?: {name: string; role?: string; phone?: string}
  contactCta?: Cta
  contactImage?: {src: string; alt: string}
  inquiry?: Omit<InquiryFormProps, 'id'> // ohne inquiry entfällt das Formular
}) {
  const p = props
  return (
    <div className="bg-white text-artdus-black pt-14 animate-fade-in">
      <SalesHeroItem
        eyebrow={p.heroEyebrow}
        title={p.heroTitle}
        body={p.heroBody}
        primaryCta={p.heroPrimaryCta}
        secondaryCta={p.heroSecondaryCta}
        images={p.heroImages}
        imageAlt={p.heroImageAlt}
        imageCaption={p.heroImageCaption || undefined}
      />

      {(p.trustHeading || p.trustBody) && (
        <TextCtaItem
          id="vertrauen"
          eyebrow={p.trustEyebrow || undefined}
          heading={p.trustHeading}
          body={p.trustBody}
        />
      )}

      {p.facts.length > 0 && (
        <FactsRowItem id="fakten" kicker={p.factsKicker || undefined} facts={p.facts} />
      )}

      {p.includedCards.length > 0 && (
        <CardTrioItem
          eyebrow={p.includedEyebrow}
          heading={p.includedHeading}
          cards={p.includedCards.map((c, i) => ({...c, id: i === 0 ? 'format' : undefined}))}
        />
      )}

      {(p.independentHeading || p.independentBody) && (
        <TextCtaItem id="unabhaengig" heading={p.independentHeading} body={p.independentBody} />
      )}

      {p.contactHeading && p.contactCta && p.contactImage?.src && (
        <CtaBandItem
          id="kontakt"
          eyebrow={p.contactEyebrow}
          heading={p.contactHeading}
          body={p.contactBody}
          contact={p.contactPerson?.name ? p.contactPerson : undefined}
          cta={p.contactCta}
          imageSrc={p.contactImage.src}
          imageAlt={p.contactImage.alt}
        />
      )}

      {p.inquiry && p.inquiry.heading && <InquiryFormItem id="anfrage" {...p.inquiry} />}
    </div>
  )
}
