// Geteiltes Tailwind-Theme der Messe-Website. Wird von der Website und vom
// Redaktionswerkzeug eingebunden, damit beide dieselben Bauteile im gleichen
// Look rendern.
//
// Die Markenfarben sind seit 1.0.0 nicht mehr an eine Messe gebunden: Die
// Utility-Klassen heissen brand-* und lesen CSS-Variablen, die jede Instanz
// selbst setzt.
//
//   // tailwind.config.*
//   import preset from '@artfair/web-items/tailwind-preset'
//   export default {
//     presets: [preset],
//     content: ['./…', './node_modules/@artfair/web-items/src/**/*.{ts,tsx}'],
//   }
//
// CommonJS — Dateiendung .cjs, weil das Paket "type": "module" ist. Als .js
// wurde die Datei als ESM geparst; `module.exports` erzeugt dort keine Exports,
// und ein `import preset from …` scheiterte mit "The module has no exports at
// all" (Turbopack/AD27). Der oeffentliche Pfad @artfair/web-items/tailwind-preset
// bleibt unveraendert, weil das exports-Feld ihn aufloest.
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
        // ── Markenfarben ────────────────────────────────────────────────
        // Die Werte kommen aus CSS-Variablen, die jede Instanz selbst setzt.
        // Der Hex-Wert dahinter ist die Rueckfallebene, falls eine Instanz die
        // Variable nicht definiert; er entspricht dem art.fair-Wert und
        // entfaellt, sobald jede Instanz ihre Werte setzt.
        //
        // Eine zweite Messe setzt --brand-ink, --brand-accent usw. in ihrer
        // eigenen CSS -- alle Bauteile ziehen mit, ohne Codeaenderung.
        //
        // Bis 0.26.0 standen hier zusaetzlich die Namen artdus-* mit festen
        // Hex-Werten. Sie sind in 1.0.0 entfallen, nachdem Paket, AD27 und
        // Webby vollstaendig umgestellt waren.
        'brand-ink': 'var(--brand-ink, #0A0A0A)', // Text, dunkle Flächen
        'brand-accent': 'var(--brand-accent, #E7FA31)', // Akzent, CTA
        'brand-paper': 'var(--brand-paper, #F6F6F4)', // Grundfläche
        'brand-surface': 'var(--brand-surface, #F5F5F5)', // hellere Fläche, Badges
        'brand-line': 'var(--brand-line, #ECECEC)', // Trennlinien
        'brand-muted': 'var(--brand-muted, #888888)', // gedämpfter Text
        'brand-danger': 'var(--brand-danger, #E8192C)', // Fehlermeldungen (role="alert")
        'brand-border': 'var(--brand-border, #222222)', // derzeit unbenutzt

          // Transparenzstufen als eigene Namen. Tailwind kann auf eine
          // var()-Farbe keinen /opacity-Modifier anwenden (in v3 gar nicht;
          // Webby laeuft auf 3.4) — deshalb hier ausformuliert. Bleiben
          // mandantenfaehig, weil sie dieselbe Variable lesen.
          'brand-accent-40': 'color-mix(in srgb, var(--brand-accent, #E7FA31) 40%, transparent)',
          'brand-ink-75': 'color-mix(in srgb, var(--brand-ink, #0A0A0A) 75%, transparent)',
          'brand-ink-60': 'color-mix(in srgb, var(--brand-ink, #0A0A0A) 60%, transparent)',
          'brand-ink-10': 'color-mix(in srgb, var(--brand-ink, #0A0A0A) 10%, transparent)',
          'brand-ink-70': 'color-mix(in srgb, var(--brand-ink, #0A0A0A) 70%, transparent)',
          'brand-ink-55': 'color-mix(in srgb, var(--brand-ink, #0A0A0A) 55%, transparent)',
          'brand-accent-50': 'color-mix(in srgb, var(--brand-accent, #E7FA31) 50%, transparent)',
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
