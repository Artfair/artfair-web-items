// Abstandhalter — leeres, farbiges Band (kein Text). Reine Layout-Luft, Farbe
// wählbar aus der festen Palette. Höhe optional (Standard: mittlerer Abstand).
export function SpacerItem({ color, height }: { color?: string; height?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: color || "transparent", height: height || "64px" }}
    />
  );
}
