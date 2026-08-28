import type {ReactNode} from 'react'

// Haus-Linkstil für Fließtext auf hellem Grund (FAQ-Antworten, Nummerierte
// Blöcke, Info-Header): Text schwarz, Lime-Unterstreichung, Hover-Marker.
export const INLINE_LINK_LIGHT =
  'text-artdus-black underline decoration-artdus-lime decoration-2 underline-offset-[3px] transition-colors hover:bg-artdus-lime/40'

// [Text](https://…) im Fließtext zu klickbaren Links auflösen — geteilter
// Helfer für Items, deren Textfelder Links MITTEN im Satz brauchen (bisher:
// Bildnachweise der Linkseite, FAQ-Antworten; bewusst nicht pauschal in
// allen Textfeldern, damit die Klammer-Syntax nirgends unerwartet gilt).
// Alles außerhalb der Klammern bleibt Text (Absätze über whitespace-pre-line
// des Aufrufers); externe Ziele (http/https) öffnen in neuem Tab.
export function renderInlineLinks(
  text: string,
  opts: {
    className: string // Link-Optik des Aufrufers (hell/dunkel)
    onClick?: (label: string, href: string) => void // z. B. Klick-Tracking
  },
): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [, label, href] = m
    const external = /^https?:/.test(href)
    out.push(
      <a
        key={`${m.index}-${href}`}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={opts.onClick ? () => opts.onClick!(label, href) : undefined}
        className={opts.className}
      >
        {label}
      </a>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
