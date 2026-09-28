// Typdeklaration zum CommonJS-Preset. Liegt bewusst neben tailwind-preset.cjs
// mit gleichem Basisnamen — TypeScript findet sie dadurch ohne Eintrag im
// exports-Feld. Ohne diese Datei meldet ein TS-Projekt beim Einbinden
// "Could not find a declaration file for module …" (AD27-Build, 28.09.2026).
import type { Config } from "tailwindcss";

declare const preset: Partial<Config>;
export = preset;
