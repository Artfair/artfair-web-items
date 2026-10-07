"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pillen-Navigation des Magazins (Alle · Rubriken · ggf. Archiv). Aus AD27
// (components/magazine/MagazineNav) übernommen; die Punkte liefert die Instanz.
// `basis` ist die Startseite des Magazins — dort zählt nur der exakte Pfad.
export function MagNav({ basis, punkte }: { basis: string; punkte: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="mag-nav">
      {punkte.map((it) => {
        const active = it.href === basis ? pathname === basis : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={`mag-pill${active ? " mag-pill--active" : ""}`}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
