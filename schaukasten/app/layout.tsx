import type { Metadata } from 'next'
import '../schrank/src/styles/tokens.css'
import './globals.css'

// Vorschau des Schranks. Die Hausschriften gehören der Instanz und liegen nicht
// im (öffentlichen) Schrank — hier steht eine Ersatzschrift.
export const metadata: Metadata = {
  title: 'Schaukasten · web-items',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-sans text-brand-ink">{children}</body>
    </html>
  )
}
