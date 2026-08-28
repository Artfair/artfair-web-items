// Baukasten-Item „Nummerierte Blöcke" — editoriale 01…05-Blöcke in zwei
// versetzten Spalten, optional mit Establishing-Foto und Link im Kopf.
// Muster der Themen-Sektion der Startseite, verallgemeinert.

import { INLINE_LINK_LIGHT, renderInlineLinks } from "../inlineLinks";

export interface NumberedBlock {
  heading: string;
  body: string; // Links als [Text](https://…) — Impressum/Datenschutz (Annalena 27.8.2026)
  extra?: React.ReactNode; // z. B. Parkgebühren-Liste
}

// Bausteine der Blöcke — einzeln, damit der erste Block im Desktop-Grid in
// geteilte Zeilen zerlegt werden kann (Ausrichtung der rechten Spalte).
function NumRow({ no }: { no: string }) {
  // Keine schwarze Kopflinie — die feine Linie neben der Nummer gliedert.
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-[15px] text-neutral-600 tracking-[0.08em]">{no}</span>
      <span aria-hidden="true" className="flex-1 h-px bg-neutral-300" />
    </div>
  );
}

function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.15] mb-3.5">
      {children}
    </h3>
  );
}

function BlockBody({ block }: { block: NumberedBlock }) {
  return (
    <>
      <p className="text-[15px] leading-[1.62] text-neutral-600 whitespace-pre-line">
        {renderInlineLinks(block.body, { className: INLINE_LINK_LIGHT })}
      </p>
      {block.extra}
    </>
  );
}

function BlockCard({ no, block }: { no: string; block: NumberedBlock }) {
  return (
    <div>
      <NumRow no={no} />
      <BlockHeading>{block.heading}</BlockHeading>
      <BlockBody block={block} />
    </div>
  );
}

export function NumberedBlocksItem({
  id,
  eyebrow,
  heading,
  image,
  headLink,
  blocks,
}: {
  id?: string;
  eyebrow?: string; // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026)
  heading: string;
  image?: { src: string; alt: string; caption?: string };
  headLink?: { label: string; href: string };
  blocks: NumberedBlock[];
}) {
  // Versetzte Spalten: links 01, 03, 05 … rechts 02, 04 …
  const left = blocks.filter((_, i) => i % 2 === 0);
  const right = blocks.filter((_, i) => i % 2 === 1);
  const no = (b: NumberedBlock) => String(blocks.indexOf(b) + 1).padStart(2, "0");

  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(64px,8vw,128px)] scroll-mt-14">
      {eyebrow && (
        <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
          <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-light text-[clamp(40px,5.5vw,76px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>

      {image && (
        <div className="relative mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="w-full aspect-[21/9] object-cover"
          />
          {image.caption && (
            <span className="absolute left-0 bottom-0 bg-artdus-black text-white text-[11px] tracking-[0.12em] uppercase px-3.5 py-2">
              {image.caption}
            </span>
          )}
        </div>
      )}

      {headLink && (
        <a
          href={headLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase border-b-2 border-artdus-lime pb-[3px] mb-[clamp(36px,4vw,64px)]"
        >
          {headLink.label} →
        </a>
      )}

      {/* Mobil: eine Spalte in Lesereihenfolge 01…05 */}
      <div className="flex flex-col gap-[clamp(40px,5vw,72px)] md:hidden">
        {blocks.map((b) => (
          <BlockCard key={b.heading} no={no(b)} block={b} />
        ))}
      </div>
      {/* Desktop: zwei versetzte Spalten (links 01/03/05, rechts 02/04).
          Der Versatz ist strukturell: Nummernzeile und Überschrift von 01
          belegen eigene Grid-Zeilen, die rechte Spalte beginnt in der Zeile
          des Fließtexts — „02" liegt damit immer exakt auf der Höhe der
          ersten Textzeile von 01, unabhängig von Inhalt und Fensterbreite. */}
      <div className="hidden md:grid md:grid-cols-2 md:grid-rows-[auto_auto_1fr] gap-x-[clamp(40px,5vw,88px)]">
        <div className="col-start-1 row-start-1">
          <NumRow no={no(left[0])} />
        </div>
        <div className="col-start-1 row-start-2">
          <BlockHeading>{left[0].heading}</BlockHeading>
        </div>
        <div className="col-start-1 row-start-3 flex flex-col gap-[clamp(40px,5vw,72px)]">
          <div>
            <BlockBody block={left[0]} />
          </div>
          {left.slice(1).map((b) => (
            <BlockCard key={b.heading} no={no(b)} block={b} />
          ))}
        </div>
        <div className="col-start-2 row-start-3 flex flex-col gap-[clamp(40px,5vw,72px)]">
          {right.map((b) => (
            <BlockCard key={b.heading} no={no(b)} block={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
