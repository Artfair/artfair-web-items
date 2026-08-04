// Asset-Basis: EINE Stelle, an der root-relative Bild-/Video-Pfade (/images/…,
// /videos/…) aufgelöst werden. Die Dateien liegen (noch) im public-Ordner der
// Website; ein Konsument, der die Bauteile woanders rendert (z. B. Webby),
// setzt `assetBase` auf die Website-Adresse. AD27 selbst lässt es leer → Pfade
// bleiben lokal. Absolute URLs (http…, //…, cdn.sanity.io) bleiben unberührt —
// sobald Assets in Sanity/pixxio (CDN) liegen, ist das hier ein No-op.
export function withBase(url: string | undefined, base?: string): string {
  if (!url) return ''
  if (!base) return url
  if (url.startsWith('/') && !url.startsWith('//')) return base + url
  return url
}
