// Baukasten-Item „Fakten-Zeile" — bis zu vier Kurzinfos nebeneinander,
// jeweils Pillen-Label + Wert, über einer schwarzen Hairline.

export function FactsRowItem({
  id,
  facts,
}: {
  id?: string; // Sprungmarke für Menü-Links (z. B. "oeffnungszeiten")
  facts: { label: string; value: string; muted?: boolean }[];
}) {
  return (
    <section id={id} className="px-[var(--page-x)] py-[clamp(72px,8vw,128px)] scroll-mt-14">
      {/* Ohne Kopflinien — die Pillen-Labels gliedern die Spalten;
          gleiches Raster auf allen Breiten, Werte oben bündig. */}
      <div className="grid gap-x-[clamp(24px,3vw,48px)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4 items-start">
        {facts.map((f) => (
          <div key={f.label}>
            <span className="inline-flex border border-artdus-black rounded-full px-4 py-[5px] text-[12px] font-medium tracking-[0.14em] uppercase whitespace-nowrap mb-4">
              {f.label}
            </span>
            <p
              className={`text-[17px] leading-[1.45] whitespace-pre-line ${
                f.muted ? "text-neutral-600" : "text-artdus-black"
              }`}
            >
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
