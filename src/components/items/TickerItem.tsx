// Baukasten-Item „Ticker" — dunkles Laufband mit Foto-Hintergrund.
// Inhalt: kurze Meldungen, durch „//" getrennt, endlos laufend.
// prefers-reduced-motion stoppt die Animation (globaler CSS-Block).

export function TickerItem({
  items,
  imageSrc,
}: {
  items: string[];
  imageSrc?: string;
}) {
  // Genug Wiederholungen für eine lückenlose Schleife.
  const units: string[] = [];
  while (units.length < 8) units.push(...items);

  return (
    <div className="relative overflow-hidden whitespace-nowrap bg-artdus-black border-b-[1.5px] border-white">
      {imageSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.48)]" />
        </>
      )}
      {/* Nahtloser Loop wie im Logo-Laufband (v0.13.8): w-max gibt dem Track
          seine echte Inhaltsbreite (Shrink-to-fit war schmaler, translateX(-50%)
          verfehlte die Periode — Band sprang); Abstand als margin-right AN JEDER
          Einheit statt gap + padding-left am Track, damit die halbe Breite
          exakt eine Periode ist. */}
      <div className="relative inline-flex w-max items-center animate-marquee py-[18px] text-[13px] font-medium tracking-[0.14em] uppercase text-white">
        {[...units, ...units].map((text, i) => (
          <span key={i} className="inline-flex items-center gap-[38px] mr-[38px]">
            <span>{text}</span>
            <span className="opacity-40">{"//"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
