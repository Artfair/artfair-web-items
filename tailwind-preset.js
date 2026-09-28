// Geteiltes Tailwind-Theme (Token-Konsolidierung 2026).
// Wird von AD27 und Webby als Preset eingebunden, damit beide dieselben
// Utility-Klassen (brand-accent, text-ink, animate-marquee …) verstehen.
// Seit 0.22.0 tragen die Markenfarben zusätzlich markenfreie Namen (brand-*),
// damit das Paket auch von einer zweiten Messe genutzt werden kann.
// Die Farb-Werte hinter den var()-Tokens leben in ./src/styles/tokens.css.
//
//   // tailwind.config.*
//   import artfairPreset from '@artfair/web-items/tailwind-preset'
//   export default {
//     presets: [artfairPreset],
//     content: ['./…', './node_modules/@artfair/web-items/src/**/*.{ts,tsx}'],
//   }
//
// CommonJS, weil Tailwind-Configs es projektübergreifend am robustesten laden.
module.exports = {
  theme: {
    extend: {
      colors: {
        // Kanonische Tokens — Werte in src/styles/tokens.css (einzige Quelle).
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'gray-1': 'var(--gray-1)',
        'gray-2': 'var(--gray-2)',
        'gray-3': 'var(--gray-3)',
        'gray-4': 'var(--gray-4)',
        'line-soft': 'var(--line-soft)',
        line: 'var(--line)',
        'earth-1': 'var(--earth-1)',
        'earth-2': 'var(--earth-2)',
        'earth-3': 'var(--earth-3)',
        'earth-line': 'var(--earth-line)',
        // ── Markenfarben, alte Namen (Bestand) ────────────────────────────
        // Bleiben unverändert in Betrieb. Werden erst entfernt, wenn nirgends
        // mehr verwendet — siehe Block darunter.
        'artdus-black': '#0A0A0A',
        'artdus-red': '#E8192C',
        'artdus-gray': '#888888',
        'artdus-light': '#F5F5F5',
        'artdus-border': '#222222',
        'artdus-lime': '#E7FA31',
        'artdus-paper': '#F6F6F4',
        'artdus-line': '#ECECEC',

        // ── Markenfarben, neue Namen (ab 0.22.0) ──────────────────────────
        // Wertgleiche Zweitnamen zu den artdus-* oben — KEINE Farbänderung,
        // rein additiv. Zweck: die Utility-Klassen tragen die Marke nicht mehr
        // im Namen, damit eine zweite Messe dasselbe Paket nutzen kann.
        //
        // Umstellung läuft schrittweise: beide Namensätze funktionieren
        // parallel, neue Arbeit nutzt brand-*, Bestand wird nach und nach
        // nachgezogen. Erst wenn kein artdus-* mehr vorkommt, fällt der Block
        // oben weg (dann Major-Sprung, weil Konsumenten sie noch nutzen —
        // Webby: ConciergePanel, EditShell).
        //
        // Werte stehen hier bewusst als Hex und nicht als var(--…): tokens.css
        // liegt derzeit doppelt vor (Paket + AD27/app/tokens.css, bereits
        // auseinandergedriftet). Die Überführung auf CSS-Variablen kommt,
        // wenn diese Doppelung aufgelöst ist.
        //
        // Benennung nach Rolle statt nach Farbe — Namen sind noch nicht
        // endgültig, solange sie niemand verwendet (Abstimmung Annalena).
        'brand-ink': '#0A0A0A', //  = artdus-black · Text, dunkle Flächen
        'brand-accent': '#E7FA31', //  = artdus-lime  · Akzent, CTA
        'brand-paper': '#F6F6F4', //  = artdus-paper · Grundfläche
        'brand-surface': '#F5F5F5', //  = artdus-light · hellere Fläche, Badges
        'brand-line': '#ECECEC', //  = artdus-line  · Trennlinien
        'brand-muted': '#888888', //  = artdus-gray  · gedämpfter Text
        'brand-danger': '#E8192C', //  = artdus-red   · Fehlermeldungen (role="alert")
        'brand-border': '#222222', //  = artdus-border · derzeit unbenutzt
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        marquee: 'marquee 32s linear infinite',
        'dock-in': 'dockIn 0.34s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'tab-in': 'tabIn 0.3s ease',
        'chat-pop': 'chatPop 0.22s ease',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        dockIn: {
          '0%': { transform: 'translateY(22px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        tabIn: {
          '0%': { transform: 'translate(22px, -50%)', opacity: '0' },
          '100%': { transform: 'translate(0, -50%)', opacity: '1' },
        },
        chatPop: {
          '0%': { transform: 'translateY(14px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
    },
  },
}
