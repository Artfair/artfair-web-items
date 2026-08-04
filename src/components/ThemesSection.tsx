// Kuratorische Themen — nummerierte Bild-Text-Reihen mit alternierender
// Bildseite. Auf der Startseite („Themen 2027") und der Programm-Seite
// im Einsatz; Inhalte kommen aus dem Home-Dict, damit beide Seiten
// denselben Stand zeigen.

export interface ThemeEntry {
  img: string;
  alt: string;
  t: string;
  b: string;
  ratio: "4/5" | "4/3";
}

export function ThemesSection({
  id,
  title,
  intro,
  themes,
}: {
  id?: string;
  title: string;
  intro: string;
  themes: ThemeEntry[];
}) {
  return (
    <section
      id={id}
      className="bg-white px-[var(--page-x)] pt-[clamp(20px,3vw,52px)] pb-[clamp(72px,11vw,160px)] scroll-mt-14"
    >
      <div className="mb-[clamp(48px,7vw,110px)]">
        <h2 className="font-light text-[clamp(26px,4.4vw,70px)] leading-none tracking-[-0.02em]">
          {title}
        </h2>
        <p className="text-[clamp(16px,1.3vw,20px)] leading-[1.62] text-neutral-700 mt-[clamp(20px,2.4vw,34px)] max-w-[66ch]">
          {intro}
        </p>
      </div>
      <div className="flex flex-col gap-[clamp(56px,8vw,130px)]">
        {themes.map((th, i) => (
          <div
            key={th.t}
            className="grid grid-cols-1 md:grid-cols-9 gap-[clamp(10px,1.8vw,32px)] items-center"
          >
            <div
              className={`md:col-span-5 overflow-clip ${
                th.ratio === "4/5" ? "aspect-[4/5]" : "aspect-[4/3]"
              } ${i === 1 ? "md:order-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={th.img} alt={th.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className={`md:col-span-4 flex flex-col gap-[clamp(16px,2vw,26px)] ${i === 1 ? "md:order-1" : ""}`}>
              <div className="flex items-center gap-3.5">
                <span className="text-[clamp(13px,1.1vw,16px)] font-medium">{`0${i + 1}`}</span>
                <span className="w-[34px] h-px bg-[#d8d8d8] block" />
              </div>
              <h3 className="font-light text-[clamp(28px,3.6vw,58px)] leading-[0.98] tracking-[-0.02em]">
                {th.t}
              </h3>
              <p className="text-[clamp(15px,1.2vw,18px)] leading-[1.62] text-neutral-700 max-w-[44ch]">
                {th.b}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
