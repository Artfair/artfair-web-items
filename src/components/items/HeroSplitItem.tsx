import Link from "next/link";

// Baukasten-Item „Hero Split" — Acid-Block (H1, Text, CTAs) neben
// Video oder Bild. Trägt die H1 der Seite — pro Seite nur einmal einsetzen.

// mailto/extern als normaler <a>, interne Ziele als SPA-Link.
function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (/^(mailto:|https?:)/.test(href)) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function HeroSplitItem({
  title,
  body,
  primaryCta,
  secondaryCta,
  videoSrc,
  poster,
}: {
  /** @deprecated Eyebrows abgeschafft (Annalena 13.8.2026) — wird nicht mehr gerendert. */
  eyebrow?: string;
  title: string; // Zeilenumbruch als \n
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  videoSrc?: string;
  poster?: string;
}) {
  return (
    <section className="grid md:grid-cols-[1fr_1.05fr] gap-[clamp(28px,4vw,72px)] bg-white px-[var(--page-x)] py-[clamp(32px,4.5vw,72px)] md:min-h-[min(76vh,780px)]">
      <div className="bg-artdus-lime text-artdus-black flex flex-col justify-center gap-7 px-[clamp(40px,5vw,80px)] py-[clamp(48px,6vw,96px)]">
        <h1 className="font-light text-[clamp(44px,6.5vw,92px)] leading-[0.98] tracking-[-0.02em] whitespace-pre-line">
          {title}
        </h1>
        <p className="text-xl leading-normal max-w-[30ch]">{body}</p>
        <div className="flex flex-wrap gap-3.5 mt-1.5">
          <CtaLink
            href={primaryCta.href}
            className="text-[13px] font-semibold tracking-[0.14em] uppercase text-white bg-artdus-black px-[30px] py-[15px]"
          >
            {primaryCta.label} →
          </CtaLink>
          {secondaryCta && (
            <CtaLink
              href={secondaryCta.href}
              className="text-[13px] font-semibold tracking-[0.14em] uppercase text-artdus-black border border-artdus-black px-[30px] py-[15px]"
            >
              {secondaryCta.label}
            </CtaLink>
          )}
        </div>
      </div>
      <div className="relative min-h-[340px]">
        {videoSrc ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )
        )}
      </div>
    </section>
  );
}
