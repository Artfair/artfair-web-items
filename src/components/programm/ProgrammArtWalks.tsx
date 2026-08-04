import {NumberedBlocksItem} from '../items/NumberedBlocksItem'
import {localizeHref} from '../../lib/slugs'
import {withBase} from '../../lib/assets'

// Art Walks (Programm) — fest im Code gepflegter Riegel: Messeführungen +
// private Führungen mit Preis-Tabelle und Kontakt. Wird sowohl im Baukasten-
// Hybrid (als Slot) als auch im Code-Fallback der Programm-Seite verwendet.
export function ProgrammArtWalks({lang, assetBase = ''}: {lang: 'de' | 'en'; assetBase?: string}) {
  const de = lang === 'de'
  const a = (p: string) => withBase(p, assetBase)
  return (
    <NumberedBlocksItem
      id="art-walks"
      eyebrow="Art Walks"
      heading={de ? 'Buchen Sie Ihren Art Walk.' : 'Book your art walk.'}
      image={{
        src: a('/images/home/painting-crowd.jpg'),
        alt: de
          ? 'Besucher*innen betrachten ein großformatiges Gemälde auf der Art Düsseldorf.'
          : 'Visitors looking at a large-scale painting at Art Düsseldorf.',
      }}
      blocks={[
        {
          heading: de ? 'Messeführungen' : 'Guided fair tours',
          body: de
            ? 'Auch in diesem Jahr können Sie eine Führung über die Messe buchen. Die Art Walks powered by E.ON Foundation bringen Sie zu den Highlights der Messe und tauchen mit Ihnen gemeinsam in die Themenschwerpunkte der Art Düsseldorf ein. Tickets und alle Informationen zu den Messeführungen finden Sie im Ticketshop.'
            : 'This year, too, you can book a guided tour of the fair. The Art Walks powered by E.ON Foundation take you to the highlights of the fair and dive into the thematic focuses of Art Düsseldorf with you. Tickets and all information about the tours are available in the ticket shop.',
          extra: (
            <a
              href={localizeHref('/tickets', lang)}
              className="self-start inline-block text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] mt-5"
            >
              {de ? 'Zum Ticketshop' : 'To the ticket shop'} →
            </a>
          ),
        },
        {
          heading: de ? 'Private Führungen' : 'Private tours',
          body: de
            ? 'Buchen Sie eine auf Ihre Interessen abgestimmte Tour: nach Ihrem Zeitplan, persönlich, flexibel und professionell geführt. In einer 60-minütigen Tour vermitteln unsere Art Guides spannende Einblicke in Kunst und aktuelle Entwicklungen — individuell auf Ihre Interessen zugeschnitten.'
            : 'Book a tour tailored to your interests: on your schedule, personal, flexible and professionally guided. In a 60-minute tour, our art guides share fascinating insights into art and current developments — customised to your interests.',
          extra: (
            <div className="mt-6">
              <ul className="text-[15px]">
                {[
                  {label: de ? 'Gruppengröße' : 'Group size', value: de ? 'max. 15 Personen' : 'max. 15 people'},
                  {
                    label: de ? 'Preis' : 'Price',
                    value: de
                      ? '240 € netto, inkl. Headsets (zzgl. Eintritt)'
                      : '€240 net, incl. headsets (plus admission)',
                  },
                  {label: de ? 'Dauer' : 'Duration', value: de ? '60 Minuten' : '60 minutes'},
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex justify-between gap-4 border-b border-black/10 py-1.5"
                  >
                    <span className="text-neutral-600">{row.label}</span>
                    <span className="font-medium text-right">{row.value}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:vip@art-dus.de"
                className="self-start inline-block text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] mt-5"
              >
                vip@art-dus.de →
              </a>
            </div>
          ),
        },
      ]}
    />
  )
}
