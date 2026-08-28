import Link from "next/link";
import { INLINE_LINK_LIGHT, renderInlineLinks } from "../inlineLinks";

// Baukasten-Item „Info-Header" (Header-Typ 4 · Clean/Info) — nur Text auf
// Weiß mit 28px-Acid-Balken links, optionalem schwarzen Knopf rechts unten,
// schwarzer Haarlinie und Meta-Zeile (Presse) oder eigenem Fuß-Inhalt wie
// Filter-Pills (FAQ, via footer). Trägt die H1 — pro Seite max. einmal.
// Design-Handoff „Seiten-Header-System", Typ 4 (Presse, Gallery/Besucher FAQ).

export function InfoHeaderItem({
  id,
  eyebrow,
  title,
  body,
  action,
  meta,
  children,
  footer,
}: {
  id?: string;
  eyebrow?: string; // leer = keine Eyebrow-Zeile, auch kein Punkt (Annalena 14.8.2026 — z. B. Impressum/Datenschutz)
  title: string;
  body?: string;
  action?: { label: string; href: string }; // schwarzer Knopf, rechts unten
  meta?: string[]; // Meta-Zeile unter der Haarlinie (z. B. Stand, Kontakt)
  children?: React.ReactNode; // unter dem Text, z. B. Suchfeld (FAQ)
  footer?: React.ReactNode; // unter der Haarlinie statt Meta, z. B. Filter-Pills
}) {
  return (
    <section id={id}>
      <div className="px-[var(--page-x)] pt-[clamp(48px,6.1vw,88px)] pb-[clamp(24px,2.8vw,40px)] flex gap-[clamp(20px,2.5vw,36px)] items-stretch">
        <div aria-hidden="true" className="w-[clamp(16px,1.9vw,28px)] bg-artdus-lime shrink-0" />
        <div className="flex-1 flex justify-between items-end gap-10 flex-wrap">
          <div className="min-w-0">
            {eyebrow && (
              <span className="flex items-center gap-2.5 text-[13px] font-medium tracking-[0.18em] uppercase mb-[clamp(16px,1.7vw,24px)]">
                <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
                {eyebrow}
              </span>
            )}
            <h1 className="font-normal text-[clamp(42px,5.8vw,84px)] leading-[0.98] tracking-[-0.01em]">
              {title}
            </h1>
            {body && (
              <p className="text-[clamp(18px,1.6vw,23px)] leading-[1.4] text-neutral-700 max-w-[640px] mt-[clamp(20px,1.9vw,28px)]">
                {/* Links als [Text](https://…) — Impressum/Datenschutz (Annalena 27.8.2026) */}
                {renderInlineLinks(body, { className: INLINE_LINK_LIGHT })}
              </p>
            )}
            {children}
          </div>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 bg-artdus-black text-white text-[13px] font-medium tracking-[0.14em] uppercase px-[28px] py-[15px] whitespace-nowrap shrink-0"
            >
              {action.label}
            </Link>
          )}
        </div>
      </div>
      <div className="px-[var(--page-x)] pt-[clamp(16px,1.7vw,24px)]">
        <div aria-hidden="true" className="h-px bg-artdus-black" />
      </div>
      {meta && meta.length > 0 && (
        <div className="px-[var(--page-x)] pt-5 pb-[clamp(24px,2.8vw,40px)] flex gap-x-8 gap-y-2 flex-wrap text-[13px] tracking-[0.1em] uppercase text-neutral-600">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      {footer && (
        <div className="px-[var(--page-x)] pt-5 pb-[clamp(24px,2.8vw,40px)]">{footer}</div>
      )}
    </section>
  );
}
