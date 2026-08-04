// Baukasten-Item „Willkommen-Panel" — Lime-Block (Kicker, Headline, Text)
// neben Video/Bild im Hochformat. 1:1 aus der Startseite herausgelöst.

export function WelcomePanelItem({
  kicker,
  title,
  body,
  videoSrc,
  poster,
}: {
  kicker: string;
  title: string;
  body: string;
  videoSrc?: string;
  poster?: string;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-9 items-stretch gap-[clamp(10px,1.8vw,32px)] px-[var(--page-x)] pt-[clamp(48px,7vw,110px)] pb-[clamp(56px,9vh,120px)]">
      <div className="md:col-span-5 bg-artdus-lime text-artdus-black flex flex-col justify-center p-[clamp(30px,3.6vw,68px)]">
        <div className="text-[clamp(11px,0.95vw,14px)] font-medium tracking-[0.16em] uppercase opacity-60 mb-[clamp(28px,3.4vw,50px)]">
          {kicker}
        </div>
        <h2 className="font-light text-[clamp(34px,4.6vw,78px)] leading-[0.94] tracking-[-0.03em] mb-[clamp(20px,2.2vw,30px)] whitespace-pre-line">
          {title}
        </h2>
        <p className="text-[clamp(16px,1.35vw,21px)] leading-[1.58] max-w-[40ch]">{body}</p>
      </div>
      <div className="md:col-span-4 flex flex-col gap-[clamp(18px,2.6vw,50px)]">
        <div className="reveal-rise relative overflow-clip aspect-[626/835]">
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {videoSrc && (
            <video
              className="relative w-full h-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </section>
  );
}
