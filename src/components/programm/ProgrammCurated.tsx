import {NumberedBlocksItem} from '../items/NumberedBlocksItem'

// Kuratierte Bereiche (Programm) — fest im Code gepflegter Riegel: Fragile
// Realities / International Practices inkl. Kurator*innen-Nennungen. Wird im
// Baukasten-Hybrid als Slot eingehängt und im Code-Fallback direkt gerendert.
export function ProgrammCurated({lang}: {lang: 'de' | 'en'}) {
  const de = lang === 'de'
  return (
    <NumberedBlocksItem
      id="kuratiert"
      eyebrow={de ? 'Kuratiert' : 'Curated'}
      heading={de ? 'Kuratierte Bereiche.' : 'Curated sections.'}
      blocks={[
        {
          heading: 'Fragile Realities',
          body: de
            ? 'Fragile Realities versammelt künstlerische Praktiken, die sich mit der Verschiebung von Realität auseinandersetzen. Die Werke versuchen nicht, Krisen zu erklären — sie nähern sich Fragilität über den Körper, über Materialien oder über Formen der Erinnerung. Eingeladen sind ausschließlich Räume, die von Galeristinnen gegründet wurden: eine strukturelle Perspektive auf kuratorische Praxis, Netzwerke und Sichtbarkeit im Kunstsystem.'
            : 'Fragile Realities brings together artistic practices that engage with shifts in reality. The works do not attempt to explain crises — they approach fragility through the body, through materials or through forms of memory. Only spaces founded by women gallerists are invited: a structural perspective on curatorial practice, networks and visibility within the art system.',
          extra: (
            <p className="text-[15px] leading-[1.62] text-neutral-600 mt-4">
              {de ? 'Kuratiert von ' : 'Curated by '}
              <span className="font-medium text-artdus-black">Pola van den Hövel</span>.
            </p>
          ),
        },
        {
          heading: 'International Practices',
          body: de
            ? 'International Practices präsentiert kuratierte internationale Perspektiven als integralen Bestandteil der Art Düsseldorf. Das Format vereint Sammlungen, Kooperationen und künstlerische Positionen aus dem Ausland und eröffnet neue Dialoge und Verbindungen — von künstlerischen Praktiken geprägt, die aus unterschiedlichen kulturellen Kontexten kommen.'
            : 'International Practices presents curated international perspectives as an integral part of Art Düsseldorf. The format brings together collections, collaborations and artistic positions from abroad, opening up new dialogues and connections shaped by practices from different cultural contexts.',
          extra: (
            <p className="text-[15px] leading-[1.62] text-neutral-600 mt-4">
              {de
                ? 'Zuletzt mit dem anonymous art project, Tokio (kuratiert von '
                : 'Most recently with the anonymous art project, Tokyo (curated by '}
              <span className="font-medium text-artdus-black">Eriko Kimura</span>
              {de ? ') und J. Park. The Art of Noise, Daegu (kuratiert von ' : ') and J. Park. The Art of Noise, Daegu (curated by '}
              <span className="font-medium text-artdus-black">Gregor Jansen</span>).
            </p>
          ),
        },
      ]}
    />
  )
}
