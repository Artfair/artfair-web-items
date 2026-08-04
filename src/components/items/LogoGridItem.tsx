// Baukasten-Item „Logo-Grid" — Sektionskopf + Raster aus Partner-Logos
// (z. B. Exhibition Partner, VIP Programm, Media Partner).

export interface GridLogo {
  src: string;
  name: string; // Partnername — dient als Alt-Text
  href?: string; // optionaler Link zur Partner-Website
}

export function LogoGridItem({
  id,
  eyebrow,
  heading,
  logos,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  logos: GridLogo[];
}) {
  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
        {eyebrow}
      </span>
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(28px,3.5vw,56px)]">
        {heading}
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[clamp(32px,5vw,88px)] gap-y-[clamp(36px,5vw,72px)] list-none">
        {logos.map((logo) => {
          const tile = (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="w-full aspect-[3/2] object-contain p-[8%] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          );
          return (
            <li key={logo.name} className="group">
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.name}>
                  {tile}
                </a>
              ) : (
                tile
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
