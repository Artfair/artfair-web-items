import {TalksScheduleItem} from '../items/TalksScheduleItem'
import {withBase} from '../../lib/assets'

// Talks-Fahrplan (Programm) — fest im Code gepflegter Riegel: das komplette
// Talkprogramm 2027 (drei Tage, Speaker, Zeiten). Bewusst NICHT im Baukasten
// editierbar („Fahrplan im Code"); wird im Hybrid als Slot eingehängt und im
// Code-Fallback direkt gerendert.
export function ProgrammSchedule({lang, assetBase = ''}: {lang: 'de' | 'en'; assetBase?: string}) {
  const de = lang === 'de'
  const a = (p: string) => withBase(p, assetBase)
  return (
    <TalksScheduleItem
      id="talks"
      eyebrow="Talks — AD27"
      heading={de ? 'Das Talkprogramm.' : 'The talk programme.'}
      intro={
        de
          ? 'Drei Tage, drei Themen — Gespräche über Kunst, Europa und die Verantwortung einer Messe. 17.–19. April 2027, Talk Stage, Areal Böhler.'
          : 'Three days, three themes — conversations about art, Europe and the responsibility of a fair. 17–19 April 2027, Talk Stage, Areal Böhler.'
      }
      imageSrc={a("/images/programm/talk-stage.jpg")}
      imageAlt={
        de
          ? 'Talk auf der Talk Stage in den Hallen des Areal Böhler.'
          : 'Talk on the Talk Stage in the halls of Areal Böhler.'
      }
      imageCaption="Talk Stage — Areal Böhler, AD26"
      days={[
        {
          weekday: de ? 'Freitag' : 'Friday',
          date: de ? '17. April' : '17 April',
          theme: 'Engagement, Encounters, Enlightenment: New Energies for Art',
          talks: [
            {
              time: '14:00',
              title: 'Kunst schafft Orte für Erkenntnis',
              imageSrc: a('/images/home/theme-words.jpg'),
              speakers: [
                {name: 'Jennifer Braun', role: 'The Gen Z Art Critic'},
                {name: 'Annkathrin Kohout', role: 'Autorin und Kulturwissenschaftlerin'},
                {name: 'Ann-Katrin Günzel', role: 'Chefredakteurin Kunstforum International'},
              ],
              moderation: {name: 'Carsten Probst', role: 'Präsident AICA Deutschland'},
            },
            {
              time: '15:00',
              title: 'Kunst schafft Orte für Engagement',
              imageSrc: a('/images/home/lounge.jpg'),
              speakers: [
                {name: 'Gil Bronner', role: 'Sammlung Philara'},
                {name: 'Kathrin Jentjens', role: 'Kuratorin & Mediatorin Neue Auftraggeber'},
                {name: 'Stephan Muschick', role: 'Geschäftsführer E.ON Foundation'},
              ],
              moderation: {name: 'Tatjana Kimmel', role: 'Freunde des Kunstpalast e.V.'},
            },
            {
              time: '16:00',
              title: 'Kunst schafft Orte für Begegnung',
              imageSrc: a('/images/home/pink-booth.jpg'),
              speakers: [
                {name: 'Linda Conze', role: 'Kuratorin Kunstpalast'},
                {name: 'Hedwig Fijen', role: 'Direktorin Manifesta 16 Ruhr'},
                {name: 'Marcel Schumacher', role: 'Leiter Kunsthaus nrw'},
              ],
              moderation: {name: 'Sabine Oelze', role: 'Kunstjournalistin, Deutschlandfunk / WDR'},
            },
          ],
        },
        {
          weekday: de ? 'Samstag' : 'Saturday',
          date: de ? '18. April' : '18 April',
          theme: 'Borders, Solidarity, Unities: New Energies for Europe',
          talks: [
            {
              time: '14:00',
              title: 'Ost und West. Eine alte Geschichte – und ein neuer DDR-Hype?',
              imageSrc: a('/images/home/mirror.jpg'),
              speakers: [
                {name: 'Katharina Neuburger', role: 'Ludwig Stiftung Aachen'},
                {name: 'Renate Goldmann', role: 'VAN HAM Art Estate'},
                {name: 'Stefan Schmidtke', role: 'Geschäftsführer Kulturhauptstadt Europas Chemnitz 2025'},
              ],
              moderation: {name: 'Bettina Böttinger', role: 'WDR'},
            },
            {
              time: '15:00',
              title:
                'Zusammenhalt und Zerrissenheit einer Staatengemeinschaft: Wo fängt Europa an, wo hört es auf?',
              imageSrc: a('/images/home/hall-aerial.jpg'),
              speakers: [
                {name: 'Mark Terkessidis', role: 'Autor & Migrationsforscher'},
                {name: 'Markus Ambach', role: 'Kurator'},
                {name: 'Farzane Vaziritabar', role: 'Künstlerin'},
              ],
              moderation: {name: 'Christiane Meixner', role: 'Tagesspiegel'},
            },
            {
              time: '16:00',
              title: 'Kunst versus Politik: Ein neuer alter Machtkampf?',
              imageSrc: a('/images/home/panel.jpg'),
              speakers: [
                {name: 'Lars Hendrik Beger', role: 'Kulturjournalist, Deutschlandfunk'},
                {name: 'Georg Schöllhammer', role: 'tranzit.at, Herausgeber springerin'},
                {name: 'Ivor Stodolsky und Marita Muukkonen', role: 'Artists at Risk'},
              ],
              moderation: {name: 'Sebastian Frenzel', role: 'MONOPOL'},
            },
          ],
        },
        {
          weekday: de ? 'Sonntag' : 'Sunday',
          date: de ? '19. April' : '19 April',
          talks: [
            {
              time: '15:00',
              title: 'Ökonomie, Verantwortung und Nachhaltigkeit – Bilanz einer Messe',
              imageSrc: a('/images/home/exterior.jpg'),
              speakers: [
                {name: 'Jacob Bilabel', role: 'Projektleitung Green Culture'},
                {name: 'Stephan Muschick', role: 'E.ON Foundation'},
                {name: 'Thomas G. Schneider', role: 'Geschäftsführer Hasenkamp'},
                {name: 'Walter Gehlen', role: 'Direktor der Art Düsseldorf'},
              ],
            },
          ],
        },
      ]}
      credit={
        de
          ? 'Art Talks & Walks powered by E.ON Foundation. Kuratiert von Bettina Haiss / Kathrin Luz Communication und Art Düsseldorf.'
          : 'Art Talks & Walks powered by E.ON Foundation. Curated by Bettina Haiss / Kathrin Luz Communication and Art Düsseldorf.'
      }
    />
  )
}
