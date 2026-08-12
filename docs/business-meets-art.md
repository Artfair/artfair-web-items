# Business meets Art — Umbau der Landingpage (Content-Spez 8/2026)

Handoff für das AD27-Team. Alle Bauteile liegen ab **v0.9.0** im Paket
`@artfair/web-items`.

## Empfohlener Weg: die ganze Seite als EIN Item (v0.9.0)

`BusinessPageItem` ist die komplette Landingpage als ein Custom-Item
(Muster `AboutPageItem`) — **als Ganzes editierbar in Webby** über den
Section-Typ `businessPage` (inkl. eingebettetem Anfrage-Formular als
`inquiry`-Objekt). Integration in AD27 wie bei `/about` (PR #66):

1. `@artfair/web-items` auf `#semver:^0.9.0` heben (Achtung: `^0.6.x`
   erlaubt kein 0.7/0.8/0.9 — die Zeile muss wirklich geändert werden).
2. In Webby/Sanity eine `sitePage-business-meets-art` mit einem
   `businessPage`-Abschnitt pflegen (Inhalte: siehe Komposition unten,
   Feldnamen identisch). Webby muss dafür seine gespiegelte `sections.ts`
   nachziehen.
3. `app/[lang]/business-meets-art/page.tsx` rendert die sitePage-Abschnitte
   über den `SectionRenderer`; als Fallback dient `<BusinessPageItem …/>`
   mit denselben Inhalten hartkodiert (Props = die Werte aus der
   Komposition unten, `inquiry` gebündelt als Objekt).

Feste Sprungmarken im Item: `#vertrauen`, `#fakten`, `#format`,
`#unabhaengig`, `#kontakt`, `#anfrage`.

## Was ist neu im Paket

| Bauteil | Änderung |
| --- | --- |
| `BusinessPageItem` | **NEU (v0.9.0)** — ganze Business-Seite als ein Item; Section-Typ `businessPage` |
| `SalesHeroItem` | optionales `imageCaption` — dezente Bildunterschrift unter der Slideshow |
| `FactsRowItem` | optionales `kicker` — Einordnungszeile über den Badges („Auf einen Blick.") |
| `TextCtaItem` | `eyebrow` und `cta` jetzt optional — ohne beides eine ruhige Textsektion |
| `CtaBandItem` | optionales `contact` — Ansprechperson abgesetzt vom Fließtext |
| `InquiryFormItem` | **NEU (v0.7.0)** — Anfrage-Formular (Sektion 7); `action`-Prop als Backend-Andockstelle |

Alle Erweiterungen sind rückwärtskompatibel (bestehende Seiten rendern
unverändert). Die Baukasten-Typen (`sections.ts`) und der `SectionRenderer`
sind mitgezogen — die Sektionstypen `factsRow`, `ctaBand`, `textCta`,
`salesHero` haben die neuen Felder, `inquiryForm` ist neu. **Webby** muss
seine gespiegelte `sections.ts` nachziehen, bevor die Felder dort editierbar
sind.

## Sektionsreihenfolge (final)

1. Hero (`SalesHeroItem`, Copy überarbeitet, neue Bildunterschrift)
2. Vertrauen / Social Proof (`TextCtaItem` ohne CTA) — **NEU**
3. Fact-Badges (`FactsRowItem` mit Kicker „Auf einen Blick.")
4. Das ist enthalten (`CardTrioItem`, Copy überarbeitet)
5. Unabhängig buchbar (`TextCtaItem` ohne Eyebrow/CTA) — **NEU**
6. Kontaktblock (`CtaBandItem` mit abgesetzter Ansprechperson)
7. Anfrage-Formular (`InquiryFormItem`, Anker `#anfrage`) — **NEU**
8. Footer (unverändert)

Entscheidungen bei Umsetzung (bitte gegenchecken):

- **„Anfrage senden"** öffnet keine eigene Seite/kein Modal, sondern springt
  zum Formular am Seitenende (`#anfrage`). Das Formular ist ein eigenes,
  einzeln exportiertes Item — es kann später ohne Umbau auf eine eigene
  Route oder in ein Modal wandern.
- **„Format ansehen"** (Sekundär-CTA) springt auf `#format` = erste Karte von
  „Das ist enthalten". Die Spez sagt „Anker zu Sektion 5"; nach Sinn
  („Format *ansehen*") ist das Enthalten-Trio das plausiblere Ziel — falls
  doch „Unabhängig buchbar" gemeint war: Anker `#unabhaengig` existiert.
- **Kennzahl in Sektion 3** ([X] Unternehmen) ist wie gefordert NICHT
  enthalten — erst einsetzen, wenn die Zahl verifiziert ist.
- **Vertrauen-Sektion umformuliert** (Entscheidung Annalena 11.8.): Headline
  „In guter Gesellschaft." statt „Genutzt von Unternehmen, für die Diskretion
  zählt." (zu plump); die Sponsoring-Verneinung („Kein Sponsoring-Paket,
  keine Gegenleistung …") ist aus dem Text gestrichen — das Argument trägt
  allein die Sektion „Unabhängig buchbar".
- **Messetage** im Dropdown: Donnerstag, 8. April 2027 (Preview, ergänzt
  Annalena 12.8.) plus 9.–11. April 2027 (aus AD27-Inhalten) plus
  „Noch offen / flexibel".

## Inhalte (Referenz-Komposition, DE/EN)

Die verbindlichen Texte und Bilder für alle Sektionen — entweder als
`businessPage`-Section in Webby pflegen (empfohlen, Feldnamen identisch)
oder als granulare Riegel-Komposition direkt in
`app/[lang]/business-meets-art/page.tsx` einsetzen (Metadata-Block kann
bleiben; ggf. Description an neue Subline angleichen):

```tsx
import {SalesHeroItem} from '@/components/items/SalesHeroItem'
import {TextCtaItem} from '@/components/items/TextCtaItem'
import {FactsRowItem} from '@/components/items/FactsRowItem'
import {CardTrioItem} from '@/components/items/CardTrioItem'
import {CtaBandItem} from '@/components/items/CtaBandItem'
import {InquiryFormItem} from '@artfair/web-items'

export default async function BusinessMeetsArt({
  params,
}: {
  params: Promise<{lang: string}>
}) {
  const {lang} = await params
  const de = (lang === 'en' ? 'en' : 'de') === 'de'

  return (
    <div className="bg-white text-artdus-black pt-14 animate-fade-in">
      {/* 1 — Hero */}
      <SalesHeroItem
        eyebrow="Business meets Art · AD27"
        title={
          de
            ? 'Ein Rahmen, den Ihre wichtigsten Kunden nicht vergessen.'
            : 'A setting your most important clients won’t forget.'
        }
        body={
          de
            ? 'Ein exklusives Format für Unternehmen, die ihre wichtigsten Kundenbeziehungen in einem kultivierten, unaufdringlichen Rahmen vertiefen möchten — unabhängig von Sponsoring oder Partnerschaft.'
            : 'An exclusive format for companies looking to deepen their most important client relationships in a cultivated, understated setting — independent of any sponsorship or partnership.'
        }
        primaryCta={{label: de ? 'Anfrage senden' : 'Send inquiry', href: '#anfrage'}}
        secondaryCta={{label: de ? 'Format ansehen' : 'View the format', href: '#format'}}
        images={[
          '/images/business/bma-1.jpg',
          '/images/business/bma-2.jpg',
          '/images/business/bma-7.jpg',
          '/images/business/bma-5.jpg',
          '/images/business/bma-8.jpg',
          '/images/business/bma-6.jpg',
          '/images/business/bma-9.jpg',
        ]}
        imageAlt={
          de
            ? 'Impressionen von Business-Events auf der Art Düsseldorf.'
            : 'Impressions of business events at Art Düsseldorf.'
        }
        imageCaption="Business meets Art, AD26"
      />

      {/* 2 — Vertrauen / Social Proof (NEU) */}
      <TextCtaItem
        id="vertrauen"
        eyebrow={de ? 'Vertrauen' : 'Trust'}
        heading={de ? 'In guter Gesellschaft.' : 'In good company.'}
        body={
          de
            ? 'Business meets Art wurde 2025/26 von Unternehmen aus den Bereichen Wirtschaftsprüfung, Versicherung und Recht genutzt, um ausgewählte Kunden in kleinem Kreis einzuladen — diskret, persönlich, ohne großen Auftritt.'
            : 'In 2025/26, Business meets Art was used by companies from auditing, insurance and law to host selected clients in an intimate setting — discreet, personal, and without fanfare.'
        }
      />

      {/* 3 — Fact-Badges (mit Einordnungszeile) */}
      <FactsRowItem
        id="fakten"
        kicker={de ? 'Auf einen Blick.' : 'At a glance.'}
        facts={[
          {
            label: de ? 'Führung' : 'Guided tour',
            value: de ? 'ca. 60 Minuten,\nindividuell kuratiert' : 'approx. 60 minutes,\nindividually curated',
          },
          {
            label: de ? 'Gruppengröße' : 'Group size',
            value: de ? 'max. 15 Personen\npro Führung' : 'max. 15 participants\nper tour',
          },
          {
            label: de ? 'Hospitality' : 'Hospitality',
            value: de ? 'Champagne oder Canapé\nin der VIP Lounge' : 'Champagne or canapés\nin the VIP lounge',
          },
          {
            label: de ? 'Verfügbarkeit' : 'Availability',
            value: de ? 'Begrenzte Anzahl,\npersönliche Betreuung' : 'Limited number,\npersonal support',
          },
        ]}
      />

      {/* 4 — Das ist enthalten */}
      <CardTrioItem
        eyebrow={de ? 'VIP- & Business-Pakete' : 'VIP & business packages'}
        heading={de ? 'Das ist enthalten.' : 'What’s included.'}
        cards={[
          {
            id: 'format',
            imageSrc: '/images/visit/talks.jpg',
            imageAlt: de
              ? 'Gruppe bei einer Führung durch die Hallen der Art Düsseldorf.'
              : 'Group on a guided tour through the Art Düsseldorf halls.',
            label: de ? 'Kunst' : 'Art',
            title: de ? 'Private Führung' : 'Private guided tour',
            body: de
              ? 'Kein Rundgang von der Stange: Ihre Führung wird auf Ihre Gäste zugeschnitten — auf deren Interessen, nicht auf ein Standardprogramm. Der ideale Gesprächsanlass, ganz ohne Verkaufsdruck.'
              : 'No off-the-shelf tour: your guided tour is tailored to your guests — to their interests, not to a standard programme. The ideal conversation starter, without any sales pressure.',
          },
          {
            imageSrc: '/images/home/lounge.jpg',
            imageAlt: de
              ? 'Lounge-Bereich der Art Düsseldorf mit Sitzgruppen auf dem Areal Böhler.'
              : 'Art Düsseldorf lounge area with seating at Areal Böhler.',
            label: 'Lounge',
            title: de ? 'Exklusive VIP-Lounge' : 'Exclusive VIP lounge',
            body: de
              ? 'Ein reservierter Rückzugsort für Ihre Gäste — mit Champagner-Empfang oder einer Auswahl feiner Canapés. Der Rahmen für Gespräche, die etwas Raum brauchen.'
              : 'A reserved retreat for your guests — with a champagne reception or a selection of fine canapés. The setting for conversations that need a little room.',
          },
          {
            imageSrc: '/images/visit/tickets.jpg',
            imageAlt: de
              ? 'Guest-Pass der Art Düsseldorf wird am Einlass gescannt.'
              : 'Art Düsseldorf guest pass being scanned at the entrance.',
            label: 'Tickets',
            title: de ? 'Eintritt inklusive' : 'Admission included',
            body: de
              ? 'Der Messe-Eintritt ist für alle Teilnehmer*innen in jedem Paket enthalten — mit flexiblen Ticket-Optionen für Ihre Gruppe.'
              : 'Fair admission is included for all participants in every package — with flexible ticket options for your group.',
          },
        ]}
      />

      {/* 5 — Unabhängig buchbar (NEU, bewusst kurz und ruhig) */}
      <TextCtaItem
        id="unabhaengig"
        heading={de ? 'Unabhängig buchbar.' : 'Bookable independently.'}
        body={
          de
            ? 'Business meets Art ist kein Bestandteil eines Sponsoring- oder Partnerschaftspakets. Sie können dieses Format unabhängig von einer bestehenden Zusammenarbeit mit Art Düsseldorf buchen.'
            : 'Business meets Art is not part of any sponsorship or partnership package. You can book this format independently of any existing collaboration with Art Düsseldorf.'
        }
      />

      {/* 6 — Kontaktblock (Ansprechperson abgesetzt vom Fließtext) */}
      <CtaBandItem
        id="kontakt"
        eyebrow={de ? 'Kontakt' : 'Get in touch'}
        heading={de ? 'Planen Sie Ihr\nBusiness-Event.' : 'Plan your\nbusiness event.'}
        body={
          de
            ? 'Alle VIP- & Business-Pakete sind in begrenzter Anzahl verfügbar. Unser VIP-Team betreut Sie persönlich und gestaltet das Erlebnis eng mit Ihnen — abgestimmt auf Ihre Gäste und Ziele.'
            : 'All VIP & business packages are available in limited numbers. Our VIP team supports you personally and shapes the experience closely with you — matched to your guests and goals.'
        }
        contact={{name: 'Johanna Sucec', role: 'VIP Management', phone: '+49 221 420 393-14'}}
        cta={{label: de ? 'Anfrage senden' : 'Send inquiry', href: '#anfrage'}}
        imageSrc="/images/home/ad-hero-1.jpg"
        imageAlt={
          de
            ? 'Besucher*innen zwischen Kunstwerken in den Hallen der Art Düsseldorf.'
            : 'Visitors among artworks in the Art Düsseldorf halls.'
        }
      />

      {/* 7 — Anfrage-Formular (NEU; noch ohne Backend) */}
      <InquiryFormItem
        id="anfrage"
        eyebrow={de ? 'Anfrage' : 'Inquiry'}
        heading={de ? 'Ihre Anfrage.' : 'Your inquiry.'}
        companyLabel={de ? 'Unternehmen' : 'Company'}
        contactLabel={de ? 'Ansprechpartner + Position' : 'Contact person + position'}
        periodLabel={de ? 'Gewünschter Zeitraum' : 'Preferred period'}
        periodOptions={
          de
            ? ['Donnerstag, 8. April 2027 (Preview)', 'Freitag, 9. April 2027', 'Samstag, 10. April 2027', 'Sonntag, 11. April 2027', 'Noch offen / flexibel']
            : ['Thursday, 8 April 2027 (preview)', 'Friday, 9 April 2027', 'Saturday, 10 April 2027', 'Sunday, 11 April 2027', 'Still open / flexible']
        }
        guestsLabel={de ? 'Ungefähre Gästezahl' : 'Approximate number of guests'}
        guestOptions={
          de
            ? ['Bis 5 Gäste', '6–10 Gäste', '11–15 Gäste', 'Mehr als 15 Gäste (mehrere Führungen)']
            : ['Up to 5 guests', '6–10 guests', '11–15 guests', 'More than 15 guests (multiple tours)']
        }
        contextLabel={de ? 'Kontext/Anlass' : 'Context/occasion'}
        contextPlaceholder={
          de
            ? 'z.B. Kundenveranstaltung, Jubiläum, internes Anliegen'
            : 'e.g. client event, anniversary, internal occasion'
        }
        optionalHint="optional"
        selectPlaceholder={de ? 'Bitte wählen' : 'Please choose'}
        submitLabel={de ? 'Anfrage senden' : 'Send inquiry'}
        confirmation={
          de
            ? 'Vielen Dank. Johanna Sucec meldet sich innerhalb von 2 Werktagen persönlich bei Ihnen, um Details und einen passenden Termin abzustimmen.'
            : 'Thank you. Johanna Sucec will get back to you personally within two working days to discuss details and find a suitable date.'
        }
      />
    </div>
  )
}
```

## Offene Punkte (nicht Code)

- Kennzahl für Sektion 2/Vertrauen (Anzahl Unternehmen 2025/26) verifizieren —
  aktuell ohne Zahl ausgeliefert.
- Finale deutsche Formulierungen freigeben; die englischen Texte oben sind
  Übersetzungsvorschläge (analog zur Struktur, noch nicht freigegeben).
- Sekundär-CTA-Label „Format ansehen" vs. Alternativen („Mehr erfahren") prüfen.
- Formular-Backend (Entscheidung Annalena 12.8.: Backend statt
  Mailto-Fallback): Absenden bestätigt derzeit nur clientseitig — **es geht
  noch keine Anfrage an das VIP-Team raus.** Andock-Stelle ist fertig: das
  AD27-Team baut eine POST-Route (z. B. `/api/business-inquiry`, E-Mail an
  Johanna Sucec) und setzt `action="/api/business-inquiry"` am
  `InquiryFormItem`. Feldnamen im FormData: `company`, `contact`, `period`,
  `guests`, `context`. Fehlerfall zeigt `errorText` unter dem Knopf.
- Kein Kalender-Link als primärer Pfad nach dem Formular; falls gewünscht,
  später als sekundäre Ergänzung unterhalb der Bestätigung.
