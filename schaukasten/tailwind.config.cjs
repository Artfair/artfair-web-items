// Dasselbe Preset wie die Instanzen; gescannt werden die App und die kopierten Leisten.
module.exports = {
  presets: [require('./schrank/tailwind-preset.cjs')],
  content: ['./app/**/*.{ts,tsx}', './schrank/src/**/*.{ts,tsx}'],
}
