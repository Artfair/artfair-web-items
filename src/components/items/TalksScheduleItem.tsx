// Baukasten-Item „Talkprogramm" — Foto-Karten-Grid: Sektionskopf im
// Seitenstandard, Foto im Raster mit Caption-Chip, Tages-Gruppen und
// Talk-Karten mit vollflächigem Messefoto, dunklem Verlauf und
// reversed Text. Acid bleibt als Zeitchip und Quadrat-Marker erhalten.

export interface TalkSpeaker {
  name: string;
  role?: string;
}

export interface Talk {
  time: string;
  duration?: string; // z. B. „60 Min"
  title: string;
  speakers: TalkSpeaker[];
  moderation?: TalkSpeaker;
  imageSrc?: string; // Kartenhintergrund (Messefoto); ohne Bild: Schwarz
}

export interface TalkDay {
  weekday: string; // „Freitag"
  date: string; // „17. April"
  theme?: string; // Tagesthema
  talks: Talk[];
}

export function TalksScheduleItem({
  id,
  eyebrow,
  heading,
  intro,
  imageSrc,
  imageAlt,
  imageCaption,
  days,
  credit,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  days: TalkDay[];
  credit?: string;
}) {
  return (
    <section id={id} className="px-[var(--page-x)] pb-[clamp(64px,8vw,128px)] scroll-mt-14">
      <span className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5">
        <span aria-hidden="true" className="w-[7px] h-[7px] bg-artdus-lime" />
        {eyebrow}
      </span>
      <h2 className="font-light text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.02em] mb-[clamp(20px,2.5vw,36px)]">
        {heading}
      </h2>
      {intro && (
        <p className="text-[17px] leading-[1.6] text-neutral-600 max-w-[62ch] mb-[clamp(28px,3.5vw,56px)]">
          {intro}
        </p>
      )}

      {imageSrc && (
        <div className="relative overflow-hidden bg-neutral-100 mb-[clamp(36px,5vw,72px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            loading="lazy"
            className="block w-full aspect-[21/9] object-cover"
          />
          {imageCaption && (
            <div className="absolute left-6 bottom-6 flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-white bg-[rgba(0,0,0,0.55)] px-3.5 py-2">
              <span aria-hidden="true" className="w-2 h-2 bg-artdus-lime inline-block" />
              {imageCaption}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-[clamp(44px,5.5vw,80px)]">
        {days.map((day) => (
          <div key={day.weekday + day.date}>
            <div className="flex items-baseline gap-5 flex-wrap mb-6">
              <span className="font-medium text-[clamp(24px,2.6vw,30px)] tracking-[-0.01em]">
                {day.weekday} <span className="text-neutral-500">{day.date}</span>
              </span>
              {day.theme && (
                <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-neutral-600">
                  {day.theme}
                </span>
              )}
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none">
              {day.talks.map((talk) => (
                <li
                  key={talk.title}
                  className="group relative overflow-hidden bg-artdus-black text-white flex flex-col lg:min-h-[420px]"
                >
                  {talk.imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={talk.imageSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25"
                  />
                  <div className="relative p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="bg-artdus-lime text-artdus-black text-[15px] font-medium tracking-[0.06em] px-[11px] py-1">
                        {talk.time}
                      </span>
                      <span className="text-[11px] tracking-[0.14em] uppercase text-white/70">
                        {talk.duration ?? "60 Min"}
                      </span>
                    </div>
                    <h3 className="font-medium text-[20px] leading-[1.22] tracking-[-0.01em] mb-5">
                      {talk.title}
                    </h3>
                    <div className="flex flex-col gap-2.5 mt-auto">
                      {talk.speakers.map((sp) => (
                        <div key={sp.name}>
                          <div className="text-[15px] font-medium leading-[1.3]">{sp.name}</div>
                          {sp.role && (
                            <div className="text-[12px] leading-[1.3] text-white/70">{sp.role}</div>
                          )}
                        </div>
                      ))}
                      {talk.moderation && (
                        <div className="border-t border-white/25 pt-3 mt-1">
                          <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-white/70 mb-1">
                            <span aria-hidden="true" className="w-1.5 h-1.5 bg-artdus-lime inline-block" />
                            Moderation
                          </div>
                          <div className="text-[15px] font-medium leading-[1.3]">
                            {talk.moderation.name}
                          </div>
                          {talk.moderation.role && (
                            <div className="text-[12px] leading-[1.3] text-white/70">
                              {talk.moderation.role}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {credit && (
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-neutral-500 pt-5 mt-[clamp(36px,5vw,64px)] border-t border-neutral-200">
          {credit}
        </p>
      )}
    </section>
  );
}
